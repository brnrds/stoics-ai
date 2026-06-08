---
title: "The Problem"
description: "Add token logging and watch context grow linearly with every tool call."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/the-problem"
md_url: "https://vercel.com/academy/build-ai-agent-harness/the-problem.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:00.593Z"
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

# The Problem

# The Problem

Your agent has been getting away with something.

Through Modules 1 to 4, you've been running short tasks. Read a file, find a TODO, list the directory. Five steps, ten at most. The context window stays comfortable, the agent stays sharp, and everything is fine.

This is the part where we turn around and look at what happens on a real task. Twenty steps. Thirty. The kind of task where the agent reads three files, searches the codebase twice, runs a test, fixes a thing, runs the test again, and writes a summary.

Before we fix the problem, we need to see it. The fix is small. The seeing is the hard part.

## Outcome

`onStepFinish` logs input and output tokens at every step. Running a multi-step task makes context growth visible: input tokens climb linearly while output stays roughly flat.

## Fast Track

1. Add an `onStepFinish` callback to `ToolLoopAgent`
2. Log `usage.inputTokens` and `usage.outputTokens` per step
3. Run a multi-step task and watch the input number climb

## Hands-on Exercise 5.1

Wire token logging and run a task that does enough work to show the curve.

**Requirements:**

1. Pass `onStepFinish: ({ usage, stepNumber }) => { ... }` to `ToolLoopAgent`
2. Log to `console.error` (so it shows up next to the agent's normal output but stays out of stdout)
3. Run a prompt that forces 4+ tool calls so the curve is visible
4. Read the numbers. Don't try to fix anything yet

**Implementation hints:**

- `onStepFinish` runs after every step, not just successful ones. The `usage` field is the relevant one
- Use `console.error` for telemetry. `console.log` mixes with the agent's response and gets ugly
- The prompt needs to do real work. "Read package.json" is one step. "Read package.json, then tsconfig, then the entry point, then summarize" is four

### Add the logging

```ts title="index.ts"
const agent = new ToolLoopAgent({
  // ... existing config
  onStepFinish: ({ usage, stepNumber }) => {
    console.error(
      `Step ${stepNumber}: ${usage.inputTokens} input, ${usage.outputTokens} output`,
    );
  },
});
```

That's all of the instrumentation. The SDK calls this for you after every step.

### Run a task that hurts

```bash title="Terminal"
bun run index.ts . "Read package.json, then tsconfig.json, then index.ts, then summarize everything"
```

You should see something like:

```
Step 0: 1,200 input, 450 output
Step 1: 2,800 input, 200 output
Step 2: 4,100 input, 180 output
Step 3: 8,900 input, 350 output
Step 4: 9,200 input, 600 output
```

The exact numbers will be different in your project. The shape won't be. Input tokens climb every step. Output tokens stay roughly flat.

### Why input tokens grow

Every step sends the entire message history to the model. The user prompt. The system prompt. Every tool call the agent has made. Every tool result the agent has received.

The package.json from step 1 is still in context at step 4, even though the agent is done with it. The tsconfig from step 2 is still there. Nothing leaves on its own.

| Component           | Tokens          | Behavior                 |
| ------------------- | --------------- | ------------------------ |
| System prompt       | \~500           | Fixed, sent every call   |
| Each tool result    | 200 to 2,000    | Stays in history forever |
| After 20 tool calls | 4,000 to 40,000 | Linearly accumulating    |

The context window is 200,000 tokens. A busy agent that reads big files can hit it in 30 to 50 steps. When it does:

- The instructions at the top get pushed out of attention
- The model starts ignoring its own system prompt
- Tool selection degrades
- The agent loops or hallucinates

### What doesn't work

Three tempting non-fixes:

- **Hoping it doesn't happen.** It always happens on real tasks
- **Reducing step count.** Ten steps is too few for real work. Fifty is normal
- **Using a bigger model.** A bigger context window delays the problem, doesn't solve it. And it costs more per token

The fix is to take old tool results out of the message history before they overflow attention. Lesson 5.2 does exactly that.

\*\*Note: Telemetry first, fix second\*\*

This lesson doesn't fix anything. That's deliberate. You can't tell whether a fix worked unless you measured the problem first. Token logging stays in for the rest of the module so you can compare before and after at every step.

## Try It

Run the multi-step task. Look at the numbers. Confirm:

1. Input tokens grow with every step
2. Output tokens stay relatively small
3. By the last step, you're sending more than three times the tokens of step 0

```bash title="Terminal"
bun run index.ts . "Read package.json, then tsconfig.json, then index.ts, then summarize everything"
```

Try a longer task and watch the curve get steeper:

```bash title="Terminal"
bun run index.ts . "Read every .ts file in src/, then tell me what each one does"
```

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add index.ts
git commit -m "feat(telemetry): log token usage per step"
```

## Done-When

- [ ] `onStepFinish` is wired to log `usage.inputTokens` and `usage.outputTokens`
- [ ] A 4+ step task shows input tokens climbing
- [ ] Output tokens stay relatively flat across steps
- [ ] The logging goes to `console.error`, not `console.log`
- [ ] `npx tsc --noEmit` passes

\*\*Note: Plot the curve\*\*

Logging numbers to stderr is fine. Logging them to a CSV is better. Append `step,inputTokens,outputTokens` to a file in `onStepFinish`, then load it into your spreadsheet of choice. The shape of the curve tells you whether your task is read-heavy (steep climb) or compute-heavy (gentler climb). Same agent, different curve, depending on what it's doing.

## Solution

```ts title="index.ts"
const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: buildSystemPrompt({
    workingDirectory: cwd,
    sandboxType: sandbox.type,
    toolNames: Object.keys(tools),
    projectContext,
  }),
  tools,
  stopWhen: stepCountIs(15),
  onStepFinish: ({ usage, stepNumber }) => {
    console.error(
      `Step ${stepNumber}: ${usage.inputTokens} input, ${usage.outputTokens} output`,
    );
  },
});
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
