# LangSmith
URL: /docs/integrations/observability/langsmith

Trace AI SDK calls into LangSmith with the wrapAISDK helper.

- href

  https\://www\.langchain.com/langsmith

LangSmith

is LangChain's observability and eval platform. If you are already in the LangChain or LangGraph ecosystem, LangSmith is the natural pairing: traces, datasets, prompt versioning, and LLM-as-judge evals share state with the rest of the LangChain stack.

This page covers the **AI SDK** path. If you use

- href

  /docs/runtimes/langgraph

`@assistant-ui/react-langgraph`

, tracing flows through LangGraph Cloud automatically; you only need this guide when your route handler talks to AI SDK directly.

## [How it works](#how-it-works)

LangSmith provides a wrapper around the `ai` namespace. You call `wrapAISDK(ai)`, get back the same exports (`generateText`, `streamText`, `generateObject`, `streamObject`), and use those in place of the originals. Every call is then traced.

`your route ──► wrapped streamText ──► LangSmith client ──► LangSmith`

## [Setup](#setup)

### [Get LangSmith credentials](#get-langsmith-credentials)

Sign up at

- href

  https\://smith.langchain.com/

smith.langchain.com

and copy an API key from settings.

- title

  .env.local

`LANGSMITH_TRACING=true LANGSMITH_API_KEY=lsv2_pt_... LANGSMITH_PROJECT=assistant-ui`

`LANGSMITH_PROJECT` controls which project receives traces; the default project applies if you omit it. See LangSmith's

- href

  https\://docs.langchain.com/langsmith/how\_to\_environment\_variables

environment variable reference

for the full list.

### [Install the LangSmith SDK](#install-the-langsmith-sdk)

- packages

  - langsmith

### [Wrap the AI SDK](#wrap-the-ai-sdk)

`wrapAISDK` re-exports `generateText`, `streamText`, `generateObject`, and `streamObject` with tracing enabled. Use the wrapped versions in your route.

- title

  app/api/chat/route.ts

`import * as ai from "ai"; import { wrapAISDK } from "langsmith/experimental/vercel"; import { openai } from "@ai-sdk/openai"; import type { UIMessage } from "ai"; const { streamText } = wrapAISDK(ai); export async function POST(req: Request) { const { messages }: { messages: UIMessage[] } = await req.json(); const result = streamText({ model: openai("gpt-5.4-nano"), messages: await ai.convertToModelMessages(messages), }); return result.toUIMessageStreamResponse(); }`

`convertToModelMessages` is not part of the wrapper, so import it from `ai` directly.

### [Add metadata for grouping (optional)](#add-metadata-for-grouping-optional)

Pass a `langsmith` provider option to tag traces with user, session, or run identifiers. Use `createLangSmithProviderOptions` to build the value:

`import { createLangSmithProviderOptions } from "langsmith/experimental/vercel"; const result = streamText({ model: openai("gpt-5.4-nano"), messages: await ai.convertToModelMessages(messages), providerOptions: { langsmith: createLangSmithProviderOptions({ name: "chat-completion", metadata: { userId, threadId }, }), }, });`

`name` becomes the run name in LangSmith. Traces filter by the metadata fields you pass; resolve `userId` and `threadId` from your auth and thread state, don't ship literal strings.

### [Run and verify](#run-and-verify)

Send a message. The trace should appear in your LangSmith project within seconds. Confirm:

- A new run named according to `name` (or the default `streamText`).
- Inputs (messages), outputs (completion), token usage, and latency are populated.
- Metadata fields appear as filters.

## [Notes](#notes)

- **Serverless flush.** Serverless functions exit before LangSmith flushes batched traces. Before returning, force the flush with the `Client` from `langsmith`:

  `import { Client } from "langsmith"; const client = new Client(); // ...inside your route handler, after streamText: await client.awaitPendingTraceBatches();`

  Without this you will lose traces on Vercel, AWS Lambda, and similar platforms.

- **`experimental_telemetry` vs `wrapAISDK`.** The AI SDK has a generic `experimental_telemetry` flag that emits OpenTelemetry spans (used by

  - href

    /docs/integrations/observability/langfuse

  Langfuse

  ). `wrapAISDK` is LangSmith's own path; you do not need to set `experimental_telemetry` when using it.

- **LangGraph users.** If your backend is LangGraph Cloud, prefer the LangGraph runtime; tracing is built in. Use `wrapAISDK` only when calling AI SDK directly outside of LangGraph.

- **Version requirements.** LangSmith documents AI SDK v5 as the minimum and `langsmith >= 0.3.63`. The wrapper continues to work against v6 in practice; if you hit an incompatibility, check LangSmith's release notes.

## [Related](#related)

- href

  /docs/runtimes/langgraph

LangGraph runtimeIf your backend is LangGraph, tracing flows through LangGraph Cloud automatically.

- href

  /docs/integrations/observability/langfuse

LangfuseOpenTelemetry-based alternative; OSS and self-hostable.

- href

  /docs/runtimes/ai-sdk/v6

AI SDK runtimeThe runtime that ferries traces from the route to the chat UI.