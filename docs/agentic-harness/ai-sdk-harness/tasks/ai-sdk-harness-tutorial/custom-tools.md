---
title: "Custom Tools"
description: "Register tools without forking. Map every customization surface and treat tools as registrations, not built-ins."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/custom-tools"
md_url: "https://vercel.com/academy/build-ai-agent-harness/custom-tools.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:09.005Z"
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

# Custom Tools

# Custom Tools

You currently build the tool list by hand in `index.ts`. `read`, `grep`, `bash`, `task`, `askUser`, `todo`, `loadSkill`. That works fine for the seven the course gives you. It doesn't work when someone wants to add their own `deploy` tool, or wrap `bash` with project-specific safe commands, without forking the harness.

A tool registry is the seam. New tools get registered through it. Existing tools can be composed into new ones. The core harness stays the same.

## Outcome

`src/registry.ts` exposes a tool registry with `register`, `get`, `list`, and a small `wrapTool` helper. The agent's tool set is built from the registry instead of being hardcoded in `index.ts`.

## Fast Track

1. Define a `ToolRegistry` with `register(name, tool)`, `get(name)`, `list()`
2. Move the built-in tool wiring into a `registerBuiltins(registry, sandbox)` helper
3. Add `wrapTool(base, { beforeExecute, afterExecute })` for composition
4. Build the agent's tool set from `registry.list()` instead of an inline object

## Hands-on Exercise 11.2

Build the registry and migrate the existing tools to it.

**Requirements:**

1. `src/registry.ts` exports `createRegistry()` returning an object with `register`, `get`, `list`, and `entries`
2. Built-in tools register through `registerBuiltins(registry, sandbox)`. Same set as before
3. `wrapTool(base, hooks)` returns a new tool that runs `beforeExecute` and `afterExecute` around `base.execute`
4. In `index.ts`, the agent's tools come from `Object.fromEntries(registry.entries())` rather than an inline object
5. Demonstrate one custom registration (`deploy` tool) to prove the seam works

**Implementation hints:**

- The registry is a `Map<string, Tool>` plus three or four method names. Don't overbuild it
- `wrapTool` is a thin function that returns a new tool. The base tool stays unchanged
- `entries()` returning `[name, tool][]` makes `Object.fromEntries` work cleanly

### The registry

```ts title="src/registry.ts"
import type { Tool } from "ai";

export interface ToolRegistry {
  register(name: string, tool: Tool): void;
  get(name: string): Tool | undefined;
  list(): string[];
  entries(): [string, Tool][];
}

export function createRegistry(): ToolRegistry {
  const tools = new Map<string, Tool>();
  return {
    register: (name, tool) => {
      tools.set(name, tool);
    },
    get: (name) => tools.get(name),
    list: () => [...tools.keys()],
    entries: () => [...tools.entries()],
  };
}
```

The registry doesn't own any policy. It's a map with a typed interface. Whoever calls `register` decides what gets in.

### The builtins helper

```ts title="src/registry.ts (additions)"
import type { Sandbox } from "./sandbox";
import { createReadTool, createGrepTool, createBashTool, createTaskTool, createAskUserTool, createTodoTool, createLoadSkillTool } from "./tools";
import { createApproval } from "./approval";
import type { Skill } from "./skills";

export function registerBuiltins(
  registry: ToolRegistry,
  sandbox: Sandbox,
  skills: Skill[],
) {
  registry.register("read", createReadTool(sandbox));
  registry.register("grep", createGrepTool(sandbox));
  registry.register(
    "bash",
    createBashTool(sandbox, createApproval({ mode: "interactive" })),
  );
  registry.register(
    "task",
    createTaskTool(sandbox, {
      read: registry.get("read")!,
      grep: registry.get("grep")!,
    }),
  );
  registry.register("askUser", createAskUserTool());
  registry.register("todo", createTodoTool());
  registry.register("loadSkill", createLoadSkillTool(skills));
}
```

The order matters here. `task` needs `read` and `grep` to already exist in the registry, since it spawns subagents that use them. Get the order wrong and you'll register `task` with undefined references.

### The wrapper

```ts title="src/registry.ts (additions)"
import { tool, type Tool } from "ai";

interface WrapHooks {
  beforeExecute?: (input: any) => any | Promise<any>;
  afterExecute?: (result: any) => any | Promise<any>;
}

export function wrapTool(base: Tool, hooks: WrapHooks): Tool {
  return tool({
    description: base.description,
    inputSchema: base.inputSchema,
    execute: async (input) => {
      const transformed = hooks.beforeExecute ? await hooks.beforeExecute(input) : input;
      const result = await base.execute(transformed);
      return hooks.afterExecute ? await hooks.afterExecute(result) : result;
    },
  });
}
```

`beforeExecute` can rewrite the input. `afterExecute` can post-process the output. Either is optional. The base tool stays unchanged, so a project can wrap a built-in without breaking other consumers of that built-in.

### Wire it into the CLI

```ts title="index.ts (changes)"
import { createRegistry, registerBuiltins } from "./src/registry";

const registry = createRegistry();
registerBuiltins(registry, sandbox, skills);

registry.register("deploy", tool({
  description: `Deploy the project to a target environment.
WHEN TO USE: pushing changes to staging or production.
WHEN NOT TO USE: testing changes (use bash with the test runner instead).`,
  inputSchema: z.object({
    environment: z.enum(["staging", "production"]),
  }),
  execute: async ({ environment }) => {
    const { stdout } = await sandbox.exec(`vercel deploy --${environment}`);
    return stdout;
  },
}));

const agent = new ToolLoopAgent({
  // ...
  tools: Object.fromEntries(registry.entries()),
  instructions: buildSystemPrompt({
    // ...
    toolNames: registry.list(),
  }),
});
```

The agent's `tools` field is now derived from the registry. Adding a new tool is a single `registry.register(...)` call somewhere before the agent gets built. Removing a tool is one line.

### Wrapping bash for a project

This is what `wrapTool` earns its place doing:

```ts title="index.ts (sketch)"
const baseBash = registry.get("bash")!;
registry.register("bash", wrapTool(baseBash, {
  beforeExecute: (input) => {
    if (input.command.startsWith("bun test")) {
      return { ...input, command: input.command + " --reporter=spec" };
    }
    return input;
  },
}));
```

The base `bash` is still in memory; the registry now holds a wrapped version that adds project-specific tweaks. The agent never sees the unwrapped one. The harness core never changed.

\*\*Note: The extension surface table\*\*

| Surface       | What you can customize    | How                                      |
| ------------- | ------------------------- | ---------------------------------------- |
| Tools         | Add, remove, wrap         | Registry plus `wrapTool`                 |
| Skills        | Add specialized knowledge | `skills/` directory plus `loadSkill`     |
| Sandbox       | Custom backends           | `createSandbox` factory                  |
| Approval      | Custom policies           | Config plus events (next lesson)         |
| System prompt | Custom sections           | `PromptContext` plus `buildSystemPrompt` |
| Model         | Per-role models           | Subagent definitions                     |

Each row maps to code you've already written. The registry is the entry point for the first row. The rest are extension surfaces too, each with their own conventions.

## Try It

Add a tiny project-specific tool to confirm the seam:

```ts title="index.ts (after registerBuiltins)"
registry.register("now", tool({
  description: "Return the current timestamp",
  inputSchema: z.object({}),
  execute: async () => new Date().toISOString(),
}));
```

Run a task that uses it:

```bash title="Terminal"
bun run index.ts . "What's the current timestamp? Use the now tool."
```

The agent should call `now` and return the timestamp. Remove the `register` line, run the same prompt, and the agent should report that `now` doesn't exist.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/registry.ts index.ts
git commit -m "feat(registry): tool registry with wrapTool composition"
```

## Done-When

- [ ] `createRegistry` returns a working registry
- [ ] `registerBuiltins` wires the seven built-in tools
- [ ] `wrapTool` composes hooks around a base tool
- [ ] The agent's `tools` field is built from `registry.entries()`
- [ ] A custom tool registered after `registerBuiltins` is callable by the agent
- [ ] `npx tsc --noEmit` passes

\*\*Note: Replace, don't wrap\*\*

Wrapping a tool keeps the base unchanged. Replacing one removes it entirely. Add `registry.unregister(name)` and a pattern where a project can swap the built-in `bash` for a project-specific version with a smaller safe-prefix list. Where does the replacement need to happen in the bootstrap order? What breaks if a replacement happens after the agent is built?

## Solution

See the full code blocks above.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
