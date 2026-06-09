# Quickstart
URL: /docs/runtimes/langgraph/quickstart

From-template and manual setup paths to a working LangGraph chat.

Two paths to a running chat against a LangGraph Cloud server. The template is fastest; the manual path is what you adapt when integrating into an existing project.

## [From the template](#from-the-template)

- value

  React

`npx create-assistant-ui@latest -t langgraph my-app cd my-app`

Set environment variables:

- title

  .env.local

`# LANGCHAIN_API_KEY=your_api_key # production # LANGGRAPH_API_URL=your_api_url # production NEXT_PUBLIC_LANGGRAPH_API_URL=your_api_url # development (no API key required) NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=your_graph_id`

`npm run dev`

Skip ahead to

- href

  /docs/runtimes/langgraph/streaming

streaming

to start adding features.

- value

  React Native

There is not a React Native LangGraph template yet. Use the manual setup below in an Expo app.

- value

  React Ink

There is not an Ink LangGraph template yet. Use the manual setup below in a Node/Ink app.

## [Manual setup in an existing project](#manual-setup-in-an-existing-project)

### [Install dependencies](#install-dependencies)

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-langgraph
  - @langchain/langgraph-sdk

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-langgraph
  - @langchain/langgraph-sdk

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-langgraph
  - @langchain/langgraph-sdk
  - ink
  - react

### [Create the LangGraph client helper](#create-the-langgraph-client-helper)

- value

  React

* title

  @/lib/chatApi.ts

`import { Client } from "@langchain/langgraph-sdk"; export const createClient = () => { const apiUrl = process.env["NEXT_PUBLIC_LANGGRAPH_API_URL"] || (typeof window !== "undefined" ? new URL("/api", window.location.href).href : "/api"); return new Client({ apiUrl }); };`

- value

  React Native

* title

  lib/chatApi.ts

`import { Client } from "@langchain/langgraph-sdk"; export const createClient = () => { const apiUrl = process.env.EXPO_PUBLIC_LANGGRAPH_API_URL ?? "http://localhost:2024"; return new Client({ apiUrl }); };`

- value

  React Ink

* title

  lib/chatApi.ts

`import { Client } from "@langchain/langgraph-sdk"; export const createClient = () => { const apiUrl = process.env.LANGGRAPH_API_URL ?? "http://localhost:2024"; return new Client({ apiUrl }); };`

### [Build the assistant component](#build-the-assistant-component)

- value

  React

* title

  @/components/MyAssistant.tsx

`"use client"; import { useMemo } from "react"; import { Thread } from "@/components/assistant-ui/thread"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { unstable_createLangGraphStream, useLangGraphRuntime, type LangChainMessage, } from "@assistant-ui/react-langgraph"; import { createClient } from "@/lib/chatApi"; const ASSISTANT_ID = process.env["NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID"]!; export function MyAssistant() { const client = useMemo(() => createClient(), []); const stream = useMemo( () => unstable_createLangGraphStream({ client, assistantId: ASSISTANT_ID, }), [client], ); const runtime = useLangGraphRuntime({ unstable_allowCancellation: true, stream, create: async () => { const { thread_id } = await client.threads.create(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await client.threads.getState<{ messages: LangChainMessage[]; }>(externalId); return { messages: state.values.messages, interrupts: state.tasks[0]?.interrupts, }; }, }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  components/MyAssistant.tsx

`import { useMemo } from "react"; import { AssistantRuntimeProvider } from "@assistant-ui/react-native"; import { unstable_createLangGraphStream, useLangGraphRuntime, type LangChainMessage, } from "@assistant-ui/react-langgraph"; import { Thread } from "@/components/assistant-ui/thread"; import { createClient } from "@/lib/chatApi"; const ASSISTANT_ID = process.env.EXPO_PUBLIC_LANGGRAPH_ASSISTANT_ID!; export function MyAssistant() { const client = useMemo(() => createClient(), []); const stream = useMemo( () => unstable_createLangGraphStream({ client, assistantId: ASSISTANT_ID, }), [client], ); const runtime = useLangGraphRuntime({ unstable_allowCancellation: true, stream, create: async () => { const { thread_id } = await client.threads.create(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await client.threads.getState<{ messages: LangChainMessage[]; }>(externalId); return { messages: state.values.messages, interrupts: state.tasks[0]?.interrupts, }; }, }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

- value

  React Ink

* title

  components/MyAssistant.tsx

`import { useMemo } from "react"; import { AssistantRuntimeProvider } from "@assistant-ui/react-ink"; import { unstable_createLangGraphStream, useLangGraphRuntime, type LangChainMessage, } from "@assistant-ui/react-langgraph"; import { Thread } from "./thread.js"; import { createClient } from "../lib/chatApi.js"; const ASSISTANT_ID = process.env.LANGGRAPH_ASSISTANT_ID!; export function MyAssistant() { const client = useMemo(() => createClient(), []); const stream = useMemo( () => unstable_createLangGraphStream({ client, assistantId: ASSISTANT_ID, }), [client], ); const runtime = useLangGraphRuntime({ unstable_allowCancellation: true, stream, create: async () => { const { thread_id } = await client.threads.create(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await client.threads.getState<{ messages: LangChainMessage[]; }>(externalId); return { messages: state.values.messages, interrupts: state.tasks[0]?.interrupts, }; }, }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

### [Mount the component](#mount-the-component)

- value

  React

* title

  @/app/page.tsx

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

### [Set environment variables](#set-environment-variables)

- value

  React

Use the same `.env.local` shape as the template path

- href

  \#from-the-template

above

.

- value

  React Native

* title

  .env

`EXPO_PUBLIC_LANGGRAPH_API_URL=http://localhost:2024 EXPO_PUBLIC_LANGGRAPH_ASSISTANT_ID=your_graph_id`

- value

  React Ink

* title

  .env

`LANGGRAPH_API_URL=http://localhost:2024 LANGGRAPH_ASSISTANT_ID=your_graph_id`

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

## [Production proxy backend](#production-proxy-backend)

For development, the client above hits LangGraph Cloud directly using `NEXT_PUBLIC_LANGGRAPH_API_URL`. For production, proxy through your own backend so your API key never reaches the client. Limit the proxy to the endpoints you actually need.

- title

  @/app/api/\[...path]/route.ts

``import { NextRequest, NextResponse } from "next/server"; export const runtime = "edge"; function getCorsHeaders() { return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS", "Access-Control-Allow-Headers": "*", }; } async function handleRequest(req: NextRequest, method: string) { try { const path = req.nextUrl.pathname.replace(/^\/?api\//, ""); const url = new URL(req.url); const searchParams = new URLSearchParams(url.search); searchParams.delete("_path"); searchParams.delete("nxtP_path"); const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ""; const options: RequestInit = { method, headers: { "x-api-key": process.env["LANGCHAIN_API_KEY"] ?? "" }, signal: req.signal, }; if (["POST", "PUT", "PATCH"].includes(method)) { options.body = await req.text(); } const res = await fetch( `${process.env["LANGGRAPH_API_URL"]}/${path}${queryString}`, options, ); const headers = new Headers(res.headers); headers.delete("content-encoding"); headers.delete("content-length"); headers.delete("transfer-encoding"); for (const [key, value] of Object.entries(getCorsHeaders())) { headers.set(key, value); } return new NextResponse(res.body, { status: res.status, statusText: res.statusText, headers, }); } catch (e: unknown) { if (e instanceof Error) { const typedError = e as Error & { status?: number }; return NextResponse.json( { error: typedError.message }, { status: typedError.status ?? 500 }, ); } return NextResponse.json({ error: "Unknown error" }, { status: 500 }); } } export const GET = (req: NextRequest) => handleRequest(req, "GET"); export const POST = (req: NextRequest) => handleRequest(req, "POST"); export const PUT = (req: NextRequest) => handleRequest(req, "PUT"); export const PATCH = (req: NextRequest) => handleRequest(req, "PATCH"); export const DELETE = (req: NextRequest) => handleRequest(req, "DELETE"); export const OPTIONS = () => new NextResponse(null, { status: 204, headers: getCorsHeaders() });``

With this route in place, drop `NEXT_PUBLIC_LANGGRAPH_API_URL` from production env vars; the client helper falls back to the same-origin `/api` path. Set `LANGCHAIN_API_KEY` and `LANGGRAPH_API_URL` server-side instead.

## [Next](#next)

- href

  /docs/runtimes/langgraph/streaming

StreamingEvent handlers, message metadata, message conversion.

- href

  /docs/runtimes/langgraph/generative-ui

Generative UIStructured UI components emitted by your graph.

- href

  /docs/runtimes/langgraph/interrupts

InterruptsInterrupt persistence and checkpoint-based message editing.