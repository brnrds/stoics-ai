---
title: "Task Tool"
description: "Route delegations through one task tool, with per-role models and the shape for spawn permissions."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/task-tool"
md_url: "https://vercel.com/academy/build-ai-agent-harness/task-tool.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:03.507Z"
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

# Task Tool

# Task Tool

You already have most of the task tool. Lessons 6.2 and 6.3 built the explorer and executor branches inside its `execute` function.

This lesson is about treating the tool as the routing layer it actually is. The parent calls `task`. The tool picks the right subagent type, validates the parent's permission to spawn it, and returns the result. Adding more roles later (a reviewer, an architect, a verifier) should be a matter of adding a branch, not redesigning the tool.

## Outcome

The `task` tool is structured as an explicit router with one consolidated description, role-specific models, and a clear place for spawn-permission checks when you need them.

## Fast Track

1. Tighten the `task` tool description so the parent knows when to pick which role
2. Extract the subagent construction into a small helper so adding roles later is one block
3. Sketch the shape of a spawn-permissions check, even if you don't enforce it yet

## Hands-on Exercise 6.4

Refactor `createTaskTool` so the routing is the first thing you see, with the role-specific construction below.

**Requirements:**

1. The task tool's description names both roles, says what each is good for, and points the parent at `askUser` and direct work for the cases that aren't delegation
2. The `execute` body is a thin router. Each role is built by a separate helper function inside the same file
3. Each role helper takes the sandbox and parent tools, returns a `ToolLoopAgent`, and exposes the model and step budget at the top of its definition
4. Keep error handling as a string return, not a thrown exception

**Implementation hints:**

- The two helpers can share a generate-and-format function so the `[Role: N steps]` formatting lives in one place
- Don't over-abstract. Two helpers and a router is enough. A registry-and-factory system is the right move when you have five roles, not two
- The description is what the parent reads. WHEN TO USE and WHEN NOT TO USE work for the routing layer too, not just individual tools

### The router shape

```ts title="src/tools.ts (refactored task tool)"
function buildExplorer(sandbox: Sandbox, parentTools: { read: any; grep: any }) {
  return new ToolLoopAgent({
    model: "anthropic/claude-haiku-4-5",
    instructions: `You are an explorer agent. Investigate and report back concisely.
Working directory: ${sandbox.workingDirectory}`,
    tools: { read: parentTools.read, grep: parentTools.grep },
    stopWhen: stepCountIs(5),
  });
}

function buildExecutor(sandbox: Sandbox, parentTools: { read: any; grep: any }) {
  const executorBash = createBashTool(
    sandbox,
    createApproval({
      mode: "delegated",
      trust: ["npm test", "npm run build", "npx tsc"],
    }),
  );
  return new ToolLoopAgent({
    model: "anthropic/claude-sonnet-4-6",
    instructions: `You are an executor agent. Follow instructions precisely.
Working directory: ${sandbox.workingDirectory}
Do NOT ask questions. Do NOT explore beyond what's needed. Execute the task.`,
    tools: { read: parentTools.read, grep: parentTools.grep, bash: executorBash },
    stopWhen: stepCountIs(15),
  });
}

async function runSubagent(role: string, agent: ToolLoopAgent, description: string) {
  try {
    const { text, steps } = await agent.generate({ prompt: description });
    return text ? `[${role}: ${steps.length} steps]\n${text}` : `(no response from ${role})`;
  } catch (e: any) {
    return `${role} error: ${e.message}`;
  }
}

export function createTaskTool(
  sandbox: Sandbox,
  parentTools: { read: any; grep: any },
) {
  return tool({
    description: `Delegate work to a subagent.
Explorer (default): read-only research with Haiku. Use for searching across files,
  understanding patterns, and gathering context.
Executor: implementation with Sonnet and delegated bash. Use for focused
  changes with explicit instructions and a known verification step.

WHEN TO USE: research across many files (explorer), bulk implementation (executor).
WHEN NOT TO USE: ambiguous requirements (use askUser), architectural decisions
  (the parent decides).
DO NOT USE FOR: single-step tasks the parent can do directly.`,
    inputSchema: z.object({
      description: z.string().describe("Task instructions for the subagent"),
      subagentType: z
        .enum(["explorer", "executor"])
        .default("explorer")
        .describe("Subagent role"),
    }),
    execute: async ({ description, subagentType }) => {
      const agent =
        subagentType === "executor"
          ? buildExecutor(sandbox, parentTools)
          : buildExplorer(sandbox, parentTools);
      return runSubagent(subagentType, agent, description);
    },
  });
}
```

The router is now five lines. Everything else is per-role construction.

### Where spawn permissions go

Right now any agent can call `task` with any `subagentType`. That's fine for a starter harness. In a more layered setup, you'd want a per-role permission map:

```ts title="src/tools.ts (sketch)"
const SPAWN_PERMISSIONS: Record<string, string[]> = {
  orchestrator: ["explorer", "executor", "reviewer"],
  executor: ["explorer"],
  explorer: [],
};

function canSpawn(parentRole: string, subagentType: string): boolean {
  return SPAWN_PERMISSIONS[parentRole]?.includes(subagentType) ?? false;
}
```

The check goes at the top of `execute`. If the spawn isn't permitted, return an error string and don't build the subagent.

We're not adding that to the working harness yet, because the parent doesn't have a role at this point. When you start using subagents that themselves call `task`, the permissions table is the next thing you'll want. Until then, the absence is fine and the shape is documented.

### Model per role, not model per session

The model is part of the role definition, not a global setting:

| Role                 | Model  | Why                             |
| -------------------- | ------ | ------------------------------- |
| Explorer             | Haiku  | Fast, cheap, read-only          |
| Executor             | Sonnet | Reliable for implementation     |
| Reviewer (later)     | Opus   | Heavy reasoning for code review |
| Orchestrator (later) | Sonnet | Multi-tool routing              |

Different roles, different models. Don't pick one model and use it everywhere. The cost difference compounds across a long task, and the failure modes are different too.

\*\*Note: Two roles is the right starting point\*\*

You can build a fancier hierarchy: architect, planner, reviewer, integrator. We're not doing it because two roles cover the work most harnesses care about. Add more when you have a real task that needs them. Don't add them speculatively. Each role is a new place for instructions to drift and a new model bill to track.

## Try It

Ask the parent to delegate two pieces of work in sequence: research first, then implementation:

```bash title="Terminal"
bun run index.ts . "First, delegate to an explorer: find every file that uses the zod schema for tools. Then delegate to an executor: in those files, add a comment above each tool() call saying which lesson introduced it."
```

You should see two task calls from the parent. The first returns a list of files. The second performs the edits and reports back.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/tools.ts
git commit -m "refactor(subagents): split task tool into router and role helpers"
```

## Done-When

- [ ] `createTaskTool` is a thin router that dispatches by `subagentType`
- [ ] Each role lives in a separate helper (`buildExplorer`, `buildExecutor`)
- [ ] The task tool description names both roles and the right time to use each
- [ ] Errors return as strings, not exceptions
- [ ] Adding a third role would be a new helper and a new branch, nothing more
- [ ] `npx tsc --noEmit` passes

\*\*Note: Add a reviewer role\*\*

Try adding a `reviewer` subagent: read-only tools, Opus-level model, plus a `verdict` tool that returns `pass` or `fail` with feedback. After an executor finishes, automatically spawn a reviewer with the original task and the executor's diff. If the reviewer fails, re-run the executor with the feedback appended. Cap the retry count at two. What model combination produces the best review quality? When does the reviewer rubber-stamp instead of catching real problems?

## Solution

See the router shape above. The exercise solution is the same code, applied to your `src/tools.ts`.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
