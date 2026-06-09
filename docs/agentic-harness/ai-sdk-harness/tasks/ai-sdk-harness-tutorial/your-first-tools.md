---
title: "Your First Tools"
description: "Add grep and learn why tool descriptions are the model selection API, not documentation."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/your-first-tools"
md_url: "https://vercel.com/academy/build-ai-agent-harness/your-first-tools.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:54.060Z"
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

# Your First Tools

# Your First Tools

In the last lesson, you handed the agent `read` and turned a chatbot into something useful. Useful, but limited. Your agent can only open files it already knows the name of. Ask it to "find all TODO comments" and it starts guessing which files might have one, then reads them one by one.

That's not searching. That's flailing politely.

Add `grep` and the agent gets a real search tool. But now you have a new problem. The model has to choose between `read` and `grep` every time it picks up a task. And until you tell it how, it picks wrong.

## Outcome

You have a `grep` tool with a rich, behavior-shaping description. The model uses `grep` for searches and `read` for file inspection, with the routing decided entirely by the descriptions.

## Fast Track

1. Add a `grep` tool with regex pattern, optional glob filter, and a 50-match cap
2. Write a description using WHEN TO USE, WHEN NOT TO USE, DO NOT USE FOR, and EXAMPLES
3. Update `read`'s description to match the same contract

## Hands-on Exercise 1.2

Build the `grep` tool, then rewrite both descriptions until the model routes correctly.

**Requirements:**

1. Add a `grep` tool with a Zod schema for `pattern`, optional `path`, and optional `glob`
2. Implement `execute` using `execSync` with `grep -rn`, excluding `node_modules` and `.git`
3. Cap output at 50 matches and report the total count
4. Write descriptions for both `read` and `grep` using the four-section contract: WHEN TO USE, WHEN NOT TO USE, DO NOT USE FOR, EXAMPLES

**Implementation hints:**

- Import `execSync` from `node:child_process`
- Quote inputs into the shell command to avoid breaking on special characters
- Treat `grep`'s non-zero exit (no matches found) as success, not error
- The description is the model's API for choosing tools. Write it for the model, not for the reader

### Watch the wrong tool win

Start with a minimal description and see how badly it goes:

```ts title="index.ts"
const grep = tool({
  description: "Search files.",
  inputSchema: z.object({
    pattern: z.string(),
    glob: z.string().optional(),
  }),
  // ... execute with execSync grep
});
```

Now ask the agent:

```bash title="Terminal"
bun run index.ts . "Find all TODO comments in this project"
```

The model ignores `grep` and reaches for `read`, opening random files and hoping one has a TODO. If you've already added `bash`, it'll try that instead. A two-word description doesn't give the model anything to work with, so it guesses.

This is the first time tool selection matters. It's also the first time it breaks.

### Descriptions are prompts

The fix isn't a better implementation. It's a better description:

```ts title="index.ts"
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
```

Two things are happening in that description. WHEN TO USE makes the tool's job legible. WHEN NOT TO USE and DO NOT USE FOR steer the model away from defaulting to whatever tool it likes best, which (in our experience) is usually `bash`.

\*\*Note: Bash gravity\*\*

Every model we've tested (Haiku, Sonnet, Opus) defaults to `bash` when tool descriptions are weak. Production harnesses double up the negative steering, with both WHEN NOT TO USE and DO NOT USE FOR on every tool, because saying it once isn't enough. The pattern in this lesson comes from a real harness after watching the agent consistently pick wrong.

Now do the same treatment on `read`. The description on `read` has to push back against `grep` just as hard:

```ts title="index.ts"
const read = tool({
  description: `Read a file from the project. Returns numbered lines.
WHEN TO USE: viewing file contents, checking configs, reading source code.
WHEN NOT TO USE: searching across files (use grep instead).
DO NOT USE FOR: running commands, listing directories.`,
  // ... rest unchanged
});
```

### Why a 50-match cap

`grep` gets the same context-conscious treatment as `read`. Without a cap, a search for `import` in a large codebase floods the context with hundreds of lines of imports the agent doesn't need. 50 matches is enough to answer the question. 500 is pollution.

## Try It

Run the search prompt with the rewritten descriptions:

```bash title="Terminal"
bun run index.ts . "Find all TODO comments in this project"
```

You should see the model call `grep` directly, with a pattern like `TODO` and a glob like `*.ts`. Seed a couple of `// TODO:` comments in a small file so the result is obvious. Excluding `node_modules` keeps the output focused on your code, not the dependencies.

Now run the file-inspection prompt:

```bash title="Terminal"
bun run index.ts . "Read the tsconfig.json"
```

This still uses `read`, not `grep`. The descriptions steer the model in both directions. Search prompts pull toward `grep`. Known-file prompts pull toward `read`.

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Note: Make verification boring on purpose\*\*

A real codebase has too many matches to eyeball. Drop two `// TODO:` comments in a small file you control, then run the search. The point is to verify routing, not to discover bugs. Make the test obvious.

## Commit

```bash
git add index.ts
git commit -m "feat(tools): add grep with behavioral description contract"
```

## Done-When

- [ ] `"Find all TODO comments"` calls `grep`, not `read` or `bash`
- [ ] `"Read the tsconfig.json"` calls `read`, not `grep`
- [ ] `grep` caps at 50 matches and reports the total when truncated
- [ ] Both `read` and `grep` use WHEN TO USE, WHEN NOT TO USE, and DO NOT USE FOR
- [ ] `npx tsc --noEmit` passes

\*\*Note: Push the descriptions until they break\*\*

Start weakening `grep`'s description one section at a time. Drop EXAMPLES first. Then DO NOT USE FOR. Then WHEN NOT TO USE. At what point does the model switch back to `bash` or `read`? Does the threshold change between Haiku, Sonnet, and Opus?

## Solution

```ts title="index.ts"
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const cwd = resolve(process.argv[2] || process.cwd());

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

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: `You are a coding agent.\nWorking directory: ${cwd}`,
  tools: { read, grep },
  stopWhen: stepCountIs(10),
});

const prompt = process.argv.slice(3).join(" ") || "Hello!";
const { text, steps } = await agent.generate({ prompt });
console.log(text);
console.log(`\n(${steps.length} steps)`);
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
