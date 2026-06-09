---
title: "Why Delegate"
description: "Single-agent failure modes (context pollution, lost focus, over-broad capabilities) and the situations where delegation earns its keep."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/why-delegate"
md_url: "https://vercel.com/academy/build-ai-agent-harness/why-delegate.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:02.111Z"
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

# Why Delegate

# Why Delegate

You just spent a whole module on context management. Pruning, caps, caching. The agent is better behaved than it was. The problem isn't fully solved.

On a fifty-step task, the agent fails in ways pruning can't catch. Not because the context is too long, but because the work itself is wrong-shaped for one agent to do. Exploration, planning, execution, and verification all bleed into each other. The agent that's exploring becomes the agent that's making changes, with all the context from the exploration still hanging on.

Delegation pulls these apart. The parent decides what to do. Subagents go do it. Each one runs in isolation. The parent gets the answer back, not the journey.

## Outcome

You can describe the three single-agent failure modes that delegation fixes, and you can tell when a task is a good candidate for delegation versus when it's better done in the parent.

## The Failure Modes

These are the kinds of failures that pruning won't catch.

### Context pollution

The agent reads twenty files to understand the codebase. Twenty file contents are now in context. When the agent starts making changes, the files relevant to the change are buried under fifteen files that were useful five steps ago and useless now.

Pruning eventually removes them, but not before they've shoved the actual task off the top of attention.

### Lost focus

By step thirty, the agent has drifted. The system prompt says "refactor the auth module." Somewhere along the way the agent noticed a CSS typo, fixed it, then noticed a sub-optimal import, refactored it, then ended up writing a comment explaining a function it found interesting. The original task is forgotten.

This is what happens when one agent has too many concerns and too much rope.

### Over-broad capabilities

The agent has `write` and `bash`. During exploration, it "helpfully" fixes a typo it noticed in a file it was reading. The fix breaks something else. Exploration shouldn't be allowed to modify anything, but a single agent with the full toolset doesn't know how to draw that line for itself.

## The Pattern

Delegation splits the agent into roles with different tools and different models.

```
Parent
  Plans the work
  Delegates research to an Explorer
  Delegates implementation to an Executor
  Synthesizes results
  Makes architectural decisions

Explorer subagent
  Read and grep only (cannot modify anything)
  Cheap, fast model (Haiku)
  Reports findings, does not act

Executor subagent
  Full tools, including write and bash
  Stronger model (Sonnet or Opus)
  Follows precise instructions from the parent
  Cannot ask user questions (no askUser)
```

The parent is the only agent that asks questions, makes decisions, or holds the long-term plan. Everything else is delegated and scoped.

## When to Delegate

| Delegate                   | Keep in the parent                     |
| -------------------------- | -------------------------------------- |
| Research across many files | Single-file changes                    |
| Parallel independent tasks | Sequential dependent changes           |
| Mechanical bulk work       | Architectural decisions                |
| Exploration before acting  | Ambiguous requirements (use `askUser`) |

The split is about whether the work has a clean handoff shape. Reading thirty files and returning a one-paragraph summary is a clean handoff. Deciding which of three architectural approaches to take is not, because the decision is the work.

\*\*Note: Delegation is not free\*\*

A subagent call is a fresh model run with its own startup tokens, its own system prompt, and its own latency. Don't delegate everything. Delegate the work where the parent benefits from not seeing the full trace. If the parent could do the task in three steps, delegation isn't paying for itself.

## Try It

This is a concept lesson. No code to run. Check yourself:

1. Without looking back, name the three single-agent failure modes
2. Pick one of your own coding tasks from the last week. Which parts of it would have been good explorer work? Which would have been good executor work? Which had to stay with the planner?
3. What would have happened if you'd given that whole task to one agent with all the tools, fifty steps, and no delegation?

## Commit

No code in this lesson. The next lesson builds the explorer.

## Done-When

- [ ] You can name three single-agent failure modes
- [ ] You can describe when delegation helps and when it doesn't
- [ ] You can sketch which parts of a real task would split between parent, explorer, and executor


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
