---
title: "Approval Config"
description: "Two approval models. Config for operational modes, events for pluggable safety."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/approval-config"
md_url: "https://vercel.com/academy/build-ai-agent-harness/approval-config.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:05.876Z"
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

# Approval Config

# Approval Config

You already have an approval system. Module 2 built the discriminated union with `interactive`, `background`, and `delegated` modes. That answers one question: *who decides?*

It doesn't answer the other one: *what specific policies apply?*

A CI run uses `mode: "background"` to auto-approve commands. Fine. But you also want to block any write to `.env`, regardless of mode. You want bash commands wrapped in a stricter OS-level sandbox, regardless of mode. Those rules don't fit the discriminated union. They live one layer down.

This lesson sets up the second layer (event-based interception) and shows where the two models meet. The event layer is conceptual in the build-along, but the shape is worth seeing now so you can wire it in when you need it.

## Outcome

You can describe two approval models, identify which one fits which use case, and explain how they combine in production harnesses.

## The Two Models

The config model is what you have:

```ts
type ApprovalConfig =
  | { mode: "interactive" }
  | { mode: "background" }
  | { mode: "delegated"; trust: string[] };
```

Set at startup. Doesn't change during a session. Answers *who decides*.

The event model is the layer below:

```ts title="src/approval-events.ts (sketch)"
harness.on("tool_call", async (event) => {
  const { toolName, input } = event;

  if (toolName === "write" && input.path.endsWith(".env")) {
    return { block: true, reason: "Cannot modify .env files" };
  }

  if (toolName === "bash") {
    event.input.command = `sandbox-exec -p '(deny default)' ${input.command}`;
  }

  return { block: false };
});
```

Fires on every tool call. Extensions can block, modify, or pass through. Answers *what policies apply*.

## When to Use Which

| Use case                              | Config               | Events                |
| ------------------------------------- | -------------------- | --------------------- |
| CI run, auto-approve everything       | `mode: "background"` | Overkill              |
| Subagent inheriting trust from parent | `mode: "delegated"`  | Wrong level           |
| Block writes to specific files        | Too coarse           | File-level policy     |
| Wrap commands in OS-level sandbox     | Can't modify input   | Input modification    |
| Project-specific safety rules         | Global only          | Per-project extension |

The config layer is for the operational mode of a whole session. The event layer is for fine-grained, often project-specific, often pluggable policies. They overlap a little. They don't replace each other.

## How They Combine

A real harness uses both:

```ts title="src/index.ts (sketch)"
const approval = createApproval({ mode: "interactive" });

harness.on("tool_call", async (event) => {
  if (event.toolName === "write" && event.input.path.endsWith(".env")) {
    return { block: true, reason: "Protected file" };
  }
});
```

The config says "interactive mode, the human approves." The event handler says "regardless of what the human approves, never touch `.env`." The event fires after the config but before the tool runs. Defense in depth.

This matters because operational modes and policies tend to come from different places. The mode is set by who's running the harness (CI, a developer, a delegated subagent). The policies are set by the project (`.env` is sensitive, the build directory is read-only, anything that touches production credentials needs OS-level sandboxing). One config knob can't carry both kinds of decisions without getting tangled.

\*\*Note: The event layer slots into Module 11\*\*

We'll build the actual event bus in Module 11's extensibility work, where lifecycle events are the primary extension point. Approval events are one specific kind of lifecycle event. Once the bus exists, the approval interceptor is a few lines of code that subscribes to `tool_call`.

## What's Missing in the Build-Along

The harness you've built so far has the config layer. It doesn't have an event layer yet. That's fine. The config layer covers most of the cases the course needs to teach.

Adding the event layer would look like this:

1. Build a small typed event emitter in the harness (Module 11)
2. Emit a `tool_call` event from the agent loop before each tool runs
3. Let subscribers return `{ block, reason }` or modify the input
4. Wire one subscriber that blocks writes to a hardcoded file as a smoke test

The work is small. It's not in this module because the prerequisites (events, extensions) belong with the rest of the extensibility story. When you reach Module 11, the event-based approval becomes a single concrete example of why the event bus is useful.

## Try It

This is a concept lesson. Check yourself:

1. For each of the five use cases in the table above, decide which model fits best
2. Sketch a single use case where both models apply at once. What does each layer do?
3. Identify a project you've worked on where event-based approval would have caught a real mistake. What would the rule have been?

## Commit

No code in this lesson. The event layer arrives in Module 11.

## Done-When

- [ ] You can describe the config approach and what it answers
- [ ] You can describe the event approach and what it answers
- [ ] You can pick which one fits a given use case
- [ ] You can sketch how the two combine for defense in depth

\*\*Note: Build a risk-scored auto-approval\*\*

Binary approve and deny is crude. Try a `riskScore(command)` function that returns a number from 0 to 100. Score factors: writes to disk add 30, network access adds 20, file deletion adds 50, modifying config adds 40, read-only is 0. Set a threshold of, say, 40. Below auto-approves. Above prompts the user. Log every auto-approval with its score so you can audit later. Add a `--risk-threshold` flag so users can tune their own comfort level. Now figure out how to score `rm -rf /tmp/test` differently from `rm -rf /` without scoring purely on keywords.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
