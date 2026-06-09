---
title: "Shell Execution with Safety"
description: "Extract the tool factory pattern, separating what the model sees from how commands execute."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/shell-execution-with-safety"
md_url: "https://vercel.com/academy/build-ai-agent-harness/shell-execution-with-safety.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:55.495Z"
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

# Shell Execution with Safety

# Shell Execution with Safety

Your bash tool works, but the description, the safety check, and the call to `execSync` are sitting on top of each other in one big closure. That's fine when there's one bash tool. It stops being fine the moment you want to run commands somewhere other than this machine.

A few modules from now, we'll swap local execution for a sandbox. When that happens, you don't want to rewrite the bash tool. You want to hand it a different backend and let the rest stay still.

That's what the factory pattern is for.

## Outcome

You have a `createBashTool(operations, safePrefixes)` factory that returns a fully configured `bash` tool. The model-facing contract (description, schema, safety check) lives in the factory. The execution backend is injected through an `operations` object.

## Fast Track

1. Define a `BashOperations` interface with one method, `exec(command)`
2. Wrap the existing bash tool in `createBashTool(operations, safePrefixes)`
3. Construct a `localOps` object that wraps `execSync`, then build the tool with it

## Hands-on Exercise 2.2

Pull bash out into a factory function with a swappable execution backend.

**Requirements:**

1. Define `BashOperations` with `exec(command: string): Promise<{ stdout: string; exitCode: number }>`
2. Write `createBashTool(operations: BashOperations, safePrefixes: string[])` that returns a `tool()`
3. Keep the safety check inside the factory, using the injected `safePrefixes`
4. Build a `localOps` implementation that wraps `execSync`
5. Replace your existing `bash` constant with `const bash = createBashTool(localOps, SAFE_PREFIXES)`

**Implementation hints:**

- The factory closes over `operations` and `safePrefixes`. The `execute` function inside the tool calls `operations.exec(command)` instead of `execSync` directly
- Localops handles both stdout and errors uniformly. Return `{ stdout, exitCode }` whether the command succeeded or not
- Don't refactor `read` yet. The factory pattern earns its keep where the backend will actually vary, which for now is just `bash`

### Where the seam goes

Right now your bash tool calls `execSync` directly:

```ts title="index.ts"
execute: async ({ command }) => {
  if (!isSafe(command)) return "Blocked...";
  const stdout = execSync(command, { cwd, encoding: "utf-8", timeout: 30_000 });
  return stdout;
}
```

When you add a sandbox later, this becomes `sandbox.exec(command)`. Same idea, different backend. The factory introduces a seam between the two:

```ts title="index.ts"
interface BashOperations {
  exec(command: string): Promise<{ stdout: string; exitCode: number }>;
}
```

Everything the model sees lives above the seam. Everything that actually runs commands lives below.

### Build the factory

```ts title="index.ts"
function createBashTool(operations: BashOperations, safePrefixes: string[]) {
  function isSafe(command: string): boolean {
    return safePrefixes.some((p) => command.trim().startsWith(p));
  }

  return tool({
    description: `Execute a shell command in the working directory.

WHEN TO USE: running build commands, installing packages, running tests,
  git operations, directory listings.

WHEN NOT TO USE: reading file contents (use read instead).
  Searching for patterns (use grep instead).

DO NOT USE FOR: reading files (use read), searching code (use grep).

USAGE: command is a single shell string. Commands not in the safe-prefix
  allowlist are blocked and return a clear error message.`,
    inputSchema: z.object({
      command: z.string().describe("Shell command to execute"),
    }),
    execute: async ({ command }) => {
      if (!isSafe(command)) {
        return `Blocked: "${command}" requires approval.`;
      }
      const { stdout } = await operations.exec(command);
      return stdout || "(no output)";
    },
  });
}
```

Notice what's gone: no `execSync`, no `cwd` reference, no error handling that knows about Node's `child_process`. The factory only knows there's something called `operations.exec` and it returns stdout.

### Build the local backend

The `localOps` object is where the actual `execSync` call lives now:

```ts title="index.ts"
const localOps: BashOperations = {
  exec: async (command) => {
    try {
      const stdout = execSync(command, {
        cwd,
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
};

const bash = createBashTool(localOps, SAFE_PREFIXES);
```

When you build the sandbox abstraction in Module 4, the swap is one line:

```ts title="index.ts (preview, Module 4)"
const sandboxOps: BashOperations = {
  exec: (command) => sandbox.exec(command),
};

const bash = createBashTool(sandboxOps, SAFE_PREFIXES);
```

Same tool. Different backend. The description, the schema, and the safety check don't move.

\*\*Note: Why only bash, not read\*\*

You could apply the same factory pattern to `read`. We're not doing it yet. The factory earns its keep when the backend genuinely varies. For `read`, that won't happen until Module 4. For `bash`, execution backends and safety policy are already pulling in opposite directions. Refactor when there's pressure, not before.

## Try It

Run a safe command to make sure the factory wired everything correctly:

```bash title="Terminal"
bun run index.ts . "List all files in this directory"
```

Same output as before. Same blocked-command behavior. The model can't tell anything changed, which is the whole point.

Try a blocked command to make sure the safety check still works:

```bash title="Terminal"
bun run index.ts . "Run: rm -rf node_modules"
```

You should still get the block message back.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add index.ts
git commit -m "refactor(bash): extract createBashTool with operations interface"
```

## Done-When

- [ ] `BashOperations` interface defined with `exec(command)`
- [ ] `createBashTool(operations, safePrefixes)` returns a working tool
- [ ] `localOps` wraps `execSync` and returns `{ stdout, exitCode }`
- [ ] Safe commands still run, blocked commands still return the block message
- [ ] `npx tsc --noEmit` passes

\*\*Note: Sketch the sandbox swap\*\*

Without building it yet, write a `mockOps: BashOperations` that doesn't actually run anything. Just return `{ stdout: "(pretend output)", exitCode: 0 }` for any command. Swap `localOps` for `mockOps` and watch the agent get plausible-but-fake output for everything. This is the seam that lets the sandbox abstraction in Module 4 work without rewriting your tools.

## Solution

```ts title="index.ts"
interface BashOperations {
  exec(command: string): Promise<{ stdout: string; exitCode: number }>;
}

function createBashTool(operations: BashOperations, safePrefixes: string[]) {
  function isSafe(command: string): boolean {
    return safePrefixes.some((p) => command.trim().startsWith(p));
  }

  return tool({
    description: `Execute a shell command in the working directory.

WHEN TO USE: running build commands, installing packages, running tests,
  git operations, directory listings.

WHEN NOT TO USE: reading file contents (use read instead).
  Searching for patterns (use grep instead).

DO NOT USE FOR: reading files (use read), searching code (use grep).

USAGE: command is a single shell string. Commands not in the safe-prefix
  allowlist are blocked and return a clear error message.`,
    inputSchema: z.object({
      command: z.string().describe("Shell command to execute"),
    }),
    execute: async ({ command }) => {
      if (!isSafe(command)) {
        return `Blocked: "${command}" requires approval.`;
      }
      const { stdout } = await operations.exec(command);
      return stdout || "(no output)";
    },
  });
}

const localOps: BashOperations = {
  exec: async (command) => {
    try {
      const stdout = execSync(command, {
        cwd,
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
};

const bash = createBashTool(localOps, SAFE_PREFIXES);
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
