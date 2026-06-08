---
title: "Dynamic Prompt Construction"
description: "Build a prompt composer that adapts to runtime context, making prompt policy easier to evolve safely."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/dynamic-prompt-construction"
md_url: "https://vercel.com/academy/build-ai-agent-harness/dynamic-prompt-construction.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:57.073Z"
content_type: "lesson"
course: "build-ai-agent-harness"
course_title: "Build Your Own AI Coding Agent Harness"
prerequisites:  []
---

<agent-instructions>
Vercel Academy — structured learning, not reference docs.
Lessons are sequenced.
Adapt commands to the human's actual environment (OS, package manager, shell, editor) — detect from project context or ask, don't assume.
The lesson shows one path; if the human's project diverges, adapt concepts to their setup.
Preserve the learning goal over literal steps.
Quizzes are pedagogical — engage, don't spoil.
Quiz answers are included for your reference.
</agent-instructions>

# Dynamic Prompt Construction

# Dynamic Prompt Construction

The sectioned prompt from the last lesson is hardcoded. That's fine when there's one project, one sandbox, and one fixed toolset. The minute any of those move, the prompt has to move with them.

Different working directory. Different sandbox backend. A subagent that only gets `read` and `grep`. The hardcoded string can't carry any of that. A function can.

## Outcome

A `buildSystemPrompt(context)` function in `src/system.ts` returns the system prompt string from a typed `PromptContext`. The agent's `instructions` are now derived from runtime state instead of pasted in.

## Fast Track

1. Create `src/system.ts` with a `PromptContext` interface and a `buildSystemPrompt(ctx)` function
2. Compose the prompt from sections, including optional sections like `gitBranch` and `projectContext`
3. Call `buildSystemPrompt(...)` in `index.ts` and pass the result to `instructions`

## Hands-on Exercise 3.2

Extract the prompt into a typed builder.

**Requirements:**

1. Define `PromptContext` with `workingDirectory`, `sandboxType`, `toolNames`, optional `gitBranch`, optional `projectContext`
2. Write `buildSystemPrompt(ctx: PromptContext): string` that returns the sectioned prompt
3. Make `gitBranch` and `projectContext` conditional, including their section only when set
4. In `index.ts`, build the context object and call `buildSystemPrompt(ctx)` for the `instructions` field

**Implementation hints:**

- Push sections into an array and `join("\n")` at the end. Plain string concat, no template engine
- Conditional sections use a simple `if (ctx.foo) sections.push(...)`. Don't reach for fancier patterns
- Keep `buildSystemPrompt` pure. Same context in, same prompt out, no side effects. That makes it unit-testable

### The shape of context

The prompt depends on runtime state. Bottle that state into one object:

```ts title="src/system.ts"
export interface PromptContext {
  workingDirectory: string;
  sandboxType: string;
  toolNames: string[];
  gitBranch?: string;
  projectContext?: string;
}
```

`workingDirectory` and `sandboxType` always apply. `toolNames` lets the prompt list the tools that are actually wired up (which matters when you give a subagent a subset). `gitBranch` and `projectContext` are optional because they're not always knowable.

### The builder

```ts title="src/system.ts"
export function buildSystemPrompt(ctx: PromptContext): string {
  const sections: string[] = [];

  sections.push(`You are a coding agent working in: ${ctx.workingDirectory}`);
  sections.push(`Sandbox: ${ctx.sandboxType}`);

  sections.push(`
# Agency
- USE your tools. Read files, search code, run commands, then answer.
- Do NOT explain what you WOULD do. Actually do it.
- Available tools: ${ctx.toolNames.join(", ")}`);

  if (ctx.gitBranch) {
    sections.push(`- Current branch: ${ctx.gitBranch}`);
  }

  sections.push(`
# Guardrails
- Prefer simple, minimal changes
- Search before creating, and reuse existing patterns
- No new dependencies without asking`);

  if (ctx.projectContext) {
    sections.push(`
# Project Instructions (from AGENTS.md)
${ctx.projectContext}`);
  }

  return sections.join("\n");
}
```

There's no template engine here. There's no DSL. There's an array, a few `push` calls, and a `join`. That's deliberate. The prompt is a string. Building it should look like building a string.

### Wire it in

In `index.ts`, replace the inline `instructions` literal with a call to the builder:

```ts title="index.ts"
import { buildSystemPrompt } from "./src/system";

const instructions = buildSystemPrompt({
  workingDirectory: cwd,
  sandboxType: "local",
  toolNames: Object.keys({ read, grep, bash }),
});

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions,
  tools: { read, grep, bash },
  stopWhen: stepCountIs(10),
});
```

The agent's behavior on a single task may look the same as before. The win is structural. Adding a git context line, swapping sandbox types, or stripping a section for a subagent now requires editing one focused function instead of finding and replacing inside a multiline string.

\*\*Note: Why a function, not a string\*\*

The prompt is the most important configuration the harness has. Making it a function means it's testable (assert what the output looks like for a given context), composable (add sections without touching others), replaceable (users can provide their own builder), and deterministic (same context, same prompt, every time). The cost is one file. The benefit shows up the third time you add a section.

## Try It

Run any prompt you've used before:

```bash title="Terminal"
bun run index.ts . "Find all TODO comments in this project"
```

The output should be the same as the last lesson, because the prompt content is the same. The change is internal. Confirm the agent still has the tools it expects by logging the prompt itself once:

```ts title="index.ts (temporary)"
console.log(instructions);
```

You should see the full Agency and Guardrails sections, with the working directory and tool names interpolated in.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/system.ts index.ts
git commit -m "refactor(prompt): extract buildSystemPrompt with runtime context"
```

## Done-When

- [ ] `src/system.ts` exports `PromptContext` and `buildSystemPrompt`
- [ ] `buildSystemPrompt` returns the same prompt content as the previous lesson when given the same context
- [ ] `gitBranch` and `projectContext` are optional and only included when provided
- [ ] `index.ts` calls `buildSystemPrompt(...)` instead of using an inline string
- [ ] `npx tsc --noEmit` passes

\*\*Note: Write a test for the prompt\*\*

Add a quick assertion: build the prompt with `gitBranch: "main"` and confirm the output contains "Current branch: main". Build it without `gitBranch` and confirm the line is absent. This is the smallest possible unit test for a prompt, and it catches the kind of bug that's almost impossible to spot by reading the model's output.

## Solution

```ts title="src/system.ts"
export interface PromptContext {
  workingDirectory: string;
  sandboxType: string;
  toolNames: string[];
  gitBranch?: string;
  projectContext?: string;
}

export function buildSystemPrompt(ctx: PromptContext): string {
  const sections: string[] = [];

  sections.push(`You are a coding agent working in: ${ctx.workingDirectory}`);
  sections.push(`Sandbox: ${ctx.sandboxType}`);

  sections.push(`
# Agency
- USE your tools. Read files, search code, run commands, then answer.
- Do NOT explain what you WOULD do. Actually do it.
- Available tools: ${ctx.toolNames.join(", ")}`);

  if (ctx.gitBranch) {
    sections.push(`- Current branch: ${ctx.gitBranch}`);
  }

  sections.push(`
# Guardrails
- Prefer simple, minimal changes
- Search before creating, and reuse existing patterns
- No new dependencies without asking`);

  if (ctx.projectContext) {
    sections.push(`
# Project Instructions (from AGENTS.md)
${ctx.projectContext}`);
  }

  return sections.join("\n");
}
```

```ts title="index.ts"
import { buildSystemPrompt } from "./src/system";

const tools = { read, grep, bash };

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: buildSystemPrompt({
    workingDirectory: cwd,
    sandboxType: "local",
    toolNames: Object.keys(tools),
  }),
  tools,
  stopWhen: stepCountIs(10),
});
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
