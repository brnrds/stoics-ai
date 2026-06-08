---
title: "Designing the Interface"
description: "Define a Sandbox interface that tools call so execution can move without rewriting tool logic."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/designing-the-interface"
md_url: "https://vercel.com/academy/build-ai-agent-harness/designing-the-interface.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:58.289Z"
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

# Designing the Interface

# Designing the Interface

Your tools work great. They also know too much.

`read` knows about `readFileSync`. `bash` knows about `execSync`. Both know they're running on Node. The minute you want them to run somewhere else, a sandbox, a remote VM, an in-memory filesystem, every tool has to be rewritten.

Before we build any backend, we'll write down the interface. What does a sandbox need to do, in the abstract, for any tool to call it? Once that contract exists, the tools refactor against it and the backends slot in behind.

## Outcome

A `Sandbox` interface defined with `readFile`, `exec`, `stop`, plus identity fields. All three tools (`read`, `grep`, `bash`) call the interface instead of Node APIs directly.

## Fast Track

1. Define the `Sandbox` interface with `type`, `workingDirectory`, `readFile`, `exec`, `stop`, plus optional `expiresAt` and `snapshot`
2. Refactor `read` to call `sandbox.readFile(path)` instead of `readFileSync`
3. Refactor `grep` and `bash` (or your `localOps.exec`) to route through `sandbox.exec(command)`

## Hands-on Exercise 4.1

Write the interface and refactor the three tools to use it.

**Requirements:**

1. Define `Sandbox` in `src/sandbox.ts` with `type`, `workingDirectory`, `readFile`, `exec`, `stop`, and optional `expiresAt` and `snapshot`
2. Every method is `async`, even when the implementation will be synchronous under the hood
3. Pass a `Sandbox` into the tool factories. Update `read`, `grep`, and `bash` to call `sandbox.readFile` and `sandbox.exec`
4. The build won't run yet (you haven't written the implementation). That's fine. We'll do that in the next lesson

**Implementation hints:**

- All methods are `async` because the cloud backend will need it, and inconsistent signatures across implementations are a mess
- Use optional methods (`expiresAt?`, `snapshot?(): Promise<...>`) for capabilities that don't apply to every backend
- `type: string` is for logging and debugging. Don't make it a union yet. It can become `"local" | "just-bash" | "cloud"` later if you want

### The interface

```ts title="src/sandbox.ts"
export interface Sandbox {
  type: string;
  workingDirectory: string;
  readFile(path: string): Promise<string>;
  exec(command: string): Promise<{ stdout: string; exitCode: number }>;
  stop(): Promise<void>;
  expiresAt?: number;
  snapshot?(): Promise<{ snapshotId: string }>;
}
```

A few choices worth pointing at:

- Every method returns a `Promise`. The local backend wraps sync calls. The cloud backend really is async. Same signature for both keeps the tools simple
- `type` and `workingDirectory` are identity fields. Tools sometimes need to know where they are and what they're talking to
- `expiresAt` and `snapshot` are optional. A local sandbox doesn't expire. A `just-bash` sandbox doesn't snapshot. The interface accommodates both without forcing stubs

### What each method earns

| Method             | Purpose                      | Required?           |
| ------------------ | ---------------------------- | ------------------- |
| `readFile`         | Read a file by path          | Yes                 |
| `exec`             | Run a command                | Yes                 |
| `stop`             | Shut down gracefully         | Yes (no-op is fine) |
| `type`             | Identify the backend in logs | Yes                 |
| `workingDirectory` | Base path for tools          | Yes                 |
| `expiresAt`        | Timeout timestamp            | No (cloud only)     |
| `snapshot`         | Save state                   | No (cloud only)     |

Make the interface as small as you can get away with. Anything you add now will be the thing every implementation has to support forever.

### Refactor the tools

The refactor for `read` is one line:

```ts title="src/tools.ts"
// Before
execute: async ({ path: filePath }) => {
  const content = readFileSync(resolve(cwd, filePath), "utf-8");
  // ...
}

// After
execute: async ({ path: filePath }) => {
  const content = await sandbox.readFile(filePath);
  // ...
}
```

`grep` and `bash` get the same treatment, routing through `sandbox.exec(command)` instead of `execSync` or the `localOps` object we built in Module 2. The factory functions now accept a `sandbox` parameter and close over it.

The tool's input schema, description, line cap, and match cap all stay the same. The model still sees the same contract. The plumbing under the hood is what's moving.

\*\*Note: The win is portability, not behavior\*\*

After this refactor, the agent behaves the same way on the same prompts. Same tools, same results. That's the test that the refactor was structural and not behavioral. The win shows up when you add the second backend in lesson 4.3 and don't have to touch the tools to get there.

## Try It

You haven't written an implementation yet, so the code won't run end-to-end. What you can do is check that the types line up:

```bash title="Terminal"
npx tsc --noEmit
```

If you've refactored consistently, this passes. Every reference to `readFileSync` and `execSync` inside the tools should be gone. The tools now expect a `Sandbox` parameter.

## Commit

```bash
git add src/sandbox.ts src/tools.ts
git commit -m "refactor(tools): route through Sandbox interface"
```

## Done-When

- [ ] `src/sandbox.ts` exports the `Sandbox` interface
- [ ] `read`, `grep`, and `bash` accept a `Sandbox` and call `sandbox.readFile` and `sandbox.exec`
- [ ] No tool imports `readFileSync` or `execSync` directly anymore
- [ ] `expiresAt` and `snapshot` are typed as optional
- [ ] `npx tsc --noEmit` passes

\*\*Note: Add one more method without breaking the world\*\*

Suppose you want tools to write files too. Add `writeFile(path: string, content: string): Promise<void>` to the interface. Now every implementation has to support it, including ones that don't make sense to write to (like a read-only review sandbox). What's the right move? A new optional method? A separate interface for write-capable sandboxes? An error thrown from the implementations that can't do it? Each one has a different cost. Pick one and notice what it forces everywhere else.

## Solution

```ts title="src/sandbox.ts"
export interface Sandbox {
  type: string;
  workingDirectory: string;
  readFile(path: string): Promise<string>;
  exec(command: string): Promise<{ stdout: string; exitCode: number }>;
  stop(): Promise<void>;
  expiresAt?: number;
  snapshot?(): Promise<{ snapshotId: string }>;
}
```

```ts title="src/tools.ts (shape)"
import type { Sandbox } from "./sandbox";

export function createReadTool(sandbox: Sandbox) {
  return tool({
    description: `Read a file from the project. Returns numbered lines.
WHEN TO USE: viewing file contents, checking configs, reading source code.
WHEN NOT TO USE: searching across files (use grep instead).`,
    inputSchema: z.object({
      path: z.string(),
      offset: z.number().optional(),
      limit: z.number().optional(),
    }),
    execute: async ({ path: filePath, offset, limit }) => {
      const content = await sandbox.readFile(filePath);
      // ... same line numbering and truncation logic
    },
  });
}

export function createBashTool(
  sandbox: Sandbox,
  needsApproval: (input: { command: string }) => boolean,
) {
  return tool({
    // ... same description and schema
    execute: async ({ command }) => {
      if (needsApproval({ command })) {
        return `Blocked: "${command}" requires approval.`;
      }
      const { stdout } = await sandbox.exec(command);
      return stdout || "(no output)";
    },
  });
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
