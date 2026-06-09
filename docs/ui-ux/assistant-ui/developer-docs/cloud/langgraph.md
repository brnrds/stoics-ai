# LangGraph + assistant-ui
URL: /docs/cloud/langgraph

Integrate cloud persistence and thread management with LangGraph Cloud.

## [Overview](#overview)

This guide shows how to integrate Assistant Cloud with

- href

  https\://langchain-ai.github.io/langgraph/cloud/

LangGraph Cloud

using assistant-ui's runtime system and pre-built UI components.

## [Prerequisites](#prerequisites)

You need an assistant-cloud account to follow this guide.

- href

  https\://cloud.assistant-ui.com/

Sign up here

to get started.

## [Setup Guide](#setup-guide)

### [Create a Cloud Project](#create-a-cloud-project)

Create a new project in the

- href

  https\://cloud.assistant-ui.com/

assistant-cloud dashboard

and from the settings page, copy:

- **Frontend API URL**: `https://proj-[ID].assistant-api.com`
- **API Key**: For server-side operations

### [Configure Environment Variables](#configure-environment-variables)

Add the following environment variables to your project:

- value

  React

* title

  .env.local

`# Frontend API URL from your cloud project settings NEXT_PUBLIC_ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com # API key for server-side operations ASSISTANT_API_KEY=your-api-key-here`

- value

  React Native

* title

  .env

`# Client API URL from your cloud project settings EXPO_PUBLIC_ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com # API key for server-side operations; do not ship this in your app bundle ASSISTANT_API_KEY=your-api-key-here`

- value

  React Ink

* title

  .env

`# Client API URL from your cloud project settings ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com # API key for server-side operations; do not ship this in your CLI bundle ASSISTANT_API_KEY=your-api-key-here`

### [Install Dependencies](#install-dependencies)

Install the required packages:

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-langgraph

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-langgraph
  - assistant-cloud

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-langgraph
  - assistant-cloud
  - ink
  - react

### [Create the Runtime Provider](#create-the-runtime-provider)

Create a runtime provider that integrates LangGraph with assistant-cloud. Choose between anonymous mode for demos/prototypes or authenticated mode for production:

- value

  React

* items

  - Anonymous
  - Authenticated (Clerk)

- value

  Anonymous

* title

  app/chat/runtime-provider.tsx

`"use client"; import { AssistantCloud, AssistantRuntimeProvider, } from "@assistant-ui/react"; import { useLangGraphRuntime } from "@assistant-ui/react-langgraph"; import { createThread, deleteThread, getThreadState, sendMessage } from "@/lib/chatApi"; import { LangChainMessage } from "@assistant-ui/react-langgraph"; import { useMemo } from "react"; export function MyRuntimeProvider({ children, }: Readonly<{ children: React.ReactNode; }>) { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, anonymous: true, // Creates browser session-based user ID }), [], ); const runtime = useLangGraphRuntime({ cloud, stream: async function* (messages, { initialize }) { const { externalId } = await initialize(); if (!externalId) throw new Error("Thread not found"); return sendMessage({ threadId: externalId, messages, }); }, create: async () => { const { thread_id } = await createThread(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await getThreadState(externalId); return { messages: (state.values as { messages?: LangChainMessage[] }).messages ?? [], }; }, delete: async (externalId) => { await deleteThread(externalId); }, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  Authenticated (Clerk)

* title

  app/chat/runtime-provider.tsx

`"use client"; import { AssistantCloud, AssistantRuntimeProvider, } from "@assistant-ui/react"; import { useLangGraphRuntime } from "@assistant-ui/react-langgraph"; import { createThread, deleteThread, getThreadState, sendMessage } from "@/lib/chatApi"; import { LangChainMessage } from "@assistant-ui/react-langgraph"; import { useAuth } from "@clerk/nextjs"; import { useMemo } from "react"; export function MyRuntimeProvider({ children, }: Readonly<{ children: React.ReactNode; }>) { const { getToken } = useAuth(); const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: async () => getToken({ template: "assistant-ui" }), }), [getToken], ); const runtime = useLangGraphRuntime({ cloud, stream: async function* (messages, { initialize }) { const { externalId } = await initialize(); if (!externalId) throw new Error("Thread not found"); return sendMessage({ threadId: externalId, messages, }); }, create: async () => { const { thread_id } = await createThread(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await getThreadState(externalId); return { messages: (state.values as { messages?: LangChainMessage[] }).messages ?? [], }; }, delete: async (externalId) => { await deleteThread(externalId); }, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

For Clerk authentication, configure the `"assistant-ui"` token template in your Clerk dashboard.

- value

  React Native

* title

  components/runtime-provider.tsx

`import { useMemo, type ReactNode } from "react"; import { AssistantRuntimeProvider } from "@assistant-ui/react-native"; import { AssistantCloud } from "assistant-cloud"; import { type LangChainMessage, useLangGraphRuntime, } from "@assistant-ui/react-langgraph"; import { createThread, deleteThread, getThreadState, sendMessage } from "@/lib/chatApi"; async function getAssistantToken() { // Return a user token from your auth provider. return "..."; } export function MyRuntimeProvider({ children }: { children: ReactNode }) { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.EXPO_PUBLIC_ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), [], ); const runtime = useLangGraphRuntime({ cloud, stream: async function* (messages, { initialize }) { const { externalId } = await initialize(); if (!externalId) throw new Error("Thread not found"); return sendMessage({ threadId: externalId, messages, }); }, create: async () => { const { thread_id } = await createThread(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await getThreadState(externalId); return { messages: (state.values as { messages?: LangChainMessage[] }).messages ?? [], }; }, delete: async (externalId) => { await deleteThread(externalId); }, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  React Ink

* title

  runtime-provider.tsx

`import { useMemo, type ReactNode } from "react"; import { AssistantRuntimeProvider } from "@assistant-ui/react-ink"; import { AssistantCloud } from "assistant-cloud"; import { type LangChainMessage, useLangGraphRuntime, } from "@assistant-ui/react-langgraph"; import { createThread, deleteThread, getThreadState, sendMessage } from "./chat-api.js"; async function getAssistantToken() { // Return a user token from your auth provider. return "..."; } export function MyRuntimeProvider({ children }: { children: ReactNode }) { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), [], ); const runtime = useLangGraphRuntime({ cloud, stream: async function* (messages, { initialize }) { const { externalId } = await initialize(); if (!externalId) throw new Error("Thread not found"); return sendMessage({ threadId: externalId, messages, }); }, create: async () => { const { thread_id } = await createThread(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await getThreadState(externalId); return { messages: (state.values as { messages?: LangChainMessage[] }).messages ?? [], }; }, delete: async (externalId) => { await deleteThread(externalId); }, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

The `useLangGraphRuntime` hook accepts `cloud`, `create`, `load`, and `delete` parameters for simplified thread management. The runtime handles the thread lifecycle internally.

- **`create`**: Called when creating a new thread. Returns `{ externalId }` with your backend's thread ID.
- **`load`**: Called when switching to an existing thread. Returns the thread's messages (and optionally interrupts).
- **`delete`**: Called when deleting a thread. Receives the thread's `externalId`. When provided, users can delete threads from the thread list UI.

### [Add Thread UI Components](#add-thread-ui-components)

Install the thread list component:

- value

  React

* items

  - assistant-ui
  - shadcn (namespace)
  - shadcn

`npx assistant-ui@latest add thread-list``npx shadcn@latest add https://r.assistant-ui.com/thread-list.json``npx shadcn@latest add https://r.assistant-ui.com/thread-list.json`

Then add it to your application layout:

- title

  app/chat/page.tsx

`import { Thread } from "@/components/assistant-ui/thread"; import { ThreadList } from "@/components/assistant-ui/thread-list"; export default function ChatPage() { return ( <div className="grid h-dvh grid-cols-[250px_1fr] gap-x-2"> <ThreadList /> <Thread /> </div> ); }`

- value

  React Native

Follow the

- href

  /docs/react-native

React Native setup

for `Thread`, then compose it with the native thread-list primitives:

- title

  app/chat.tsx

`import { Text, View } from "react-native"; import { ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react-native"; import { Thread } from "@/components/assistant-ui/thread"; function ThreadList() { return ( <ThreadListPrimitive.Root> <ThreadListPrimitive.New> <Text>New chat</Text> </ThreadListPrimitive.New> <ThreadListPrimitive.Items renderItem={({ threadId }) => ( <ThreadListItemPrimitive.Root key={threadId}> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title fallback="New conversation" /> </ThreadListItemPrimitive.Trigger> </ThreadListItemPrimitive.Root> )} /> </ThreadListPrimitive.Root> ); } export default function ChatPage() { return ( <MyRuntimeProvider> <View style={{ flex: 1 }}> <ThreadList /> <Thread /> </View> </MyRuntimeProvider> ); }`

- value

  React Ink

Follow the

- href

  /docs/ink

Ink setup

for `Thread`, then compose it with the terminal thread-list primitives:

- title

  chat.tsx

`import { Box, Text } from "ink"; import { ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react-ink"; import { Thread } from "./components/thread.js"; function ThreadList() { return ( <ThreadListPrimitive.Root> <ThreadListPrimitive.New> <Text color="green">[New chat]</Text> </ThreadListPrimitive.New> <ThreadListPrimitive.Items renderItem={({ threadId }) => ( <ThreadListItemPrimitive.Root key={threadId}> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title fallback="New conversation" /> </ThreadListItemPrimitive.Trigger> </ThreadListItemPrimitive.Root> )} /> </ThreadListPrimitive.Root> ); } export function ChatPage() { return ( <MyRuntimeProvider> <Box flexDirection="column"> <ThreadList /> <Thread /> </Box> </MyRuntimeProvider> ); }`

## [Authentication](#authentication)

The React runtime-provider tab shows two authentication modes:

- **Anonymous**: Suitable for React demos and prototypes. Creates a browser session-based user ID.

- **Authenticated**: For production use with user accounts. The authenticated example uses

  - href

    https\://clerk.com/

  Clerk

  , but you can integrate any auth provider.

The React Native and React Ink tabs use explicit `authToken` callbacks, which is the recommended shape outside browser-session-based demos.

For other authentication providers or custom implementations, see the

- href

  /docs/cloud/authorization

Cloud Authorization

guide.

## [Next Steps](#next-steps)

- Learn about

  - href

    /docs/runtimes/langgraph

  LangGraph runtime setup

  for your application

- Explore

  - href

    /docs/api-reference/runtimes/thread-list-runtime

  ThreadListRuntime

  for advanced thread management

- Check out the

  - href

    https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-langgraph

  LangGraph example

  on GitHub