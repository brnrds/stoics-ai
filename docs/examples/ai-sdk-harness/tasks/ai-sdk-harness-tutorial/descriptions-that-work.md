---
title: "Descriptions That Work"
description: "The evolution of tool descriptions from one-liners to structured contracts, and why every field matters."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/descriptions-that-work"
md_url: "https://vercel.com/academy/build-ai-agent-harness/descriptions-that-work.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:55.097Z"
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

# Descriptions That Work

# Descriptions That Work

When you wrote your first tool description in [The Agent Loop](../01-agent-loop/01-from-chat-to-agent), you used two sections: WHEN TO USE and WHEN NOT TO USE. That was enough to get routing working with three tools.

Add a fourth tool. Add a fifth. Add subagents and edit and write and todo. The model starts getting fuzzy again. It picks `bash` for things `read` should handle, or skips `grep` for an exploratory `read` loop that opens twenty files.

The fix is the same as before. We just need more of it.

## Outcome

Every tool in your harness has a 5-section description contract (WHEN TO USE, WHEN NOT TO USE, DO NOT USE FOR, USAGE, EXAMPLES), and the model routes correctly across ambiguous prompts.

## Fast Track

1. Expand each tool's description to 5 sections
2. Add USAGE for parameter guidance and EXAMPLES for concrete invocations
3. Keep the doubled-up negative (WHEN NOT TO USE and DO NOT USE FOR), because every model leaks back toward `bash` without it

## Hands-on Exercise 2.1

Refactor every tool's description in `index.ts` to use the full contract.

**Requirements:**

1. Each description starts with a one-line summary of what the tool does and its output format
2. WHEN TO USE lists 2-4 specific scenarios using keywords the model will see in prompts
3. WHEN NOT TO USE redirects to other tools by name
4. DO NOT USE FOR repeats the negative steering as hard boundaries
5. USAGE explains parameter constraints and defaults
6. EXAMPLES shows 2-3 concrete invocations with inputs

**Implementation hints:**

- WHEN NOT TO USE is soft ("prefer X"). DO NOT USE FOR is hard ("never use this for Y"). You want both
- Models default to `bash` for everything when descriptions are weak. The repeated negative is the counterforce
- USAGE earns its place when a parameter has constraints the model can't infer from the schema (caps, defaults, encoding)

### Why doubled-up negatives

You might look at WHEN NOT TO USE and DO NOT USE FOR side by side and think they're saying the same thing twice. They are. That's the point.

In our testing:

- Haiku reads WHEN NOT TO USE but ignores it under ambiguity
- Sonnet respects WHEN NOT TO USE but benefits from DO NOT USE FOR as reinforcement
- Opus handles both well, and the repetition does no harm

Every model we've tested leans toward `bash` when descriptions are thin. We call this bash gravity, the universal pull toward the most general tool. Saying "don't use this for searching" once isn't always enough. Saying it twice almost always is.

### The full contract

Here's what each section does, applied to `grep`:

```ts title="index.ts"
const grep = tool({
  description: `Search file contents using regex. Returns matching lines with file paths.

WHEN TO USE: finding patterns across multiple files, locating function definitions,
  searching for imports, finding TODOs or error messages.

WHEN NOT TO USE: reading a known file (use read instead).
  Running commands (use bash instead).

DO NOT USE FOR: reading files (use read), listing directories (use bash),
  modifying files (use edit).

USAGE: pattern is a regex string. glob filters by file extension.
  Results are capped at 50 matches.

EXAMPLES:
  - Find all TODO comments: pattern "TODO" glob "*.ts"
  - Find function definitions: pattern "function \\w+" glob "*.ts"
  - Find imports of a package: pattern "from 'express'" glob "*.ts"`,
  // ... inputSchema and execute unchanged
});
```

Here's the same treatment on `read`:

```ts title="index.ts"
const read = tool({
  description: `Read a file from the project. Returns numbered lines.

WHEN TO USE: viewing file contents, checking configurations, reading source code,
  examining specific lines with offset/limit.

WHEN NOT TO USE: searching for patterns across files (use grep instead).
  Running commands (use bash instead).

DO NOT USE FOR: searching code (use grep), executing commands (use bash),
  modifying files (use edit or write).

USAGE: path is relative to working directory. offset and limit are optional.
  Output is capped at 500 lines.`,
  // ... rest unchanged
});
```

And `bash`:

```ts title="index.ts"
const bash = tool({
  description: `Execute a shell command in the working directory.

WHEN TO USE: running build commands, installing packages, running tests,
  git operations, directory listings.

WHEN NOT TO USE: reading file contents (use read instead).
  Searching for patterns (use grep instead).

DO NOT USE FOR: reading files (use read), searching code (use grep).

USAGE: command is a single shell string. Commands not in the safe-prefix
  allowlist are blocked and return a clear error message.

EXAMPLES:
  - List files: command "ls -la"
  - Check git status: command "git status"
  - Run a test suite: command "npm test"`,
  // ... rest unchanged
});
```

### Why each section earns its keep

| Section         | Purpose                                                         |
| --------------- | --------------------------------------------------------------- |
| First line      | What the tool does, what it returns                             |
| WHEN TO USE     | Specific scenarios with keywords the prompt will use            |
| WHEN NOT TO USE | Soft redirect to the right tool                                 |
| DO NOT USE FOR  | Hard boundary, restated                                         |
| USAGE           | Constraints the schema can't capture (caps, defaults, encoding) |
| EXAMPLES        | Concrete invocations for the model to pattern-match             |

The descriptions get longer. That's fine. Tool descriptions live in the system prompt, which the SDK caches between turns. You're paying for the tokens once.

## Try It

Run one prompt per tool shape and verify routing:

```bash title="Terminal"
bun run index.ts . "Find all TODO comments in this project"
bun run index.ts . "Read the package.json"
bun run index.ts . "List all files in this directory"
```

You should see:

- The TODO prompt calls `grep`
- The package.json prompt calls `read`
- The list-files prompt calls `bash` with `ls`

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Note: Verify with one prompt per shape\*\*

Pick a prompt that points at exactly one tool. Search-shaped for `grep`, file-shaped for `read`, shell-shaped for `bash`. Mixed prompts (like "show me the package.json contents") sometimes route to either `read` or `bash` with `cat`, and that's not a routing bug, that's an ambiguous prompt.

## Commit

```bash
git add index.ts
git commit -m "feat(tools): expand descriptions to full 5-section contract"
```

## Done-When

- [ ] All three tools have descriptions with all 5 sections
- [ ] The TODO-search prompt routes to `grep`
- [ ] The file-read prompt routes to `read`
- [ ] The shell-listing prompt routes to `bash`
- [ ] `npx tsc --noEmit` passes

\*\*Note: Find the weakest link\*\*

Pick the description you wrote and start stripping. Drop EXAMPLES. Drop DO NOT USE FOR. Drop USAGE. After each strip, run all three test prompts. At what point does routing break? Where does it break first? The model that flips first is the one whose floor you've found.

## Solution

```ts title="index.ts"
const read = tool({
  description: `Read a file from the project. Returns numbered lines.

WHEN TO USE: viewing file contents, checking configurations, reading source code,
  examining specific lines with offset/limit.

WHEN NOT TO USE: searching for patterns across files (use grep instead).
  Running commands (use bash instead).

DO NOT USE FOR: searching code (use grep), executing commands (use bash),
  modifying files (use edit or write).

USAGE: path is relative to working directory. offset and limit are optional.
  Output is capped at 500 lines.`,
  // ... inputSchema and execute from Module 1
});

const grep = tool({
  description: `Search file contents using regex. Returns matching lines with file paths.

WHEN TO USE: finding patterns across multiple files, locating function definitions,
  searching for imports, finding TODOs or error messages.

WHEN NOT TO USE: reading a known file (use read instead).
  Running commands (use bash instead).

DO NOT USE FOR: reading files (use read), listing directories (use bash),
  modifying files (use edit).

USAGE: pattern is a regex string. glob filters by file extension.
  Results are capped at 50 matches.

EXAMPLES:
  - Find all TODO comments: pattern "TODO" glob "*.ts"
  - Find function definitions: pattern "function \\w+" glob "*.ts"
  - Find imports of a package: pattern "from 'express'" glob "*.ts"`,
  // ... inputSchema and execute from Module 1
});

const bash = tool({
  description: `Execute a shell command in the working directory.

WHEN TO USE: running build commands, installing packages, running tests,
  git operations, directory listings.

WHEN NOT TO USE: reading file contents (use read instead).
  Searching for patterns (use grep instead).

DO NOT USE FOR: reading files (use read), searching code (use grep).

USAGE: command is a single shell string. Commands not in the safe-prefix
  allowlist are blocked and return a clear error message.

EXAMPLES:
  - List files: command "ls -la"
  - Check git status: command "git status"
  - Run a test suite: command "npm test"`,
  // ... inputSchema and execute from Module 1
});
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
