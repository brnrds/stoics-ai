# LangChain React Runtime
URL: /docs/runtimes/langchain

Use LangChain's useStream hook with a React chat UI through assistant-ui — a lighter LangGraph adapter that delegates streaming to @langchain/react.

`@assistant-ui/react-langchain` wraps

- href

  https\://docs.langchain.com/oss/javascript/langgraph-sdk/react-stream

`useStream`

from `@langchain/react` and exposes it as an assistant-ui runtime. It targets the same backend as

- href

  /docs/runtimes/langgraph

`@assistant-ui/react-langgraph`

(LangGraph Cloud) but at a higher level, delegating stream plumbing to the upstream hook.

## [When to use it](#when-to-use-it)

Pick `react-langchain` over `react-langgraph` when:

- Your app already depends on `@langchain/react` and uses `useStream` elsewhere.
- You want to read custom state keys (`todos`, `files`, plans) reactively with `useLangChainState<T>(key)`.
- You prefer a thin wrapper that stays pinned to upstream behavior.

Pick `react-langgraph` instead when:

- You are scaffolding via `npx create-assistant-ui -t langgraph` (the template uses it).
- You need subgraph events, generative UI messages, message metadata, or end-to-end cancellation today.

Both adapters are first-class. `react-langchain` is newer and thinner; some features have not been ported yet (the

- href

  \#comparison-with-react-langgraph

comparison

below has the full table).

## [Architecture](#architecture)

`@assistant-ui/react-langchain` is layered on `ExternalStoreRuntime` (see

- href

  /docs/runtimes/concepts/architecture

architecture

). Graph state is the source of truth; the runtime renders messages from `state.values.messages` and submits user input back to the graph.

Shared adapters (attachments, speech, feedback) work the same way described in

- href

  /docs/runtimes/concepts/adapters

adapters

. Cloud thread persistence is built in.

## [Requirements](#requirements)

- A LangGraph Cloud API server (locally via

  - href

    https\://github.com/langchain-ai/langgraph-studio

  LangGraph Studio

  or hosted via

  - href

    https\://www\.langchain.com/langsmith

  LangSmith

  ).

- The graph state must include a `messages` key with LangChain-alike messages, or pass a custom `messagesKey`.

## [Quickstart](#quickstart)

### [Install dependencies](#install-dependencies)

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-langchain
  - @langchain/react
  - @langchain/langgraph-sdk

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-langchain
  - @langchain/react
  - @langchain/langgraph-sdk

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-langchain
  - @langchain/react
  - @langchain/langgraph-sdk
  - ink
  - react

### [Define the assistant component](#define-the-assistant-component)

- value

  React

* title

  @/components/MyAssistant.tsx

`"use client"; import { Thread } from "@/components/assistant-ui/thread"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { useStreamRuntime } from "@assistant-ui/react-langchain"; export function MyAssistant() { const runtime = useStreamRuntime({ assistantId: process.env["NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID"]!, apiUrl: process.env["NEXT_PUBLIC_LANGGRAPH_API_URL"], }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  components/MyAssistant.tsx

`import { Thread } from "@/components/assistant-ui/thread"; import { AssistantRuntimeProvider } from "@assistant-ui/react-native"; import { useStreamRuntime } from "@assistant-ui/react-langchain"; export function MyAssistant() { const runtime = useStreamRuntime({ assistantId: process.env.EXPO_PUBLIC_LANGGRAPH_ASSISTANT_ID!, apiUrl: process.env.EXPO_PUBLIC_LANGGRAPH_API_URL, }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

- value

  React Ink

* title

  components/MyAssistant.tsx

`import { Thread } from "./thread.js"; import { AssistantRuntimeProvider } from "@assistant-ui/react-ink"; import { useStreamRuntime } from "@assistant-ui/react-langchain"; export function MyAssistant() { const runtime = useStreamRuntime({ assistantId: process.env.LANGGRAPH_ASSISTANT_ID!, apiUrl: process.env.LANGGRAPH_API_URL, }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

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

* title

  .env.local

`NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:2024 NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=your_graph_id`

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

.

- value

  React Native

Follow the

- href

  /docs/react-native

React Native setup

.

- value

  React Ink

Follow the

- href

  /docs/ink

Ink setup

.

## [`useStreamRuntime` options](#usestreamruntime-options)

`useStreamRuntime` accepts every option upstream `useStream` does, plus three assistant-ui-specific fields:

| Option        | Type                                   | Description                                                  |
| ------------- | -------------------------------------- | ------------------------------------------------------------ |
| `cloud`       | `AssistantCloud`                       | Optional. Persists threads via assistant-cloud.              |
| `adapters`    | `{ attachments?, speech?, feedback? }` | Optional. Attachment, speech, and feedback adapters.         |
| `messagesKey` | `string`                               | The state key that holds messages. Defaults to `"messages"`. |

## [Reading custom state keys](#reading-custom-state-keys)

LangGraph agents often expose structured state beyond messages (plans, todos, scratch files, generative-UI artifacts). Read them directly with `useLangChainState`. It mirrors `useStream().values[key]` upstream and updates when the stream emits new state.

- value

  React

`import { useLangChainState } from "@assistant-ui/react-langchain"; type Todo = { id: string; title: string; done: boolean }; function TodoList() { const todos = useLangChainState<Todo[]>("todos", []); return ( <ul> {todos.map((t) => ( <li key={t.id}> {t.done ? "✓" : "○"} {t.title} </li> ))} </ul> ); }`

- value

  React Native

`import { useLangChainState } from "@assistant-ui/react-langchain"; import { Text, View } from "react-native"; type Todo = { id: string; title: string; done: boolean }; function TodoList() { const todos = useLangChainState<Todo[]>("todos", []); return ( <View> {todos.map((t) => ( <Text key={t.id}> {t.done ? "✓" : "○"} {t.title} </Text> ))} </View> ); }`

- value

  React Ink

`import { useLangChainState } from "@assistant-ui/react-langchain"; import { Box, Text } from "ink"; type Todo = { id: string; title: string; done: boolean }; function TodoList() { const todos = useLangChainState<Todo[]>("todos", []); return ( <Box flexDirection="column"> {todos.map((t) => ( <Text key={t.id}> {t.done ? "✓" : "○"} {t.title} </Text> ))} </Box> ); }`

Signatures:

`useLangChainState<T>(key: string): T | undefined; useLangChainState<T>(key: string, defaultValue: T): T;`

Useful with the

- href

  https\://docs.langchain.com/oss/python/deepagents

`deepagents`

middleware, whose `write_todos` step updates `state.todos` alongside the tool-call stream. Reading the state key directly avoids reconstructing the list from partial tool-call args.

Added in v0.0.2 — see issue

- href

  https\://github.com/assistant-ui/assistant-ui/issues/3862

\#3862

for motivation.

## [Interrupts](#interrupts)

LangGraph interrupts pause the graph and wait for client input. `useLangChainInterruptState` exposes the current interrupt; `useLangChainSubmit` resumes the graph with a raw state update.

- value

  React

`import { useLangChainInterruptState, useLangChainSubmit, } from "@assistant-ui/react-langchain"; import { Command } from "@langchain/langgraph-sdk"; function InterruptPrompt() { const interrupt = useLangChainInterruptState(); const submit = useLangChainSubmit(); if (!interrupt) return null; return ( <div> <pre>{JSON.stringify(interrupt.value, null, 2)}</pre> <button onClick={() => submit(null, { command: new Command({ resume: "approved" }) }) } > Approve </button> </div> ); }`

- value

  React Native

`import { useLangChainInterruptState, useLangChainSubmit, } from "@assistant-ui/react-langchain"; import { Command } from "@langchain/langgraph-sdk"; import { Pressable, Text, View } from "react-native"; function InterruptPrompt() { const interrupt = useLangChainInterruptState(); const submit = useLangChainSubmit(); if (!interrupt) return null; return ( <View> <Text>{JSON.stringify(interrupt.value, null, 2)}</Text> <Pressable onPress={() => submit(null, { command: new Command({ resume: "approved" }) }) } > <Text>Approve</Text> </Pressable> </View> ); }`

- value

  React Ink

`import { useLangChainInterruptState, useLangChainSubmit, } from "@assistant-ui/react-langchain"; import { Command } from "@langchain/langgraph-sdk"; import { Box, Text, useInput } from "ink"; function InterruptPrompt() { const interrupt = useLangChainInterruptState(); const submit = useLangChainSubmit(); useInput((input) => { if (!interrupt || input !== "a") return; submit(null, { command: new Command({ resume: "approved" }) }); }); if (!interrupt) return null; return ( <Box flexDirection="column"> <Text>{JSON.stringify(interrupt.value, null, 2)}</Text> <Text>Press a to approve.</Text> </Box> ); }`

## [Message conversion](#message-conversion)

`convertLangChainBaseMessage` transforms a LangChain `BaseMessage` into an assistant-ui message. Use it when building a custom `ExternalStoreAdapter` that consumes LangChain messages outside `useStreamRuntime`.

`import { convertLangChainBaseMessage } from "@assistant-ui/react-langchain";`

## [Cloud persistence](#cloud-persistence)

Pass an `AssistantCloud` instance to persist threads across sessions. The runtime automatically wires thread list management and resumes state from the cloud.

`// see "AssistantCloud" in /docs/runtimes/concepts/threads for cloud setup const runtime = useStreamRuntime({ cloud, assistantId: "agent", apiUrl: "http://localhost:2024", });`

## [Custom `messagesKey`](#custom-messageskey)

If your graph stores messages under a non-default key, pass `messagesKey` so the runtime submits tool results and human turns to the correct state slot:

`const runtime = useStreamRuntime({ assistantId: "agent", apiUrl: "http://localhost:2024", messagesKey: "chat_messages", });`

## [Comparison with `react-langgraph`](#comparison-with-react-langgraph)

Both packages connect assistant-ui to LangGraph backends. They are independent adapters for different upstream libraries; one is not a successor to the other.

| Aspect                         | `react-langgraph`                    | `react-langchain`                     |
| ------------------------------ | ------------------------------------ | ------------------------------------- |
| Wraps                          | `@langchain/langgraph-sdk` (raw SDK) | `@langchain/react` (`useStream` hook) |
| Age                            | Sept 2024 onward                     | April 2026 onward                     |
| Version                        | `0.13.x`                             | `0.0.x`                               |
| Lines of source                | \~7,500                              | \~600                                 |
| Built on                       | `useExternalStoreRuntime`            | `useExternalStoreRuntime`             |
| `create-assistant-ui` template | `-t langgraph`                       | No template yet                       |

### [Feature coverage](#feature-coverage)

| Feature                                 | `react-langgraph`                      | `react-langchain`                 |
| --------------------------------------- | -------------------------------------- | --------------------------------- |
| Stream messages                         | Yes (`useLangGraphRuntime`)            | Yes (`useStreamRuntime`)          |
| Interrupt state                         | Yes                                    | Yes                               |
| Send raw state update / resume command  | Yes                                    | Yes (`useLangChainSubmit`)        |
| Read arbitrary custom state key         | No                                     | Yes (`useLangChainState<T>(key)`) |
| Per-message metadata (`messages-tuple`) | Yes                                    | Not exposed                       |
| Generative UI messages (LangSmith)      | Yes                                    | Not exposed                       |
| Subgraph / namespaced stream events     | Yes (via `eventHandlers`)              | Not exposed                       |
| End-to-end cancellation primitive       | Yes (`unstable_createLangGraphStream`) | Not exposed                       |
| Message accumulator utility             | Yes (`LangGraphMessageAccumulator`)    | Not exposed                       |
| Cloud thread persistence                | Yes                                    | Yes                               |

`react-langchain` is the newer, thinner wrapper. It delegates to upstream `useStream` rather than re-implementing the stream plumbing, which is why its footprint is smaller. Features absent today have not been ported, not deprecated.

### [Hook name mapping](#hook-name-mapping)

| `react-langgraph`             | `react-langchain`               | Notes                                                                                 |
| ----------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `useLangGraphRuntime`         | `useStreamRuntime`              | Options extend upstream `UseStreamOptions`; no `stream` / `create` / `load` to write. |
| `useLangGraphInterruptState`  | `useLangChainInterruptState`    | Same return shape.                                                                    |
| `useLangGraphSendCommand`     | `useLangChainSubmit`            | `submit(values, { command })` replaces the dedicated hook.                            |
| `useLangGraphSend`            | *(use `runtime.thread.append`)* | No direct equivalent; send turns through the runtime.                                 |
| `useLangGraphMessageMetadata` | *(not available)*               | Open an issue if you rely on this.                                                    |
| `useLangGraphUIMessages`      | *(not available)*               | Open an issue if you rely on this.                                                    |
| *(none)*                      | `useLangChainState<T>(key)`     | New — reads any custom state key reactively.                                          |

## [Related](#related)

- href

  /docs/runtimes/langgraph

LangGraphThe full-featured adapter with subgraph events, UI messages, metadata.

- href

  /docs/runtimes/custom/external-store

ExternalStoreRuntimeThe core runtime react-langchain is built on.