---
title: "Cloud Implementation"
description: "What a cloud sandbox looks like, with remote VMs, real filesystems, latency, and cost."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/cloud-implementation"
md_url: "https://vercel.com/academy/build-ai-agent-harness/cloud-implementation.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:59.747Z"
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

# Cloud Implementation

# Cloud Implementation

The local backend is free and fast. The `just-bash` backend is free and safe. The cloud backend is neither.

A cloud sandbox is a real VM running somewhere else. It has a real filesystem, real `git`, real `npm`, and real network. It also costs money per minute, adds latency on every call, and expires after thirty minutes whether you're done or not.

This lesson is concept and analysis, not build-along. The tooling around cloud sandboxes (provisioning, snapshots, billing) is provider-specific and changes faster than a course can keep up with. What stays stable is the shape: the interface is the same, the tradeoffs are different, and the tools don't care.

## Outcome

You can read and reason about a cloud sandbox implementation, and you can describe why `expiresAt` and `snapshot` exist on the interface as optional fields.

## What a Cloud Sandbox Looks Like

```ts title="src/sandbox-cloud.ts (illustrative)"
import type { Sandbox } from "./sandbox";

export async function createCloudSandbox(config: {
  template?: string;
  snapshotId?: string;
}): Promise<Sandbox> {
  const vm = await VercelSandbox.create(config);

  return {
    type: "cloud",
    workingDirectory: "/workspace",
    expiresAt: Date.now() + 30 * 60 * 1000,

    readFile: async (p) => {
      return vm.files.read(resolve("/workspace", p));
    },

    exec: async (command) => {
      const result = await vm.commands.run(command, { cwd: "/workspace" });
      return {
        stdout: result.stdout + result.stderr,
        exitCode: result.exitCode,
      };
    },

    stop: async () => {
      await vm.close();
    },

    snapshot: async () => {
      const snap = await vm.snapshot();
      return { snapshotId: snap.id };
    },
  };
}
```

Same shape as `local` and `just-bash`. The methods just happen to make network calls. From the tool's perspective, that's invisible. From the wall-clock perspective, it's the only thing that matters.

## The Tradeoffs

|              | Local              | just-bash                            | Cloud                                     |
| ------------ | ------------------ | ------------------------------------ | ----------------------------------------- |
| Cost         | Free               | Free                                 | Per-minute                                |
| Latency      | Microseconds       | Microseconds                         | Tens to hundreds of milliseconds per call |
| Isolation    | None               | Partial (reads real, writes virtual) | Full, separate VM                         |
| Persistence  | Permanent          | Garbage collected on stop            | Snapshot or restore                       |
| `git`, `npm` | Your local install | Simulated                            | Real, separately installed                |
| Timeout      | None               | None                                 | Hard limit (often 30 to 60 minutes)       |

The interface accommodates all three because the shape stays the same. The optional fields (`expiresAt`, `snapshot`) earn their `?` because they don't apply to the simpler backends.

## When to Pick Each

| Backend     | Best for                                              |
| ----------- | ----------------------------------------------------- |
| `local`     | Local development, debugging, trusted environments    |
| `just-bash` | Exploration, testing, untrusted code review           |
| `cloud`     | Production, CI, multi-user, fully sandboxed execution |

A real harness lets the user pick at startup. The agent doesn't know or care.

\*\*Note: Why the cloud backend is concept-only here\*\*

We're not building `createCloudSandbox` against a live provider because the API for the provisioning side, the network details, the snapshot semantics, all of that varies by vendor and shifts often. The teaching point that survives is that the interface is the same. If you want to wire this up against [Vercel Sandbox](https://vercel.com/docs/functions/sandbox), the methods translate directly.

## What `expiresAt` and `snapshot` Buy You

`expiresAt` lets the harness know the clock is running. A long-running task can check `expiresAt` and decide whether to start a new operation or wrap up. Without it, the agent runs until it gets a network error and then has to figure out what happened.

`snapshot` lets the harness save state mid-run. The cloud sandbox is going to die in thirty minutes. If you snapshot at minute twenty-eight, you can restart from the snapshot in a fresh sandbox and pick up where you left off. Module 7 covers this in depth.

Both are optional. A local sandbox shouldn't pretend to have them. A `just-bash` sandbox doesn't have a meaningful way to expose them. The interface lets each backend opt in to the capabilities it can actually deliver.

## Try It

There's no code to run in this lesson, but there's a concept check:

1. Without looking back at the table, write down two reasons `readFile` in the cloud backend is slower than `readFile` in the local backend
2. Explain in one sentence why `expiresAt` is optional on the interface
3. Sketch what `createCloudSandbox` would look like against a provider API you've used before. What would `exec` need to do that `local.exec` doesn't?

The shape of your answers tells you whether the abstraction has clicked.

## Commit

No code changes in this lesson, so no commit. If you sketched a cloud implementation as a thinking exercise, keep it in a scratch file.

## Done-When

- [ ] You can explain why `readFile` in a cloud sandbox adds latency
- [ ] You can explain why `expiresAt` exists on the interface
- [ ] You can describe when you'd pick `cloud` over `local` or `just-bash`
- [ ] You could implement `createCloudSandbox` against a real provider API if asked

\*\*Note: Sketch the cost-aware harness\*\*

A cloud sandbox costs money per minute. Design a guardrail in the harness that warns you when the running cost crosses a threshold. The agent itself doesn't see the cost, but the harness wrapping it can. Where in the loop does the check go? What happens when the threshold is exceeded mid-task? Do you stop, snapshot, or ask the user? Each answer points at a different operational model.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
