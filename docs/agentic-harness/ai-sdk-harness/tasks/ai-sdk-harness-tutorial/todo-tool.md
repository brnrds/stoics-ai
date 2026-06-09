---
title: "Todo Tool"
description: "Task decomposition with pending, in_progress, and completed state tracking, and a single-active-item constraint."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/todo-tool"
md_url: "https://vercel.com/academy/build-ai-agent-harness/todo-tool.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:06.391Z"
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

# Todo Tool

# Todo Tool

If you give the agent a complicated task and watch it work, you'll notice it does the same thing humans do under pressure: it starts five things at once, finishes none of them, and then explains what it was about to do.

The fix is the same one that works for humans. Make a list. Pick one thing. Finish it. Cross it off. Pick the next thing.

The todo tool is that list, with one rule the agent can't argue with: only one item is in progress at a time.

## Outcome

A `todo` tool with `add`, `start`, `complete`, and `list` actions, backed by an in-memory list. Multi-step tasks get decomposed and tracked. Single-step tasks skip the tool entirely.

## Fast Track

1. Add a `todo` tool with `add`, `start`, `complete`, and `list`
2. Track items in an in-memory array with `pending`, `in_progress`, and `completed` states
3. Reject `start` when another item is already in progress

## Hands-on Exercise 9.1

Build the tool and verify the one-active-at-a-time constraint.

**Requirements:**

1. `todo` tool accepts an `action` enum and optional `description` and `id`
2. `add` creates a new item with a short generated id, `pending` state, and the given description
3. `start` rejects if another item is `in_progress`. Otherwise it sets the named item to `in_progress`
4. `complete` marks the named item `completed`
5. `list` returns the items as a multi-line string with state labels

**Implementation hints:**

- The state lives in module scope. The same agent run shares one list. A new run starts fresh
- `crypto.randomUUID().slice(0, 8)` is enough id for an in-memory list. You don't need a serial counter
- Keep the rejection message specific: "Already working on: \[id] description. Complete it first."

### The tool

```ts title="src/tools.ts (additions)"
interface TodoItem {
  id: string;
  description: string;
  state: "pending" | "in_progress" | "completed";
}

const todos: TodoItem[] = [];

export function createTodoTool() {
  return tool({
    description: `Manage a task list for multi-step work.
WHEN TO USE: tasks with 3+ steps, multiple files, or dependencies between
  changes. Plan once, then track progress as you go.
WHEN NOT TO USE: single-file fixes, simple questions, exploratory reads.
DO NOT USE FOR: status updates to the user (just answer them directly).`,
    inputSchema: z.object({
      action: z.enum(["add", "start", "complete", "list"]),
      description: z.string().optional(),
      id: z.string().optional(),
    }),
    execute: async ({ action, description, id }) => {
      if (action === "add") {
        const item: TodoItem = {
          id: crypto.randomUUID().slice(0, 8),
          description: description ?? "(unnamed)",
          state: "pending",
        };
        todos.push(item);
        return `Added: [${item.id}] ${item.description}`;
      }

      if (action === "start") {
        const active = todos.find((t) => t.state === "in_progress");
        if (active) {
          return `Already working on: [${active.id}] ${active.description}. Complete it first.`;
        }
        const next = todos.find((t) => t.id === id);
        if (next) {
          next.state = "in_progress";
          return `Started: [${next.id}] ${next.description}`;
        }
        return `No todo with id ${id}.`;
      }

      if (action === "complete") {
        const item = todos.find((t) => t.id === id);
        if (item) {
          item.state = "completed";
          return `Completed: [${item.id}] ${item.description}`;
        }
        return `No todo with id ${id}.`;
      }

      return todos
        .map((t) => `[${t.state}] ${t.id}: ${t.description}`)
        .join("\n") || "No todos.";
    },
  });
}
```

The single-active rule is the load-bearing part. Without it, the agent will start every item up front and then race through them in parallel, losing focus on each one.

### Wire it in

```ts title="index.ts"
const tools = {
  // ...everything else
  todo: createTodoTool(),
};
```

The system prompt's Agency and Guardrails sections already steer the agent toward acting. The tool's WHEN TO USE description is what tells it when to plan first instead of diving in.

### When to plan, when not to

| Plan first                           | Skip the planner                          |
| ------------------------------------ | ----------------------------------------- |
| 3 or more steps to complete the task | One file change with a known location     |
| Multiple files affected              | A simple question that doesn't need files |
| Dependencies between changes         | Exploration with no specific outcome yet  |
| User asked for a multi-part feature  | Bug fix with a precise error message      |

If the agent makes a todo list for a one-line typo fix, that's a sign the description is steering too aggressively. Tighten WHEN NOT TO USE.

\*\*Note: The list lives in memory, on purpose\*\*

The todos array doesn't persist across runs. That's deliberate. A long-lived list across sessions tends to grow into a junk drawer of stale items. If you want persistence later, snapshot the list to a file at session end. Don't carry stale `in_progress` items into a new session, since the agent has no memory of why they were started.

## Try It

Run a multi-part task and watch the planning happen:

```bash title="Terminal"
bun run index.ts . "Add a 'verify' npm script that runs typecheck, lint, and tests in sequence. Then run it and report the result."
```

You should see the agent call `todo add` two or three times to build the plan, then `todo start` and `todo complete` as it works through the items. The list should never have two items in `in_progress`.

Run a simple task to confirm the agent skips the tool:

```bash title="Terminal"
bun run index.ts . "What does the cwd variable in src/sandbox-local.ts do?"
```

The agent should answer without ever calling `todo`. If it makes a todo for a one-step question, the description is being too eager.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add src/tools.ts index.ts
git commit -m "feat(planning): add todo tool with single-active constraint"
```

## Done-When

- [ ] `todo` tool is wired and accepts `add`, `start`, `complete`, `list`
- [ ] Only one item is `in_progress` at a time
- [ ] Multi-step tasks get decomposed
- [ ] Single-step tasks don't trigger the tool
- [ ] `npx tsc --noEmit` passes

\*\*Note: Add dependencies\*\*

Right now items are independent. Try adding `dependsOn: string[]` to each item, listing the ids of items that must be complete first. The `start` action should reject if any dependency is still pending or in progress. Now multi-step tasks can express real ordering: "rename the function" depends on "find every caller." Where does this start to feel like overkill?

## Solution

See `createTodoTool` above. The exercise solution is the same code, applied to your `src/tools.ts`.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
