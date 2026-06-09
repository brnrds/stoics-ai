---
title: "Build Your Own AI Coding Agent Harness"
description: "Build an AI coding agent harness from scratch using AI SDK, Vercel Sandbox, and just-bash. Covers the tool loop, tool design, system prompts, sandbox abstraction, context pruning, subagent delegation, lifecycle management, and extensibility."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness"
md_url: "https://vercel.com/academy/build-ai-agent-harness.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:41.791Z"
content_type: "course"
lessons: 38
estimated_time: 
lesson_urls:
  - "https://vercel.com/academy/build-ai-agent-harness/from-chat-to-agent.md"
  - "https://vercel.com/academy/build-ai-agent-harness/your-first-tools.md"
  - "https://vercel.com/academy/build-ai-agent-harness/completing-the-toolbox.md"
  - "https://vercel.com/academy/build-ai-agent-harness/descriptions-that-work.md"
  - "https://vercel.com/academy/build-ai-agent-harness/shell-execution-with-safety.md"
  - "https://vercel.com/academy/build-ai-agent-harness/approval-gates.md"
  - "https://vercel.com/academy/build-ai-agent-harness/structuring-agent-instructions.md"
  - "https://vercel.com/academy/build-ai-agent-harness/dynamic-prompt-construction.md"
  - "https://vercel.com/academy/build-ai-agent-harness/verification-gates.md"
  - "https://vercel.com/academy/build-ai-agent-harness/project-context.md"
  - "https://vercel.com/academy/build-ai-agent-harness/designing-the-interface.md"
  - "https://vercel.com/academy/build-ai-agent-harness/local-implementation.md"
  - "https://vercel.com/academy/build-ai-agent-harness/in-memory-implementation.md"
  - "https://vercel.com/academy/build-ai-agent-harness/cloud-implementation.md"
  - "https://vercel.com/academy/build-ai-agent-harness/lifecycle-hooks.md"
  - "https://vercel.com/academy/build-ai-agent-harness/the-problem.md"
  - "https://vercel.com/academy/build-ai-agent-harness/pruning-old-results.md"
  - "https://vercel.com/academy/build-ai-agent-harness/tool-output-design.md"
  - "https://vercel.com/academy/build-ai-agent-harness/cache-control.md"
  - "https://vercel.com/academy/build-ai-agent-harness/why-delegate.md"
  - "https://vercel.com/academy/build-ai-agent-harness/explorer-subagent.md"
  - "https://vercel.com/academy/build-ai-agent-harness/executor-subagent.md"
  - "https://vercel.com/academy/build-ai-agent-harness/task-tool.md"
  - "https://vercel.com/academy/build-ai-agent-harness/state-machine.md"
  - "https://vercel.com/academy/build-ai-agent-harness/snapshot-and-restore.md"
  - "https://vercel.com/academy/build-ai-agent-harness/durable-workflows.md"
  - "https://vercel.com/academy/build-ai-agent-harness/hard-won-lessons.md"
  - "https://vercel.com/academy/build-ai-agent-harness/structured-questions.md"
  - "https://vercel.com/academy/build-ai-agent-harness/approval-config.md"
  - "https://vercel.com/academy/build-ai-agent-harness/todo-tool.md"
  - "https://vercel.com/academy/build-ai-agent-harness/fast-context-understanding.md"
  - "https://vercel.com/academy/build-ai-agent-harness/verification-contract.md"
  - "https://vercel.com/academy/build-ai-agent-harness/cli-entry-point.md"
  - "https://vercel.com/academy/build-ai-agent-harness/streaming-and-tool-rendering.md"
  - "https://vercel.com/academy/build-ai-agent-harness/web-surface.md"
  - "https://vercel.com/academy/build-ai-agent-harness/skills-system.md"
  - "https://vercel.com/academy/build-ai-agent-harness/custom-tools.md"
  - "https://vercel.com/academy/build-ai-agent-harness/extension-points.md"
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

# Build Your Own AI Coding Agent Harness

A tool loop with three tools is a demo. The problems start when you try to use it for real work. You read a 5,000-line file and it stays in context forever. You give it `bash` and it runs `rm -rf`. You ask it to refactor a module and it explains how to refactor a module. One long task fills the context window and the agent loses its own instructions. The cloud sandbox costs money per minute and your code disappears when it times out.

**Harness** is the word for the system around the agent that handles all of this. This course builds `TeensyCode` from scratch.

### What You'll Build

`TeensyCode` is a working AI coding agent harness with a compact TypeScript core, a real toolset, and multiple sandbox backends. Something you understand completely because you built every piece:

- **The loop:** `ToolLoopAgent` with `read`, `grep`, `write`, `edit`, `bash`, `task`, and `askUser` tools
- **Safety gates:** Execute-level safety with safe-command allowlists, evolving into configurable approval (interactive, background, delegated)
- **Behavioral prompts:** A structured system prompt with Agency, Guardrails, and Handling Ambiguity sections, plus `AGENTS.md` injection for per-project configuration
- **Sandbox abstraction:** One `Sandbox` interface, two implementations: local (Node fs and child\_process) and in-memory (just-bash with a copy-on-write virtual filesystem). Swap the backend, the tools don't change
- **Context management:** `pruneMessages`, bounded tool output, and cache control to keep long-running sessions usable and affordable
- **Subagent delegation:** Explorer and executor roles with isolated context, constrained tools, and a model picked per job
- **Human-in-the-loop:** `askUser` with multiple-choice options and an ambiguity protocol that prefers search, then questions, then action
- **Sandbox lifecycle:** State-machine thinking, snapshot and restore, and durable workflow concepts
- **Extensibility:** Event bus, skills with progressive disclosure, and custom tool registration

### Prerequisites

- TypeScript, async/await, basic terminal experience
- An `AI_GATEWAY_API_KEY` environment variable
- Node.js 20+ or Bun runtime
- Recommended: [Building Filesystem Agents](https://vercel.com/academy/filesystem-agents) course

### How The Course Works

**Causal sequence.** Each step exists because the previous one broke something. Step 1 adds `read` because the chatbot can't see files. Step 2 adds `grep` because the agent can't search. Step 3 adds `bash` because it can't run commands, but now it can `rm -rf`. Each step spotlights one concept while the rest stays runnable.

**Modules 1 through 6** are build-along. You write code, run it, verify. **Module 7** is concept and analysis (sandbox lifecycle involves durable workflows and state machines you can't safely demo locally). **Modules 8 through 11** mix building and analysis.

***

## Course Modules

### Module 1: The Agent Loop

Build a `ToolLoopAgent` from zero tools (a chatbot) to `read` and `grep` (an agent) to `bash` with safety gates.

- [From Chat to Agent](./from-chat-to-agent), where one tool turns a chatbot into an agent
- [Your First Tools](./your-first-tools), where tool descriptions become the model selection API
- [Completing the Toolbox](./completing-the-toolbox), where dangerous tools get execute-level gates

### Module 2: Tool Design

Evolve descriptions into a 5-section contract, extract the factory pattern, and build configurable approval.

- [Descriptions That Work](./descriptions-that-work): WHEN TO USE, WHEN NOT TO USE, DO NOT USE FOR, EXAMPLES
- [Shell Execution with Safety](./shell-execution-with-safety): factory plus operations separates contract from execution
- [Approval Gates](./approval-gates): boolean to function to discriminated union

### Module 3: The System Prompt

Shape behavior with structured instructions, dynamic composition, verification gates, and `AGENTS.md`.

- [Structuring Agent Instructions](./structuring-agent-instructions): Agency plus Guardrails, act don't explain
- [Dynamic Prompt Construction](./dynamic-prompt-construction): `buildSystemPrompt()` adapts to runtime context
- [Verification Gates](./verification-gates): typecheck, lint, test, build contract
- [Project Context](./project-context): drop an `AGENTS.md`, change the agent

### Module 4: The Sandbox Abstraction

One interface, three implementations. Tools call `sandbox.exec()`, not `child_process.exec()`.

- [Designing the Interface](./designing-the-interface): the `Sandbox` type with `readFile`, `exec`, `stop`
- [Local Implementation](./local-implementation): Node fs plus child\_process wrapper
- [In-Memory Implementation](./in-memory-implementation): just-bash with a copy-on-write overlay
- [Cloud Implementation](./cloud-implementation): remote VM concept and tradeoffs
- [Lifecycle Hooks](./lifecycle-hooks): `afterStart`, `beforeStop`, `onTimeout`

### Module 5: Context Management

Every tool call stays in context forever. Fix it with pruning, bounded output, and cache control.

- [The Problem](./the-problem): token logging shows linear growth
- [Pruning Old Results](./pruning-old-results): `pruneMessages` keeps stale tool output from piling up
- [Tool Output Design](./tool-output-design): prevention over cleanup, with bounded caps on every tool
- [Cache Control](./cache-control): provider headers reduce repeated context costs

### Module 6: Subagent Delegation

Parent plans, subagents execute. Isolated context, constrained tools, role-based models.

- [Why Delegate](./why-delegate): single-agent failure modes
- [Explorer Subagent](./explorer-subagent): read-only, cheap model, constrained exploration
- [Executor Subagent](./executor-subagent): full tools, stronger model, delegated trust
- [Task Tool](./task-tool): routing, permissions, model per role

### Module 7: Sandbox Lifecycle

Cloud sandboxes cost money and time out. Concept and analysis module.

- [State Machine](./state-machine): state transitions, timeouts, and activity tracking
- [Snapshot and Restore](./snapshot-and-restore): freeze, restore, and idempotency hazards
- [Durable Workflows](./durable-workflows): Vercel Workflow with `sleep()`
- [Hard-Won Lessons](./hard-won-lessons): production gotchas from lifecycle work

### Module 8: Human-in-the-Loop

Agents that guess wrong waste more time than agents that ask.

- [Structured Questions](./structured-questions): `askUser` with multiple choice and an ambiguity protocol
- [Approval Config](./approval-config): config for modes, events for policies

### Module 9: Planning and Verification

Plan before acting, verify after acting.

- [Todo Tool](./todo-tool): task decomposition with state tracking
- [Fast Context Understanding](./fast-context-understanding): grep first, read only what you'll change
- [Verification Contract](./verification-contract): gate sequence with scoped claims

### Module 10: Surfaces

The agent is headless. CLI, TUI, and web are rendering strategies.

- [CLI Entry Point](./cli-entry-point): args, sandbox factory, clean shutdown
- [Streaming and Tool Rendering](./streaming-and-tool-rendering): real-time text plus tool call display
- [Web Surface](./web-surface): same agent, different renderer

### Module 11: Extensibility

Events, not inheritance. Skills as progressive disclosure. Tools as registrations.

- [Skills System](./skills-system): names in the prompt, full content on demand
- [Custom Tools](./custom-tools): register without forking, compose existing tools
- [Extension Points](./extension-points): lifecycle events for subscribe, block, modify

***

### Capstone

Run your harness against a real project. Not "add a hello world endpoint" but "add rate limiting to the auth routes." Watch where context overflows. Watch where it picks the wrong tool. Watch where the subagent gets bad instructions. Fix what breaks.

## Tech Stack

| Component                                                   | Purpose                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| [AI SDK](https://sdk.vercel.ai)                             | `ToolLoopAgent`, `tool()`, `stepCountIs`, `pruneMessages`, streaming  |
| [AI Gateway](https://vercel.com/ai-gateway)                 | Model routing. `"anthropic/claude-haiku-4-5"` as a string, no wrapper |
| [Vercel Sandbox](https://vercel.com/docs/functions/sandbox) | Remote VM with an isolated filesystem, git, and npm                   |
| [just-bash](https://www.npmjs.com/package/just-bash)        | In-memory virtual filesystem and simulated bash                       |
| [Vercel Workflow](https://vercel.com/docs/workflow)         | Durable workflows for sandbox lifecycle                               |
| [Zod v3](https://zod.dev)                                   | Tool input schemas. v4 breaks AI SDK v6 types                         |


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
