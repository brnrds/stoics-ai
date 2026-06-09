# Full-stack integration
URL: /docs/integrations/frameworks/mastra/full-stack

Run Mastra agents inside your Next.js API routes.

Run Mastra in-process inside your Next.js application. The agent code, the API route, and the assistant-ui frontend all live in one project. This is the lowest-friction path: one deploy target, one set of env vars, no cross-origin plumbing.

For independent scaling, see

- href

  /docs/integrations/frameworks/mastra/separate-server

separate server

instead.

## [Setup](#setup)

### [Initialize assistant-ui](#initialize-assistant-ui)

Set up assistant-ui in your project:

- title

  New project

`npx assistant-ui@latest create`

- title

  Existing project

`npx assistant-ui@latest init`

This installs dependencies and creates a default chat API route at `app/api/chat/route.ts`. For manual setup, see the

- href

  /docs

getting started guide

.

### [Install Mastra packages](#install-mastra-packages)

`@mastra/core` provides the agent runtime; `@mastra/ai-sdk` converts Mastra's stream format to AI SDK's UI message stream; `zod` is required for tool schemas.

- packages

  - @mastra/core\@latest
  - @mastra/ai-sdk\@latest
  - zod\@latest

### [Configure Next.js](#configure-nextjs)

Mastra's runtime depends on Node-only modules. Tell Next.js to bundle Mastra packages externally on the server so they aren't traced into the edge runtime.

- title

  next.config.mjs

`/** @type {import('next').NextConfig} */ const nextConfig = { serverExternalPackages: ["@mastra/*"], }; export default nextConfig;`

If you skip this step you'll see opaque bundling errors at request time, not at build time.

### [Define an agent](#define-an-agent)

Create a `mastra/` folder at the project root with two files:

- title

  Project layout

`mastra/ ├── agents/ │ └── chefAgent.ts └── index.ts`

Define the agent in `chefAgent.ts`:

- title

  mastra/agents/chefAgent.ts

`import { Agent } from "@mastra/core/agent"; export const chefAgent = new Agent({ name: "chef-agent", instructions: "You are Michel, a practical and experienced home chef. " + "You help people cook with whatever ingredients they have available.", model: "openai/gpt-5.4-mini", });`

`model: "openai/gpt-5.4-mini"` uses Mastra's model router. Set the provider key in `.env.local` so Next.js auto-loads it:

- title

  .env.local

`OPENAI_API_KEY=sk-...`

### [Register the agent](#register-the-agent)

Initialize Mastra with the agent so it can be looked up by name:

- title

  mastra/index.ts

`import { Mastra } from "@mastra/core"; import { chefAgent } from "./agents/chefAgent"; export const mastra = new Mastra({ agents: { chefAgent }, });`

### [Wire the API route](#wire-the-api-route)

Replace the default route with one that streams from the Mastra agent:

- title

  app/api/chat/route.ts

`import { createUIMessageStream, createUIMessageStreamResponse } from "ai"; import { toAISdkStream } from "@mastra/ai-sdk"; import { mastra } from "@/mastra"; export const maxDuration = 30; export async function POST(req: Request) { const { messages } = await req.json(); const agent = mastra.getAgent("chefAgent"); const stream = await agent.stream(messages); const uiMessageStream = createUIMessageStream({ originalMessages: messages, execute: async ({ writer }) => { for await (const part of toAISdkStream(stream, { from: "agent" })) { await writer.write(part); } }, }); return createUIMessageStreamResponse({ stream: uiMessageStream }); }`

`agent.stream()` returns a Mastra-native stream. `toAISdkStream` (from `@mastra/ai-sdk`) adapts each part to the AI SDK shape; `createUIMessageStream` wraps the part loop into the UI message stream that `useChatRuntime` consumes; `createUIMessageStreamResponse` returns it as an HTTP response.

The `@/mastra` import assumes the `@/*` path alias is configured in `tsconfig.json` (the assistant-ui starter sets this up). If your project uses a different alias, adjust the import path.

### [Run and verify](#run-and-verify)

Start the dev server:

`npm run dev`

Open `http://localhost:3000`, send a message like *"What can I make with eggs and rice?"*, and confirm:

- The response streams in token by token.
- The browser's network tab shows a single `POST /api/chat` returning `text/event-stream`.
- No console errors about missing modules; if you see `Cannot find module '@mastra/...'`, revisit the `serverExternalPackages` step.

## [Notes](#notes)

- **Errors in the route bubble to the client as a stream error.** Wrap `agent.stream()` in `try/catch` if you need to log structured errors before they reach the client.

- **Pin compatible versions.** `@mastra/ai-sdk` tracks the AI SDK v6 contract. If you upgrade `ai` to a future major, verify the `toAISdkStream` shape against Mastra's release notes.

- **Advanced Mastra features** (memory, tools, workflows, evals) live entirely in the agent definition. assistant-ui sees only the resulting stream, so anything Mastra supports works without further frontend changes. See the

  - href

    https\://mastra.ai/docs

  Mastra docs

  .

## [Related](#related)

- href

  /docs/integrations/frameworks/mastra/separate-server

Separate server integrationRun Mastra as a standalone server, connect via API.

- href

  /docs/runtimes/ai-sdk/v6

AI SDK runtimeThe runtime that handles the client side of this integration.