---
title: "Cache Control"
description: "Use provider-aware cache control to reduce repeated input costs when your stack supports it."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/cache-control"
md_url: "https://vercel.com/academy/build-ai-agent-harness/cache-control.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:01.700Z"
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

# Cache Control

# Cache Control

Pruning solves one half of the problem. The other half is that every call still sends the parts of the context that didn't change.

Your system prompt is the same on call ten as it was on call one. The early user prompt is the same. The tool definitions are the same. The provider has seen these tokens before, and you're paying to send them again.

Cache control is the provider's way to say "I remember this, don't process it again." Where it's supported, the cost drop is real. Where it isn't, the pattern still teaches a useful habit: separate stable context from fresh context.

## Outcome

A `prepareCall` pipeline that prunes old tool results, then marks the stable parts of the remaining context as cacheable. On providers that support cache control, repeated input costs drop substantially.

## Fast Track

1. Add an `addCacheControl(messages)` helper that marks stable messages cacheable
2. Compose it after `pruneMessages` in `prepareCall`
3. Mark the system message and early conversation as cacheable; leave the most recent messages fresh

## Hands-on Exercise 5.4

Wire cache control behind the pruning step.

**Requirements:**

1. Write `addCacheControl(messages)` that returns a new array of messages with `providerOptions.cacheControl` set where appropriate
2. The first message (system or initial user prompt) should always be cacheable
3. Messages older than the last two should be cacheable
4. The most recent one or two messages should stay uncached
5. Update `prepareCall` to call `addCacheControl(pruneMessages(...))`

**Implementation hints:**

- `cacheControl: { type: "ephemeral" }` is the Anthropic-flavored shape. Other providers use different keys. If you're hitting one that doesn't support cache control, the call still works, the header just gets ignored
- The cache breakpoints work by prefix. Marking message 5 as cacheable caches everything up to and including message 5. The provider checks the prefix on the next call
- Don't mark recent messages cacheable. They're about to be replaced

### The helper

```ts title="src/cache.ts"
import type { ModelMessage } from "ai";

export function addCacheControl(messages: ModelMessage[]): ModelMessage[] {
  return messages.map((msg, i) => {
    if (i === 0) {
      return {
        ...msg,
        providerOptions: { cacheControl: { type: "ephemeral" } },
      };
    }
    if (i < messages.length - 2) {
      return {
        ...msg,
        providerOptions: { cacheControl: { type: "ephemeral" } },
      };
    }
    return msg;
  });
}
```

The first message and all but the last two get the cache marker. The recent ones stay out so they don't end up cached just before the next call replaces them.

### Compose with pruning

In `index.ts`, the `prepareCall` becomes a pipeline:

```ts title="index.ts"
import { addCacheControl } from "./src/cache";

prepareCall: async (options) => {
  const pruned = options.messages
    ? pruneMessages({
        messages: options.messages,
        toolCalls: "before-last-3-messages",
      })
    : undefined;

  return {
    ...options,
    messages: pruned ? addCacheControl(pruned) : undefined,
  };
},
```

Pruning happens first because it changes how many messages there are. Caching happens second on whatever messages survive.

### What the savings look like

The numbers depend on the provider, the cache hit rate, and how much of your context is stable. For a typical Anthropic-backed agent running long sessions:

| Component                 | Cost without cache    | Cost with cache      |
| ------------------------- | --------------------- | -------------------- |
| 50 calls, 200K input each | Full input every call | Stable prefix cached |
| 10M tokens at full price  | \~$30 per session     | \~$6 per session     |

That's an order-of-magnitude swing on long sessions. On short sessions, the difference is smaller because the cache doesn't have time to amortize. The discipline still applies.

\*\*Note: Cache control is provider-specific\*\*

Anthropic uses `cacheControl` on message parts. OpenAI uses different headers and a different model. Some providers don't expose caching at the prompt level at all. The pattern (separate stable from fresh) survives those differences. The exact `providerOptions` shape doesn't.

### Why the pattern matters even where caching isn't supported

You're forcing yourself to think about which parts of the prompt are stable. That's a useful habit. It tells you whether your system prompt is doing too much work per-call (rebuilt every time) or just right (built once, reused).

If caching disappeared tomorrow, the discipline of identifying stable context would still be worth keeping. Stable context is also easier to test, easier to version, and easier to reason about than context that changes shape every call.

## Try It

Run a multi-step task and watch the token counts:

```bash title="Terminal"
bun run index.ts . "Read package.json, tsconfig, index.ts, then summarize"
```

If your provider returns cache hit info in the usage object, log it:

```ts title="index.ts (temporary)"
onStepFinish: ({ usage, stepNumber }) => {
  console.error(
    `Step ${stepNumber}: ${usage.inputTokens} input, ${usage.outputTokens} output, ${usage.cachedInputTokens ?? 0} cached`,
  );
},
```

You should see `cachedInputTokens` growing from step 1 onward, with `inputTokens` (the part you pay full price for) staying small.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/cache.ts index.ts
git commit -m "feat(context): add cache control to stable messages"
```

## Done-When

- [ ] `addCacheControl(messages)` marks stable messages cacheable
- [ ] `prepareCall` runs pruning then caching, in that order
- [ ] The most recent message stays uncached
- [ ] On a provider that supports caching, `cachedInputTokens` shows up in usage
- [ ] `npx tsc --noEmit` passes

\*\*Note: Build a token-budget dashboard\*\*

You've got telemetry from lesson 5.1, pruning from 5.2, caps from 5.3, and caching from this lesson. Wire them together. After each step, log: input tokens (uncached), cached tokens, output tokens, and the running cost. At session end, print the total cost and what the session would have cost without pruning and caching. The number is what makes the discipline worth doing.

## Solution

```ts title="src/cache.ts"
import type { ModelMessage } from "ai";

export function addCacheControl(messages: ModelMessage[]): ModelMessage[] {
  return messages.map((msg, i) => {
    if (i === 0) {
      return {
        ...msg,
        providerOptions: { cacheControl: { type: "ephemeral" } },
      };
    }
    if (i < messages.length - 2) {
      return {
        ...msg,
        providerOptions: { cacheControl: { type: "ephemeral" } },
      };
    }
    return msg;
  });
}
```

```ts title="index.ts (prepareCall)"
prepareCall: async (options) => {
  const pruned = options.messages
    ? pruneMessages({
        messages: options.messages,
        toolCalls: "before-last-3-messages",
      })
    : undefined;

  return {
    ...options,
    messages: pruned ? addCacheControl(pruned) : undefined,
  };
},
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
