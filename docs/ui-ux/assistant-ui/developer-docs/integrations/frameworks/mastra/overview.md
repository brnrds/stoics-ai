# Mastra Integration
URL: /docs/integrations/frameworks/mastra/overview

Wire the Mastra TypeScript agent framework into a React chat UI with assistant-ui — full streaming, tool calling, multi-agent support, and thread management.

- href

  https\://mastra.ai/

Mastra

is an open-source TypeScript agent framework. It provides primitives for AI applications: agents with memory and tool calling, deterministic LLM workflows, RAG, model routing, workflow graphs, and automated evals.

This is an integration guide, not a runtime adapter. assistant-ui does not ship a `@assistant-ui/react-mastra` package. You wire up Mastra through the standard

- href

  /docs/runtimes/ai-sdk/v6

AI SDK runtime

by routing your API endpoint through Mastra's agent stream.

## [Pick a pattern](#pick-a-pattern)

| Pattern                                                                       | When to pick                                                                                                            |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| - href

  /docs/integrations/frameworks/mastra/full-stackFull-stack           | One Next.js app: API routes call Mastra in-process. Simpler deployment, single repo.                                    |
| * href

  /docs/integrations/frameworks/mastra/separate-serverSeparate server | Mastra runs as its own service; the Next.js frontend hits its API. Independent scaling, clearer separation of concerns. |

Both use the same client-side `useChatRuntime` from

- href

  /docs/runtimes/ai-sdk/v6

`@assistant-ui/react-ai-sdk`

. The only difference is where the Mastra agent lives.

## [Architecture](#architecture)

Mastra integrates at the LLM-client layer on the server. assistant-ui talks to your API route via the AI SDK runtime; the route calls `agent.stream(messages)` and returns the result wrapped in a UI message stream. The client side is built on

- href

  /docs/runtimes/custom/external-store

`ExternalStoreRuntime`

through the AI SDK adapter.

Shared adapters (attachments, speech, feedback, history) work the same way described in

- href

  /docs/runtimes/concepts/adapters

adapters

. Multi-thread support uses

- href

  /docs/cloud

AssistantCloud

or a

- href

  /docs/runtimes/concepts/threads

custom thread list

.

## [Requirements](#requirements)

- A Next.js project, or another framework that can run AI SDK route handlers.
- Model API keys (OpenAI, Anthropic, etc.) configured in your environment.
- Node 18 or newer.

## [Next](#next)

- href

  /docs/integrations/frameworks/mastra/full-stack

Full-stack integrationRun Mastra inside your Next.js API routes.

- href

  /docs/integrations/frameworks/mastra/separate-server

Separate server integrationRun Mastra as a standalone server, frontend connects via API.

- href

  /docs/runtimes/ai-sdk/v6

AI SDK runtimeThe runtime that handles the client side of this integration.