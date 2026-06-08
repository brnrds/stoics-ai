---
title: "CLI Entry Point"
description: "Parse arguments, create the sandbox, initialize the agent, and shut down cleanly."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/cli-entry-point"
md_url: "https://vercel.com/academy/build-ai-agent-harness/cli-entry-point.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:07.401Z"
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

# CLI Entry Point

# CLI Entry Point

You've been running `bun run index.ts . "prompt"` since Module 1. That's a CLI. It just isn't a polite one.

The positional arguments are doing too much work. There's no flag for the sandbox backend, so you've been juggling `process.env.SANDBOX`. The model is hardcoded into the agent. And if you hit Ctrl-C mid-run, the sandbox doesn't shut down cleanly. For local that's fine. For a cloud sandbox, that's leaving a VM running on someone else's credit card.

This lesson formalizes the entry point. Arguments via `parseArgs`. Sandbox via a factory that reads a flag. Model via a flag with a default. Shutdown via a signal handler that always runs `sandbox.stop()`.

## Outcome

`index.ts` parses `--sandbox`, `--model`, a positional working directory, and a positional prompt. The sandbox shuts down cleanly on normal exit and on SIGINT.

## Fast Track

1. Use `parseArgs` from `node:util` for `--sandbox` and `--model`
2. Build the sandbox from the flag through a small factory
3. Wire a `SIGINT` handler that calls `sandbox.stop()` and exits
4. Always call `sandbox.stop()` in a `finally` after the agent runs

## Hands-on Exercise 10.1

Replace the ad-hoc CLI with `parseArgs` plus a clean shutdown.

**Requirements:**

1. Use `parseArgs` from `node:util` with `--sandbox` (default `local`) and `--model` (default `anthropic/claude-haiku-4-5`)
2. Allow positionals: the first is `cwd`, the rest are joined into the prompt
3. Build the sandbox from the flag via a `sandboxFromFlag(name, cwd)` helper
4. Wrap the agent run in `try/finally` so `sandbox.stop()` always runs
5. Register a `SIGINT` handler that stops the sandbox and exits with code 0

**Implementation hints:**

- `parseArgs` is in `node:util`. Set `allowPositionals: true` to mix flags and positionals
- `sandboxFromFlag` is a one-liner switch over `"local"` and `"just-bash"`
- The `finally` matters more for cloud sandboxes than local, but you want the same code path either way

### The CLI

```ts title="index.ts"
import { parseArgs } from "node:util";
import { ToolLoopAgent, stepCountIs, pruneMessages } from "ai";
import { resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createLocalSandbox } from "./src/sandbox-local";
import { createJustBashSandbox } from "./src/sandbox-just-bash";
import { buildSystemPrompt } from "./src/system";
import {
  createReadTool,
  createGrepTool,
  createBashTool,
  createTaskTool,
  createAskUserTool,
  createTodoTool,
} from "./src/tools";
import { createApproval } from "./src/approval";
import { addCacheControl } from "./src/cache";
import { discoverGates } from "./src/verification";
import type { Sandbox } from "./src/sandbox";

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    sandbox: { type: "string", default: "local" },
    model: { type: "string", default: "anthropic/claude-haiku-4-5" },
  },
  allowPositionals: true,
});

const cwd = resolve(positionals[0] || process.cwd());
const prompt = positionals.slice(1).join(" ") || "Hello!";

async function sandboxFromFlag(name: string, dir: string): Promise<Sandbox> {
  if (name === "just-bash") return createJustBashSandbox(dir);
  return createLocalSandbox(dir);
}

const sandbox = await sandboxFromFlag(values.sandbox!, cwd);
console.error(`Sandbox: ${sandbox.type}`);

const projectContext = existsSync(join(cwd, "AGENTS.md"))
  ? readFileSync(join(cwd, "AGENTS.md"), "utf-8")
  : undefined;

const verificationCommands = await discoverGates(sandbox);

const baseTools = {
  read: createReadTool(sandbox),
  grep: createGrepTool(sandbox),
  bash: createBashTool(sandbox, createApproval({ mode: "interactive" })),
};
const tools = {
  ...baseTools,
  task: createTaskTool(sandbox, { read: baseTools.read, grep: baseTools.grep }),
  askUser: createAskUserTool(),
  todo: createTodoTool(),
};

const agent = new ToolLoopAgent({
  model: values.model!,
  instructions: buildSystemPrompt({
    workingDirectory: cwd,
    sandboxType: sandbox.type,
    toolNames: Object.keys(tools),
    projectContext,
    verificationCommands,
  }),
  tools,
  stopWhen: stepCountIs(15),
  prepareCall: async (options) => {
    const pruned = options.messages
      ? pruneMessages({
          messages: options.messages,
          toolCalls: "before-last-3-messages",
        })
      : undefined;
    return {
      ...options,
      messages: pruned ? addCacheControl(pruned) : undefined,
    };
  },
  onStepFinish: ({ usage, stepNumber }) => {
    console.error(
      `Step ${stepNumber}: ${usage.inputTokens} input, ${usage.outputTokens} output`,
    );
  },
});

process.on("SIGINT", async () => {
  console.error("\nShutting down...");
  await sandbox.stop();
  process.exit(0);
});

try {
  const { text, steps } = await agent.generate({ prompt });
  console.log(text);
  console.log(`\n(${steps.length} steps)`);
} finally {
  await sandbox.stop();
}
```

That's the full file. Most of it is the assembly that the previous nine modules already wrote. The CLI changes are: `parseArgs`, the `sandboxFromFlag` helper, the `SIGINT` handler, and the `try/finally`.

### Why `finally` matters

If the agent throws halfway through, the `finally` still runs. For a local sandbox, you've cleaned up nothing important. For a cloud sandbox, you've avoided leaving a VM running. For a `just-bash` sandbox, you've released some memory. Same code, different cost, all of them cleanly handled.

The `SIGINT` handler is a duplicate. The user pressing Ctrl-C is one path. An uncaught exception is another path. The `finally` covers normal exit, the handler covers the explicit interrupt.

\*\*Note: The CLI is a thin wrapper\*\*

Almost nothing in this file is about CLI concerns. The agent, the tools, the prompt, the sandbox: that's all reusable. The CLI parts are five or six lines of `parseArgs` and a signal handler. If you build a different surface (a web server, a Slack bot, a VS Code extension), the only code that changes is those five or six lines. Everything below them stays put.

## Try It

Run with the new flags:

```bash title="Terminal"
bun run index.ts --sandbox=just-bash --model=anthropic/claude-haiku-4-5 . "Read the package.json"
```

You should see `Sandbox: just-bash` in stderr, then the model's response in stdout, then the step count.

Test the clean shutdown by sending SIGINT mid-run:

```bash title="Terminal"
bun run index.ts . "Run a long task"
```

Press Ctrl-C. You should see "Shutting down..." and a clean exit, not a hang.

```bash title="Terminal"
npx tsc --noEmit
```

## Commit

```bash
git add index.ts
git commit -m "feat(cli): parseArgs and SIGINT-aware shutdown"
```

## Done-When

- [ ] `parseArgs` reads `--sandbox` and `--model` flags
- [ ] Positionals supply `cwd` and the prompt
- [ ] `sandbox.stop()` runs on normal exit (via `finally`)
- [ ] `sandbox.stop()` runs on SIGINT (via handler)
- [ ] `npx tsc --noEmit` passes

\*\*Note: Add a sessions flag\*\*

Add `--session=<id>` that loads a previous run's messages from disk and replays them as `messages` to `agent.generate({ prompt, messages })`. On exit, save the new messages back. Now you can pick up a conversation tomorrow. Where does the file live? What happens when the file is corrupt? Should you version-stamp it so old sessions don't break when the harness changes?

## Solution

See the full `index.ts` above.


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
