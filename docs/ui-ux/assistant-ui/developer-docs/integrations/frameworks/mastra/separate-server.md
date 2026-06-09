# Separate server integration
URL: /docs/integrations/frameworks/mastra/separate-server

Run Mastra as a standalone server with assistant-ui as a separate frontend.

Run Mastra as its own service and have the assistant-ui frontend hit it over HTTP. The two halves can deploy, scale, and version independently. The tradeoff is one extra hop and CORS to configure.

For the simpler in-process variant, see

- href

  /docs/integrations/frameworks/mastra/full-stack

full-stack

instead.

## [Setup](#setup)

The setup has two halves. Steps 1 to 4 happen in the **Mastra server** project; steps 5 to 7 happen in a **separate assistant-ui frontend** project. You'll have two terminals open by the end: one for each dev server.

### [Create the Mastra server project](#create-the-mastra-server-project)

In a directory separate from your frontend, scaffold a Mastra project:

`npx create-mastra@latest`

Follow the wizard's prompts. When it finishes, change into the new directory and add the AI SDK adapter:

`cd your-mastra-server`

- packages

  - @mastra/ai-sdk\@latest

Set the model provider keys (`OPENAI_API_KEY`, etc.) in `.env.development`. The `create-mastra` wizard prompts for some keys, but verify all the providers you plan to call are present.

### [Define an agent](#define-an-agent)

- title

  src/mastra/agents/chefAgent.ts

`import { Agent } from "@mastra/core/agent"; export const chefAgent = new Agent({ name: "chef-agent", instructions: "You are Michel, a practical and experienced home chef. " + "You help people cook with whatever ingredients they have available.", model: "openai/gpt-5.4-nano", });`

### [Register the agent, chat route, and CORS](#register-the-agent-chat-route-and-cors)

Open the Mastra entry point. You will set three things in the same `Mastra` constructor: the agent, a chat route, and CORS for the frontend's origin.

- title

  src/mastra/index.ts

`import { Mastra } from "@mastra/core"; import { chefAgent } from "./agents/chefAgent"; import { chatRoute } from "@mastra/ai-sdk"; export const mastra = new Mastra({ agents: { chefAgent }, server: { cors: { origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000", credentials: true, }, apiRoutes: [ chatRoute({ path: "/chat/:agentId" }), ], }, });`

A few things to note:

- `:agentId` matches the **JavaScript key** in the `agents` object, not the agent's `name` field. So `chefAgent` is reachable at `/chat/chefAgent` (camelCase), not `/chat/chef-agent`.
- Add more agents to the `agents` object and they all become callable through this single route.
- `FRONTEND_ORIGIN` should be set to your deployed frontend's URL in production. Without CORS configured, the browser blocks the request and the chat silently fails.

### [Run the Mastra server](#run-the-mastra-server)

`npm run dev`

The server starts on `http://localhost:4111` by default. Leave it running for the rest of the steps.

### [Initialize the assistant-ui frontend](#initialize-the-assistant-ui-frontend)

In a **different directory** from the Mastra server, scaffold the frontend:

- title

  New project

`npx assistant-ui@latest create`

- title

  Existing project

`npx assistant-ui@latest init`

This creates a default chat page and a local API route at `app/api/chat/route.ts`. You won't use the local route, since the agent runs on the separate Mastra server; delete it once the next step is wired.

### [Point the runtime at the Mastra server](#point-the-runtime-at-the-mastra-server)

Open the file containing `useChatRuntime` (typically `app/assistant.tsx`) and pass an explicit `api` URL:

- title

  app/assistant.tsx

`"use client"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk"; import { Thread } from "@/components/assistant-ui/thread"; export const Assistant = () => { const runtime = useChatRuntime({ transport: new AssistantChatTransport({ api: process.env.NEXT_PUBLIC_MASTRA_URL!, }), }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); };`

Set the URL in your frontend's environment:

- title

  .env.local

`NEXT_PUBLIC_MASTRA_URL=http://localhost:4111/chat/chefAgent`

`NEXT_PUBLIC_*` makes the URL available in the browser. In production, point this at your deployed Mastra server. Mastra itself uses `.env.development` for its server keys; the two projects keep separate environment files.

### [Run and verify](#run-and-verify)

Make sure the Mastra server (step 4) is still running in its own terminal, then start the frontend in a new terminal:

`npm run dev`

Open `http://localhost:3000`, send a message, and confirm:

- The response streams in token by token.
- The network tab shows the `POST` going to `http://localhost:4111/chat/chefAgent`, not the local `/api/chat`.
- No CORS errors in the console; if you see `blocked by CORS policy`, revisit step 3.

## [Notes](#notes)

- **Auth between frontend and Mastra**: the example above is open. In production, gate the Mastra route with a header or cookie check and forward credentials from the frontend (`AssistantChatTransport` accepts `headers` and `credentials` options).

- **Single agent vs router**: `chatRoute({ path: "/chat/:agentId" })` works for any agent registered on the `Mastra` instance. Switching agents from the frontend is a matter of pointing `NEXT_PUBLIC_MASTRA_URL` at a different agent ID.

- **Advanced Mastra features** (memory, tools, workflows, evals) live in the agent definition. The frontend sees only the resulting stream. See the

  - href

    https\://mastra.ai/docs

  Mastra docs

  .

## [Related](#related)

- href

  /docs/integrations/frameworks/mastra/full-stack

Full-stack integrationRun Mastra inside your Next.js API routes for a single deploy target.

- href

  /docs/runtimes/ai-sdk/v6

AI SDK runtimeThe runtime that handles the client side of this integration.