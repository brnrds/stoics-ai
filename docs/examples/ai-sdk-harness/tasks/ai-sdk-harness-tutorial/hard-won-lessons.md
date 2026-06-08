---
title: "Hard-Won Lessons"
description: "Production gotchas from real sandbox lifecycle implementations."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/hard-won-lessons"
md_url: "https://vercel.com/academy/build-ai-agent-harness/hard-won-lessons.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:05.171Z"
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

# Hard-Won Lessons

# Hard-Won Lessons

Each of the five things below caused a real outage, a real cost spike, or real lost work. They look obvious once you've seen them. They aren't obvious before that, which is why they keep happening.

These come from teams running production agent harnesses against cloud sandboxes. None of them are theoretical. The patterns repeat across providers, across platforms, and across implementations.

## Outcome

You can name five production lifecycle gotchas, describe the failure mode of each, and apply the fix pattern.

## Stale Handles After Reconnect

You reconnect to an existing sandbox. The handle is the one you had before, or one the harness rebuilt from a session record. Either way, the command stream is broken. Commands go in, garbage comes out, or the call hangs forever.

The handle survives the disconnect. The session inside it doesn't.

**Fix:** Probe a reconnected handle before using it.

```ts
const sandbox = await reconnect(sandboxId);
const probe = await sandbox.exec("echo probe");
if (probe.exitCode !== 0 || probe.stdout.trim() !== "probe") {
  sandbox = await createFromSnapshot(lastSnapshotId);
}
```

Probes are read-only and quick. The cost of running one before every reconnect is much smaller than the cost of an agent talking to a dead handle.

## Stale Expiry Data

The sandbox reports `expiresAt` when it's created. If you cache that value and check against it later, you're checking against data that was already old by the time you stored it. Worse, if you pass a derived value (`remainingTimeout = expiresAt - now()`) to a provider API after the cache went stale, you can accidentally create a sandbox that's already expired.

**Fix:** Always fetch fresh expiry from the provider before lifecycle decisions.

```ts
const { expiresAt } = await sandbox.getStatus();
if (expiresAt < Date.now()) {
  await beforeStop?.(sandbox);
}
```

Cache expiry information for display, not for control flow.

## Polling Resets Inactivity

Your lifecycle workflow polls sandbox status every thirty seconds. If the status check counts as activity, the inactivity window never closes. The sandbox runs until hard expiry. The bill arrives.

This is a clean pure-function bug masquerading as an integration issue. The fix is in two places at once: the activity tracker has to ignore status calls, and the status calls have to be careful not to trigger activity-coded events.

**Fix:** The activity tracker only counts user-initiated work.

```ts
function recordActivity(event: SandboxEvent) {
  if (event.kind === "user_message" || event.kind === "tool_call" || event.kind === "fs_change") {
    sandbox.lastActivityAt = Date.now();
  }
}
```

Status pings, health checks, reconnect probes, billing reads: none of those reset the timer.

## Auto-Resume Loops

The user reconnects. The sandbox auto-resumes from its last snapshot. The auto-resume triggers a lifecycle check, which sees no activity yet and decides to snapshot. The snapshot triggers a hibernate. The hibernate triggers the next auto-resume.

You've made an infinite loop out of two pieces of code that look correct in isolation.

**Fix:** Auto-resume only on initial entry. Subsequent reconnects join the active sandbox.

```ts
if (isInitialEntry && sandbox.state === "hibernated") {
  await restore(sandbox.snapshotId);
}
```

The state machine is your friend here. If the sandbox is already active, attaching to it is the right move. If it's hibernated, restore. If it's in any other state, wait or fail. Don't chain transitions automatically.

## State Divergence

Sandbox state lives in three places: the provider's API, your database, the client's local cache. They will diverge. Whatever you display to the user is going to be wrong some of the time, and which place you trust decides whether it's wrong in a way that costs you money or wrong in a way that costs you trust.

**Fix:** The provider API is the source of truth. Derive everything displayed from there.

```ts
const { state } = await provider.getSandboxStatus(sandboxId);
ui.showState(state);
```

Your database is a cache. The client cache is a cache. Neither is the truth. When in doubt, fetch.

\*\*Warning: The combinations are worse than the individuals\*\*

Each gotcha is bad on its own. The expensive bugs come from combining them. A stale handle plus a polling-counts-as-activity tracker means you keep paying for a sandbox you can't talk to. A divergent cache plus an auto-resume loop means you create three duplicate sandboxes for one user. Defense-in-depth is the right posture here. Fix all five, even when one or two seem unlikely in your environment.

## Try It

This is a concept lesson. Check yourself:

1. Without looking back, name the five gotchas
2. Pick the one that's most likely to bite your environment first. Why?
3. For each gotcha, draw the failure timeline. Where's the fix gate that would have caught it?

If you're building toward a real cloud backend, write the fix gates into the lifecycle hooks before you write the cloud sandbox itself. The gates don't do anything against the local backend, but they're cheaper to add now than to retrofit later.

## Commit

No code in this lesson.

## Done-When

- [ ] You can name all five gotchas
- [ ] You can describe the fix pattern for each
- [ ] You can identify which gates from Module 4's lifecycle hooks each fix would slot into

\*\*Note: Build a chaos mode\*\*

Production sandbox failures look different from local-dev failures. Build a `--chaos` flag for your test runs that randomly injects one failure per session: kill the sandbox process mid-command, return a stale handle on reconnect, force a state divergence between cache and provider, or skip a single status update. Run your full agent loop under chaos mode. The first thing that breaks is the gotcha you forgot to defend against.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
