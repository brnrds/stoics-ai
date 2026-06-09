---
title: "Lifecycle Hooks"
description: "Sandboxes need setup and teardown. Add afterStart, beforeStop, and onTimeout hook points."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/lifecycle-hooks"
md_url: "https://vercel.com/academy/build-ai-agent-harness/lifecycle-hooks.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:00.165Z"
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

# Lifecycle Hooks

# Lifecycle Hooks

Creating a sandbox is half the work. The other half is everything that happens around it.

A fresh cloud VM doesn't have your git config. It doesn't have node\_modules. It doesn't have your `.env`. Before the agent does anything useful, something has to configure git, install dependencies, copy environment files. And before the sandbox shuts down, something has to check whether there's uncommitted work and decide what to do about it.

Those somethings are lifecycle hooks. The local sandbox barely needs them. The cloud sandbox would be unusable without them.

## Outcome

The sandbox setup in `index.ts` calls `afterStart` and `beforeStop` hooks, with type definitions in `src/sandbox.ts`. The local sandbox runs with empty hooks. The plumbing is in place for the cloud and lifecycle work in Module 7.

## Fast Track

1. Add a `SandboxLifecycle` interface to `src/sandbox.ts` with optional `afterStart`, `beforeStop`, `onTimeout`
2. After creating the sandbox in `index.ts`, call `await lifecycle.afterStart?.(sandbox)`
3. Before `sandbox.stop()`, call `await lifecycle.beforeStop?.(sandbox)`
4. Keep the lifecycle empty for local. The hook points exist, the bodies don't have to

## Hands-on Exercise 4.5

Wire optional lifecycle hooks around the sandbox.

**Requirements:**

1. Define `SandboxLifecycle` with three optional methods, each taking a `Sandbox` and returning `Promise<void>`
2. In `index.ts`, pass a `lifecycle` object next to the sandbox creation
3. Call `await lifecycle.afterStart?.(sandbox)` immediately after creating the sandbox
4. Call `await lifecycle.beforeStop?.(sandbox)` before `sandbox.stop()`
5. Default to an empty `lifecycle = {}` so the local sandbox runs unchanged

**Implementation hints:**

- Optional chaining (`?.()`) does the conditional call for you. No need for `if (lifecycle.afterStart)` blocks
- Even an empty lifecycle is still a lifecycle. Don't make it optional at the outer level
- `onTimeout` is the one hook the harness invokes, not you. The cloud backend triggers it when `expiresAt` is reached. Stub it now, use it in Module 7

### The interface

```ts title="src/sandbox.ts (additions)"
export interface SandboxLifecycle {
  afterStart?(sandbox: Sandbox): Promise<void>;
  beforeStop?(sandbox: Sandbox): Promise<void>;
  onTimeout?(sandbox: Sandbox): Promise<void>;
}
```

All three are optional. A local sandbox might never need any of them. A cloud sandbox in a production harness probably uses all three.

### What each hook is for

`afterStart` runs after the sandbox is created and ready to take commands. This is where setup happens:

```ts title="src/lifecycle.ts (illustrative cloud lifecycle)"
const cloudLifecycle: SandboxLifecycle = {
  afterStart: async (sandbox) => {
    await sandbox.exec('git config user.name "Agent"');
    await sandbox.exec('git config user.email "agent@example.com"');
    await sandbox.exec("npm install");
    await sandbox.exec("cp .env.example .env");
  },
};
```

`beforeStop` runs before the sandbox shuts down, so anything important gets a chance to escape:

```ts
beforeStop: async (sandbox) => {
  const { stdout } = await sandbox.exec("git status --porcelain");
  if (stdout.trim()) {
    await sandbox.exec('git add -A && git commit -m "WIP: auto-save"');
  }
  if (sandbox.snapshot) {
    await sandbox.snapshot();
  }
},
```

`onTimeout` runs when the sandbox hits its time limit. The cloud backend invokes this, not you. The body usually reuses `beforeStop` plus some logging:

```ts
onTimeout: async (sandbox) => {
  console.error("Sandbox timed out, saving state");
  await cloudLifecycle.beforeStop?.(sandbox);
},
```

### Wire it into the agent loop

```ts title="index.ts"
const sandbox = await createSandboxByEnv(cwd);
const lifecycle: SandboxLifecycle = {};

await lifecycle.afterStart?.(sandbox);

try {
  const { text, steps } = await agent.generate({ prompt });
  console.log(text);
  console.log(`\n(${steps.length} steps)`);
} finally {
  await lifecycle.beforeStop?.(sandbox);
  await sandbox.stop();
}
```

The `try/finally` is important. Even if the agent throws mid-run, `beforeStop` should fire. That's where the uncommitted-work check belongs.

For the local sandbox with an empty `lifecycle = {}`, none of the hooks run. The agent behaves exactly as before. The structure is there for when we add real hooks in Module 7.

\*\*Note: Hooks earn their keep on cloud, not local\*\*

For the local backend, the lifecycle hooks are mostly ceremony. For the cloud backend, skipping `beforeStop` means losing uncommitted work when the VM dies. The fact that the interface forces you to think about both is the point. The local case is the simpler shape of the cloud case, not a different shape.

## Try It

The agent should behave exactly the same as the previous lesson, since the local lifecycle is empty.

```bash title="Terminal"
bun run index.ts . "Read the package.json"
```

Confirm the type plumbing works by adding a temporary log:

```ts title="index.ts (temporary)"
const lifecycle: SandboxLifecycle = {
  afterStart: async (sb) => console.error(`[lifecycle] after start: ${sb.type}`),
  beforeStop: async (sb) => console.error(`[lifecycle] before stop: ${sb.type}`),
};
```

Run any prompt. You should see the two log lines bracketing the agent's work.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/sandbox.ts index.ts
git commit -m "feat(sandbox): add lifecycle hook points"
```

## Done-When

- [ ] `SandboxLifecycle` interface defined with three optional methods
- [ ] `afterStart` is called once after sandbox creation
- [ ] `beforeStop` is called once before `sandbox.stop()`, inside a `finally`
- [ ] With an empty `lifecycle`, the agent runs unchanged
- [ ] With logging hooks, the lifecycle calls fire in order
- [ ] `npx tsc --noEmit` passes

\*\*Note: Snapshot and restore as a lifecycle pair\*\*

Lifecycle hooks aren't just for setup and teardown. Try this pairing: `afterStart` checks for a saved snapshot in a known location and restores from it if found. `beforeStop` auto-snapshots before shutting down. Now your harness has crash-resume behavior with no extra code at the call site. Where does the snapshot live? How do you tell a real new run from a resumed one? What happens when the snapshot is from a different code version? Module 7 covers this in depth, but the shape comes from the lifecycle interface you just defined.

## Solution

```ts title="src/sandbox.ts (additions)"
export interface SandboxLifecycle {
  afterStart?(sandbox: Sandbox): Promise<void>;
  beforeStop?(sandbox: Sandbox): Promise<void>;
  onTimeout?(sandbox: Sandbox): Promise<void>;
}
```

```ts title="index.ts"
import type { SandboxLifecycle } from "./src/sandbox";

const sandbox = await createSandboxByEnv(cwd);
const lifecycle: SandboxLifecycle = {};

await lifecycle.afterStart?.(sandbox);

try {
  const { text, steps } = await agent.generate({ prompt });
  console.log(text);
  console.log(`\n(${steps.length} steps)`);
} finally {
  await lifecycle.beforeStop?.(sandbox);
  await sandbox.stop();
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
