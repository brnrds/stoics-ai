---
title: "Structuring Agent Instructions"
description: "Add Agency and Guardrails sections to the system prompt, making tool-first behavior explicit and repeatable."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/structuring-agent-instructions"
md_url: "https://vercel.com/academy/build-ai-agent-harness/structuring-agent-instructions.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:56.571Z"
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

# Structuring Agent Instructions

# Structuring Agent Instructions

Right now your system prompt is one line: `You are a coding agent.` That's not a prompt. That's a name tag.

Your tools are doing most of the steering already. The descriptions from Module 2 are strong enough that the agent will probably pick `read` for read tasks and `grep` for searches without much help. So what's the system prompt for?

It's where you write down the policy. Not what the agent *can* do (that's the tools). What the agent *should* do, in what order, with what kind of restraint. A name tag won't carry that. A sectioned prompt will.

## Outcome

`instructions` is a sectioned prompt with explicit Agency and Guardrails blocks. The agent acts on tasks (uses tools, reports results) instead of explaining what it would hypothetically do.

## Fast Track

1. Replace `You are a coding agent.` with a sectioned prompt
2. Add an Agency section: use tools, do not explain, prefer the specialized tool over `bash`
3. Add a Guardrails section: minimal changes, search before creating, no new deps without asking

## Hands-on Exercise 3.1

Rewrite the `instructions` field in `index.ts` to use a structured, multi-section prompt.

**Requirements:**

1. Open with a one-line statement of role and the working directory
2. Add an `# Agency` section telling the agent to act, not explain
3. Add a `# Guardrails` section with constraints (minimal changes, reuse, no new deps)
4. Keep using template literals so the working directory interpolates in

**Implementation hints:**

- Section headers (`# Agency`, `# Guardrails`) make the prompt scannable for both you and the model
- Be explicit with negative instructions ("Do NOT explain what you would do"). Models default to explaining
- Reference your tools by name. The model already has descriptions but pointing at them in the prompt reinforces routing

### The before

```ts title="index.ts"
instructions: `You are a coding agent.\nWorking directory: ${cwd}`,
```

This works. The agent reads files when asked, searches when asked, runs commands when asked. But there's no policy. Ask it to "find all TODO comments and fix them" and the response depends entirely on the model's mood that minute. Maybe it acts. Maybe it produces a plan and waits for you to approve it.

That ambiguity is what the prompt is for.

### The after

```ts title="index.ts"
instructions: `You are a coding agent working in: ${cwd}

# Agency
- USE your tools. Read files, search code, run commands, then answer.
- Do NOT explain what you WOULD do. Actually do it.
- Prefer grep for searching, read for viewing files.
- Use bash only for commands that aren't covered by other tools.

# Guardrails
- Prefer simple, minimal changes
- Search before creating, and reuse existing patterns
- No new dependencies without asking`,
```

Now the policy is written down. The Agency section gives the agent permission and instruction to act. The Guardrails section sets limits.

A few things to notice:

- The "complete the task" instruction is explicit. Without it, agents drift toward explaining. Saying "actually do it" out loud is annoyingly necessary
- The tool preferences live in the prompt as well as the descriptions. The repetition is intentional. We're saying it in two places because models miss it in one
- "No new dependencies without asking" sets up the human-in-the-loop work in Module 8

### What's actually changing

The agent already had the tools. It already had the descriptions. What's new is that the operating policy is now portable. You can copy this prompt to a different agent, with different tools, and the policy still applies. You can A/B test it. You can lift one section out for a subagent.

A one-line prompt can't do that. A sectioned prompt can.

\*\*Note: Section anatomy\*\*

| Section               | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| Role line             | Who the agent is and where it's working                     |
| Agency                | Permission and instruction to act on tasks                  |
| Guardrails            | How to act: minimal, reuse-first, conservative on deps      |
| Tool Usage (later)    | Which tool for which job, especially in mixed-tool sessions |
| Communication (later) | How to report results back                                  |

Start with Agency and Guardrails. The other two earn their place when the prompt grows past 20 lines or so.

## Try It

Run the same prompt before and after the change to see how the agent's posture shifts:

```bash title="Terminal"
bun run index.ts . "Find all TODO comments and tell me where they are"
```

With the one-liner, the agent might list its plan first ("I'll use grep to search..."). With the structured prompt, it goes straight to the tool call and reports findings.

```bash title="Terminal"
npx tsc --noEmit
```

\*\*Note: Don't expect a dramatic shift every time\*\*

If your agent was already acting with the one-line prompt (Module 2's descriptions are strong enough that it usually does), the visible change might be subtle. The durable gain is policy: you've made the operating style explicit, which means you can change it without rewriting the whole agent.

## Commit

```bash
git add index.ts
git commit -m "feat(prompt): add Agency and Guardrails sections"
```

## Done-When

- [ ] `instructions` includes `# Agency` and `# Guardrails` sections
- [ ] Agency tells the agent to use tools and not explain
- [ ] Guardrails constrains scope (minimal changes, reuse, no new deps)
- [ ] The working directory still interpolates into the prompt
- [ ] `npx tsc --noEmit` passes

\*\*Note: Test the prompt's edges\*\*

Try removing the Agency section entirely. Run the same task. Does the agent slip back into explainer mode? Try removing Guardrails. Does it start adding random npm packages? Each section is doing work. Figuring out which section catches which behavior is the whole game.

## Solution

```ts title="index.ts"
const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: `You are a coding agent working in: ${cwd}

# Agency
- USE your tools. Read files, search code, run commands, then answer.
- Do NOT explain what you WOULD do. Actually do it.
- Prefer grep for searching, read for viewing files.
- Use bash only for commands that aren't covered by other tools.

# Guardrails
- Prefer simple, minimal changes
- Search before creating, and reuse existing patterns
- No new dependencies without asking`,
  tools: { read, grep, bash },
  stopWhen: stepCountIs(10),
});
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
