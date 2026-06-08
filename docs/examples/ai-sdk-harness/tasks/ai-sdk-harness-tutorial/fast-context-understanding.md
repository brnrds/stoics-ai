---
title: "Fast Context Understanding"
description: "grep first, read only what you'll change. Don't read 30 files to understand a codebase."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/fast-context-understanding"
md_url: "https://vercel.com/academy/build-ai-agent-harness/fast-context-understanding.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:06.731Z"
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

# Fast Context Understanding

# Fast Context Understanding

Watch a fresh agent on a real task and you'll see it do the same thing every time. Read `package.json`. Read `tsconfig.json`. Read the entry point. Read every file in `src/`. Twenty steps later, it's just starting to think about the actual work.

This is the "read everything, then act" strategy. It feels thorough. It pollutes context, burns budget, and runs out of attention before the agent's done anything useful.

The fix is small: search first, read second, act third. The whole change lives in the system prompt and a habit the agent picks up from it.

## Outcome

The system prompt's Agency section steers the agent toward `grep` before `read` whenever the relevant files aren't already named. Multi-file tasks resolve in a few steps instead of a few dozen.

## Fast Track

1. Add two lines to the Agency section: search before reading, don't read files "just in case"
2. Verify with a real task: the agent should `grep` for the pattern, then `read` only the matches
3. Confirm direct file questions still go straight to `read`

## Hands-on Exercise 9.2

Steer the agent toward grep-first exploration through the prompt.

**Requirements:**

1. Update the `# Agency` section in `buildSystemPrompt` with two new bullets:
   - Search before reading. Use `grep` first, then `read` only what you'll change
   - Don't read files "just in case." Read what you need when you need it
2. Run a task where the relevant files aren't named in the prompt. Confirm the agent uses `grep` first
3. Run a task that names a specific file. Confirm the agent goes straight to `read`

**Implementation hints:**

- The change is in `src/system.ts`, not in any tool. The tools haven't changed
- The Agency section is where action policy lives. This is action policy
- Don't add this to the tool description on `grep`. It belongs at the agent's policy level, not the tool's

### The prompt addition

```ts title="src/system.ts (excerpt)"
sections.push(`
# Agency
- USE your tools. Read files, search code, run commands, then answer.
- Do NOT explain what you WOULD do. Actually do it.
- Available tools: ${ctx.toolNames.join(", ")}
- Search before reading. Use grep first, then read only what you'll change.
- Don't read files "just in case." Read what you need when you need it.`);
```

Two bullets. That's the whole policy change.

### The pattern in practice

The naive (slow) flow on "Add rate limiting to the auth routes":

```
read package.json
read tsconfig.json
read src/index.ts
read src/routes/index.ts
read src/routes/auth.ts
read src/routes/users.ts
read src/middleware/index.ts
... 20 more files
start implementing
```

The grep-first (fast) flow on the same prompt:

```
grep pattern: "router\.post.*auth|router\.get.*auth"
  -> matches src/routes/auth.ts
read src/routes/auth.ts
grep pattern: "rateLimit|rate-limit|middleware"
  -> matches src/middleware/rate-limit.ts
read src/middleware/rate-limit.ts
start implementing
```

Five steps instead of thirty. The agent now has exactly the context it needs to act and almost nothing else.

### Parallel reads, when they apply

Once `grep` has narrowed the file list, the reads can fan out. The AI SDK runs tool calls in parallel when they don't depend on each other:

```
Step 1: grep for the pattern (1 call)
Step 2: read auth.ts AND read rate-limit.ts (2 parallel calls)
Step 3: start implementing
```

Don't force this. If the agent reads files in parallel on its own, great. If it doesn't, the search-first habit alone is the win.

\*\*Note: The fast pattern needs grep to be sharp\*\*

This policy is only as good as the `grep` tool's results. If `grep` is returning hundreds of matches because the pattern was vague, the agent ends up reading half the codebase anyway. The 50-match cap from Module 5 is doing real work here. So is the model's habit of writing narrower patterns when it sees the cap take effect.

## Try It

Run a multi-file task with no specific file named:

```bash title="Terminal"
bun run index.ts . "Find every place this project parses JSON and tell me which ones might fail on malformed input"
```

You should see `grep` calls before any `read`, and the `read`s should be on the files `grep` found.

Run a task that names a specific file:

```bash title="Terminal"
bun run index.ts . "What's in src/sandbox-local.ts?"
```

The agent should go straight to `read`. No `grep` needed. The pattern adapts to whether the file is known.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/system.ts
git commit -m "feat(prompt): steer agent toward grep-first exploration"
```

## Done-When

- [ ] Two new bullets in the Agency section
- [ ] Multi-file tasks use `grep` before `read`
- [ ] Specific-file tasks skip `grep` and go straight to `read`
- [ ] The total step count on an exploration task drops noticeably
- [ ] `npx tsc --noEmit` passes

\*\*Note: When grep isn't enough\*\*

Some patterns are hard to grep. Architectural questions ("how is auth handled across the app") don't map to a single regex. Sketch a `survey` tool that takes a high-level question and returns a list of files plus a one-line role for each. Should this be the explorer subagent from Module 6 with a tighter prompt? Or a new tool? Where's the line between a tool and a subagent?


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
