---
title: "From Chat to Agent"
description: "Build a ToolLoopAgent with zero tools, then add one and watch a chatbot become an agent."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/from-chat-to-agent"
md_url: "https://vercel.com/academy/build-ai-agent-harness/from-chat-to-agent.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:12:53.501Z"
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

# From Chat to Agent

# From Chat to Agent

Your agent is the world's most confident intern. Ask it to look at your `tsconfig.json` and it will happily describe what's probably in there. Ask it to find the bug on line 42 and it will offer a strikingly plausible fix.

It has not opened the file. It cannot. A chatbot has no tools, so it pattern-matches on what code usually looks like and serves that up as analysis.

One tool fixes that. We'll add `read` and turn the intern from a confident explainer into something that actually opens the file.

## Outcome

You have a `ToolLoopAgent` that, given a prompt, calls a `read` tool to inspect a known file and reports what it found.

## Fast Track

1. Create `index.ts` with a `ToolLoopAgent`, `instructions`, `model`, and `stopWhen: stepCountIs(10)`
2. Run it with no tools and watch the chatbot explain what it would do
3. Add a `read` tool with a Zod `inputSchema` and a 500-line cap, then run it again

## Hands-on Exercise 1.1

Build the smallest possible agent in `index.ts`, then add one tool.

**Requirements:**

1. Import `ToolLoopAgent`, `stepCountIs`, and `tool` from `ai`, plus `z` from `zod`
2. Create an agent with `model: "anthropic/claude-haiku-4-5"`, brief instructions, and `stopWhen: stepCountIs(10)`
3. Add a `read` tool that accepts `path`, optional `offset`, and optional `limit`
4. Cap output at 500 lines and prefix each line with its line number

**Implementation hints:**

- `ToolLoopAgent` takes `instructions`, `model`, `tools`, and `stopWhen`. Use `instructions`, not `system`
- Call the agent with `agent.generate({ prompt })`, not `agent.generate(prompt)`
- The `description` field on `tool()` is a prompt to the model, not a docstring. The model reads it to decide when to call the tool
- Resolve paths against the working directory so the agent can't accidentally read files outside the project

### The chatbot

Start with the smallest possible agent. No tools, just instructions:

```ts title="index.ts"
import { ToolLoopAgent, stepCountIs } from "ai";

const cwd = process.argv[2] || process.cwd();

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: `You are a coding agent.\nWorking directory: ${cwd}`,
  tools: {},
  stopWhen: stepCountIs(10),
});

const prompt = process.argv.slice(3).join(" ") || "Hello!";
const { text, steps } = await agent.generate({ prompt });
console.log(text);
console.log(`\n(${steps.length} steps)`);
```

Run it:

```bash title="Terminal"
bun run index.ts . "What files are in this project?"
```

You'll get a polite, helpful, and entirely fictional response. Something like *"I'd be happy to help you explore the project files!"* followed by suggestions about what it would look at, if only it could. That's the chatbot.

```
(1 steps)
```

One step. No tool calls. The model talked, and that's all it can do.

\*\*Note: AI SDK v6 naming\*\*

Use `instructions` (not `system`), `stopWhen` (not `stopCondition`), and `agent.generate({ prompt })` (not `agent.generate(prompt)`). The names changed between SDK versions. Wrong names silently compile but the agent does not behave the way you'd expect.

### One tool changes everything

Now add a `read` tool. This is what flips the chatbot into an agent:

```ts title="index.ts" {1-2,4-5,8-28,32}
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cwd = resolve(process.argv[2] || process.cwd());

const read = tool({
  description: `Read a file from the project. Returns numbered lines.
WHEN TO USE: viewing file contents, checking configs, reading source code.
WHEN NOT TO USE: searching across files (use grep instead).`,
  inputSchema: z.object({
    path: z.string().describe("File path relative to working directory"),
    offset: z.number().optional().describe("Start line (1-indexed)"),
    limit: z.number().optional().describe("Max lines to return"),
  }),
  execute: async ({ path: filePath, offset, limit }) => {
    const abs = resolve(cwd, filePath);
    const content = readFileSync(abs, "utf-8");
    let lines = content.split("\n");

    if (offset) lines = lines.slice(offset - 1);
    if (limit) lines = lines.slice(0, limit);

    const MAX_LINES = 500;
    const truncated = lines.length > MAX_LINES;
    if (truncated) lines = lines.slice(0, MAX_LINES);

    const numbered = lines.map((l, i) => `${(offset || 1) + i}: ${l}`);
    return truncated
      ? numbered.join("\n") + `\n... (truncated at ${MAX_LINES} lines)`
      : numbered.join("\n");
  },
});

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: `You are a coding agent.\nWorking directory: ${cwd}`,
  tools: { read },
  stopWhen: stepCountIs(10),
});
```

That `description` field is doing more work than it looks like. The model reads every tool's description before deciding what to do next. WHEN TO USE and WHEN NOT TO USE are not for you. They're the prompt the model uses to pick this tool over another one.

### Why the 500-line cap

Notice `MAX_LINES = 500`. Without it, an unbounded `read` on a 10,000-line file dumps every line into the context window, and the agent keeps that result around for the rest of the session. One careless read can eat 10% of the available context.

You'll see this discipline applied to every tool in the course. Context management gets its own module later, but the habit starts here in the tool itself.

## Try It

Run the agent with a prompt that lines up with what `read` can actually do:

```bash title="Terminal"
bun run index.ts . "Read the tsconfig.json"
```

You should see the model call `read`, then summarize the file. Two steps instead of one:

```
Here's the tsconfig.json:
- target: ESNext
- moduleResolution: bundler
- strict: true

(2 steps)
```

That's the whole transformation. One tool call, one response. The model chose `read` because the description told it when to.

\*\*Note: Pick prompts that match the tool\*\*

`read` can inspect a known file. It cannot enumerate a directory. Until you add `grep` and `bash` in the next two lessons, stick to prompts like `Read the tsconfig.json` or `Read package.json`.

Sanity check the types:

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add index.ts
git commit -m "feat(agent): add ToolLoopAgent with read tool"
```

## Done-When

- [ ] `index.ts` exports a `ToolLoopAgent` with a `read` tool
- [ ] The chatbot version (no tools) returns after one step
- [ ] The agent version (with `read`) calls the tool and reports the file contents
- [ ] `read` returns numbered lines with optional offset and limit
- [ ] Output truncates at 500 lines with a clear message
- [ ] `npx tsc --noEmit` passes

\*\*Note: Try it without the cap\*\*

Create a 1000-line file with `seq 1 1000 > /tmp/big.txt`, then ask the agent to read it. Remove the `MAX_LINES = 500` guard and run it again. Watch the response grow. Now think about what this looks like over a 30-step task. What breaks first, the model's reasoning or the token limit?

## Solution

```ts title="index.ts"
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cwd = resolve(process.argv[2] || process.cwd());

const read = tool({
  description: `Read a file from the project. Returns numbered lines.
WHEN TO USE: viewing file contents, checking configs, reading source code.
WHEN NOT TO USE: searching across files (use grep instead).`,
  inputSchema: z.object({
    path: z.string().describe("File path relative to working directory"),
    offset: z.number().optional().describe("Start line (1-indexed)"),
    limit: z.number().optional().describe("Max lines to return"),
  }),
  execute: async ({ path: filePath, offset, limit }) => {
    const abs = resolve(cwd, filePath);
    const content = readFileSync(abs, "utf-8");
    let lines = content.split("\n");

    if (offset) lines = lines.slice(offset - 1);
    if (limit) lines = lines.slice(0, limit);

    const MAX_LINES = 500;
    const truncated = lines.length > MAX_LINES;
    if (truncated) lines = lines.slice(0, MAX_LINES);

    const numbered = lines.map((l, i) => `${(offset || 1) + i}: ${l}`);
    return truncated
      ? numbered.join("\n") + `\n... (truncated at ${MAX_LINES} lines)`
      : numbered.join("\n");
  },
});

const agent = new ToolLoopAgent({
  model: "anthropic/claude-haiku-4-5",
  instructions: `You are a coding agent.\nWorking directory: ${cwd}`,
  tools: { read },
  stopWhen: stepCountIs(10),
});

const prompt = process.argv.slice(3).join(" ") || "Hello!";
const { text, steps } = await agent.generate({ prompt });
console.log(text);
console.log(`\n(${steps.length} steps)`);
```


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
