# Integrations
URL: /docs/integrations

Adapters for Vercel AI SDK, LangChain, LangGraph, Mastra, plus auth, persistence, observability, and tool services — drop into a React chat UI built with assistant-ui.

Integrations are wiring guides for using third-party services with assistant-ui, plus canonical recipes for the adapter slots (persistence, attachments). They are distinct from

- href

  /docs/runtimes/pick-a-runtime

runtimes

, which are the React adapter packages (`@assistant-ui/react-ai-sdk`, `@assistant-ui/react-langgraph`, etc.) that connect the UI to a backend. An integration assumes you already have a working runtime and adds something on top.

## [Where integrations slot in](#where-integrations-slot-in)

`client ──► your API route ──► LLM provider │ ▲ │ │ agent │ │ observability frameworks │ │ proxies (e.g. │ │ (e.g. Helicone, Mastra) │ │ Langfuse) ▼ │ run on the server, │ then forward calls ──────┘ to the provider`

Integrations live on the server. **Agent frameworks** like Mastra take over the API route. **Gateways** swap the upstream provider URL. **Observability** logs or traces every call. **Auth** gates the route and scopes per-user data. **Persistence** and **attachments** are adapter recipes for storing chat data outside the default in-memory path.

## [Frameworks](#frameworks)

Framework integrations that pair with assistant-ui at the API-route layer.

- href

  /docs/integrations/frameworks/ai-sdk

Vercel AI SDKThe canonical first-party adapter. Full setup lives under runtimes; this entry is the architectural pointer.

- platforms

  - react

* href

  /docs/integrations/frameworks/cloudflare-agents/overview

Cloudflare AgentsStateful Durable Object agents. Wired through the AI SDK runtime with WebSocket streaming.

- href

  /docs/integrations/frameworks/mastra/overview

MastraTypeScript agent framework. Routed through the AI SDK runtime, full-stack or separate server.

## [Tools](#tools)

Pluggable tool catalogs and protocols.

- href

  /docs/integrations/tools/mcp

Model Context Protocol (MCP)Connect any MCP server as a tool catalog through the AI SDK MCP client.

## [Gateways](#gateways)

OpenAI-compatible proxies that add catalog routing, fallback, BYOK, or self-hosting.

- href

  /docs/integrations/gateways

LLM gatewaysOpenRouter, Portkey, LiteLLM Proxy. Swap baseURL, route across providers.

## [Observability](#observability)

Log, monitor, trace, and evaluate LLM calls. These pair with any runtime.

- href

  /docs/integrations/observability/helicone

HeliconeObservability proxy. Drop-in baseURL swap that logs cost, latency, and prompts.

- href

  /docs/integrations/observability/langfuse

LangfuseOpenTelemetry-based tracing and evals. Open source, self-hostable.

- href

  /docs/integrations/observability/langsmith

LangSmithLangChain ecosystem tracing via wrapAISDK. Datasets and evals included.

- platforms

  - react

## [Auth](#auth)

Gate the chat route and scope thread data to the signed-in user. These pages are the **non-cloud** path; pair with

- href

  /docs/integrations/persistence/custom-adapter

custom thread persistence

when you own the database.

- href

  /docs/integrations/auth/clerk

ClerkHosted auth with a Next.js middleware. auth() returns userId; Clerk Orgs map to multi-tenant chat.

- href

  /docs/integrations/auth/better-auth

better-authTypeScript-first, owns the user table and session. session.user.id is populated by default.

- href

  /docs/integrations/auth/next-auth

Auth.js (next-auth)The OSS Next.js standard. Requires jwt/session callbacks to populate session.user.id.

For AssistantCloud users,

- href

  /docs/cloud/authorization

cloud authorization

handles the JWT exchange for Clerk, Auth0, Supabase, and Firebase without DB code.

## [Persistence](#persistence)

Store threads and messages outside AssistantCloud.

- href

  /docs/integrations/persistence/custom-adapter

Custom thread persistenceWorked example: Postgres + Drizzle, RemoteThreadListAdapter, ThreadHistoryAdapter with withFormat.

## [Attachments](#attachments)

Upload chat attachments to object storage instead of inlining as data URLs.

- href

  /docs/integrations/attachments/custom-adapter

Custom attachment uploadsProduction AttachmentAdapter with presigned URLs. Tabs for S3/R2, Vercel Blob, Uploadthing.

## [Don't see your service?](#dont-see-your-service)

assistant-ui doesn't ship a guide for every tool, but most fit one of two patterns:

- **Routes through your AI SDK handler** (agent frameworks, observability proxies, gateways): adapt the

  - href

    /docs/integrations/frameworks/mastra/full-stack

  Mastra full-stack

  or

  - href

    /docs/integrations/observability/helicone

  Helicone proxy

  pattern using the service's own SDK.

- **Replaces the runtime entirely** (custom backends): see

  - href

    /docs/runtimes/custom

  custom backend

  .

If you build something useful,

- href

  https\://github.com/assistant-ui/assistant-ui/issues

open an issue

or post in

- href

  https\://discord.gg/S9dwgCNEFs

Discord

; the docs are open to contributions.

## [Related](#related)

- href

  /docs/runtimes/pick-a-runtime

Pick a runtimeChoose the React adapter that matches your backend before adding integrations.

- href

  /docs/runtimes/concepts/architecture

Runtime conceptsArchitecture, adapters, threads, and stability across all runtimes.