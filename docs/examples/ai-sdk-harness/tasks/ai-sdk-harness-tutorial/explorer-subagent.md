---
title: "Explorer Subagent"
description: "A read-only subagent with a cheap model. Perfect for research and exploration."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/explorer-subagent"
md_url: "https://vercel.com/academy/build-ai-agent-harness/explorer-subagent.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:02.644Z"
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

# Explorer Subagent

# Explorer Subagent

The explorer is the simplest subagent to build, and the most useful to start with.

It can read files. It can search. It can do nothing else. No `write`, no `bash`, no asking the user. It investigates a question, summarizes what it found, and disappears.

That sounds like a constraint. It's the feature. The explorer can't drift, can't make accidental changes, and can't burn down your project with a creative `find -exec`. It does one thing, and when it finishes, the parent gets back a clean answer instead of forty steps of intermediate file reads.

## Outcome

A parent-facing `task` tool spawns a fresh `ToolLoopAgent` with `read` and `grep` only, a cheap model, and a 5-step budget. The parent can delegate research and get a text summary back.

## Fast Track

1. Define a `task` tool whose schema accepts a `description` for the subagent
2. Inside `execute`, instantiate a new `ToolLoopAgent` with `read` and `grep` only
3. Use `claude-haiku-4-5` and `stopWhen: stepCountIs(5)`
4. Return the subagent's text response back to the parent, wrapped in a try/catch

## Hands-on Exercise 6.2

Add a delegation seam from the parent into an explorer subagent.

**Requirements:**

1. Add a `task` tool to your tool registry
2. The schema takes a `description: string` that the parent uses to tell the subagent what to investigate
3. Inside `execute`, create a new `ToolLoopAgent` with `read` and `grep` (no `bash`, no `askUser`)
4. Pick a fast model (`claude-haiku-4-5`) and cap steps at 5
5. Return the explorer's text response, with errors caught and returned as a string

**Implementation hints:**

- The explorer is instantiated per call. Don't reuse one. Each delegation gets a fresh context window
- Reuse the `read` and `grep` tools you already have. They're closed over the sandbox the parent uses, which is what you want
- Wrap `explorer.generate(...)` in try/catch and return `"Subagent error: ${e.message}"` instead of letting the exception propagate. The parent expects a string back from any tool

### The task tool

```ts title="src/tools.ts (additions)"
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import type { Sandbox } from "./sandbox";

export function createTaskTool(sandbox: Sandbox, parentTools: {
  read: ReturnType<typeof createReadTool>;
  grep: ReturnType<typeof createGrepTool>;
}) {
  return tool({
    description: `Delegate research to a read-only subagent.
WHEN TO USE: investigating a codebase, finding patterns, gathering context
  across many files.
WHEN NOT TO USE: making changes (the subagent cannot write or run commands).
DO NOT USE FOR: tasks that need decisions or askUser interactions.`,
    inputSchema: z.object({
      description: z.string().describe("What the subagent should investigate"),
    }),
    execute: async ({ description }) => {
      const explorer = new ToolLoopAgent({
        model: "anthropic/claude-haiku-4-5",
        instructions: `You are an explorer agent. Investigate and report back concisely.
Working directory: ${sandbox.workingDirectory}`,
        tools: { read: parentTools.read, grep: parentTools.grep },
        stopWhen: stepCountIs(5),
      });

      try {
        const { text, steps } = await explorer.generate({ prompt: description });
        return text
          ? `[Explorer: ${steps.length} steps]\n${text}`
          : "(no response from subagent)";
      } catch (e: any) {
        return `Subagent error: ${e.message}`;
      }
    },
  });
}
```

A few design choices worth pointing at:

- **Fresh agent per call.** The explorer doesn't survive across calls. Each task gets its own context window, which is the whole point of delegating
- **No `bash`, no `askUser`.** The explorer can read and search. It cannot modify the project or pause for user input. The parent stays in charge of decisions
- **Haiku, not Sonnet.** Exploration is reading and summarizing, not deep reasoning. A faster, cheaper model is the right fit
- **Five steps.** Enough to look at a handful of files and report back. If the explorer needs more, the parent should break the task into smaller pieces
- **Errors return as strings.** Tools return strings to the model. An uncaught exception breaks the tool loop. Returning the error text lets the parent decide what to do

### Wire it into the parent

```ts title="index.ts"
const tools = {
  read: createReadTool(sandbox),
  grep: createGrepTool(sandbox),
  bash: createBashTool(sandbox, createApproval({ mode: "interactive" })),
};

const tools_with_task = {
  ...tools,
  task: createTaskTool(sandbox, { read: tools.read, grep: tools.grep }),
};

const agent = new ToolLoopAgent({
  // ...
  tools: tools_with_task,
});
```

The parent now has four tools: `read`, `grep`, `bash`, and `task`. The first three are direct. The fourth delegates.

\*\*Warning: Add logs while you debug\*\*

When a subagent returns nothing or returns the wrong thing, you have no idea what happened inside its run. While developing, log the subagent's step count and text length from inside the task tool. Without that, you'll be staring at confused parent output with no idea whether the subagent ran for one step or five, found anything, or quietly failed.

## Try It

Ask the parent something that the explorer is well-suited for:

```bash title="Terminal"
bun run index.ts . "Delegate to a subagent: find every place this project uses zod and tell me which files import from it."
```

The parent should call `task` with that description. The explorer should run, find the imports, and return a summary. The parent should pass that summary back to you.

For comparison, run the same task without the explicit delegation instruction:

```bash title="Terminal"
bun run index.ts . "Find every place this project uses zod and tell me which files import from it."
```

The parent may or may not delegate. With strong tool descriptions, it might call `grep` directly. That's fine. The delegation tool earns its keep when the search has to go through many files and the parent doesn't want all that text in its context.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/tools.ts index.ts
git commit -m "feat(subagents): add explorer via task tool"
```

## Done-When

- [ ] `createTaskTool` exists and returns a `task` tool
- [ ] The task tool spawns a fresh `ToolLoopAgent` per call
- [ ] The explorer has `read` and `grep` only
- [ ] The explorer uses `claude-haiku-4-5` and stops at 5 steps
- [ ] Errors return as strings, not exceptions
- [ ] Parent can delegate research and get a clean summary back
- [ ] `npx tsc --noEmit` passes

\*\*Note: Parallel explorers\*\*

A single explorer is a coroutine. Spawning two in parallel from the parent's tool loop is real parallelism. Try changing the task tool's schema to accept an array of descriptions and run them with `Promise.all`. Now the parent can investigate three different parts of the codebase at once and synthesize the results. What changes about the parent's prompt to take advantage of this?

## Solution

```ts title="src/tools.ts (createTaskTool)"
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import type { Sandbox } from "./sandbox";

export function createTaskTool(
  sandbox: Sandbox,
  parentTools: { read: any; grep: any },
) {
  return tool({
    description: `Delegate research to a read-only subagent.
WHEN TO USE: investigating a codebase, finding patterns, gathering context.
WHEN NOT TO USE: making changes (the subagent cannot write or run commands).
DO NOT USE FOR: tasks that need decisions or askUser interactions.`,
    inputSchema: z.object({
      description: z.string().describe("What the subagent should investigate"),
    }),
    execute: async ({ description }) => {
      const explorer = new ToolLoopAgent({
        model: "anthropic/claude-haiku-4-5",
        instructions: `You are an explorer agent. Investigate and report back concisely.
Working directory: ${sandbox.workingDirectory}`,
        tools: { read: parentTools.read, grep: parentTools.grep },
        stopWhen: stepCountIs(5),
      });

      try {
        const { text, steps } = await explorer.generate({ prompt: description });
        return text
          ? `[Explorer: ${steps.length} steps]\n${text}`
          : "(no response from subagent)";
      } catch (e: any) {
        return `Subagent error: ${e.message}`;
      }
    },
  });
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
