# Picking a runtime
URL: /docs/runtimes/pick-a-runtime

Decision guide for choosing the right runtime, by framework or by feature.

A runtime is the connection between assistant-ui's UI primitives and your AI backend. This page helps you pick one. Two lenses, pick whichever maps to what you already know.

## [Lens 1: by framework](#lens-1-by-framework)

If you are already using one of these frameworks, the choice is mechanical.

### [First-party adapters](#first-party-adapters)

assistant-ui ships React adapter packages for these. Pick the matching card and follow its overview.

- href

  /docs/runtimes/ai-sdk

Vercel AI SDKuseChat hook, streaming, tools, attachments, multi-step. v6 current; v5 / v4 legacy.

- href

  /docs/runtimes/langgraph

LangGraphDirect integration with @langchain/langgraph-sdk. Subgraph events, UI messages, message metadata.

- href

  /docs/runtimes/langchain

LangChain useStreamWraps @langchain/react's useStream. Lighter-weight, tracks upstream.

- href

  /docs/runtimes/google-adk

* aria-hidden

  true

* alt

Google ADKADK JS or Python agents. Tool confirmations, auth flows, multi-agent, code execution.

- href

  /docs/runtimes/a2a

A2A ProtocolAny A2A v1.0-compliant agent server. Streaming task state, artifacts, multi-tenancy.

- href

  /docs/runtimes/ag-ui

AG-UI ProtocolAG-UI agents (CopilotKit, custom servers). Streaming text, thinking, tool calls, state snapshots.

- platforms

  - react

* href

  /docs/runtimes/opencode

OpenCodeOpenCode coding-agent server. Permission flows, questions, fork / revert. Experimental.

- platforms

  - react

### [Integration guides](#integration-guides)

For frameworks without a dedicated adapter, these wiring guides route through one of the adapters above.

- href

  /docs/integrations/frameworks/cloudflare-agents/overview

Cloudflare AgentsStateful agents on Durable Objects with WebSocket streaming. Wired through the Vercel AI SDK runtime.

- href

  /docs/integrations/frameworks/mastra/overview

MastraTypeScript agent framework. Wired through the Vercel AI SDK runtime.

## [Lens 2: by needs](#lens-2-by-needs)

If you do not know your framework yet, or your backend is custom, pick by what you need:

| You need                                              | Use                                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------------- |
| Simple `fetch` call to your API, runtime owns state   | - href

  /docs/runtimes/custom/local-runtimeLocalRuntime             |
| Keep messages in redux, zustand, tanstack-query, etc. | * href

  /docs/runtimes/custom/external-storeExternalStoreRuntime    |
| Backend that already speaks the data stream protocol  | - href

  /docs/runtimes/custom/data-streamDataStream                 |
| Stream full agent state snapshots (not just messages) | * href

  /docs/runtimes/custom/assistant-transportAssistantTransport |

If none of the framework adapters fits, start at

- href

  /docs/runtimes/custom

custom backend

.

## [Shared concepts](#shared-concepts)

Regardless of which runtime you pick, four ideas apply across the board.

- **Architecture** — Framework adapters wrap one of two **core runtimes** (`LocalRuntime`, `ExternalStoreRuntime`). See

  - href

    /docs/runtimes/concepts/architecture

  architecture

  for the full layering.

- **Adapters** (attachments, speech, feedback, history, suggestions) work the same way across runtimes. See

  - href

    /docs/runtimes/concepts/adapters

  adapters

  .

- **Threads** (single, cloud, custom database) follow the same model. See

  - href

    /docs/runtimes/concepts/threads

  threads

  .

- **Stability** policy: APIs prefixed with `unstable_` may change in any release. See

  - href

    /docs/runtimes/concepts/stability

  stability

  .

Need help? Join our

- href

  https\://discord.gg/S9dwgCNEFs

Discord community

or check the

- href

  https\://github.com/assistant-ui/assistant-ui

GitHub repo

.