# Quickstart
URL: /docs/runtimes/google-adk/quickstart

Minimal API route and client setup with createAdkApiRoute.

Four steps to a working ADK chat. Assumes you have already installed the package and have ADK ready on the server side; if not, start at

- href

  /docs/runtimes/google-adk

overview

.

### [Create a backend API endpoint](#create-a-backend-api-endpoint)

Use `createAdkApiRoute` to create an API route in one line: For React Native and Ink, host this route in a separate backend project and point the client runtime at its absolute URL.

- title

  app/api/chat/route.ts

`import { createAdkApiRoute } from "@assistant-ui/react-google-adk/server"; import { InMemoryRunner, LlmAgent } from "@google/adk"; const agent = new LlmAgent({ name: "my_agent", model: "gemini-2.5-flash", instruction: "You are a helpful assistant.", }); const runner = new InMemoryRunner({ agent, appName: "my-app" }); export const POST = createAdkApiRoute({ runner, userId: "user_1", sessionId: (req) => new URL(req.url).searchParams.get("sessionId") ?? "default", });`

Both `userId` and `sessionId` accept either a static string or `(req: Request) => string` for dynamic resolution from cookies, headers, or query params.

### [Set up the client runtime](#set-up-the-client-runtime)

Use `createAdkStream` to connect to your API route. No manual SSE parsing needed:

- value

  React

* title

  components/MyAssistant.tsx

`"use client"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { useAdkRuntime, createAdkStream, } from "@assistant-ui/react-google-adk"; import { Thread } from "@/components/assistant-ui/thread"; export function MyAssistant() { const runtime = useAdkRuntime({ stream: createAdkStream({ api: "/api/chat" }), }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  components/MyAssistant.tsx

``import { AssistantRuntimeProvider } from "@assistant-ui/react-native"; import { useAdkRuntime, createAdkStream, } from "@assistant-ui/react-google-adk"; import { Thread } from "@/components/assistant-ui/thread"; const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"; export function MyAssistant() { const runtime = useAdkRuntime({ stream: createAdkStream({ api: `${API_URL}/api/chat` }), }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }``

- value

  React Ink

* title

  components/MyAssistant.tsx

`import { AssistantRuntimeProvider } from "@assistant-ui/react-ink"; import { useAdkRuntime, createAdkStream, } from "@assistant-ui/react-google-adk"; import { Thread } from "./thread.js"; export function MyAssistant() { const runtime = useAdkRuntime({ stream: createAdkStream({ api: "http://localhost:3000/api/chat" }), }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

### [Use the component](#use-the-component)

- value

  React

* title

  app/page.tsx

`import { MyAssistant } from "@/components/MyAssistant"; export default function Home() { return ( <main className="h-dvh"> <MyAssistant /> </main> ); }`

- value

  React Native

* title

  app/index.tsx

`import { View } from "react-native"; import { MyAssistant } from "@/components/MyAssistant"; export default function Home() { return ( <View style={{ flex: 1 }}> <MyAssistant /> </View> ); }`

- value

  React Ink

* title

  app.tsx

`import { Box } from "ink"; import { MyAssistant } from "./components/MyAssistant.js"; export function App() { return ( <Box flexDirection="column"> <MyAssistant /> </Box> ); }`

### [Set up UI components](#set-up-ui-components)

- value

  React

Follow the

- href

  /docs/ui/thread

UI Components guide

to wire up the Thread, composer, and supporting primitives.

- value

  React Native

Follow the

- href

  /docs/react-native

React Native setup

to add a native Thread, composer, and supporting primitives.

- value

  React Ink

Follow the

- href

  /docs/ink

Ink setup

to add a terminal Thread, composer, and supporting primitives.

## [Adding adapters](#adding-adapters)

Attachments, speech, feedback, history, and a custom thread list are supported via the standard adapter slots. See

- href

  /docs/runtimes/concepts/adapters

adapters

:`const runtime = useAdkRuntime({ stream: createAdkStream({ api: "/api/chat" }), adapters: { attachments, history, speech, feedback }, });`

For multi-thread, see

- href

  /docs/runtimes/concepts/threads

threads

.

## [Next](#next)

- href

  /docs/runtimes/google-adk/api

API referencecreateAdkStream, server helpers, session adapter, threads, message editing.

- href

  /docs/runtimes/google-adk/hooks

HooksTool confirmations, auth, input requests, artifacts, escalation, metadata.