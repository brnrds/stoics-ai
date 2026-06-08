---
title: "In-Memory Implementation"
description: "Add a just-bash backend so the same Sandbox interface can run against an in-memory copy-on-write filesystem."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/in-memory-implementation"
md_url: "https://vercel.com/academy/build-ai-agent-harness/in-memory-implementation.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:59.176Z"
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

# In-Memory Implementation

# In-Memory Implementation

The local sandbox runs real commands on real files. That's great until you want to let the agent explore code without trusting it to not break anything.

`just-bash` is the answer. It's a virtual filesystem with copy-on-write semantics: the agent reads from real disk, but anything it writes lives in memory and disappears when the sandbox stops. Fast, cheap, safe. Ideal for exploration, testing, and any time you'd rather not let an agent loose on your actual files.

## Outcome

`createJustBashSandbox(dir)` returns a `Sandbox` backed by `just-bash`. The harness can switch between local and in-memory backends with an environment variable, and the agent runs the same prompts against either.

## Fast Track

1. Install `just-bash` with `bun add just-bash`
2. Implement `createJustBashSandbox(dir)` in `src/sandbox-just-bash.ts`
3. Map `readFile` and `exec` to the `just-bash` API, paying attention to the virtual mount point
4. Pick the backend at startup based on `process.env.SANDBOX`

## Hands-on Exercise 4.3

Add the `just-bash` backend and wire the env-var switch.

**Requirements:**

1. `createJustBashSandbox(dir: string): Promise<Sandbox>` (note the `Promise`, because creation is async)
2. Use `JustBashSandbox.create({ overlayRoot: dir })` to spin up the virtual FS
3. Inside `readFile` and `exec`, translate paths through the virtual mount point `/home/user/project`
4. In `index.ts`, choose `local` or `just-bash` based on `process.env.SANDBOX`

**Implementation hints:**

- `JustBashSandbox.create` returns a promise. Your factory has to be async too
- The mount point is the trap. `overlayRoot: "/Users/you/project"` does not mount at `/`, it mounts at `/home/user/project`. Every path inside the sandbox has to be prefixed with that constant
- `runCommand` returns a command handle, not a result. Call `wait()` for the exit code, `output()` for the combined stdout/stderr

### The just-bash API

A quick tour of the parts you'll wrap:

```ts
import { Sandbox as JustBashSandbox } from "just-bash";

const jb = await JustBashSandbox.create({ overlayRoot: "/path/to/project" });

const content = await jb.readFile("/home/user/project/package.json");

const cmd = await jb.runCommand("ls", { cwd: "/home/user/project" });
const finished = await cmd.wait();
console.log(await cmd.output());
console.log(finished.exitCode);
```

\*\*Warning: The mount point trap\*\*

When you pass `overlayRoot: "/path/to/project"`, `just-bash` mounts that directory at `/home/user/project` inside the virtual filesystem. Not at `/`. Not at the original path. Every `readFile` and `runCommand` call has to use the virtual mount point. This will trip you up. It trips everyone up.

### The implementation

```ts title="src/sandbox-just-bash.ts"
import { Sandbox as JustBashSandbox } from "just-bash";
import type { Sandbox } from "./sandbox";

const MOUNT = "/home/user/project";

export async function createJustBashSandbox(dir: string): Promise<Sandbox> {
  const jb = await JustBashSandbox.create({ overlayRoot: dir });

  return {
    type: "just-bash",
    workingDirectory: dir,
    readFile: async (p) => {
      const virtualPath = `${MOUNT}/${p}`;
      return jb.readFile(virtualPath);
    },
    exec: async (command) => {
      const cmd = await jb.runCommand(command, { cwd: MOUNT });
      const finished = await cmd.wait();
      return {
        stdout: await cmd.output(),
        exitCode: finished.exitCode,
      };
    },
    stop: async () => {},
  };
}
```

The `MOUNT` constant is the only thing the just-bash backend cares about that the local one didn't. Every path in, every path out, gets translated through it.

### Wire the env-var switch

```ts title="index.ts"
import { createLocalSandbox } from "./src/sandbox-local";
import { createJustBashSandbox } from "./src/sandbox-just-bash";

const sandboxType = process.env.SANDBOX || "local";
const sandbox =
  sandboxType === "just-bash"
    ? await createJustBashSandbox(cwd)
    : createLocalSandbox(cwd);

console.error(`Sandbox: ${sandbox.type}`);
```

The factory for `local` is synchronous, the factory for `just-bash` is async. The conditional handles that for us. Everything downstream (tools, agent, prompt builder) is the same.

### Copy-on-write, in one sentence

Reads come from the real disk. Writes go to memory. The real filesystem is never modified. When the sandbox stops, the virtual filesystem is garbage collected. The agent can read your `package.json`, then create and delete `test.txt` a hundred times, and your project on disk is untouched.

## Try It

Same prompt, two backends:

```bash title="Terminal"
bun run index.ts . "Read the package.json"
```

```bash title="Terminal"
SANDBOX=just-bash bun run index.ts . "Read the package.json"
```

You should get the same answer both times, with `Sandbox: local` and `Sandbox: just-bash` printed in the respective runs. That's the interface working.

Try a write-shaped task on the in-memory backend:

```bash title="Terminal"
SANDBOX=just-bash bun run index.ts . "Create a file called scratch.txt with the text 'hello'"
```

The agent writes the file. Now check the real disk: `scratch.txt` isn't there. The write happened in the overlay, in memory.

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Note: Not every tool is portable on the first try\*\*

Some tools will work identically across both backends. Some will quietly fail because they assumed something about the host. `grep` is a common offender, since the shell behavior under `just-bash` is simulated and not always byte-identical to your system's `grep`. The portability test is real, not theoretical. Plan to fix one or two tools after this swap.

## Commit

```bash
git add src/sandbox-just-bash.ts index.ts package.json
git commit -m "feat(sandbox): add just-bash backend with in-memory FS"
```

## Done-When

- [ ] `just-bash` is installed
- [ ] `src/sandbox-just-bash.ts` exports `createJustBashSandbox(dir)` that returns a `Promise<Sandbox>`
- [ ] Paths route through the `MOUNT` constant
- [ ] `SANDBOX=just-bash bun run ...` runs the agent against the in-memory backend
- [ ] A write task on `just-bash` doesn't touch the real filesystem
- [ ] `npx tsc --noEmit` passes

\*\*Note: Find the leaky tool\*\*

Pick a prompt that works against the `local` backend but fails or behaves differently under `just-bash`. Track down which tool is making the host-specific assumption. Then decide: do you fix the tool, or do you let the interface absorb the difference (for example, by having `just-bash` provide a shim for that command)? Either is a real design choice. Notice which one keeps the tool simpler.

## Solution

```ts title="src/sandbox-just-bash.ts"
import { Sandbox as JustBashSandbox } from "just-bash";
import type { Sandbox } from "./sandbox";

const MOUNT = "/home/user/project";

export async function createJustBashSandbox(dir: string): Promise<Sandbox> {
  const jb = await JustBashSandbox.create({ overlayRoot: dir });

  return {
    type: "just-bash",
    workingDirectory: dir,
    readFile: async (p) => {
      const virtualPath = `${MOUNT}/${p}`;
      return jb.readFile(virtualPath);
    },
    exec: async (command) => {
      const cmd = await jb.runCommand(command, { cwd: MOUNT });
      const finished = await cmd.wait();
      return {
        stdout: await cmd.output(),
        exitCode: finished.exitCode,
      };
    },
    stop: async () => {},
  };
}
```

```ts title="index.ts"
const sandboxType = process.env.SANDBOX || "local";
const sandbox =
  sandboxType === "just-bash"
    ? await createJustBashSandbox(cwd)
    : createLocalSandbox(cwd);
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
