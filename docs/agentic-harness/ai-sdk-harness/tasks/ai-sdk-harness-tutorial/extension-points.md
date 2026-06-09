---
title: "Extension Points"
description: "Lifecycle events for extensible behavior. Subscribe, block, modify, pass through."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/extension-points"
md_url: "https://vercel.com/academy/build-ai-agent-harness/extension-points.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:09.401Z"
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

# Extension Points

# Extension Points

The registry from the last lesson handles "what tools exist." It doesn't handle "what happens around tool calls." Logging every call. Blocking writes to specific files. Wrapping commands in an OS-level sandbox. Auto-committing on shutdown. These are cross-cutting concerns that don't belong inside any single tool.

Events are the right primitive. The harness emits lifecycle events. Extensions subscribe. Each subscriber can pass through, block, or modify the event before the harness continues. Multiple subscribers chain.

This lesson is the architectural sketch. Building the event bus into the working harness is straightforward, but the value comes from understanding the contract before you wire it.

## Outcome

You can describe an event bus that fires on key lifecycle events, handlers that can block or modify, and the order rules that make multi-handler chains predictable.

## The Event Surface

```ts title="src/events.ts (sketch)"
type LifecycleEvent =
  | "session_start"
  | "tool_call"
  | "tool_result"
  | "session_before_compact"
  | "session_shutdown";

type EventResult = { block?: boolean; reason?: string; modify?: any } | void;

interface EventBus {
  on(event: LifecycleEvent, handler: (data: any) => Promise<EventResult>): void;
  emit(event: LifecycleEvent, data: any): Promise<EventResult[]>;
}
```

The events themselves are deliberately small. Five names cover the moments where extensions usually need to plug in. Adding more later is fine; starting with five is what keeps the contract legible.

## Four Examples

The shape becomes obvious once you see what extensions actually do with it.

### Log every tool call

```ts title="src/extensions/logging.ts"
bus.on("tool_call", async ({ toolName, input }) => {
  console.error(`[${new Date().toISOString()}] ${toolName}: ${JSON.stringify(input)}`);
});
```

No return value. The handler passes through. The harness continues with the call.

### Block writes to protected files

```ts title="src/extensions/protect-files.ts"
const PROTECTED = [".env", "package-lock.json"];

bus.on("tool_call", async ({ toolName, input }) => {
  if (toolName === "write" && PROTECTED.some((p) => input.path.endsWith(p))) {
    return { block: true, reason: `${input.path} is protected by policy.` };
  }
});
```

The handler returns `block: true`. The harness stops the call and feeds the reason back to the model as the tool result. The model sees the policy in plain text and reports it to the user.

### Inject safety prompt before compaction

```ts title="src/extensions/compact-safety.ts"
bus.on("session_before_compact", async () => {
  return {
    modify: {
      customInstructions:
        "Preserve all safety constraints and approval rules across compaction.",
    },
  };
});
```

The handler returns `modify`. The harness applies the modification (in this case, an extra instruction line) before continuing. Compaction is a moment where instructions can leak; this is one way to keep them from leaking.

### Auto-commit on shutdown

```ts title="src/extensions/auto-commit.ts"
bus.on("session_shutdown", async ({ sandbox }) => {
  const { stdout } = await sandbox.exec("git status --porcelain");
  if (stdout.trim()) {
    await sandbox.exec(`git add -A && git commit -m "WIP: auto-save"`);
  }
});
```

This is the cloud-sandbox `beforeStop` hook from Module 4, generalized. Any session that ends, for any reason, gets a chance to checkpoint its work.

## The Chaining Rule

Multiple handlers can subscribe to the same event. They run in registration order. If any handler returns `block: true`, the call stops and the reason goes back to the model. If any returns `modify`, subsequent handlers see the modified data.

```
Tool call requested
  -> emit "tool_call"
       handler 1: log (pass through)
       handler 2: check protected files (may block)
       handler 3: project safety policy (may block)
  -> if any blocked: return reason to model, do not execute
  -> if all passed: execute tool
  -> emit "tool_result"
       handler 1: log result
       handler 2: telemetry
```

Order matters. Logging before safety checks captures the call attempt even when it gets blocked. Telemetry after the result captures what actually ran. Get the order right and the chain produces useful traces. Get it wrong and you log half the story.

## How Events Combine with What You Already Built

The pieces start to overlap, in a good way:

- The approval config from Module 2 sets the operational mode (interactive, background, delegated). It still runs at the tool level
- The event bus runs around the tool layer. A `tool_call` handler can block even when approval would have passed
- The lifecycle hooks from Module 4 (`afterStart`, `beforeStop`) overlap with `session_start` and `session_shutdown`. The handler signature is more general; the lifecycle hooks are the convenient name for the most common cases
- The skills system from 11.1 is a separate retrieval surface. It doesn't go through events, because the model decides whether to load a skill, not the harness

The harness ends up layered: tools at the bottom, events around tools, lifecycle hooks at the session boundary, skills as discovered knowledge, registries as the entry point for everything. Each layer has its own job.

\*\*Note: Why this is the last lesson\*\*

The event bus is the most flexible extension surface and the most dangerous one. A bad handler can deadlock the agent, leak secrets through logging, or block legitimate tool calls. Building it last (after tools, sandboxes, prompts, context, subagents, and lifecycle hooks) means you understand what you're plugging into before you plug.

If you wired this earlier, the temptation would be to handle every problem with an event hook. The discipline that comes from learning the other layers first is what stops the harness from turning into one giant `on('tool_call', ...)` handler.

## Try It

This is a concept lesson. Check yourself:

1. Without looking back, name the five lifecycle events
2. For each, describe one realistic extension that would subscribe
3. Trace what happens when two handlers on `tool_call` both return `block: true`. Whose reason wins?
4. Explain how the event bus relates to the approval config from Module 2. Where do they overlap, and where don't they?

If you want to build this for real, the implementation is small: a `Map<string, Handler[]>` and an `emit` that runs handlers in order with early-exit on block. Plug it into the agent loop right before tool execution and right after tool result. Module 4's lifecycle hooks become the first two subscribers.

## Commit

No code in this lesson unless you wire the bus. If you do, commit it on a separate branch and exercise it with a logging extension before adding any blocking ones.

## Done-When

- [ ] You can name five lifecycle events
- [ ] You can describe pass through, block, and modify return values
- [ ] You can trace a multi-handler chain and predict the result
- [ ] You can explain how the bus complements (rather than replaces) the approval config

\*\*Note: Build a telemetry extension\*\*

Subscribe to `tool_call`, `tool_result`, and the per-step events. Record timestamps, durations, and token counts. Append events to a JSONL file as they happen so a crash doesn't lose the trace. At session end, generate a one-screen report: total time, tool call counts, slowest tool, total tokens. Now run the same task twice with different system prompts and diff the telemetry. Which prompt produced fewer tool calls? Less waste? This is how you A/B test agent behavior without guessing.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
