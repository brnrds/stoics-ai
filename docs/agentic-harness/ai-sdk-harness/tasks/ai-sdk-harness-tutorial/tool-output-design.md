---
title: "Tool Output Design"
description: "Prevention is better than cleanup. Design tools to produce bounded output from the start."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/tool-output-design"
md_url: "https://vercel.com/academy/build-ai-agent-harness/tool-output-design.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:01.357Z"
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

# Tool Output Design

# Tool Output Design

Pruning takes old results out of context. That's necessary. It's not enough.

If a single tool result is 5,000 tokens, pruning the next one doesn't save you. The damage is already done. The model already saw 5,000 tokens of grep output and now has to keep them around for at least three more turns.

The better fix is upstream. Tools should produce small, structured, bounded output by default. Pruning is the cleanup crew. Tool design is the prevention.

## Outcome

Every tool in your harness has explicit output caps (lines, matches, characters), and the truncation behavior is communicated back to the model so it can paginate when it needs more.

## Fast Track

1. Cap `read` at 500 lines, with offset/limit pagination
2. Cap `grep` at 50 matches, returning the total count
3. Cap `bash` at 5,000 characters of output, keeping the tail
4. Every cap surfaces a truncation message the model can see and act on

## Hands-on Exercise 5.3

Apply the bounded-output contract to all three tools.

**Requirements:**

1. `read` keeps its 500-line cap from Module 1, with `offset` and `limit` params for pagination
2. `grep` keeps its 50-match cap from Module 1, with a "(N total, showing first 50)" suffix when truncated
3. `bash` adds a 5,000-character cap on stdout. Keep the tail (last 5,000 chars), not the head, because errors usually live at the end
4. Each truncation appends a clear message like `"... (truncated, showing last 5000 chars)"`

**Implementation hints:**

- The truncation message is the model's only signal that there's more data. It needs to be visible
- For `bash`, slicing the tail is usually right. Build output, test failures, and stack traces tend to be at the end. Pick differently if your tool runs commands where the head matters
- "Bounded" doesn't mean "tiny." 500 lines, 50 matches, 5,000 chars. Enough to answer the question, small enough to stay in context

### The cap table

| Tool   | Cap         | Why this number                                                                              |
| ------ | ----------- | -------------------------------------------------------------------------------------------- |
| `read` | 500 lines   | Enough to read most files. Big enough to grasp structure, small enough to not bury the model |
| `grep` | 50 matches  | A search returning 50 results answered the question. Five hundred would be a data dump       |
| `bash` | 5,000 chars | Most command output fits. `npm install` and friends produce noise the model doesn't need     |

These numbers aren't sacred. They're tuned by running real tasks and noticing what hurts. If your harness consistently runs commands with longer output that matters, raise the cap. If you mostly do fast searches, lower it.

### Bash output, with cap

The bash tool didn't have an output cap until now. Add one:

```ts title="src/tools.ts (excerpt)"
const MAX_BASH_CHARS = 5000;

const stdout = result.stdout || "(no output)";
const cappedStdout =
  stdout.length > MAX_BASH_CHARS
    ? stdout.slice(-MAX_BASH_CHARS) +
      `\n... (truncated, showing last ${MAX_BASH_CHARS} chars)`
    : stdout;

return cappedStdout;
```

Slicing from the end is intentional. Most commands the agent will run fail loudly at the end. A failed test prints the failures last. A failed build prints the error last. Keeping the tail keeps the part the agent needs to act on.

### Structured returns, not raw dumps

The grep tool already does this from Module 1, but it's worth restating the pattern:

```ts title="src/tools.ts (grep, excerpt)"
const lines = stdout.trim().split("\n").filter(Boolean);
const MAX_MATCHES = 50;
const truncated = lines.length > MAX_MATCHES;
const result = truncated ? lines.slice(0, MAX_MATCHES) : lines;

return truncated
  ? result.join("\n") + `\n... (${lines.length} total, showing first ${MAX_MATCHES})`
  : result.join("\n") || "No matches found.";
```

The truncation message gives the model two pieces of information it can act on: there were more results than shown, and exactly how many. With that, the agent can decide to narrow the search or paginate.

### The truncation contract

Every tool that can produce unbounded output should follow the same shape:

1. Cap the output at a reasonable limit
2. Tell the model the output was truncated and how much got cut
3. Provide pagination parameters where the tool supports them (offset/limit on `read`, narrower `glob` patterns on `grep`)

The contract is what lets the agent react. A tool that silently truncates is worse than no truncation at all, because the model thinks it has the full picture and acts on incomplete data.

\*\*Note: Caps are a tax the agent pays in pagination\*\*

Bounded output makes some tasks a little slower. To read a 2,000-line file, the agent now needs four `read` calls instead of one. That's the right tradeoff. Four bounded reads are cheaper, in tokens and cost, than one massive read that pollutes context for the rest of the session.

## Try It

Run a search that you know returns a lot of matches:

```bash title="Terminal"
bun run index.ts . "Find all import statements in this project"
```

You should see grep return 50 matches with a count of total matches in the tail. If you ask the agent to keep going, it should narrow the search or use a more specific glob, not ask for an unbounded dump.

Try a command that produces a lot of output:

```bash title="Terminal"
bun run index.ts . "Run: ls -laR"
```

If the recursive listing exceeds 5,000 characters, you should see the truncation message. The agent should react by narrowing the listing or asking for a specific subdirectory.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/tools.ts
git commit -m "feat(tools): cap bash output at 5000 chars with tail-keep"
```

## Done-When

- [ ] `read` caps at 500 lines with offset/limit pagination
- [ ] `grep` caps at 50 matches with a `(N total)` suffix on truncation
- [ ] `bash` caps stdout at 5,000 characters, keeping the tail
- [ ] Every cap surfaces a clear truncation message the model can see
- [ ] No tool can dump unbounded data into context
- [ ] `npx tsc --noEmit` passes

\*\*Note: Make the caps configurable\*\*

Hardcoded caps are a starting point. A subagent doing a quick check might need 100 lines, not 500. A deep analysis might want 2,000. Refactor your tool factories to accept a `caps` config object. Now the caller can tune them per agent. Watch for the tradeoff: configurable caps means more knobs for the user to set wrong. Where's the right default?

## Solution

```ts title="src/tools.ts (bash excerpt)"
export function createBashTool(
  sandbox: Sandbox,
  needsApproval: (input: { command: string }) => boolean,
) {
  const MAX_BASH_CHARS = 5000;

  return tool({
    description: `Execute a shell command in the working directory.
WHEN TO USE: build commands, package install, tests, git, directory listings.
WHEN NOT TO USE: reading file contents (use read).
DO NOT USE FOR: reading files (use read), searching code (use grep).`,
    inputSchema: z.object({
      command: z.string().describe("Shell command to execute"),
    }),
    execute: async ({ command }) => {
      if (needsApproval({ command })) {
        return `Blocked: "${command}" requires approval.`;
      }
      const result = await sandbox.exec(command);
      const stdout = result.stdout || "(no output)";
      return stdout.length > MAX_BASH_CHARS
        ? stdout.slice(-MAX_BASH_CHARS) +
            `\n... (truncated, showing last ${MAX_BASH_CHARS} chars)`
        : stdout;
    },
  });
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
