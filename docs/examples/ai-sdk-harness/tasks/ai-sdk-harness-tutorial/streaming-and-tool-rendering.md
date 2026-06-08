---
title: "Streaming and Tool Rendering"
description: "Stream agent responses to the terminal. Render tool calls as they fire."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/streaming-and-tool-rendering"
md_url: "https://vercel.com/academy/build-ai-agent-harness/streaming-and-tool-rendering.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:07.734Z"
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

# Streaming and Tool Rendering

# Streaming and Tool Rendering

`agent.generate()` blocks until the whole response is done. Once the agent goes past one or two steps, the wait gets uncomfortable. You're staring at a terminal that looks frozen, with no idea whether it's working or stuck.

`agent.stream()` is the upgrade. You get text deltas as they arrive, tool calls as they fire, and tool results as they come back. The user sees motion. You see what the agent is actually doing.

This lesson swaps `generate` for `stream` in the CLI and decides how each chunk renders.

## Outcome

The CLI uses `agent.stream()`. Text deltas write to stdout in real time. Tool calls and their results render to stderr so they don't mix with the agent's actual response.

## Fast Track

1. Replace `agent.generate({ prompt })` with `agent.stream({ prompt })`
2. Iterate `result.fullStream` and switch on `chunk.type`
3. Send `text-delta` to stdout, `tool-call` and `tool-result` to stderr

## Hands-on Exercise 10.2

Switch to streaming and render the chunk types appropriately.

**Requirements:**

1. Replace `agent.generate(...)` with `agent.stream(...)`
2. Loop over `result.fullStream` with `for await`
3. On `text-delta`, write the delta to stdout (no newline)
4. On `tool-call`, log the tool name and args to stderr
5. On `tool-result`, log a truncated preview to stderr

**Implementation hints:**

- `result.fullStream` is an async iterable. `for await (const chunk of result.fullStream)` is the natural loop
- Tool results can be long. Slice to 100 characters or so for the preview
- Don't render `tool-result` chunks to stdout. They're meta. They go alongside the response, not inside it

### The streaming loop

```ts title="index.ts (replacing the generate block)"
const result = await agent.stream({ prompt });

for await (const chunk of result.fullStream) {
  switch (chunk.type) {
    case "text-delta":
      process.stdout.write(chunk.textDelta);
      break;
    case "tool-call":
      console.error(
        `\n[tool] ${chunk.toolName}(${JSON.stringify(chunk.args)})`,
      );
      break;
    case "tool-result": {
      const preview =
        typeof chunk.result === "string"
          ? chunk.result.slice(0, 100)
          : JSON.stringify(chunk.result).slice(0, 100);
      console.error(`  -> ${preview}`);
      break;
    }
  }
}

console.log();
```

That's the whole change. The agent, tools, sandbox, and prompt are unchanged. The CLI's job moved from "wait for the answer" to "render the stream."

### What this looks like in practice

Same prompt as before, but with motion:

```
[tool] grep({"pattern":"TODO","glob":"*.ts"})
  -> src/auth.ts:42: // TODO: add rate limiting
  -> src/routes.ts:15: // TODO: validate input

Based on my search, there are 2 TODO comments left in this project...
```

The tool call shows up the moment the model decides to make it. The result shows up the moment the tool returns. The text answer streams in as the model writes it. The user can read along instead of waiting.

### Rendering choices, per tool

Different tools want different summaries. Here's a starting point:

| Tool      | Render as                           |
| --------- | ----------------------------------- |
| `read`    | File path and line count            |
| `grep`    | Match count and first three matches |
| `bash`    | Command and exit code               |
| `write`   | File path and byte count            |
| `edit`    | File path and "1 replacement"       |
| `task`    | Subagent type and step count        |
| `askUser` | Full question and option list       |

Treat the table as a hint, not a contract. For a CLI, the simple `tool-call` and `tool-result` switch above already covers most of what you need. Per-tool formatting earns its place when one tool's output is consistently noisy.

\*\*Note: Inline approval gets harder when you're streaming\*\*

Module 1's `bash` returns a block string when a command isn't approved. That works fine with `generate`. With streaming, you might want to pause the stream, ask the user, then resume. That's an interaction loop, not a chunk handler. The full pattern lives in the next module (extensibility and events). For now, the block-and-report behavior is still doing the right thing.

## Try It

Run anything multi-step and watch the CLI come alive:

```bash title="Terminal"
bun run index.ts . "Find all TODO comments, then read the files that contain them"
```

You should see tool calls appearing in stderr as they happen, and the model's final response streaming into stdout token by token.

For comparison, redirect stderr away and see only the agent's text response:

```bash title="Terminal"
bun run index.ts . "Find all TODO comments, then read the files that contain them" 2>/dev/null
```

You get the response, with no tool noise. That's what the stdout/stderr split bought you.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add index.ts
git commit -m "feat(cli): stream agent output with chunk-level rendering"
```

## Done-When

- [ ] `agent.stream({ prompt })` replaces `agent.generate(...)`
- [ ] `for await` iterates `result.fullStream`
- [ ] `text-delta` writes to stdout
- [ ] `tool-call` and `tool-result` write to stderr
- [ ] Redirecting stderr leaves only the agent's response in stdout
- [ ] `npx tsc --noEmit` passes

\*\*Note: Per-tool rendering\*\*

Replace the generic `tool-call` and `tool-result` logging with a small `renderTool(chunk)` function that switches on `chunk.toolName` and produces a specific summary for each. `read` shows the file path and line count. `grep` shows the match count and first matches. `bash` shows the command and exit code. Watch what happens when a new tool gets added. Where's the right place to keep the per-tool format definitions?


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
