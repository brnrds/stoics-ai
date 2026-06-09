# Generative UI
URL: /docs/runtimes/langgraph/generative-ui

Render structured UI components emitted by LangGraph alongside assistant messages.

LangGraph's

- href

  https\://docs.langchain.com/langsmith/generative-ui-react

Generative UI

lets your graph emit structured UI components alongside assistant messages via `push_ui_message` (Python) or `typedUi().push()` (TypeScript). The assistant-ui adapter translates these into

- href

  /docs/guides/tool-ui

`DataMessagePart`s

on the associated assistant message, which you render with the existing `makeAssistantDataUI` API.

## [Enable the `custom` stream mode](#enable-the-custom-stream-mode)

UI messages are emitted through LangGraph's `custom` stream channel. Make sure your `sendMessage` helper includes `"custom"` in `streamMode`:

`streamMode: ["messages", "updates", "custom"];`

If your graph accumulates UI messages in state under the `ui` key (the default for `typedUi`), `"values"` also works; the adapter reads both paths.

## [Custom state key](#custom-state-key)

If your graph uses a non-default `stateKey` with `typedUi(config, { stateKey: "my_ui" })` on the server, pass the matching `uiStateKey` option to `useLangGraphRuntime`:

`const runtime = useLangGraphRuntime({ stream: async function* (messages, { initialize }) { /* ... */ }, uiStateKey: "my_ui", });`

This only affects the `values` stream path; the `custom` channel carries each UI event individually and does not rely on the state key.

## [Emit a UI message from your graph](#emit-a-ui-message-from-your-graph)

- items

  - Python
  - TypeScript

* value

  Python

`from langgraph.graph.ui import push_ui_message from langchain_core.messages import AIMessage async def chart_node(state, config): message = AIMessage(id="msg-1", content="Here's your chart.") push_ui_message( "chart", {"series": [1, 2, 3], "title": "Sales"}, message=message, # Links the UI to this AI message ) return {"messages": [message]}`

- value

  TypeScript

`import { typedUi } from "@langchain/langgraph-sdk/react-ui/server"; import type { ComponentRegistry } from "./components"; export async function chartNode(state, config) { const ui = typedUi<ComponentRegistry>(config); const message = { id: "msg-1", type: "ai", content: "Here's your chart." }; ui.push( { name: "chart", props: { series: [1, 2, 3], title: "Sales" } }, { message }, ); return { messages: [message] }; }`

Passing `message` (Python) or `{ message }` (TypeScript) is what links the UI component to a specific assistant message. The adapter reads `metadata.message_id` to attach the generated `DataMessagePart` to the correct message in the thread.

## [Register a renderer on the client](#register-a-renderer-on-the-client)

- value

  React

* title

  @/components/ChartUI.tsx

`import { makeAssistantDataUI } from "@assistant-ui/react"; type ChartProps = { series: number[]; title: string; }; export const ChartUI = makeAssistantDataUI<ChartProps>({ name: "chart", render: ({ data }) => ( <div> <h3>{data.title}</h3> <Chart series={data.series} /> </div> ), });`

- value

  React Native

* title

  components/ChartUI.tsx

`import { makeAssistantDataUI } from "@assistant-ui/react-native"; import { Text, View } from "react-native"; type ChartProps = { series: number[]; title: string; }; export const ChartUI = makeAssistantDataUI<ChartProps>({ name: "chart", render: ({ data }) => ( <View> <Text>{data.title}</Text> <Chart series={data.series} /> </View> ), });`

- value

  React Ink

* title

  components/chart-ui.tsx

`import { makeAssistantDataUI } from "@assistant-ui/react-ink"; import { Box, Text } from "ink"; type ChartProps = { series: number[]; title: string; }; export const ChartUI = makeAssistantDataUI<ChartProps>({ name: "chart", render: ({ data }) => ( <Box flexDirection="column"> <Text bold>{data.title}</Text> <Chart series={data.series} /> </Box> ), });`

Mount the component once somewhere inside the `AssistantRuntimeProvider` tree. It renders nothing itself; it only registers the renderer:

- value

  React

* title

  @/components/MyAssistant.tsx

`<AssistantRuntimeProvider runtime={runtime}> <ChartUI /> <Thread /> </AssistantRuntimeProvider>`

- value

  React Native

* title

  components/MyAssistant.tsx

`import { View } from "react-native"; import { Thread } from "@/components/assistant-ui/thread"; <AssistantRuntimeProvider runtime={runtime}> <ChartUI /> <View style={{ flex: 1 }}> <Thread /> </View> </AssistantRuntimeProvider>;`

- value

  React Ink

* title

  components/my-assistant.tsx

`import { Box } from "ink"; import { Thread } from "./thread.js"; <AssistantRuntimeProvider runtime={runtime}> <ChartUI /> <Box flexDirection="column"> <Thread /> </Box> </AssistantRuntimeProvider>;`

When a matching UI message arrives, the adapter appends a `{ type: "data", name: "chart", data: { series, title } }` part to the parent assistant message and the registered component renders inline.

## [Register renderers via `uiComponents`](#register-renderers-via-uicomponents)

Instead of mounting separate `makeAssistantDataUI` components, register renderers directly on the runtime hook:

`const runtime = useLangGraphRuntime({ stream: async function* (messages, { initialize }) { /* ... */ }, uiComponents: { renderers: { chart: ({ data }) => <Chart series={data.series} title={data.title} />, table: ({ data }) => <DataTable rows={data.rows} />, }, }, });`

Static `renderers` are matched by `ui_message` name. If no match is found, the part renders nothing unless a `fallback` is provided.

## [Dynamic loading with `fallback`](#dynamic-loading-with-fallback)

LangSmith's

- href

  https\://docs.langchain.com/langsmith/generative-ui-react

Generative UI

supports colocating UI code with your graph and loading it at runtime via `LoadExternalComponent`. The `fallback` option handles any `ui_message` name that has no static renderer:`import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui"; const runtime = useLangGraphRuntime({ stream: async function* (messages, { initialize }) { /* ... */ }, uiComponents: { fallback: ({ name, data }) => ( <LoadExternalComponent name={name} props={data} /> ), renderers: { chart: ({ data }) => <Chart {...data} />, }, }, });`

With this setup:

- A `ui_message` with `name: "chart"` renders the static `Chart` component.
- Any other name (e.g. `"dashboard"`, `"form"`) is handled by `fallback`, which fetches the component from LangSmith at runtime.

`fallback` receives the same props as any data renderer: `name`, `data`, and part state metadata.

## [Semantics](#semantics)

The adapter mirrors the reducer in `@langchain/langgraph-sdk/react-ui` exactly:

- UI messages are keyed by their own `id`. Pushing the same id again **replaces** the existing entry.
- Passing `metadata: { merge: true }` shallow-merges `props` onto the previous entry.
- Emitting `{ type: "remove-ui", id }` (via `delete_ui_message` or `ui.delete(id)`) removes the entry.
- UI messages without `metadata.message_id` are held in the runtime but not injected into any message; use `useLangGraphUIMessages()` to access the raw list if needed.

## [Restore persisted UI messages on thread switch](#restore-persisted-ui-messages-on-thread-switch)

If your graph persists UI messages in state via `typedUi`, return them from the `load` callback so they are restored when the user switches threads or refreshes the page:

`const runtime = useLangGraphRuntime({ stream: async function* (messages, { initialize }) { /* ... */ }, load: async (externalId) => { const state = await getThreadState(externalId); return { messages: state.values.messages, uiMessages: state.values.ui, interrupts: state.tasks[0]?.interrupts, }; }, });`

Without this, each reload starts with an empty UI list even though the messages themselves are loaded.

## [Escape hatch: `useLangGraphUIMessages`](#escape-hatch-uselanggraphuimessages)

`import { useLangGraphUIMessages } from "@assistant-ui/react-langgraph"; function Sidebar() { const uiMessages = useLangGraphUIMessages(); // Filter, group, or render UI messages outside the thread return <>{uiMessages.map(/* ... */)}</>; }`

## [Related](#related)

- href

  /docs/runtimes/langgraph/streaming

StreamingEvent handlers, message accumulator, conversion, metadata.

- href

  /docs/runtimes/langgraph/interrupts

InterruptsInterrupt persistence and checkpoint-based message editing.

- href

  /docs/runtimes/langgraph/threads

ThreadsBasic thread support, AssistantCloud, custom thread list adapter.