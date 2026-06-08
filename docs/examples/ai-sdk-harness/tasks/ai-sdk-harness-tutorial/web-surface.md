---
title: "Web Surface"
description: "The same agent serves a web chat UI. Persistence, resumable streams, tool results as components."
canonical_url: "https://vercel.com/academy/build-ai-agent-harness/web-surface"
md_url: "https://vercel.com/academy/build-ai-agent-harness/web-surface.md"
docset_id: "vercel-academy"
doc_version: "1.0"
last_updated: "2026-06-08T09:13:08.084Z"
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

# Web Surface

# Web Surface

The agent is headless. The CLI is one surface. A web chat UI is another. The interesting thing is that the agent code doesn't change between them. The differences are all in the wrapper.

This lesson is a concept walkthrough. The CLI is the working demo; the web surface is the architectural sketch. The point is to make the separation obvious enough that you could build the web surface on a Friday afternoon without touching the agent.

## Outcome

You can describe how a web surface reuses the headless agent, what the surface adds on top (persistence, streaming over HTTP, components for tool results), and where the boundary between agent and surface lives.

## The Two Surfaces Side by Side

|            | CLI                    | Web                          |
| ---------- | ---------------------- | ---------------------------- |
| Output     | Terminal text          | Chat bubbles                 |
| Tool calls | stderr lines           | Tool result components       |
| Approval   | stdin prompt           | Button group                 |
| Lifetime   | Process exit           | Session persistence          |
| Streaming  | `process.stdout.write` | Server-sent events           |
| Input      | One shot from argv     | Continuous from the textarea |

The agent code is the same column. The surface code is the column to its right.

## What the Web Surface Adds

### Persistence

A CLI session dies when the terminal closes. A web session shouldn't. The surface persists the conversation:

```ts
await db.saveMessages(sessionId, messages);

const messages = await db.loadMessages(sessionId);
const result = await agent.stream({ prompt, messages });
```

The agent doesn't know about the database. It receives `messages` (or doesn't) and proceeds. The surface decides whether to load and save.

### Streaming over HTTP

The CLI streams to a TTY. The web surface streams to a browser. Server-sent events are the easy mechanism:

```ts title="src/route.ts (sketch)"
export async function POST(req: Request) {
  const { prompt, sessionId } = await req.json();
  const messages = await loadMessages(sessionId);

  const stream = new ReadableStream({
    async start(controller) {
      const result = await agent.stream({ prompt, messages });
      for await (const chunk of result.fullStream) {
        controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

Same chunk shape the CLI consumes, just over HTTP instead of stdout. The client renders each chunk as it arrives.

### Tool results as components

The CLI renders tool results as text. The web surface can render them as React components:

| Tool      | CLI rendering                 | Web rendering                        |
| --------- | ----------------------------- | ------------------------------------ |
| `read`    | File path and line count      | Code block with syntax highlighting  |
| `grep`    | Match count and first matches | Search results with file links       |
| `bash`    | Command and exit code         | Terminal output with exit code badge |
| `write`   | Path and bytes                | Diff view                            |
| `edit`    | Path and "1 replacement"      | Inline diff                          |
| `askUser` | Question text                 | Button group with the options        |

The agent emits the same chunks. The surface chooses how to display them.

### Resumable streams

A user closes the browser tab mid-response. They reopen it five minutes later. A web surface can resume the stream from where it left off (if the agent is still running) or pick up the persisted state (if it isn't). The CLI can't do this because there's no surface to come back to.

This is the place where persistence and streaming meet. The session is the unit of work. The stream is one render of that session.

\*\*Note: The agent does not know there is a web\*\*

None of the web surface code goes inside the agent. The agent gets `prompt` and optional `messages`. It returns a stream of chunks. Everything else (auth, persistence, layout, components) lives in the surface. If you find yourself adding "is this web?" branches to the agent, that's the seam slipping. Pull the special case back out into the surface.

## What's Missing in the Build-Along

This module's working code is the CLI. There's no web surface in the course repo. The decision is intentional. Building a working web frontend would take a module of its own (or several), and the teaching point is about separation, not about React.

If you want to try it: start with a Next.js route that wraps `agent.stream()`, pipe the chunks as SSE, and write a small client that consumes the events. You'll know your separation is clean if the agent code you wrote in Module 1 through Module 9 runs without changes.

## Try It

This is a concept lesson. Check yourself:

1. Without looking back, list what changes between CLI and web surfaces
2. Sketch the data flow for a single user prompt in the web case. Where does persistence happen? Where does the stream cross the network?
3. Pick a tool from your harness. Write down the CLI rendering, then sketch the React component for the web rendering. Are they reading the same chunk shape?

## Commit

No code in this lesson. The next module (extensibility) is where event-based hooks open the door for tool result components and inline approval to plug in cleanly.

## Done-When

- [ ] You can explain why the agent code doesn't change between surfaces
- [ ] You can sketch persistence, streaming, and component rendering for a web surface
- [ ] You can identify what stays in the agent vs. what moves to the surface

\*\*Note: Build a streaming web surface\*\*

Set up a Next.js route that wraps `agent.stream({ prompt, messages })`. Pipe each chunk as a server-sent event. On the client, consume the events with `EventSource` or `fetch` plus `ReadableStream`. Render `text-delta` chunks into a chat bubble. Render `tool-call` chunks as a spinner with the tool name. Replace the spinner with a small result card when `tool-result` arrives. Add a cancel button that aborts the stream and stores the partial result. The interesting part is the visual transition between text and tool calls without layout jank. How do you handle it?


---

[Full course index](/academy/llms.txt) · [Sitemap](/academy/sitemap.md)
