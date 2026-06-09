---
title: "Approval Gates"
description: "Evolve approval from a boolean to a function to a configurable discriminated union."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/approval-gates"
md_url: "https://vercel.com/academy/build-ai-agent-harness/approval-gates.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:56.024Z"
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

# Approval Gates

# Approval Gates

The allowlist you built in Module 1 has exactly one mode: block anything that isn't on the list. That's fine for a demo. It is not fine for a real harness.

CI doesn't have a human to ask. Subagents need to inherit a slice of their parent's trust, not the full allowlist. And the person running the agent locally probably wants to approve `npm install express` once and not be asked again three steps later.

Same gate. Three different operational modes. We'll get there by evolving the shape of the config itself, from a boolean, to a function, to a discriminated union.

## Outcome

`createBashTool` accepts an `ApprovalConfig` discriminated union with three modes: `interactive`, `background`, and `delegated`. Each mode shapes when `needsApproval` returns true.

## Fast Track

1. Define `ApprovalConfig` as a discriminated union with three modes
2. Write `createApproval(config)` that returns a `needsApproval` function
3. Pass the result into `createBashTool` and verify each mode behaves differently

## Hands-on Exercise 2.3

Replace the static safe-prefix check with a configurable approval system.

**Requirements:**

1. Define `ApprovalConfig` with three variants: `{ mode: "interactive" }`, `{ mode: "background" }`, `{ mode: "delegated"; trust: string[] }`
2. Write `createApproval(config: ApprovalConfig)` that returns `(input) => boolean`
3. Update `createBashTool` to accept the approval function as a parameter
4. Test each mode with the same command and verify the gate behavior changes

**Implementation hints:**

- `background` returns `false` (approved) for everything. This is for CI and automated runs
- `delegated` checks the input against `config.trust` and approves only matches
- `interactive` checks the input against the safe-prefix list and approves the safe ones. Anything else needs human approval
- The function returns `true` when approval is needed, `false` when the command can run

### Stage 1: Boolean

The simplest possible approval gate is a boolean:

```ts title="index.ts"
needsApproval: true
```

This blocks every call. `ls`, `pwd`, `rm -rf`, all of it. It's useless, but it sets the shape. `needsApproval` is the question "should we pause for human approval before this runs?"

### Stage 2: Function

A function lets you answer that question based on the input:

```ts title="index.ts"
needsApproval: ({ command }) => {
  if (SAFE_PREFIXES.some(p => command.startsWith(p))) return false;
  return true;
}
```

Better. `ls` runs. `rm -rf` blocks. But the function only knows about one rule, baked in. CI gets the same gate as a local terminal. A subagent gets the same gate as its parent. You can't reconfigure without rewriting the function.

### Stage 3: Discriminated union

The config carries the mode. The factory builds the function from the mode:

```ts title="index.ts"
type ApprovalConfig =
  | { mode: "interactive" }
  | { mode: "background" }
  | { mode: "delegated"; trust: string[] };

function createApproval(config: ApprovalConfig) {
  return ({ command }: { command: string }) => {
    if (config.mode === "background") return false;

    if (config.mode === "delegated") {
      return !config.trust.some((p) => command.trim().startsWith(p));
    }

    return !SAFE_PREFIXES.some((p) => command.trim().startsWith(p));
  };
}
```

Three modes, one function. The discriminated union makes the modes typed and exclusive. TypeScript narrows `config.trust` to `string[]` only inside the `delegated` branch, which is the kind of error the boolean and the function couldn't catch.

Now `createBashTool` takes an approval function instead of a safe-prefix list:

```ts title="index.ts"
function createBashTool(
  operations: BashOperations,
  needsApproval: (input: { command: string }) => boolean,
) {
  return tool({
    // ... same description and schema
    execute: async ({ command }) => {
      if (needsApproval({ command })) {
        return `Blocked: "${command}" requires approval.`;
      }
      const { stdout } = await operations.exec(command);
      return stdout || "(no output)";
    },
  });
}
```

And the three modes look like this at the call site:

```ts title="index.ts"
// Interactive: human approves anything not on the safe list
const bash = createBashTool(localOps, createApproval({ mode: "interactive" }));

// Background: auto-approve everything (CI, automation)
const bash = createBashTool(localOps, createApproval({ mode: "background" }));

// Delegated: subagent inherits a trust slice from its parent
const bash = createBashTool(
  localOps,
  createApproval({ mode: "delegated", trust: ["pwd", "find .", "git status"] }),
);
```

\*\*Note: Why a discriminated union and not three functions\*\*

You could just write three separate functions: `interactiveApproval`, `backgroundApproval`, `delegatedApproval`. The discriminated union wins because the config is data, not code. You can load it from `AGENTS.md`, validate it with Zod (`z.discriminatedUnion("mode", [...])`), serialize it across a subagent boundary, and let users change modes without touching the harness code.

### What this unlocks

`background` is the obvious one. The agent runs in CI, there's no human to ask, you trust the prompt enough to let it go.

`delegated` is the interesting one. When a subagent fires up, you don't hand it the full safe-prefix list. You hand it the specific commands it needs for its job. A read-only explorer gets `pwd`, `find`, `git status`. An executor running tests gets `npm test`, `npm run build`. The parent agent decides what trust to delegate, command by command.

`interactive` is what you've already been doing, just expressed as a config now.

## Try It

Try each mode with a command that should block, and a command that should pass:

```bash title="Terminal"
bun run index.ts . "Run: git status"
```

In `interactive` mode, this passes (it's on the safe list). In `background` mode, anything passes. In `delegated` mode with `trust: ["git status"]`, it passes.

```bash title="Terminal"
bun run index.ts . "Run: npm install express"
```

In `interactive` mode, this blocks. In `background` mode, it runs (and probably fails because we don't have npm wired up, but that's a different problem). In `delegated` mode, it blocks unless `npm install` is in the trust list.

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Note: Approval outcome vs. command outcome\*\*

A command can be approved and still fail for ordinary reasons. `npm test` passes the gate, then exits non-zero because tests fail. That's the command's problem, not approval's. Keep them separate when you're debugging.

## Commit

```bash
git add index.ts
git commit -m "feat(approval): add discriminated union config with three modes"
```

## Done-When

- [ ] `ApprovalConfig` is a discriminated union with `interactive`, `background`, `delegated`
- [ ] `createApproval(config)` returns a `needsApproval` function
- [ ] `createBashTool` accepts the approval function as a parameter
- [ ] Each mode behaves correctly for at least one safe and one unsafe command
- [ ] `npx tsc --noEmit` passes

\*\*Note: Session-level trust escalation\*\*

The interactive mode auto-rejects every unknown command, every time. That gets old fast. Try adding a `Set<string>` that tracks patterns the user approves during the session. When the user approves `npm test`, add the pattern. The next `npm test` call skips the prompt. Add a `trust --list` command to show what's trusted. Now think about granularity: should `npm install` trust everything, or only `npm install express` exactly?

## Solution

```ts title="index.ts"
type ApprovalConfig =
  | { mode: "interactive" }
  | { mode: "background" }
  | { mode: "delegated"; trust: string[] };

function createApproval(config: ApprovalConfig) {
  return ({ command }: { command: string }) => {
    if (config.mode === "background") return false;

    if (config.mode === "delegated") {
      return !config.trust.some((p) => command.trim().startsWith(p));
    }

    return !SAFE_PREFIXES.some((p) => command.trim().startsWith(p));
  };
}

function createBashTool(
  operations: BashOperations,
  needsApproval: (input: { command: string }) => boolean,
) {
  return tool({
    description: `Execute a shell command in the working directory.

WHEN TO USE: running build commands, installing packages, running tests,
  git operations, directory listings.

WHEN NOT TO USE: reading file contents (use read instead).
  Searching for patterns (use grep instead).

DO NOT USE FOR: reading files (use read), searching code (use grep).

USAGE: command is a single shell string. Commands not approved by the
  approval policy are blocked and return a clear error message.`,
    inputSchema: z.object({
      command: z.string().describe("Shell command to execute"),
    }),
    execute: async ({ command }) => {
      if (needsApproval({ command })) {
        return `Blocked: "${command}" requires approval.`;
      }
      const { stdout } = await operations.exec(command);
      return stdout || "(no output)";
    },
  });
}

const bash = createBashTool(localOps, createApproval({ mode: "interactive" }));
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
