# Vercel AI SDK Integration
URL: /docs/integrations/frameworks/ai-sdk

Wire the Vercel AI SDK into a React chat UI with assistant-ui — useChat, streaming, tools, attachments, multi-step agents, and persistence covered end-to-end.

- href

  https\://ai-sdk.dev/

Vercel AI SDK

is the most common framework people pair with assistant-ui. The full setup, attachments, persistence, tool-call patterns, and version notes are documented under

- href

  /docs/runtimes/ai-sdk

runtimes/ai-sdk

; this page is the entry point in the integrations tree for discoverability and architecture context.

If you arrived here looking to wire up your first chat: jump to

- href

  /docs/runtimes/ai-sdk/v6

AI SDK v6 quickstart

. This page is a high-level pointer.

## [Where it slots in](#where-it-slots-in)

`client ──► useChatRuntime (react-ai-sdk) ──► /api/chat (streamText) ──► provider │ └─ thread state, tool calls, attachments, speech / dictation / feedback adapters`

`@assistant-ui/react-ai-sdk` wraps the AI SDK's `useChat` hook and exposes it as an assistant-ui runtime. The runtime owns conversation state on the client; your `/api/chat` route returns a UI message stream from `streamText`. Everything else (tools, attachments, observability, gateways, custom persistence) layers on top of this base.

## [Pick a version](#pick-a-version)

Three versions of `ai` are supported. New projects should pick **v6**; v5 and v4 are documented for migration and existing apps that haven't upgraded.

- href

  /docs/runtimes/ai-sdk/v6

AI SDK v6 (current)Requires ai@^6 and @ai-sdk/react@^3. Async convertToModelMessages, tool inputSchema, toUIMessageStreamResponse.

- href

  /docs/runtimes/ai-sdk/v5-legacy

AI SDK v5 (legacy)Requires ai@^5 and @ai-sdk/react@^2. Synchronous convertToModelMessages, transitional API.

- href

  /docs/runtimes/ai-sdk/v4-legacy

AI SDK v4 (legacy)The original useChat-based path. Maintained for migration only.

## [When to pick AI SDK](#when-to-pick-ai-sdk)

AI SDK is the default choice for new projects on Next.js, Remix, or any framework with a Node-compatible API route. Pick it when:

- You want a single direct path from the chat UI to your model with the smallest possible code surface.

- You will compose with a framework like

  - href

    /docs/integrations/frameworks/mastra/overview

  Mastra

  , an

  - href

    /docs/integrations/observability/helicone

  observability tool

  , an

  - href

    /docs/integrations/gateways

  LLM gateway

  , or

  - href

    /docs/integrations/tools/mcp

  tools through MCP

  , all of which assume an AI SDK route.

- You want first-party `frontendTools`, attachments, multi-step tool calls, token-usage metadata, and persisted history via `withFormat`.

If you need streaming agent state (subgraph events, generative UI messages), look at

- href

  /docs/runtimes/langgraph

LangGraph

instead. If you have a different protocol-shaped backend (A2A, AG-UI, OpenCode), see

- href

  /docs/runtimes/pick-a-runtime

pick a runtime

.

## [Related](#related)

- href

  /docs/runtimes/ai-sdk

AI SDK runtime overviewThe full runtime documentation and version selector.

- href

  /docs/runtimes/pick-a-runtime

Pick a runtimeDecision guide if you're not sure AI SDK is the right runtime.

- href

  /docs/integrations/frameworks/mastra/overview

MastraThe other framework integration in this section. Wired through AI SDK.