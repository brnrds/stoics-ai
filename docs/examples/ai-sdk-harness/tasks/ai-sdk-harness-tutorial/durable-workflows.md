---
title: "Durable Workflows"
description: "setTimeout dies when the function ends. Vercel Workflow survives deploys."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/durable-workflows"
md_url: "https://vercel.com/academy/build-ai-agent-harness/durable-workflows.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:04.804Z"
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

# Durable Workflows

# Durable Workflows

Sandbox lifecycle wants to do something simple. Every thirty seconds, check whether the sandbox has been idle long enough to hibernate. If yes, snapshot and stop. If no, wait another thirty seconds.

In a long-running server, that's a `setInterval` and you go home. In serverless, the function dies after a minute or two and takes the timer with it. The sandbox keeps running, you keep paying, and your lifecycle code is sitting in some other process that doesn't exist anymore.

You need durable infrastructure. Something that can sleep across function boundaries and resume on the other side. Vercel Workflow does this. The pattern matters even if you use a different runtime.

## Outcome

You can explain why `setTimeout` fails for sandbox lifecycle in a serverless environment, and you can sketch a durable workflow loop that polls a sandbox, snapshots when idle, and resumes after a deploy.

## The Problem with setTimeout

```ts
setTimeout(() => checkAndSnapshot(), 30_000);
```

This works locally. It does not work in serverless.

The function that called `setTimeout` returns. The runtime cleans up the function's process. The timeout is garbage collected. The check never runs. The sandbox keeps running. Your monthly bill discovers what unbounded sandbox runtime costs.

Even if the function stayed alive long enough for the first check, there's no guarantee the next deploy hasn't replaced it. You'd lose the timer state across every redeploy.

## The Workflow Pattern

Vercel Workflow exposes a `sleep()` that doesn't depend on the host process staying alive:

```ts title="src/lifecycle.ts"
"use workflow";
import { sleep } from "workflow/sleep";

const POLL_INTERVAL = 30;
const INACTIVITY_WINDOW = 5 * 60;

export async function sandboxLifecycle(sandboxId: string) {
  while (true) {
    await sleep(POLL_INTERVAL);

    const status = await checkSandboxStatus(sandboxId);

    if (status === "expired") {
      break;
    }

    if (status.lastActivity + INACTIVITY_WINDOW < Date.now() / 1000) {
      await snapshotAndStop(sandboxId);
      break;
    }
  }
}
```

`sleep(30)` doesn't pause the function. It checkpoints the workflow to durable storage and returns. Thirty seconds later, the workflow resumes from exactly where it left off, in whatever function instance happens to be available. Across deploys. Across host restarts. Across whatever the platform is doing under the hood.

That's the trick. The loop body is normal code. The `sleep` is the magic.

## The Step Boundary

Inside the workflow, calls to external systems (provider APIs, your database, any kind of side effect) live in `"use step"` functions:

```ts title="src/lifecycle-steps.ts"
"use step";

export async function checkAndSnapshotStep(sandboxId: string) {
  const sandbox = await getSandbox(sandboxId);
  if (!sandbox.isActive) return { action: "stop" };

  const idle = Date.now() - sandbox.lastActivityAt;
  if (idle > INACTIVITY_WINDOW) {
    await sandbox.snapshot();
    await sandbox.stop();
    return { action: "hibernated" };
  }

  return { action: "continue" };
}
```

Step functions get retried on transient failures and cached on success. The workflow loop calls them like normal functions. The runtime makes durability happen.

## Cost Math

The number this saves you depends on how idle your typical session is. A reasonable middle case:

| Setup                        | Behavior                              | Cost per session           |
| ---------------------------- | ------------------------------------- | -------------------------- |
| No lifecycle                 | Sandbox runs to hard expiry (4 hours) | 4h x $0.02/min = $4.80     |
| Inactivity-based hibernation | Sandbox hibernates after 5 min idle   | 25 min x $0.02/min = $0.50 |

Roughly an order of magnitude on long sessions. The savings compound across users and across time.

\*\*Note: The pattern survives the runtime\*\*

Vercel Workflow is one implementation. Temporal is another. AWS Step Functions is another. The principle is the same: a sleep that survives function boundaries lets you write lifecycle code as if you had a long-running process, even when you don't. If you're using a different runtime, look for the equivalent of `sleep()` and the equivalent of step functions. Roll your own only if you really mean it.

## Where the Demo Stops Short

The local and `just-bash` backends in this course don't run a durable workflow. They don't need to. The lifetime is the process lifetime. There's no inactivity to hibernate against.

The lifecycle hooks from Module 4 are where this would slot in for a cloud backend. `afterStart` would launch the durable workflow. `beforeStop` would tell the workflow to wrap up. The workflow itself would call back into the sandbox through the same `Sandbox` interface, calling `snapshot()` and `stop()` like any other consumer.

That's why the interface is the way it is. The synchronous, in-process world (local) and the asynchronous, multi-deploy world (cloud) both fit behind the same surface, because the workflow runtime handles the hard part.

## Try It

This is a concept lesson. Check yourself:

1. Explain in one sentence why `setTimeout` fails for sandbox lifecycle in serverless
2. Trace the workflow loop and list every place `sleep` could be checkpointed across a deploy
3. Calculate the savings on a workload you've actually run. What was your average idle time per session?

## Commit

No code in this lesson. The next lesson lists the production gotchas that bite even when the durable workflow is wired correctly.

## Done-When

- [ ] You can explain why `setTimeout` doesn't work in serverless
- [ ] You can sketch the workflow loop and identify the durability seam
- [ ] You can do the cost math for a workload of your choice


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
