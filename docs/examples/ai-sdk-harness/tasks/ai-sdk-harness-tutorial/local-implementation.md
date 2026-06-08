---
title: "Local Implementation"
description: "Wrap Node.js fs and child_process in a local Sandbox implementation so the interface has a concrete baseline backend."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/local-implementation"
md_url: "https://vercel.com/academy/build-ai-agent-harness/local-implementation.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:58.667Z"
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

# Local Implementation

# Local Implementation

The interface from the last lesson does nothing on its own. We need a backend.

The local sandbox is the boring one. It wraps the same `readFileSync` and `execSync` calls you've been using all along. The difference is they're hidden behind the interface now, where every tool calls them the same way.

Boring is the point. The local sandbox proves the interface works without introducing new complexity. It's the baseline every other backend will be compared to.

## Outcome

`src/sandbox-local.ts` exports `createLocalSandbox(dir)`, a factory that returns a `Sandbox` whose methods wrap Node's `readFileSync` and `execSync`. The agent runs the same way as before, but through the interface.

## Fast Track

1. Create `src/sandbox-local.ts` exporting `createLocalSandbox(dir): Sandbox`
2. Wrap `readFileSync` in `async readFile`
3. Wrap `execSync` in `async exec` with try/catch returning `{ stdout, exitCode }`
4. Make `stop()` an async no-op

## Hands-on Exercise 4.2

Implement the local sandbox.

**Requirements:**

1. `createLocalSandbox(dir: string): Sandbox` returns an object that satisfies the interface
2. `readFile` resolves the path against `dir` and reads UTF-8
3. `exec` runs the command with `cwd: dir` and a 30-second timeout
4. On `exec` error, return `{ stdout: <whatever output there was>, exitCode: <non-zero> }` instead of throwing
5. `stop` is `async () => {}`

**Implementation hints:**

- The whole file is around 15 lines. If yours is longer, you're probably handling cases the cloud backend will care about and the local one doesn't
- `exec` should never throw, even on a non-zero exit. Tools expect a result object. Catching the error and returning it is the right shape
- `type: "local"` is what `sandboxType` interpolates into the system prompt from Module 3

### The implementation

```ts title="src/sandbox-local.ts"
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import type { Sandbox } from "./sandbox";

export function createLocalSandbox(dir: string): Sandbox {
  return {
    type: "local",
    workingDirectory: dir,
    readFile: async (p) => readFileSync(resolve(dir, p), "utf-8"),
    exec: async (command) => {
      try {
        const stdout = execSync(command, {
          cwd: dir,
          encoding: "utf-8",
          timeout: 30_000,
        });
        return { stdout, exitCode: 0 };
      } catch (e: any) {
        return {
          stdout: e.stdout || e.stderr || e.message || "",
          exitCode: e.status ?? 1,
        };
      }
    },
    stop: async () => {},
  };
}
```

That's the whole backend. `stop` is a no-op because there's nothing to clean up. The local filesystem and `child_process` will outlive the agent.

### Wire it up

```ts title="index.ts"
import { createLocalSandbox } from "./src/sandbox-local";
import { createReadTool, createGrepTool, createBashTool } from "./src/tools";

const sandbox = createLocalSandbox(cwd);
console.error(`Sandbox: ${sandbox.type}`);

const tools = {
  read: createReadTool(sandbox),
  grep: createGrepTool(sandbox),
  bash: createBashTool(sandbox, createApproval({ mode: "interactive" })),
};
```

The factories now take the sandbox. They close over it and call its methods from inside `execute`. Same tools, same agent, same prompt.

## Try It

Run the prompts you've been using. The output should be unchanged:

```bash title="Terminal"
bun run index.ts . "Read the tsconfig.json"
bun run index.ts . "Find all TODO comments"
bun run index.ts . "List all files in this directory"
```

The agent should behave exactly the same way. The plumbing under the hood is different. Confirm the sandbox identity once:

```ts title="index.ts (temporary)"
console.error(`Sandbox: ${sandbox.type}`);
```

You should see `Sandbox: local`.

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Note: If behavior changed, the refactor leaked\*\*

After this lesson, agent behavior on the same prompts should match Module 3 exactly. If something changed (different routing, different output, a new error), look for a place where a tool is still reaching for a Node API directly instead of going through `sandbox`.

## Commit

```bash
git add src/sandbox-local.ts index.ts
git commit -m "feat(sandbox): add local backend wrapping Node APIs"
```

## Done-When

- [ ] `src/sandbox-local.ts` exports `createLocalSandbox(dir)`
- [ ] The returned object satisfies the `Sandbox` interface
- [ ] `readFile` and `exec` route through Node APIs as before
- [ ] `stop` is a no-op that doesn't crash
- [ ] All three tools still work, same as Module 3
- [ ] `npx tsc --noEmit` passes

\*\*Note: Make exec stream instead of buffer\*\*

`execSync` waits for the command to finish, then dumps all stdout at once. For a long build, that's painful. Try swapping to `spawn` and streaming each chunk back. The challenge: the `Sandbox.exec` signature returns one final `{ stdout, exitCode }`. To stream, you'd need a different shape, maybe an async iterator. Notice how that ripples back into every tool that calls `exec`. Interface decisions are sticky.

## Solution

```ts title="src/sandbox-local.ts"
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import type { Sandbox } from "./sandbox";

export function createLocalSandbox(dir: string): Sandbox {
  return {
    type: "local",
    workingDirectory: dir,
    readFile: async (p) => readFileSync(resolve(dir, p), "utf-8"),
    exec: async (command) => {
      try {
        const stdout = execSync(command, {
          cwd: dir,
          encoding: "utf-8",
          timeout: 30_000,
        });
        return { stdout, exitCode: 0 };
      } catch (e: any) {
        return {
          stdout: e.stdout || e.stderr || e.message || "",
          exitCode: e.status ?? 1,
        };
      }
    },
    stop: async () => {},
  };
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
