# Quickstart
URL: /docs/runtimes/ag-ui/quickstart

Minimal HttpAgent + useAgUiRuntime setup against an AG-UI server.

Three steps to a working chat against an AG-UI agent. Assumes you have already installed the package and have an AG-UI server reachable; if not, start at

- href

  /docs/runtimes/ag-ui

overview

.

### [Wire up the runtime provider](#wire-up-the-runtime-provider)

Create an `HttpAgent` pointing at your AG-UI endpoint and pass it to `useAgUiRuntime`:

- value

  React

* title

  app/MyRuntimeProvider.tsx

`"use client"; import { useMemo } from "react"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { useAgUiRuntime } from "@assistant-ui/react-ag-ui"; import { HttpAgent } from "@ag-ui/client"; export function MyRuntimeProvider({ children, }: { children: React.ReactNode; }) { const agent = useMemo( () => new HttpAgent({ url: "http://localhost:8000/agent", }), [], ); const runtime = useAgUiRuntime({ agent }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  runtime/MyRuntimeProvider.tsx

`import { useMemo } from "react"; import { AssistantRuntimeProvider } from "@assistant-ui/react-native"; import { useAgUiRuntime } from "@assistant-ui/react-ag-ui"; import { HttpAgent } from "@ag-ui/client"; export function MyRuntimeProvider({ children, }: { children: React.ReactNode; }) { const agent = useMemo( () => new HttpAgent({ url: "http://localhost:8000/agent", }), [], ); const runtime = useAgUiRuntime({ agent }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  React Ink

* title

  runtime/MyRuntimeProvider.tsx

`import { useMemo } from "react"; import { AssistantRuntimeProvider } from "@assistant-ui/react-ink"; import { useAgUiRuntime } from "@assistant-ui/react-ag-ui"; import { HttpAgent } from "@ag-ui/client"; export function MyRuntimeProvider({ children, }: { children: React.ReactNode; }) { const agent = useMemo( () => new HttpAgent({ url: "http://localhost:8000/agent", }), [], ); const runtime = useAgUiRuntime({ agent }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

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

Once your AG-UI server is reachable, the runtime parses incoming events (`TEXT_MESSAGE_*`, `TOOL_CALL_*`, `STATE_SNAPSHOT`, etc.) into assistant-ui messages.

## [Showing thinking and reasoning](#showing-thinking-and-reasoning)

`showThinking` (default `true`) controls whether `THINKING_*` and `REASONING_*` events render as visible reasoning in the UI:

`const runtime = useAgUiRuntime({ agent, showThinking: false, // hide thinking blocks });`

## [Adding adapters](#adding-adapters)

Attachments, speech, dictation, feedback, history, and a custom thread list are supported via the standard adapter slots. See

- href

  /docs/runtimes/concepts/adapters

adapters

:`const runtime = useAgUiRuntime({ agent, adapters: { attachments, history, speech, feedback }, });`

For multi-thread, pass `adapters.threadList` (experimental); see

- href

  /docs/runtimes/ag-ui/runtime-options#thread-list-experimental

runtime options

.

## [Next](#next)

- href

  /docs/runtimes/ag-ui/runtime-options

Runtime optionsuseAgUiRuntime options, adapters, events, thread list.

- href

  /docs/runtimes/pick-a-runtime

Pick a runtimeCompare AG-UI to other runtime options.