---
title: "Skills System"
description: "Progressive disclosure. Names and descriptions always in context, full content loaded on demand."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/skills-system"
md_url: "https://vercel.com/academy/build-ai-agent-harness/skills-system.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:08.442Z"
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

# Skills System

# Skills System

The naive way to give the agent specialized knowledge is to paste it into the system prompt. "Here are our auth conventions. Here are our database patterns. Here is the testing strategy. Here are the deployment notes."

That works for one or two packages. By five, the system prompt is fifteen thousand tokens long, you're paying for them on every call, and the agent is rummaging through them looking for the one bullet that applies to today's task.

Skills do the same job with progressive disclosure. Names and one-line descriptions live in the system prompt forever (cheap). Full content is in markdown files on disk and only loads when the agent asks for it (also cheap, but only when needed).

## Outcome

`src/skills.ts` discovers skills from `skills/<name>/SKILL.md` files, surfaces their names and descriptions in the system prompt, and provides a `loadSkill` tool that returns full content on demand.

## Fast Track

1. Create a `skills/` directory with one or two skill folders, each containing `SKILL.md`
2. Parse frontmatter from each `SKILL.md` to get name and description
3. Add a `skills` section to the system prompt listing names plus descriptions
4. Add a `loadSkill(name)` tool that returns the full markdown

## Hands-on Exercise 11.1

Implement skill discovery and on-demand loading.

**Requirements:**

1. Define a `Skill` shape (`name`, `description`, `path`)
2. Write `discoverSkills(dirs: string[])` that scans for `<dir>/<name>/SKILL.md` and parses frontmatter
3. Deduplicate by name. The first directory wins, so project-local skills can override globals
4. Add a `# Skills` section to `buildSystemPrompt` listing each skill's name and one-line description
5. Add a `loadSkill` tool that takes a `name` and returns the full markdown content

**Implementation hints:**

- Frontmatter parsing doesn't need a library. A two-line slice between `---` markers is enough for `name:` and `description:` fields
- Cap the loaded skill content to keep one massive skill from blowing the context window (the same caps from Module 5 apply)
- The system prompt section should be short. One line per skill is the right density. Names and descriptions only

### The skill shape

```ts title="src/skills.ts"
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface Skill {
  name: string;
  description: string;
  path: string;
}

function parseFrontmatter(md: string): { description?: string } {
  if (!md.startsWith("---")) return {};
  const end = md.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = md.slice(3, end);
  const descLine = block.split("\n").find((l) => l.startsWith("description:"));
  return {
    description: descLine?.replace("description:", "").trim().replace(/^['"]|['"]$/g, ""),
  };
}

export function discoverSkills(dirs: string[]): Skill[] {
  const skills: Skill[] = [];
  const seen = new Set<string>();

  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry, "SKILL.md");
      if (existsSync(path) && !seen.has(entry)) {
        seen.add(entry);
        const content = readFileSync(path, "utf-8");
        const { description } = parseFrontmatter(content);
        skills.push({
          name: entry,
          description: description ?? "(no description)",
          path,
        });
      }
    }
  }

  return skills;
}
```

`dirs` is an array because real harnesses look in more than one place. Project-local skills (in the working directory) take priority. Global skills (in the user's home directory) fill in the rest.

### Surface them in the prompt

```ts title="src/system.ts (additions)"
export interface PromptContext {
  // ...existing fields
  skills?: { name: string; description: string }[];
}

// Inside buildSystemPrompt, after Guardrails:
if (ctx.skills?.length) {
  const lines = ctx.skills
    .map((s) => `- ${s.name}: ${s.description}`)
    .join("\n");
  sections.push(`
# Skills
The following skills are available. Call \`loadSkill\` with the name to get full content.
${lines}`);
}
```

The agent sees skill names and a one-line description on every call. The full content only enters context if the agent decides to load it.

### The loader tool

```ts title="src/tools.ts (additions)"
import { tool } from "ai";
import { z } from "zod";
import { readFileSync } from "node:fs";
import type { Skill } from "./skills";

export function createLoadSkillTool(skills: Skill[]) {
  const MAX_SKILL_CHARS = 4000;
  const byName = new Map(skills.map((s) => [s.name, s]));

  return tool({
    description: `Load the full content of a skill.
WHEN TO USE: the task touches a domain you have a skill for (auth, db, testing,
  deployment, etc.). Check the # Skills section in your instructions.
WHEN NOT TO USE: tasks unrelated to any available skill.
DO NOT USE FOR: tasks where the skill name is not in the listed skills.`,
    inputSchema: z.object({
      name: z.string().describe("Skill name as listed in the Skills section"),
    }),
    execute: async ({ name }) => {
      const skill = byName.get(name);
      if (!skill) return `Unknown skill: ${name}`;
      const content = readFileSync(skill.path, "utf-8");
      return content.length > MAX_SKILL_CHARS
        ? content.slice(0, MAX_SKILL_CHARS) + `\n... (truncated at ${MAX_SKILL_CHARS} chars)`
        : content;
    },
  });
}
```

The cap matters. A skill that grew to fifteen thousand words shouldn't blow the context window the moment the agent calls `loadSkill`. The truncation message lets the model know there's more if it needs to load again with an offset (not implemented here, but easy to add).

### Wire it in

```ts title="index.ts"
import { discoverSkills } from "./src/skills";

const skillDirs = [
  join(cwd, "skills"),
  join(process.env.HOME ?? "", ".harness", "skills"),
];
const skills = discoverSkills(skillDirs);

const tools = {
  // ...everything else
  loadSkill: createLoadSkillTool(skills),
};

const instructions = buildSystemPrompt({
  // ...existing context
  skills: skills.map((s) => ({ name: s.name, description: s.description })),
});
```

Project skills first, global second. Names and descriptions in the prompt. Content loads on demand through the tool.

### Why "names in, content out"

The numbers tell the story. Five skills, a thousand words each, would be roughly five thousand tokens added to every call forever. Five skills with one-line descriptions is a hundred tokens total. The model still knows the skills exist. The agent decides which ones to load based on the task. The full content only enters context when there's a reason.

This is the same prevention-over-cleanup discipline from Module 5, applied at the knowledge layer instead of the tool-output layer.

\*\*Note: The model has to ask\*\*

The model doesn't auto-load skills. The system prompt names them and the tool surface them. The model still has to decide to call `loadSkill`. Treat this as a retrieval path, not a guarantee. Watch your sessions: if the model never loads a skill that would obviously help, your skill descriptions need sharper hooks.

## Try It

Drop a sample skill into `skills/auth-patterns/SKILL.md`:

```markdown title="skills/auth-patterns/SKILL.md"
---
description: Patterns and pitfalls for adding authentication to this project
---
# Auth Patterns

This project uses NextAuth with JWT sessions. Key files:

- `lib/auth.ts`: NextAuth config
- `middleware.ts`: route protection
...
```

Run a task that should hit the skill:

```bash title="Terminal"
bun run index.ts . "Add OAuth login to this project. Check the auth-patterns skill first."
```

You should see the agent call `loadSkill` with `name: "auth-patterns"`, then proceed using the loaded content.

Run an unrelated task and confirm the agent doesn't load anything:

```bash title="Terminal"
bun run index.ts . "What's the syntax for a TypeScript const assertion?"
```

No skill load. The system prompt mentions skills exist; the model knows not to reach for them when they don't apply.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/skills.ts src/tools.ts src/system.ts index.ts skills/
git commit -m "feat(skills): progressive-disclosure skill loading"
```

## Done-When

- [ ] `discoverSkills` scans directories and parses frontmatter
- [ ] System prompt lists skills with their one-line descriptions
- [ ] `loadSkill` tool returns full content on demand, capped
- [ ] Project-local skills override globals when names collide
- [ ] A task that names a skill triggers `loadSkill`; an unrelated task doesn't
- [ ] `npx tsc --noEmit` passes

\*\*Note: Section-targeted loading\*\*

Right now `loadSkill` returns the whole file. For a five-thousand-word skill, that's wasteful when the agent only needs one section. Extend the tool with an optional `section: string` parameter that returns just the requested heading and its content. Now the model can load `loadSkill({ name: "auth-patterns", section: "OAuth flow" })`. Where do you draw the line between "skill as document" and "skill as a small searchable corpus"?

## Solution

See the full code blocks above. The exercise solution is the same code applied to your files.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
