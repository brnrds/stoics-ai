---
title: "Completing the Toolbox"
description: "Add bash with safety gates, because an agent that can rm -rf needs a leash."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/completing-the-toolbox"
md_url: "https://vercel.com/academy/build-ai-agent-harness/completing-the-toolbox.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:54.667Z"
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

# Completing the Toolbox

# Completing the Toolbox

Your agent reads files. It searches code. The next thing it'll want to do is run a command. Maybe `npm test`. Maybe `git status`. Maybe, on a bad day, `rm -rf /`.

Bash is the most useful tool you can give the agent, and the most dangerous. In this lesson, we'll add it, then put a leash on it.

## Outcome

You have a `bash` tool that runs commands in the working directory, gated by an allowlist. Safe commands run automatically. Anything else returns a block message that the model passes back to the user, honestly.

## Fast Track

1. Add a `bash` tool with a `SAFE_PREFIXES` allowlist (`ls`, `cat`, `git status`, and friends)
2. Block anything not on the allowlist with a clear error string
3. Verify the model reports blocks instead of confabulating success

## Hands-on Exercise 1.3

Add `bash` to the agent and gate it at the `execute` layer.

**Requirements:**

1. Import `execSync` from `node:child_process`
2. Define a `SAFE_PREFIXES` array with read-only commands like `ls`, `cat`, `pwd`, `git status`, `git log`, `git diff`
3. Write an `isSafe(command)` check that compares against the allowlist
4. In `execute`, return a block message if the command isn't safe, otherwise run it
5. Write the tool description with the four-section contract

**Implementation hints:**

- Match by prefix, not exact command. `ls -la` should match `ls`
- Set a `timeout` on `execSync` so a hung process doesn't freeze the agent
- The block message should tell the model exactly what was blocked. The model will pass that on to the user
- The AI SDK has a `needsApproval` option. We're not using it here. See below for why

### Why not `needsApproval`?

The AI SDK gives you a `needsApproval` field on `tool()` that looks like it does exactly what we want. It does not.

```ts
const bash = tool({
  needsApproval: () => true,
  execute: async ({ command }) => {
    // This never runs, but the model thinks it did
  },
});
```

When `needsApproval` returns `true`, the SDK creates a `tool-approval-request` in the response and skips execution. If you don't have an approval handler wired up, the tool call disappears. The model gets no result back, so it makes one up: *"Done! I deleted the files."*

The model thinks the command ran. The user sees a success message. The command didn't run. This is worse than running the command, because the user has no idea anything went wrong.

\*\*Warning: needsApproval is a signal, not a gate\*\*

`needsApproval` tells the harness "this needs human approval." It's the harness's job to actually do something about it. Without the surrounding flow, blocked tools vanish silently and the model fills in the gap with fiction.

We'll build proper approval flows in [Module 8](../08-human-in-the-loop/01-structured-questions). For now, we gate inside `execute` so the model always gets a real string back.

### The execute-level gate

Add the tool with an allowlist:

```ts title="index.ts"
import { execSync } from "node:child_process";

const SAFE_PREFIXES = [
  "ls", "cat", "echo", "pwd", "which", "find",
  "head", "tail", "wc", "git log", "git status", "git diff",
];

function isSafe(command: string): boolean {
  return SAFE_PREFIXES.some((p) => command.trim().startsWith(p));
}

const bash = tool({
  description: `Execute a shell command in the working directory.
WHEN TO USE: running build commands, installing packages, running tests,
  git operations, directory listings.
WHEN NOT TO USE: reading file contents (use read instead).
  Searching for patterns (use grep instead).
DO NOT USE FOR: reading files (use read), searching code (use grep).`,
  inputSchema: z.object({
    command: z.string().describe("Shell command to execute"),
  }),
  execute: async ({ command }) => {
    if (!isSafe(command)) {
      return `Blocked: "${command}" requires approval. Only safe commands (${SAFE_PREFIXES.join(", ")}) run automatically.`;
    }
    try {
      const stdout = execSync(command, {
        cwd,
        encoding: "utf-8",
        timeout: 30_000,
      });
      return stdout || "(no output)";
    } catch (e: any) {
      return `Exit ${e.status ?? 1}: ${e.stdout || e.stderr || e.message || ""}`;
    }
  },
});
```

The pattern that matters: when a command is blocked, the tool returns a string. That string ends up in the conversation as a tool result. The model reads it like any other result and can pass the block back to the user truthfully.

## Try It

Run a prompt that maps to a safe command:

```bash title="Terminal"
bun run index.ts . "List all files in this directory"
```

The model should reach for `bash`, pick a safe command like `ls` or `find`, and return the output.

Now try something dangerous:

```bash title="Terminal"
bun run index.ts . "Run the command: rm -rf node_modules"
```

The model calls `bash` with `rm -rf`. The gate blocks it. The block message comes back as the tool result, and the model passes it to you:

```
The command "rm -rf node_modules" requires approval.
Only safe commands run automatically.
```

That's the whole point. No silent failure. No confabulated success.

\*\*Warning: Watch for creative rewrites\*\*

If you say "delete `node_modules`," the model might try `find . -name node_modules -exec rm -rf {} +` instead of `rm -rf`. Our prefix check catches `rm` but `find -exec` slips through. Production harnesses use regex patterns for dangerous commands. We're keeping the prefix check because it's clear, not because it's complete.

```bash title="Terminal"
npx tsc --noEmit
```

## Three Tools, One Agent

You now have all three tools:

| Tool   | Purpose             | Safety                    |
| ------ | ------------------- | ------------------------- |
| `read` | View file contents  | 500-line cap              |
| `grep` | Search across files | 50-match cap              |
| `bash` | Run shell commands  | `SAFE_PREFIXES` allowlist |

The descriptions steer selection. The caps protect context. The gate protects your machine. The agent is useful and controlled.

## Commit

```bash
git add index.ts
git commit -m "feat(tools): add bash with execute-level safety gate"
```

## Done-When

- [ ] Safe commands like `ls`, `find`, and `git status` run through `bash`
- [ ] Natural-language file-reading prompts still route to `read`, not `bash` with `cat`
- [ ] `rm -rf`, `sudo`, and other unknown commands return a block message
- [ ] The model reports blocked commands to the user instead of pretending they succeeded
- [ ] `npx tsc --noEmit` passes

\*\*Note: Sketch an approval flow\*\*

The execute-level gate is honest but blunt. Real harnesses ask the user. Try adding a `needsApproval` check that returns `true` for non-safe commands, pause the loop, and show the user a prompt like *"The agent wants to run `npm install express`. Allow?"* Approve resumes with the tool result. Deny resumes with a denial message so the model can adapt. You'll build this properly in Module 8, but it's worth sketching now to see why interactive approval gets complicated once the agent runs 50 commands.

## Solution

```ts title="index.ts"
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const cwd = resolve(process.argv[2] || process.cwd());

const SAFE_PREFIXES = [
  "ls", "cat", "echo", "pwd", "which", "find",
  "head", "tail", "wc", "git log", "git status", "git diff",
];

function isSafe(command: string): boolean {
  return SAFE_PREFIXES.some((p) => command.trim().startsWith(p));
}

const read = tool({
  description: `Read a file from the project. Returns numbered lines.
WHEN TO USE: viewing file contents, checking configs, reading source code.
WHEN NOT TO USE: searching across files (use grep instead).
DO NOT USE FOR: running commands, listing directories.`,
  inputSchema: z.object({
    path: z.string().describe("File path relative to working directory"),
    offset: z.number().optional().describe("Start line (1-indexed)"),
    limit: z.number().optional().describe("Max lines to return"),
  }),
  execute: async ({ path: filePath, offset, limit }) => {
    const abs = resolve(cwd, filePath);
    const content = readFileSync(abs, "utf-8");
    let lines = content.split("\n");

    if (offset) lines = lines.slice(offset - 1);
    if (limit) lines = lines.slice(0, limit);

    const MAX_LINES = 500;
    const truncated = lines.length > MAX_LINES;
    if (truncated) lines = lines.slice(0, MAX_LINES);

    const numbered = lines.map((l, i) => `${(offset || 1) + i}: ${l}`);
    return truncated
      ? numbered.join("\n") + `\n... (truncated at ${MAX_LINES} lines)`
      : numbered.join("\n");
  },
});

const grep = tool({
  description: `Search file contents using regex. Returns matching lines with file paths.
WHEN TO USE: finding patterns across multiple files, locating function definitions,
  searching for imports, finding TODOs or error messages.
WHEN NOT TO USE: reading a known file (use read instead).
DO NOT USE FOR: running commands, listing directories.
EXAMPLES:
  - Find all TODO comments: pattern "TODO" glob "*.ts"
  - Find function definitions: pattern "function \\\\w+" glob "*.ts"`,
  inputSchema: z.object({
    pattern: z.string().describe("Regex pattern to search for"),
    path: z.string().optional().describe("Directory to search (default: working dir)"),
    glob: z.string().optional().describe("File glob filter, e.g. '*.ts'"),
  }),
  execute: async ({ pattern, path: searchPath, glob: globFilter }) => {
    const dir = resolve(cwd, searchPath || ".");
    const escapedPattern = pattern.replace(/'/g, `'\\''`);
    const escapedGlob = (globFilter || "*").replace(/'/g, `'\\''`);
    const cmd = `grep -rn --exclude-dir=node_modules --exclude-dir=.git --include='${escapedGlob}' -E '${escapedPattern}' '${dir}' 2>/dev/null`;

    try {
      const stdout = execSync(cmd, { encoding: "utf-8", timeout: 10_000 });
      const lines = stdout.trim().split("\\n").filter(Boolean);

      const MAX_MATCHES = 50;
      const truncated = lines.length > MAX_MATCHES;
      const result = truncated ? lines.slice(0, MAX_MATCHES) : lines;

      return truncated
        ? result.join("\\n") + `\\n... (${lines.length} total, showing first ${MAX_MATCHES})`
        : result.join("\\n") || "No matches found.";
    } catch (error: any) {
      const stdout = String(error?.stdout || "").trim();
      if (stdout) {
        const lines = stdout.split("\\n").filter(Boolean);
        const MAX_MATCHES = 50;
        const truncated = lines.length > MAX_MATCHES;
        const result = truncated ? lines.slice(0, MAX_MATCHES) : lines;
        return truncated
          ? result.join("\\n") + `\\n... (${lines.length} total, showing first ${MAX_MATCHES})`
          : result.join("\\n");
      }
      return "No matches found.";
    }
  },
});

const bash = tool({
  description: `Execute a shell command in the working directory.
WHEN TO USE: running build commands, installing packages, running tests,
  git operations, directory listings.
WHEN NOT TO USE: reading file contents (use read instead).
  Searching for patterns (use grep instead).
DO NOT USE FOR: reading files (use read), searching code (use grep).`,
  inputSchema: z.object({
    command: z.string().describe("Shell command to execute"),
  }),
  execute: async ({ command }) => {
    if (!isSafe(command)) {
      return `Blocked: "${command}" requires approval. Only safe commands (${SAFE_PREFIXES.join(", ")}) run automatically.`;
    }
    try {
      const stdout = execSync(command, {
        cwd,
        encoding: "utf-8",
        timeout: 30_000,
      });
      return stdout || "(no output)";
    } catch (e: any) {
      return `Exit ${e.status ?? 1}: ${e.stdout || e.stderr || e.message || ""}`;
    }
  },
});

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: `You are a coding agent.\nWorking directory: ${cwd}`,
  tools: { read, grep, bash },
  stopWhen: stepCountIs(10),
});

const prompt = process.argv.slice(3).join(" ") || "Hello!";
const { text, steps } = await agent.generate({ prompt });
console.log(text);
console.log(`\n(${steps.length} steps)`);
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
