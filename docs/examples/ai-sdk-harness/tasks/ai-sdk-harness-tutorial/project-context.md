---
title: "Project Context"
description: "Load project instructions from AGENTS.md so the same harness can pick up project-specific commands and constraints."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/project-context"
md_url: "https://vercel.com/academy/build-ai-agent-harness/project-context.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:57.898Z"
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

# Project Context

# Project Context

Your harness is generic. Every project it touches is not.

One project uses `bun test`. The next uses `vitest`. The third uses `npm run check` for a typecheck-and-lint combo that doesn't match any convention you've baked into the prompt. The agent shouldn't have to guess, and you shouldn't have to teach it project by project.

The trick most production harnesses use is the same one teams use for their human contributors: drop a markdown file in the repo that explains how the project works. The agent reads it and adjusts.

## Outcome

If an `AGENTS.md` file exists in the working directory, the harness reads it and injects its contents into the system prompt as a "Project Instructions" section. With no file, the prompt falls back to the base instructions only.

## Fast Track

1. Check for `AGENTS.md` in the working directory
2. If present, read it into a string
3. Pass it to `buildSystemPrompt` as `projectContext`

## Hands-on Exercise 3.4

Discover and inject `AGENTS.md` from the working directory.

**Requirements:**

1. In `index.ts`, check whether `cwd/AGENTS.md` exists
2. If it does, read it as UTF-8
3. Pass the contents (or `undefined`) to `buildSystemPrompt` as `projectContext`
4. Confirm the prompt builder's existing `projectContext` handling adds the section when present and omits it when absent

**Implementation hints:**

- `existsSync` from `node:fs` is fine here. The check happens once at startup, not in a hot loop
- Use `path.join(cwd, "AGENTS.md")`, not template literals, to keep path handling consistent
- Don't add monorepo directory walking yet. The challenge below covers that, and Module 4's sandbox abstraction will change how file discovery works anyway

### The discovery

The whole feature is a few lines:

```ts title="index.ts"
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const agentsPath = join(cwd, "AGENTS.md");
const projectContext = existsSync(agentsPath)
  ? readFileSync(agentsPath, "utf-8")
  : undefined;
```

Pass it into the builder:

```ts title="index.ts"
const instructions = buildSystemPrompt({
  workingDirectory: cwd,
  sandboxType: "local",
  toolNames: Object.keys(tools),
  projectContext,
});
```

That's all of it. Convention over configuration. No plugin system, no registration, no event bus. A file in a known location.

### What goes in AGENTS.md

The file is for project-specific facts the harness can't infer from the code itself:

```markdown title="AGENTS.md"
# Project Instructions

## Commands
- `bun test` runs the test suite
- `bun run build` builds for production
- `bun run lint` checks code style

## Architecture
- Monorepo, packages live in `packages/`
- Each package has its own `tsconfig.json`
- Shared types in `packages/shared/`

## Style
- Functional components, no classes
- Named exports, not default
- Error messages must be user-facing

## Lessons learned
- Auth middleware must run before rate limiting
- Don't modify migration files directly, generate new ones
```

The agent reads this and adjusts. It knows the commands. It knows the architecture. It knows the project's recurring mistakes. The same harness now behaves like a React-project agent in a React project and like a CLI-project agent in a CLI project, because the project itself told the agent what kind of project it is.

\*\*Note: A familiar pattern with different file names\*\*

This is the same trick Cursor uses with `.cursorrules`, Codex with `AGENTS.md`, Claude Code with `CLAUDE.md`, and pi with its own convention. The file name varies. The pattern doesn't. Discover a markdown file, inject as instructions.

### Why one file is enough for now

A real harness walks parent directories looking for `AGENTS.md` files in a monorepo. It merges them. It might also support `.cursorrules`, `.github/copilot-instructions.md`, or `~/.agents/default.md`.

We're not building any of that yet. One file in the working directory covers the teaching point: project context comes from a file, the harness discovers it at startup, the prompt absorbs it. The walking and merging stack on top of that without changing the shape.

## Try It

Drop an `AGENTS.md` into the working directory with one specific instruction the agent couldn't infer from the code:

```markdown title="AGENTS.md"
# Project Instructions
- All commits must use the format `feat(scope): message`
- The verification step is `bun test`, not `npm test`
```

Run the agent:

```bash title="Terminal"
bun run index.ts . "What command do I use to run the tests in this project?"
```

The agent should answer `bun test` because the file told it. Remove `AGENTS.md` and run the same prompt. The agent will guess (probably `npm test`).

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add index.ts
git commit -m "feat(prompt): inject AGENTS.md as project context"
```

## Done-When

- [ ] `index.ts` checks for `AGENTS.md` in the working directory
- [ ] If present, its contents are passed to `buildSystemPrompt` as `projectContext`
- [ ] With `AGENTS.md` present, the agent answers project-specific questions from the file
- [ ] Without `AGENTS.md`, the harness runs without error using base instructions only
- [ ] `npx tsc --noEmit` passes

\*\*Note: Directory walking for monorepos\*\*

A real monorepo has an `AGENTS.md` at the root and another inside each package. Starting from `cwd`, walk up to the repo root (look for `.git`) and collect every `AGENTS.md` along the way. Merge them, with the deepest file overriding or extending the root. Now think about conflicts: what happens when the root says `use npm` and the package says `use pnpm`? Different harnesses solve this differently. pi merges everything found. Cursor uses the deepest only. Codex concatenates root plus cwd. Try one strategy and notice where it breaks.

## Solution

```ts title="index.ts"
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildSystemPrompt } from "./src/system";

const cwd = resolve(process.argv[2] || process.cwd());

const agentsPath = join(cwd, "AGENTS.md");
const projectContext = existsSync(agentsPath)
  ? readFileSync(agentsPath, "utf-8")
  : undefined;

const tools = { read, grep, bash };

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: buildSystemPrompt({
    workingDirectory: cwd,
    sandboxType: "local",
    toolNames: Object.keys(tools),
    projectContext,
  }),
  tools,
  stopWhen: stepCountIs(10),
});
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
