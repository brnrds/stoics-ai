# Hooks
URL: /docs/ink/hooks

Reactive hooks for accessing runtime state in React Ink.

## [State Hooks](#state-hooks)

### [useAuiState](#useauistate)

The primary hook for accessing reactive state. It accepts a selector function for fine-grained re-renders — the component only re-renders when the selected value changes (shallow equality).

`import { useAuiState } from "@assistant-ui/react-ink"; // Thread state const messages = useAuiState((s) => s.thread.messages); const isRunning = useAuiState((s) => s.thread.isRunning); const isEmpty = useAuiState((s) => s.thread.isEmpty); // Composer state const text = useAuiState((s) => s.composer.text); const composerIsEmpty = useAuiState((s) => s.composer.isEmpty); const attachments = useAuiState((s) => s.composer.attachments); // Message state (inside a message context) const role = useAuiState((s) => s.message.role); const isLast = useAuiState((s) => s.message.isLast); // Thread list item state const threadId = useAuiState((s) => s.threadListItem.id); const title = useAuiState((s) => s.threadListItem.title);`

### [useAui](#useaui)

Access the store methods for imperative actions.

`import { useAui } from "@assistant-ui/react-ink"; const aui = useAui(); // Composer actions aui.composer().setText("Hello"); aui.composer().send(); // Thread actions aui.thread().cancelRun();`

### [useAuiEvent](#useauievent)

Subscribe to events without causing re-renders.

`import { useAuiEvent } from "@assistant-ui/react-ink"; useAuiEvent("thread.modelContextUpdate", ({ threadId }) => { console.log("Model context updated:", threadId); });`

## [Runtime Hooks](#runtime-hooks)

### [useLocalRuntime](#uselocalruntime)

Create an `AssistantRuntime` with a `ChatModelAdapter`.

`import { useLocalRuntime } from "@assistant-ui/react-ink"; const runtime = useLocalRuntime(chatModel, { initialMessages: [], });`

| Option                    | Type                     | Description                                                                    |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------ |
| `initialMessages`         | `ThreadMessageLike[]`    | Messages to pre-populate the thread with                                       |
| `maxSteps`                | `number`                 | Maximum number of agentic steps before stopping                                |
| `adapters.history`        | `ThreadHistoryAdapter`   | Adapter for persisting thread history                                          |
| `adapters.attachments`    | `AttachmentAdapter`      | Adapter for handling file attachments                                          |
| `adapters.speech`         | `SpeechSynthesisAdapter` | Adapter for text-to-speech output                                              |
| `adapters.dictation`      | `DictationAdapter`       | Adapter for speech-to-text input                                               |
| `adapters.feedback`       | `FeedbackAdapter`        | Adapter for message feedback (thumbs up/down)                                  |
| `adapters.suggestion`     | `SuggestionAdapter`      | Adapter for suggested prompts                                                  |
| `cloud`                   | `AssistantCloud`         | Cloud instance for thread persistence via `@assistant-ui/cloud`                |
| `unstable_humanToolNames` | `string[]`               | Tool names that trigger a run interruption to wait for human/external approval |

### [useRemoteThreadListRuntime](#useremotethreadlistruntime)

Create an `AssistantRuntime` backed by a `RemoteThreadListAdapter` for multi-thread persistence. The `runtimeHook` is called for each thread to produce the per-thread runtime (typically `useLocalRuntime`).

`import { useRemoteThreadListRuntime, useLocalRuntime } from "@assistant-ui/react-ink"; const runtime = useRemoteThreadListRuntime({ adapter: myRemoteAdapter, runtimeHook: () => useLocalRuntime(chatModel), });`

| Option         | Type                      | Description                                                                   |
| -------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `runtimeHook`  | `() => AssistantRuntime`  | Hook called to produce the per-thread runtime                                 |
| `adapter`      | `RemoteThreadListAdapter` | Adapter implementing thread list persistence                                  |
| `allowNesting` | `boolean`                 | When true, becomes a no-op if nested inside another `RemoteThreadListRuntime` |

## [Model Context Hooks](#model-context-hooks)

### [useAssistantTool](#useassistanttool)

Register a tool with an optional UI renderer. The tool definition is forwarded to the model, and when the model calls it, the `execute` function runs and the `render` component displays the result.

``import { useAssistantTool } from "@assistant-ui/react-ink"; import { Text } from "ink"; useAssistantTool({ toolName: "get_weather", description: "Get the current weather for a city", parameters: { type: "object", properties: { city: { type: "string" }, }, required: ["city"], }, execute: async ({ city }) => { const res = await fetch(`https://api.weather.example/${city}`); return res.json(); }, render: ({ args, result }) => ( <Text>{args.city}: {result?.temperature}°F</Text> ), });``

### [useAssistantToolUI](#useassistanttoolui)

Register only a UI renderer for a tool (without tool definition or execute function).

``import { useAssistantToolUI } from "@assistant-ui/react-ink"; import { Text } from "ink"; useAssistantToolUI({ toolName: "get_weather", render: ({ args, result, status }) => ( <Text> {status?.type === "running" ? `Loading weather for ${args.city}...` : `${args.city}: ${result?.temperature}°F`} </Text> ), });``

### [useAssistantInstructions](#useassistantinstructions)

Register system instructions in the model context.

`import { useAssistantInstructions } from "@assistant-ui/react-ink"; useAssistantInstructions("You are a helpful terminal assistant.");`

### [useAssistantDataUI](#useassistantdataui)

Register a UI renderer for a named data part type. When a message contains a data part with the given `name`, the `render` component is used.

`import { useAssistantDataUI } from "@assistant-ui/react-ink"; import { Text } from "ink"; useAssistantDataUI({ name: "weather_card", render: ({ data }) => ( <Text>{data.city}: {data.temperature}°F</Text> ), });`

### [makeAssistantTool](#makeassistanttool)

Create a component that registers a tool when mounted.

`import { makeAssistantTool } from "@assistant-ui/react-ink"; import { Text } from "ink"; const WeatherTool = makeAssistantTool({ toolName: "get_weather", description: "Get weather", parameters: { type: "object", properties: { city: { type: "string" } }, required: ["city"] }, execute: async ({ city }) => ({ temperature: 72 }), render: ({ args, result }) => <Text>{args.city}: {result?.temperature}°F</Text>, }); // Mount inside AssistantRuntimeProvider to register <WeatherTool />`

### [makeAssistantToolUI](#makeassistanttoolui)

Create a component that registers only a tool UI renderer (no tool definition or execute) when mounted.

``import { makeAssistantToolUI } from "@assistant-ui/react-ink"; import { Text } from "ink"; const WeatherToolUI = makeAssistantToolUI({ toolName: "get_weather", render: ({ args, result, status }) => ( <Text> {status?.type === "running" ? `Loading weather for ${args.city}...` : `${args.city}: ${result?.temperature}°F`} </Text> ), }); // Mount inside AssistantRuntimeProvider to register <WeatherToolUI />``

### [makeAssistantDataUI](#makeassistantdataui)

Create a component that registers a data UI renderer when mounted.

`import { makeAssistantDataUI } from "@assistant-ui/react-ink"; import { Text } from "ink"; const WeatherCardUI = makeAssistantDataUI({ name: "weather_card", render: ({ data }) => ( <Text>{data.city}: {data.temperature}°F</Text> ), }); // Mount inside AssistantRuntimeProvider to register <WeatherCardUI />`

### [useInlineRender](#useinlinerender)

Wrap a render function component so that it always uses the latest version without re-creating a stable reference. Useful when passing a render prop inline and the function closes over changing state.

`import { useInlineRender } from "@assistant-ui/react-ink"; const render = useInlineRender(({ args, result }) => ( <Text>{args.city}: {result?.temperature}°F</Text> )); useAssistantToolUI({ toolName: "get_weather", render });`

## [Runtime Providers](#runtime-providers)

### [AssistantRuntimeProvider](#assistantruntimeprovider)

Connects an `AssistantRuntime` to the React tree. All primitives and hooks must be used inside this provider.

`import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react-ink"; const runtime = useLocalRuntime(chatModel); <AssistantRuntimeProvider runtime={runtime}> {/* app content */} </AssistantRuntimeProvider>`

| Prop      | Type               | Description                     |
| --------- | ------------------ | ------------------------------- |
| `runtime` | `AssistantRuntime` | The runtime instance to provide |

## [Context Providers](#context-providers)

These low-level providers are used to set up scoped contexts for rendering primitives outside of the standard `ThreadPrimitive.Messages` / `MessagePrimitive.Parts` hierarchy.

### [MessageByIndexProvider](#messagebyindexprovider)

Sets up the message context for a given message index in the thread. Used internally by `ThreadPrimitive.Messages`.

`import { MessageByIndexProvider } from "@assistant-ui/react-ink"; <MessageByIndexProvider index={0}> <MessagePrimitive.Root>...</MessagePrimitive.Root> </MessageByIndexProvider>`

| Prop    | Type     | Description                                   |
| ------- | -------- | --------------------------------------------- |
| `index` | `number` | Zero-based index of the message in the thread |

### [PartByIndexProvider](#partbyindexprovider)

Sets up the part context for a given part index in the current message. Used internally by `MessagePrimitive.Parts`.

`import { PartByIndexProvider } from "@assistant-ui/react-ink"; <PartByIndexProvider index={0}> {/* part content */} </PartByIndexProvider>`

| Prop    | Type     | Description                                 |
| ------- | -------- | ------------------------------------------- |
| `index` | `number` | Zero-based index of the part in the message |

### [TextMessagePartProvider](#textmessagepartprovider)

Provides a synthetic text part context with a fixed text value. Useful for rendering text content outside of a real message part (e.g., in previews or testing).

`import { TextMessagePartProvider } from "@assistant-ui/react-ink"; <TextMessagePartProvider text="Hello world" isRunning={false}> {/* content rendered with a text part context */} </TextMessagePartProvider>`

| Prop        | Type      | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| `text`      | `string`  | The text content for the synthetic part                      |
| `isRunning` | `boolean` | Whether the part should appear as running (default: `false`) |

### [ChainOfThoughtByIndicesProvider](#chainofthoughtbyindicesprovider)

Sets up a chain-of-thought context spanning a range of message parts by start and end index. Used to group consecutive reasoning parts.

`import { ChainOfThoughtByIndicesProvider } from "@assistant-ui/react-ink"; <ChainOfThoughtByIndicesProvider startIndex={1} endIndex={3}> <ChainOfThoughtPrimitive.Root>...</ChainOfThoughtPrimitive.Root> </ChainOfThoughtByIndicesProvider>`

| Prop         | Type     | Description                                           |
| ------------ | -------- | ----------------------------------------------------- |
| `startIndex` | `number` | Index of the first part in the chain-of-thought range |
| `endIndex`   | `number` | Index of the last part in the chain-of-thought range  |

### [ChainOfThoughtPartByIndexProvider](#chainofthoughtpartbyindexprovider)

Sets up the part context for a specific part within the current chain-of-thought by index.

`import { ChainOfThoughtPartByIndexProvider } from "@assistant-ui/react-ink"; <ChainOfThoughtPartByIndexProvider index={0}> {/* chain-of-thought part content */} </ChainOfThoughtPartByIndexProvider>`

| Prop    | Type     | Description                                              |
| ------- | -------- | -------------------------------------------------------- |
| `index` | `number` | Zero-based index of the part within the chain-of-thought |

### [SuggestionByIndexProvider](#suggestionbyindexprovider)

Sets up the suggestion context for a given suggestion index. Used internally by `ThreadPrimitive.Suggestions`.

`import { SuggestionByIndexProvider } from "@assistant-ui/react-ink"; <SuggestionByIndexProvider index={0}> <SuggestionPrimitive.Title /> </SuggestionByIndexProvider>`

| Prop    | Type     | Description                        |
| ------- | -------- | ---------------------------------- |
| `index` | `number` | Zero-based index of the suggestion |

### [ThreadListItemByIndexProvider](#threadlistitembyindexprovider)

Sets up the thread list item context for a given index, differentiating between regular and archived threads.

`import { ThreadListItemByIndexProvider } from "@assistant-ui/react-ink"; <ThreadListItemByIndexProvider index={0} archived={false}> <ThreadListItemPrimitive.Root>...</ThreadListItemPrimitive.Root> </ThreadListItemByIndexProvider>`

| Prop       | Type      | Description                                    |
| ---------- | --------- | ---------------------------------------------- |
| `index`    | `number`  | Zero-based index in the thread list            |
| `archived` | `boolean` | Whether to index into the archived thread list |

### [ThreadListItemRuntimeProvider](#threadlistitemruntimeprovider)

Sets up the thread list item context from a `ThreadListItemRuntime` instance directly.

`import { ThreadListItemRuntimeProvider } from "@assistant-ui/react-ink"; <ThreadListItemRuntimeProvider runtime={threadListItemRuntime}> <ThreadListItemPrimitive.Root>...</ThreadListItemPrimitive.Root> </ThreadListItemRuntimeProvider>`

| Prop      | Type                    | Description                           |
| --------- | ----------------------- | ------------------------------------- |
| `runtime` | `ThreadListItemRuntime` | The thread list item runtime instance |

### [MessageAttachmentByIndexProvider](#messageattachmentbyindexprovider)

Sets up the attachment context for a specific message attachment by index.

`import { MessageAttachmentByIndexProvider } from "@assistant-ui/react-ink"; <MessageAttachmentByIndexProvider index={0}> <AttachmentPrimitive.Name /> </MessageAttachmentByIndexProvider>`

| Prop    | Type     | Description                                       |
| ------- | -------- | ------------------------------------------------- |
| `index` | `number` | Zero-based index of the attachment in the message |

### [ComposerAttachmentByIndexProvider](#composerattachmentbyindexprovider)

Sets up the attachment context for a specific composer attachment by index.

`import { ComposerAttachmentByIndexProvider } from "@assistant-ui/react-ink"; <ComposerAttachmentByIndexProvider index={0}> <AttachmentPrimitive.Name /> <AttachmentPrimitive.Remove> <Text color="red">[x]</Text> </AttachmentPrimitive.Remove> </ComposerAttachmentByIndexProvider>`

| Prop    | Type     | Description                                        |
| ------- | -------- | -------------------------------------------------- |
| `index` | `number` | Zero-based index of the attachment in the composer |