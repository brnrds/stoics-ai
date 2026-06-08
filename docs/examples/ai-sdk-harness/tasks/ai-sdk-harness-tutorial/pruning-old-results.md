---
title: "Pruning Old Results"
description: "Use pruneMessages to remove old tool call/result pairs while keeping recent context."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/pruning-old-results"
md_url: "https://vercel.com/academy/build-ai-agent-harness/pruning-old-results.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:00.962Z"
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

# Pruning Old Results

# Pruning Old Results

The fix is four lines.

That's the part that's going to feel anticlimactic. You measured the problem in the last lesson, watched the input tokens climb, sketched out the disaster scenario at step thirty. Now we add four lines and the curve flattens.

The lines themselves are easy. Where they go and why is the lesson.

## Outcome

`prepareCall` runs `pruneMessages` before every model call, removing tool call/result pairs older than the last three messages. The token-growth curve from the last lesson plateaus instead of climbing forever.

## Fast Track

1. Import `pruneMessages` from `ai`
2. Add a `prepareCall` to your `ToolLoopAgent` config
3. Inside it, call `pruneMessages({ messages, toolCalls: "before-last-3-messages" })`
4. Spread `...options` first, and guard against `messages` being undefined on the first call

## Hands-on Exercise 5.2

Wire pruning into the agent and re-run the same multi-step task from lesson 5.1.

**Requirements:**

1. Add `prepareCall: async (options) => ({...})` to the agent config
2. Spread `...options` so required fields like `model` and `tools` carry through
3. Conditionally prune `options.messages` when it's defined
4. Use `toolCalls: "before-last-3-messages"` for now (the simplest reasonable strategy)
5. Confirm input tokens plateau across steps instead of climbing

**Implementation hints:**

- `prepareCall` runs before every model call, with the full request `options`. You're modifying the messages on the way in
- Spread `...options` first or you'll lose `model`, `tools`, and `system`. The pruned messages override the spread
- On the very first call there are no messages yet (`prompt` is set, `messages` is `undefined`). Skip pruning in that case

### The fix

```ts title="index.ts" {1,6-13}
import { ToolLoopAgent, stepCountIs, tool, pruneMessages } from "ai";

const agent = new ToolLoopAgent({
  // ... existing config
  prepareCall: async (options) => ({
    ...options,
    messages: options.messages
      ? pruneMessages({
          messages: options.messages,
          toolCalls: "before-last-3-messages",
        })
      : undefined,
  }),
});
```

Four lines, one import. Most of the code is the guard for the first-call case.

### What's actually happening

Before each model call, `prepareCall` runs. It receives the full request the SDK is about to send. We replace its `messages` with a pruned version, dropping every tool call and result that's older than the last three messages.

```
Before pruning at step 15:
  [user prompt]
  [assistant + tool_call] -> [tool_result]    (old, will be pruned)
  [assistant + tool_call] -> [tool_result]    (old, will be pruned)
  ... 12 more pairs ...
  [assistant + tool_call] -> [tool_result]    (recent, kept)
  [assistant + tool_call] -> [tool_result]    (recent, kept)
  [assistant] -> [user]                       (recent, kept)

After pruning:
  [user prompt]                               (kept, original prompt)
  [assistant + tool_call] -> [tool_result]    (recent)
  [assistant + tool_call] -> [tool_result]    (recent)
  [assistant] -> [user]                       (recent)
```

The original user prompt always survives. The recent tool interactions survive. The middle of the conversation, where the tool results pile up, gets dropped on each call.

\*\*Warning: Two gotchas worth saying out loud\*\*

**Spread `...options` first.** `prepareCall` receives the full request options, including `model`, `tools`, and `system`. Forgetting the spread silently drops them and the agent breaks in confusing ways.

**Guard `messages`.** On the very first call, the SDK gives you a `prompt` field but no `messages` array. Calling `pruneMessages({ messages: undefined })` throws. The ternary handles it.

### Why three messages

The `toolCalls: "before-last-3-messages"` setting keeps the last three messages of conversation, not just the last three tool pairs. That's enough context for the model to know where it is in a multi-step task without keeping the whole history.

You can tune this. `before-last-1` is more aggressive and saves more tokens. `before-last-5` is gentler and keeps more context. Three is a reasonable default that works well across task shapes. Start there. Tune later if you have a specific task that needs it.

## Try It

Run the same multi-step task from lesson 5.1 and compare the token curves:

```bash title="Terminal"
bun run index.ts . "Read package.json, tsconfig, index.ts, then summarize"
```

You should see something like:

```
Step 0: 1,200 input, 450 output
Step 1: 2,800 input, 200 output
Step 2: 3,100 input, 180 output    (old results pruned)
Step 3: 3,400 input, 350 output    (growth plateaus)
Step 4: 3,200 input, 600 output    (stays flat)
```

The exact numbers depend on your project. The shape is what matters. Input tokens plateau by step 2 or 3 instead of climbing forever.

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Note: The proof is the shape, not the digits\*\*

Don't expect identical numbers to the example. Token counts depend on file sizes, model choice, and the exact wording of the prompt. The thing to verify is the curve shape: linear before, plateau after.

## Commit

```bash
git add index.ts
git commit -m "feat(context): prune old tool results in prepareCall"
```

## Done-When

- [ ] `pruneMessages` is imported from `ai`
- [ ] `prepareCall` is wired into the agent config
- [ ] `...options` is spread first, before the messages override
- [ ] The undefined-messages case is handled
- [ ] On a 4+ step task, input tokens plateau instead of growing linearly
- [ ] `npx tsc --noEmit` passes

\*\*Note: Find your task's pruning threshold\*\*

The default `before-last-3-messages` is a guess. Pick a task that needs the agent to remember something it read several steps earlier (a config value, a function name, a TODO it found). Run with `before-last-1`, `before-last-3`, and `before-last-5` and see when the agent loses the thread. The right number for your harness depends on the kind of work it does.

## Solution

```ts title="index.ts"
import { ToolLoopAgent, stepCountIs, tool, pruneMessages } from "ai";

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: buildSystemPrompt({ /* ... */ }),
  tools,
  stopWhen: stepCountIs(15),
  onStepFinish: ({ usage, stepNumber }) => {
    console.error(
      `Step ${stepNumber}: ${usage.inputTokens} input, ${usage.outputTokens} output`,
    );
  },
  prepareCall: async (options) => ({
    ...options,
    messages: options.messages
      ? pruneMessages({
          messages: options.messages,
          toolCalls: "before-last-3-messages",
        })
      : undefined,
  }),
});
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
