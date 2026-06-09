# Quickstart
URL: /docs/runtimes/a2a/quickstart

Minimal runtime and Thread setup against an A2A server.

Three steps to a working chat against an A2A server. Assumes you have already installed the package and have an A2A v1.0 server reachable; if not, start at

- href

  /docs/runtimes/a2a

overview

.

### [Wire up the runtime provider](#wire-up-the-runtime-provider)

- value

  React

* title

  app/MyRuntimeProvider.tsx

`"use client"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { useA2ARuntime } from "@assistant-ui/react-a2a"; export function MyRuntimeProvider({ children, }: { children: React.ReactNode; }) { const runtime = useA2ARuntime({ baseUrl: "http://localhost:9999", }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  runtime/MyRuntimeProvider.tsx

`import { AssistantRuntimeProvider } from "@assistant-ui/react-native"; import { useA2ARuntime } from "@assistant-ui/react-a2a"; export function MyRuntimeProvider({ children, }: { children: React.ReactNode; }) { const runtime = useA2ARuntime({ baseUrl: "http://localhost:9999", }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  React Ink

* title

  runtime/MyRuntimeProvider.tsx

`import { AssistantRuntimeProvider } from "@assistant-ui/react-ink"; import { useA2ARuntime } from "@assistant-ui/react-a2a"; export function MyRuntimeProvider({ children, }: { children: React.ReactNode; }) { const runtime = useA2ARuntime({ baseUrl: "http://localhost:9999", }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

### [Render the Thread](#render-the-thread)

- value

  React

* title

  app/page.tsx

`import { Thread } from "@/components/assistant-ui/thread"; import { MyRuntimeProvider } from "./MyRuntimeProvider"; export default function Page() { return ( <MyRuntimeProvider> <Thread /> </MyRuntimeProvider> ); }`

- value

  React Native

* title

  app/index.tsx

`import { View } from "react-native"; import { Thread } from "@/components/assistant-ui/thread"; import { MyRuntimeProvider } from "@/runtime/MyRuntimeProvider"; export default function Page() { return ( <MyRuntimeProvider> <View style={{ flex: 1 }}> <Thread /> </View> </MyRuntimeProvider> ); }`

- value

  React Ink

* title

  app.tsx

`import { Box } from "ink"; import { Thread } from "./components/thread.js"; import { MyRuntimeProvider } from "./runtime/MyRuntimeProvider.js"; export function App() { return ( <MyRuntimeProvider> <Box flexDirection="column"> <Thread /> </Box> </MyRuntimeProvider> ); }`

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

Once your A2A server is reachable, the runtime negotiates streaming vs non-streaming based on the agent card's `capabilities.streaming` flag and starts forwarding messages.

## [Auth and headers](#auth-and-headers)

Pass static or dynamic headers when your server expects auth:

``const runtime = useA2ARuntime({ baseUrl: "http://localhost:9999", headers: async () => ({ Authorization: `Bearer ${await getAccessToken()}`, }), });``

## [Adding adapters](#adding-adapters)

Attachments, speech, feedback, history, and a custom thread list are all supported via the standard adapter slots. See

- href

  /docs/runtimes/concepts/adapters

adapters

for the contracts; pass them on `useA2ARuntime`:`const runtime = useA2ARuntime({ baseUrl: "http://localhost:9999", adapters: { attachments, history, speech, feedback }, });`

For multi-thread, see

- href

  /docs/runtimes/concepts/threads

threads

and pass `adapters.threadList`.

## [Next](#next)

- href

  /docs/runtimes/a2a/client-and-hooks

Client and hooksA2AClient, useA2ARuntime options, hooks reference, task states, artifacts.

- href

  /docs/runtimes/pick-a-runtime

Pick a runtimeCompare A2A to other runtime options.