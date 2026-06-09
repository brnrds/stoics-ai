---
title: "Executor Subagent"
description: "A full-capability subagent for implementation. Delegated trust, stronger model, larger step budget."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/executor-subagent"
md_url: "https://vercel.com/academy/build-ai-agent-harness/executor-subagent.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:03.007Z"
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

# Executor Subagent

# Executor Subagent

The explorer gathers information. The executor acts on it.

The two roles split along the same line that delegation splits the agent itself. Exploration is cheap, read-only, and high-volume. Execution is more expensive, can modify files, and needs a stronger model because the cost of getting it wrong is higher.

The executor inherits trust from the parent. The parent decides what the executor is allowed to do, the executor follows the instructions precisely, and neither role asks the user anything. That stays with the parent.

## Outcome

A second branch in your task tool spawns an executor subagent with `read`, `grep`, and a delegated-mode `bash`, using `claude-sonnet-4-6` and a 15-step budget. The parent can now choose between explorer and executor when delegating.

## Fast Track

1. Extend the `task` tool schema with a `subagentType: "explorer" | "executor"` field
2. Add an executor branch that uses a stronger model, larger step budget, and a delegated-mode bash
3. Update the description to make the routing legible to the parent

## Hands-on Exercise 6.3

Add the executor role and route to it from the `task` tool.

**Requirements:**

1. Add `subagentType` to the task tool's input schema as an enum of `"explorer" | "executor"`, defaulting to `"explorer"`
2. When `subagentType === "executor"`, instantiate a `ToolLoopAgent` with `read`, `grep`, and a delegated-mode `bash`
3. The executor uses `claude-sonnet-4-6` and `stopWhen: stepCountIs(15)`
4. Build the executor's `bash` with `createApproval({ mode: "delegated", trust: [...] })`, passing a small trust list (`"npm test"`, `"npm run build"`, `"npx tsc"`)
5. Update the task tool description to explain both roles to the parent

**Implementation hints:**

- The executor needs its own `bash` tool with delegated-mode approval. Don't reuse the parent's interactive bash, since interactive mode pauses for a user prompt that the executor cannot answer
- Sonnet is the right default for executor work. Opus is overkill for most implementation tasks and slow enough to feel it
- The trust list is small on purpose. The executor should only run the commands the parent has decided are safe. Test runners and build commands are usually safe. Package installs and migrations are not

### The executor branch

```ts title="src/tools.ts (extended task tool)"
export function createTaskTool(
  sandbox: Sandbox,
  parentTools: { read: any; grep: any },
) {
  return tool({
    description: `Delegate work to a subagent.
Explorer (default): read-only research with a fast model.
Executor: implementation with a stronger model and delegated trust on bash.

WHEN TO USE: research across many files (explorer), bulk implementation (executor).
WHEN NOT TO USE: ambiguous requirements (use askUser),
  architectural decisions (the parent decides).`,
    inputSchema: z.object({
      description: z.string().describe("Task instructions for the subagent"),
      subagentType: z
        .enum(["explorer", "executor"])
        .default("explorer")
        .describe("Subagent role"),
    }),
    execute: async ({ description, subagentType }) => {
      if (subagentType === "executor") {
        const executorBash = createBashTool(
          sandbox,
          createApproval({
            mode: "delegated",
            trust: ["npm test", "npm run build", "npx tsc"],
          }),
        );

        const executor = new ToolLoopAgent({
          model: "anthropic/claude-sonnet-4-6",
          instructions: `You are an executor agent. Follow instructions precisely.
Working directory: ${sandbox.workingDirectory}
Do NOT ask questions. Do NOT explore beyond what's needed. Execute the task.`,
          tools: {
            read: parentTools.read,
            grep: parentTools.grep,
            bash: executorBash,
          },
          stopWhen: stepCountIs(15),
        });

        try {
          const { text, steps } = await executor.generate({ prompt: description });
          return text
            ? `[Executor: ${steps.length} steps]\n${text}`
            : "(no response from executor)";
        } catch (e: any) {
          return `Executor error: ${e.message}`;
        }
      }

      const explorer = new ToolLoopAgent({
        model: "anthropic/claude-haiku-4-5",
        instructions: `You are an explorer agent. Investigate and report back concisely.
Working directory: ${sandbox.workingDirectory}`,
        tools: { read: parentTools.read, grep: parentTools.grep },
        stopWhen: stepCountIs(5),
      });

      try {
        const { text, steps } = await explorer.generate({ prompt: description });
        return text
          ? `[Explorer: ${steps.length} steps]\n${text}`
          : "(no response from explorer)";
      } catch (e: any) {
        return `Explorer error: ${e.message}`;
      }
    },
  });
}
```

### Explorer vs. executor at a glance

|              | Explorer           | Executor                           |
| ------------ | ------------------ | ---------------------------------- |
| Tools        | `read`, `grep`     | `read`, `grep`, `bash` (delegated) |
| Model        | `claude-haiku-4-5` | `claude-sonnet-4-6`                |
| Step budget  | 5                  | 15                                 |
| Can modify   | No                 | Yes (within trust list)            |
| Can ask user | No                 | No                                 |

The two roles diverge in tool capability, model strength, and budget. They agree on one thing: neither can ask the user a question. That responsibility stays with the parent, which is the role that has the human in the loop.

### Instruction quality matters more for the executor

The explorer is mostly looking around. A vague description still produces something useful. The executor follows instructions literally. A vague description gets you a vague (and possibly destructive) result.

Bad:

```
Fix the auth bug.
```

Good:

```
In src/auth.ts, the login function at line 42 doesn't check for null email.
Add a null check before the database query. Run `npx tsc --noEmit` after the change.
```

The parent's job is to provide goal, procedure, constraints, and verification steps. The executor's job is to follow them. The system prompt's "Do NOT ask questions" line is doing real work here. It forces the executor to either act on what it has or fail, instead of stalling for clarification.

\*\*Note: Delegated trust, not blanket trust\*\*

The executor's `bash` uses `mode: "delegated"` from Module 2's approval config. The parent decides which commands are trusted. The executor can run `npm test`. It cannot run `npm install`, `rm -rf`, or anything else not on the list. This is the use case that justified the discriminated union in the first place.

## Try It

Ask the parent to delegate something that needs action, not just research:

```bash title="Terminal"
bun run index.ts . "Delegate to an executor: rename the 'cwd' variable in src/sandbox-local.ts to 'workingDir'. Then run npx tsc --noEmit and report the result."
```

The parent should call `task` with `subagentType: "executor"`. The executor should make the change, run the typecheck, and return a summary. Compare what you'd get from the same task with explorer mode (it can't change anything).

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/tools.ts
git commit -m "feat(subagents): add executor role with delegated bash"
```

## Done-When

- [ ] `task` tool schema includes `subagentType: "explorer" | "executor"`
- [ ] Executor uses `claude-sonnet-4-6` and a 15-step budget
- [ ] Executor has its own `bash` in `mode: "delegated"`, with a small trust list
- [ ] Executor follows precise instructions and does not ask questions
- [ ] Explorer behavior is unchanged from the previous lesson
- [ ] `npx tsc --noEmit` passes

\*\*Note: Inherit trust from the parent\*\*

The executor's trust list is hardcoded right now. Try threading the parent's trust list through: when the parent spawns an executor, the executor gets the parent's safe commands. Now think about the boundary. Should the executor be allowed to spawn another executor with the same trust? Or should each level shrink the trust set? Production harnesses do this differently, and the answer depends on how much you trust the agent's planning.

## Solution

See the `createTaskTool` code block above for the full implementation. The exercise's solution is the same code, applied to your `src/tools.ts`.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
