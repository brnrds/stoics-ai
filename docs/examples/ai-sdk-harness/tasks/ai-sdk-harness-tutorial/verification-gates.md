---
title: "Verification Gates"
description: "Add a verification contract so the agent scopes claims honestly and proves what it actually checked."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/verification-gates"
md_url: "https://vercel.com/academy/build-ai-agent-harness/verification-gates.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:57.533Z"
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

# Verification Gates

# Verification Gates

"I fixed the bug" is a sentence the agent will say with great confidence whether or not it fixed the bug. It will also tell you "all tests pass" without ever running a test. This isn't malice. Models are pattern-matchers, and the patterns they've seen end with "all tests pass" a lot.

The fix is to make verification a contract, not a vibe. We'll add a section to the system prompt that tells the agent what to run, what to do when it can't run something, and how to scope its claims afterward.

## Outcome

`buildSystemPrompt` includes a Verification section that tells the agent to run real checks (`tsc`, lint, tests, build) when they exist, and to scope its reporting honestly when they don't.

## Fast Track

1. Add a `# Verification` section to `buildSystemPrompt`
2. Tell the agent to run the checks that exist in this project, not assume them
3. Tell the agent to report what it ran, what was blocked, and what was unavailable

## Hands-on Exercise 3.3

Add the Verification section to your prompt builder and write the contract clearly.

**Requirements:**

1. Push a `# Verification` section into the sections array in `buildSystemPrompt`
2. The section instructs the agent to run typecheck (when TypeScript is present), lint, test, build, but only the ones that exist
3. Include an explicit instruction not to claim success without running the check
4. Require scoped reporting: what ran, what was blocked, what was unavailable

**Implementation hints:**

- "Do NOT claim without running" is the load-bearing sentence. Without it, models fill in the gaps
- The contract is about honesty, not about coverage. An agent that says "I ran tsc, tests were blocked by approval" is more useful than one that claims "all tests pass" without checking
- Don't bake project-specific commands into the prompt. Lesson 3.4 covers letting the project tell the agent what to run

### The contract

Add this block to `buildSystemPrompt`:

```ts title="src/system.ts"
sections.push(`
# Verification
After making changes, verify your work:
1. Run \`npx tsc --noEmit\` when TypeScript is present
2. Run lint, test, or build commands only if they exist in this project and are allowed by the current approval mode
3. Report exactly what you ran, what was blocked, and what was unavailable
4. Do NOT inflate partial verification into a blanket success claim

Do NOT claim "tests pass" without running them.
Scope your claims honestly. "Verification was limited because writes were blocked" is honest.
"All tests pass" when you didn't run them is not.`);
```

The contract names the bad behaviors explicitly. Models are good at avoiding things you name. They're bad at avoiding things you only imply.

### Scoped claims, side by side

Here's the shape of the reporting the contract is trying to produce:

| What the agent might say | What you want it to say                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| "All tests pass"         | "Ran `npm test`: 47 passed, 3 failed (pre-existing, unrelated to my change)"                            |
| "I fixed the bug"        | "Fixed the null check in `auth.ts:42`. `npx tsc --noEmit` passes. Tests were blocked by approval mode." |
| "The build works"        | "Ran `npm run build`: succeeded in 4.2s, no warnings."                                                  |

The right-hand column is specific. It says what was checked, what was found, and where the limits were. The left-hand column is the model's default voice when the prompt doesn't push back.

### What this does and doesn't do

The Verification section doesn't make the checks pass. It makes the agent's report of the checks honest. If `tsc` fails, the agent reports failure. If tests were never run because they don't exist in this project, the agent says so. If approval mode blocked the lint command, the agent says that too.

That sounds modest. In practice, this is the difference between trusting the agent's output and re-running every check yourself.

\*\*Note: Verification is about scope, not about coverage\*\*

You're not asking the agent to check everything. You're asking it to tell you, accurately, what it did check. A small honest scope is more useful than a confident-sounding full sweep. This is the same discipline as the description contracts in Module 2: say the limits out loud and the agent stays inside them.

## Try It

Make a small edit (delete a comment, rename a variable, anything you can revert) and ask the agent to verify:

```bash title="Terminal"
bun run index.ts . "Rename the cwd variable to workingDir, then verify your work"
```

The agent should:

1. Make the change with `edit` or `bash`
2. Run `npx tsc --noEmit`
3. Report the result of `tsc` specifically, not a blanket "looks good"

If your approval mode blocks the test command, the agent should say so out loud instead of pretending tests passed.

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Warning: Confabulation lives in the language\*\*

Watch for soft phrases: "should be fine," "looks good to me," "I expect this to work." Those are tells. A model that ran the check uses past tense and a specific result. A model that didn't uses hedged future tense. Reading for this kind of phrasing is half the job of grading the agent's output.

## Commit

```bash
git add src/system.ts
git commit -m "feat(prompt): add Verification section to system prompt"
```

## Done-When

- [ ] `buildSystemPrompt` includes a `# Verification` section
- [ ] The section explicitly tells the agent not to claim success without running
- [ ] The section requires scoped reporting (ran/blocked/unavailable)
- [ ] On a test edit, the agent reports the result of `tsc` specifically
- [ ] `npx tsc --noEmit` passes

\*\*Note: Discover verification steps from package.json\*\*

Right now the Verification section is hardcoded. Try reading `package.json`'s `scripts` block and including only the steps that actually exist. If `scripts.typecheck` is defined, list it. If `scripts.lint` is missing, don't tell the agent to run lint. This is the same idea as the next lesson (`AGENTS.md`), just narrower and earlier.

## Solution

```ts title="src/system.ts (additions)"
export function buildSystemPrompt(ctx: PromptContext): string {
  const sections: string[] = [];

  // ... role, sandbox, Agency, Guardrails sections from previous lesson

  sections.push(`
# Verification
After making changes, verify your work:
1. Run \`npx tsc --noEmit\` when TypeScript is present
2. Run lint, test, or build commands only if they exist in this project and are allowed by the current approval mode
3. Report exactly what you ran, what was blocked, and what was unavailable
4. Do NOT inflate partial verification into a blanket success claim

Do NOT claim "tests pass" without running them.
Scope your claims honestly. "Verification was limited because writes were blocked" is honest.
"All tests pass" when you didn't run them is not.`);

  // ... projectContext section

  return sections.join("\n");
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
