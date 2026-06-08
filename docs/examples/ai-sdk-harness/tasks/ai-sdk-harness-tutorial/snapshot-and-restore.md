---
title: "Snapshot and Restore"
description: "Freeze the filesystem, return an ID, restore later. Idempotency in three places."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/snapshot-and-restore"
md_url: "https://vercel.com/academy/build-ai-agent-harness/snapshot-and-restore.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:04.469Z"
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

# Snapshot and Restore

# Snapshot and Restore

Snapshot freezes the sandbox filesystem and returns an ID. Restore creates a new sandbox from that ID. Same files, same state, different VM.

The mechanics are simple. The places where it goes wrong are not. All three of them are about idempotency, the property that calling something twice produces the same result as calling it once. Sandboxes are full of operations that you really, really do not want to call twice without thinking about it.

## Outcome

You can describe what `snapshot` preserves and what `restore` creates, and you can identify the three idempotency hazards that show up in production lifecycle code.

## The API

```ts
const { snapshotId } = await sandbox.snapshot!();

const restored = await createCloudSandbox({ snapshotId });
```

That's the surface. Everything interesting happens around it.

## What Snapshot Preserves

Snapshots capture filesystem state. The contents of `/workspace` (or wherever your sandbox roots), the state of any installed packages, any files the agent created. They do not capture running processes, in-flight network connections, or in-memory state. A long-running build that's halfway through its compile step does not pick up where it left off after a restore. The filesystem snapshots; the work in progress does not.

This matters for the agent's mental model. After a restore, the agent has all the files it had before, but if it was in the middle of running tests when the snapshot fired, the tests have to run again.

## The Three Idempotency Hazards

### 1. Snapshot already in progress

The user (or the lifecycle workflow) triggers a snapshot while one is already running. Without a guard, you get two snapshots fighting for the same VM, or a provider error, or a partial snapshot that looks valid but isn't.

```ts
let inFlight: Promise<{ snapshotId: string }> | null = null;

snapshot: async () => {
  if (inFlight) return inFlight;
  inFlight = vm.snapshot();
  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
},
```

Cache the promise, return it on the second call, clear it when the work finishes.

### 2. Sandbox already running on restore

The user reconnects to a session that's already active and the harness triggers a restore on top of it. Now you have two VMs. The new one is wasting money. The old one is still serving traffic.

```ts
async function attachOrRestore(sessionId: string, snapshotId: string) {
  const existing = await findActiveSandbox(sessionId);
  if (existing) return existing;
  return createCloudSandbox({ snapshotId });
}
```

Look before you create. The restore path should always check for an active sandbox first.

### 3. Double stop

`stop` is called once by the inactivity timer, once by the user. Or once on hibernate, once on hard expiry. The second call hits a sandbox that's already gone, and depending on the provider, either fails loudly or corrupts state silently.

```ts
let stopped = false;

stop: async () => {
  if (stopped) return;
  stopped = true;
  await vm.close();
},
```

A boolean is enough. The point is that the second `stop` does nothing instead of hitting a dead VM.

## What Restore Doesn't Solve

A snapshot is a moment in time. Restoring from a snapshot from yesterday still gives you yesterday's code, yesterday's dependencies, yesterday's environment. If the project has moved on (a new commit, a new package, a new env var), the restored sandbox is a fossil.

Production lifecycles handle this by either invalidating snapshots when the project changes, or by re-running setup hooks (`afterStart` from Module 4) after a restore. Neither is automatic. Both have to be wired in deliberately.

\*\*Note: The local sandbox can fake this\*\*

The local backend doesn't have a real snapshot mechanism, but you can sketch one with `git stash` or a tarball of the working directory. It's not equivalent to a cloud snapshot (no VM state, no install caches), but it teaches the seam. If you want to play with the shape, that's a fine place to start.

## Try It

This is a concept lesson. Check yourself:

1. Without looking back, name the three idempotency hazards
2. Write down what `snapshot` preserves and what it doesn't, in your own words
3. Sketch the `attachOrRestore` flow as a sequence diagram. Where does the active-sandbox check happen relative to the snapshot lookup?

If you want to play with the shape locally, add a `snapshot` to the local sandbox that runs `git stash push` and returns the stash ref as a snapshot ID. The semantics are wrong (a real snapshot freezes everything, not just tracked files), but the seam is real.

## Commit

No code in this lesson unless you're sketching a local snapshot. If you do, commit it on a separate branch so it doesn't entangle with the working harness.

## Done-When

- [ ] You can describe what snapshot preserves and what it doesn't
- [ ] You can name the three idempotency hazards and the guard pattern for each
- [ ] You can explain why a restored snapshot might still need `afterStart` to re-run


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
