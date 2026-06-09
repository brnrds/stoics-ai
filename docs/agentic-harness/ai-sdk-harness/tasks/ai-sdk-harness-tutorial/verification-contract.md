---
title: "Verification Contract"
description: "Gate sequence (typecheck, lint, tests, build). The agent proves its work, not its claims."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/verification-contract"
md_url: "https://vercel.com/academy/build-ai-agent-harness/verification-contract.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:07.070Z"
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

# Verification Contract

# Verification Contract

You added a Verification section to the prompt in Module 3. That was the start. This is the full version.

The agent should run the gates the project actually has, in a sensible order, and report results that distinguish between failures it caused and failures that were already there. That last part matters more than people think. An agent that says "tests pass" when three were already failing is more useful than one that says "all tests pass" when none of them ran, but only slightly. Both are lying. The truthful version is "three pre-existing failures, my change didn't introduce any new ones."

## Outcome

The agent discovers verification gates from the project's `package.json` (and `AGENTS.md` if present), runs them in a known order, and reports scoped claims that separate its failures from pre-existing ones.

## Fast Track

1. Discover available gates from `package.json` scripts
2. Run them in order: typecheck, lint, test, build
3. Report exact commands and outputs
4. Distinguish "I caused this failure" from "this was already failing"

## Hands-on Exercise 9.3

Extend the system prompt with a project-aware gate sequence and a scoped-claims contract.

**Requirements:**

1. In `index.ts` (or a helper), read `package.json` scripts and build a list of available verification commands
2. Pass the list into `buildSystemPrompt` as a new context field, `verificationCommands: string[]`
3. Update the `# Verification` section to list the project's actual gates instead of a generic list
4. Add an explicit scoped-claims rule: distinguish your failures from pre-existing failures

**Implementation hints:**

- Check `scripts.typecheck`, `scripts["type-check"]`, `scripts.lint`, `scripts.test`, `scripts.build`. Different projects use different names
- Fall back to `npx tsc --noEmit` when there's no `typecheck` script and TypeScript is in dependencies
- The order matters. Typecheck first because it fails fastest. Build last because it's the slowest
- The scoped-claims rule has the biggest impact on agent honesty. State it explicitly

### Discover gates from package.json

```ts title="src/verification.ts"
import type { Sandbox } from "./sandbox";

export async function discoverGates(sandbox: Sandbox): Promise<string[]> {
  try {
    const raw = await sandbox.readFile("package.json");
    const pkg = JSON.parse(raw);
    const scripts = pkg.scripts ?? {};
    const gates: string[] = [];

    if (scripts.typecheck || scripts["type-check"]) {
      gates.push("npm run typecheck");
    } else if (pkg.devDependencies?.typescript || pkg.dependencies?.typescript) {
      gates.push("npx tsc --noEmit");
    }

    if (scripts.lint) gates.push("npm run lint");
    if (scripts.test) gates.push("npm test");
    if (scripts.build) gates.push("npm run build");

    return gates;
  } catch {
    return [];
  }
}
```

The function returns an array of commands the agent can actually run. If `package.json` is missing or unreadable, the array is empty and the agent runs no gates. That's still better than running gates that don't exist.

### Pass it into the prompt

```ts title="src/system.ts (changes)"
export interface PromptContext {
  workingDirectory: string;
  sandboxType: string;
  toolNames: string[];
  gitBranch?: string;
  projectContext?: string;
  verificationCommands?: string[];
}

// In buildSystemPrompt, replace the existing Verification section:
const gates = ctx.verificationCommands?.length
  ? ctx.verificationCommands.map((c, i) => `${i + 1}. \`${c}\``).join("\n")
  : "(no verification commands discovered for this project)";

sections.push(`
# Verification
After making changes, verify your work by running these gates in order:
${gates}

Run each gate, capture the output, and report what passed and what didn't.

Distinguish failures you caused from failures that were already there:
- "Ran tsc: passed."
- "Ran npm test: 47 passed, 3 failed. The 3 failures are pre-existing in user.test.ts and unrelated to my changes."

Do NOT claim "tests pass" without running them. Do NOT inflate partial
verification into a blanket success claim.`);
```

The agent now sees the actual gates for the project, not a generic placeholder list.

### Wire it in

```ts title="index.ts"
import { discoverGates } from "./src/verification";

const verificationCommands = await discoverGates(sandbox);

const agent = new ToolLoopAgent({
  // ...
  instructions: buildSystemPrompt({
    workingDirectory: cwd,
    sandboxType: sandbox.type,
    toolNames: Object.keys(tools),
    projectContext,
    verificationCommands,
  }),
});
```

For a project with `tsc` and tests but no build script, the agent now knows it has two gates. For a project with no scripts at all, the agent knows verification is on it to scope honestly.

### Scoped claims, side by side

| What the agent might say | What you want                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| "All tests pass."        | "Ran `npm test`: 47 passed, 3 failed. The failures are pre-existing in `user.test.ts` and unrelated to my changes." |
| "The build works."       | "Ran `npm run build`: succeeded in 4.2s, no warnings."                                                              |
| "Looks good."            | "Ran tsc: passed. Lint not configured. Test suite passed (12 tests)."                                               |

The left column is the model's default voice when the prompt isn't pushing back. The right column is what the contract is built to produce.

\*\*Note: The hardest gate is the agent's honesty\*\*

You can wire perfect gate discovery and the agent will still say "all tests pass" when it hasn't run them. The protective force is the system prompt section, not the discovery code. Spend time on the wording. "Distinguish failures you caused from failures that were already there" is the load-bearing sentence.

## Try It

Make a small change and ask the agent to verify:

```bash title="Terminal"
bun run index.ts . "Rename the cwd variable in src/sandbox-local.ts to workingDir, then verify"
```

The agent should:

1. Make the rename
2. Run the discovered gates in order
3. Report each gate's outcome with the specific command and result
4. If any gate fails, distinguish whether the failure was caused by the rename or was already there

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/verification.ts src/system.ts index.ts
git commit -m "feat(verify): discover project gates and require scoped claims"
```

## Done-When

- [ ] `discoverGates` returns the gates that exist for the current project
- [ ] The system prompt's Verification section lists the discovered gates
- [ ] The agent runs gates in order and reports exact results
- [ ] The agent distinguishes its failures from pre-existing ones
- [ ] On a project with no scripts, the agent reports verification is limited
- [ ] `npx tsc --noEmit` passes

\*\*Note: Fail fast, in the right order\*\*

Right now gates run in a fixed order. Try benchmarking each one in your project. Typecheck might be three seconds. Tests might be thirty. Build might be ninety. Sort by typical duration and run the fastest first so a failure surfaces sooner. Then notice: some gates depend on others. The build is meaningless if `tsc` fails. How do you express that without losing the fail-fast property?

## Solution

```ts title="src/verification.ts"
import type { Sandbox } from "./sandbox";

export async function discoverGates(sandbox: Sandbox): Promise<string[]> {
  try {
    const raw = await sandbox.readFile("package.json");
    const pkg = JSON.parse(raw);
    const scripts = pkg.scripts ?? {};
    const gates: string[] = [];

    if (scripts.typecheck || scripts["type-check"]) {
      gates.push("npm run typecheck");
    } else if (pkg.devDependencies?.typescript || pkg.dependencies?.typescript) {
      gates.push("npx tsc --noEmit");
    }

    if (scripts.lint) gates.push("npm run lint");
    if (scripts.test) gates.push("npm test");
    if (scripts.build) gates.push("npm run build");

    return gates;
  } catch {
    return [];
  }
}
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
