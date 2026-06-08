---
title: "Structured Questions"
description: "askUser tool with multiple choice, and the system prompt scripting that forces the agent to actually use it."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/structured-questions"
md_url: "https://vercel.com/academy/build-ai-agent-harness/structured-questions.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:05.514Z"
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

# Structured Questions

# Structured Questions

The agent will not ask you questions. Not on its own.

You can build an `askUser` tool. The agent will see it, read its description, and then continue not using it. Models trained on developer chat have absorbed a lot of "let me just figure this out for you" energy. Asking feels weak to them. They'd rather guess.

The fix is in two parts. The tool, which is small, and the system prompt, which has to do the work of telling the agent that asking is the right move.

## Outcome

An `askUser` tool that takes a question and 2 to 4 options, plus a `# Handling Ambiguity` section in the system prompt that scripts when to use it. Ambiguous prompts trigger the tool. Specific prompts don't.

## Fast Track

1. Add an `askUser` tool with `question` and `options` (2 to 4 strings)
2. Add a `# Handling Ambiguity` section to `buildSystemPrompt` that tells the agent to search first, then ask, then act
3. Verify with two prompts: one ambiguous, one specific

## Hands-on Exercise 8.1

Build the tool, add the prompt section, and confirm both halves are doing their jobs.

**Requirements:**

1. Add `askUser` to `src/tools.ts` with the schema above
2. Inside `execute`, format the options as a numbered list and return a string the model will pass back to the user
3. Add `# Handling Ambiguity` to `buildSystemPrompt`. Tell the agent: search first, ask second, act third
4. Run two prompts: an ambiguous one ("add authentication") and a specific one ("add a null check at line 42 of auth.ts"). Confirm only the first one triggers `askUser`

**Implementation hints:**

- The `askUser` tool's `execute` doesn't actually wait for the user. It returns a string describing the question and options. The harness around it (or the user reading the output) provides the answer in the next turn
- The system prompt scripting is doing more work than the tool description here. Without the prompt section, the model treats `askUser` as optional even when the prompt's vague
- Two examples in the prompt are usually enough to anchor the pattern. Don't overload it

### The tool

```ts title="src/tools.ts"
import { tool } from "ai";
import { z } from "zod";

export function createAskUserTool() {
  return tool({
    description: `Ask the user a multiple-choice question.
WHEN TO USE: scoping ambiguous tasks, choosing between approaches,
  resolving a missing detail before acting.
WHEN NOT TO USE: you already have enough context to proceed.
DO NOT USE FOR: rhetorical questions or progress updates.`,
    inputSchema: z.object({
      question: z.string().describe("The question to ask the user"),
      options: z
        .array(z.string())
        .min(2)
        .max(4)
        .describe("Two to four options for the user to pick from"),
    }),
    execute: async ({ question, options }) => {
      const formatted = options.map((o, i) => `${i + 1}. ${o}`).join("\n");
      console.log(`\nQuestion: ${question}\n${formatted}\n`);
      return `Asked: "${question}"\nOptions:\n${formatted}\n\n(Awaiting user response.)`;
    },
  });
}
```

The tool prints the question and options to stdout (so the user sees it) and returns the same content as a string (so the model sees it in the message history). The model knows the question is in flight and won't try to act on the assumption it's been answered yet.

### The system prompt addition

```ts title="src/system.ts (additions)"
sections.push(`
# Handling Ambiguity
When the task is ambiguous or has multiple valid approaches:
1. Search the code or docs to gather context first
2. Use askUser to let the user choose. Do NOT guess.
3. Examples: "add auth" -> ask OAuth or JWT; "set up a db" -> ask Postgres or SQLite

Specific tasks (with file paths, line numbers, or precise instructions) do not
need askUser. Act directly.`);
```

The numbered protocol matters. "Search, ask, act" gives the model a sequence it can follow. Without it, the agent either asks too early (before it has enough context to make the question useful) or too late (after it's already started building the wrong thing).

\*\*Warning: Models would rather explore than ask\*\*

Even with the protocol, the agent reads three or four files before pulling out `askUser`. That's correct behavior, since step 1 is "search first." It's still worth knowing, because if you're watching it run and getting impatient, the model isn't ignoring you. It's gathering context to ask a useful question.

If `bash` is blocked by approval, the agent can't run the commands it needs to gather that context. It might never reach step 2. The approval system and `askUser` are in tension, and that tension is real architectural friction, not a bug to fix.

### Wire the tool in

```ts title="index.ts"
const tools = {
  read: createReadTool(sandbox),
  grep: createGrepTool(sandbox),
  bash: createBashTool(sandbox, createApproval({ mode: "interactive" })),
  task: createTaskTool(sandbox, { read, grep }),
  askUser: createAskUserTool(),
};
```

The agent's tool list now includes `askUser`. The system prompt tells it when to use it. The user's terminal shows the question. The model's message history shows that the question is pending.

## Try It

Run an ambiguous task and watch the agent ask:

```bash title="Terminal"
bun run index.ts . "Add authentication to this project"
```

You should see the agent read a few files, then call `askUser` with a question like "Which authentication strategy should I use?" and options like "OAuth," "JWT," "Session cookies," and so on. The terminal prints the question. The model sits and waits.

Now run a specific task and confirm the agent doesn't ask:

```bash title="Terminal"
bun run index.ts . "Add a null check at line 42 of src/auth.ts before the database query"
```

The agent should make the change directly. No `askUser` call.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/tools.ts src/system.ts index.ts
git commit -m "feat(askUser): add structured question tool with ambiguity protocol"
```

## Done-When

- [ ] `askUser` tool is wired and accepts 2 to 4 options
- [ ] `# Handling Ambiguity` section is in the system prompt
- [ ] Ambiguous prompts trigger `askUser`
- [ ] Specific prompts do not
- [ ] `npx tsc --noEmit` passes

\*\*Note: Make the question stick\*\*

Right now `askUser` returns a string and the model continues. In a real harness, the harness would actually pause, collect the user's choice, and pass it back as the next user message. Sketch what that pause looks like. Where does the harness intercept the tool call result? Where does the user's answer get inserted into the conversation? Module 8.2's events approach is the natural place to wire this in.

## Solution

```ts title="src/tools.ts (createAskUserTool)"
export function createAskUserTool() {
  return tool({
    description: `Ask the user a multiple-choice question.
WHEN TO USE: scoping ambiguous tasks, choosing between approaches,
  resolving a missing detail before acting.
WHEN NOT TO USE: you already have enough context to proceed.
DO NOT USE FOR: rhetorical questions or progress updates.`,
    inputSchema: z.object({
      question: z.string().describe("The question to ask the user"),
      options: z
        .array(z.string())
        .min(2)
        .max(4)
        .describe("Two to four options for the user to pick from"),
    }),
    execute: async ({ question, options }) => {
      const formatted = options.map((o, i) => `${i + 1}. ${o}`).join("\n");
      console.log(`\nQuestion: ${question}\n${formatted}\n`);
      return `Asked: "${question}"\nOptions:\n${formatted}\n\n(Awaiting user response.)`;
    },
  });
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
