# Hooks
URL: /docs/react-native/hooks

Reactive hooks for accessing runtime state in React Native.

## [State Hooks](#state-hooks)

### [useAuiState](#useauistate)

The primary hook for accessing reactive state. It accepts a selector function for fine-grained re-renders — the component only re-renders when the selected value changes (shallow equality).

`import { useAuiState } from "@assistant-ui/react-native"; // Thread state const messages = useAuiState((s) => s.thread.messages); const isRunning = useAuiState((s) => s.thread.isRunning); const isEmpty = useAuiState((s) => s.thread.isEmpty); // Composer state const text = useAuiState((s) => s.composer.text); const composerIsEmpty = useAuiState((s) => s.composer.isEmpty); const attachments = useAuiState((s) => s.composer.attachments); // Message state (inside a message context) const role = useAuiState((s) => s.message.role); const isLast = useAuiState((s) => s.message.isLast); // Thread list item state const threadId = useAuiState((s) => s.threadListItem.id); const title = useAuiState((s) => s.threadListItem.title);`

### [useAui](#useaui)

Access the store methods for imperative actions.

`import { useAui } from "@assistant-ui/react-native"; const aui = useAui(); // Composer actions aui.composer().setText("Hello"); aui.composer().send(); // Thread actions aui.thread().cancelRun();`

### [useAuiEvent](#useauievent)

Subscribe to events without causing re-renders.

`import { useAuiEvent } from "@assistant-ui/react-native"; useAuiEvent("thread.modelContextUpdate", ({ threadId }) => { console.log("Model context updated:", threadId); });`

## [Runtime Hooks](#runtime-hooks)

### [useLocalRuntime](#uselocalruntime)

Create an `AssistantRuntime` with a `ChatModelAdapter`.

`import { useLocalRuntime } from "@assistant-ui/react-native"; const runtime = useLocalRuntime(chatModel, { initialMessages: [], });`

| Option                    | Type                  | Description                                      |
| ------------------------- | --------------------- | ------------------------------------------------ |
| `initialMessages`         | `ThreadMessageLike[]` | Messages to pre-populate                         |
| `maxSteps`                | `number`              | Maximum tool call steps per run                  |
| `cloud`                   | `AssistantCloud`      | Optional cloud instance for persistence          |
| `adapters`                | `object`              | Optional adapter overrides (see below)           |
| `unstable_humanToolNames` | `string[]`            | Tool names that pause the run for human approval |

The `adapters` option accepts the following fields (all optional):

| Adapter       | Type                     | Description                          |
| ------------- | ------------------------ | ------------------------------------ |
| `history`     | `ThreadHistoryAdapter`   | Load and save thread message history |
| `attachments` | `AttachmentAdapter`      | Handle file and attachment uploads   |
| `speech`      | `SpeechSynthesisAdapter` | Text-to-speech playback              |
| `dictation`   | `DictationAdapter`       | Speech-to-text input                 |
| `feedback`    | `FeedbackAdapter`        | Thumbs up/down feedback              |
| `suggestion`  | `SuggestionAdapter`      | Prompt suggestions                   |

### [useRemoteThreadListRuntime](#useremotethreadlistruntime)

Create an `AssistantRuntime` with a persistent thread list backed by a `RemoteThreadListAdapter`. This wraps any runtime hook (such as one calling `useLocalRuntime` or a custom AI SDK hook) and layers thread-list management on top.

`import { useRemoteThreadListRuntime } from "@assistant-ui/react-native"; const runtime = useRemoteThreadListRuntime({ runtimeHook: () => useLocalRuntime(chatModel), adapter: myThreadListAdapter, });`

| Option         | Type                      | Description                                                                                  |
| -------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| `runtimeHook`  | `() => AssistantRuntime`  | Hook that returns a per-thread runtime                                                       |
| `adapter`      | `RemoteThreadListAdapter` | Backend adapter for listing/creating/archiving threads                                       |
| `allowNesting` | `boolean`                 | When `true`, silently becomes a no-op if already inside another `useRemoteThreadListRuntime` |

## [Model Context Hooks](#model-context-hooks)

### [useAssistantTool](#useassistanttool)

Register a tool with an optional UI renderer. The tool definition is forwarded to the model, and when the model calls it, the `execute` function runs and the `render` component displays the result.

``import { useAssistantTool } from "@assistant-ui/react-native"; useAssistantTool({ toolName: "get_weather", description: "Get the current weather for a city", parameters: { type: "object", properties: { city: { type: "string" }, }, required: ["city"], }, execute: async ({ city }) => { const res = await fetch(`https://api.weather.example/${city}`); return res.json(); }, render: ({ args, result }) => ( <View> <Text>{args.city}: {result?.temperature}°F</Text> </View> ), });``

### [useAssistantToolUI](#useassistanttoolui)

Register only a UI renderer for a tool (without tool definition or execute function).

`import { useAssistantToolUI } from "@assistant-ui/react-native"; useAssistantToolUI({ toolName: "get_weather", render: ({ args, result, status }) => ( <View> {status?.type === "running" ? <Text>Loading weather for {args.city}...</Text> : <Text>{args.city}: {result?.temperature}°F</Text>} </View> ), });`

### [useAssistantDataUI](#useassistantdataui)

Register a UI renderer for a named data message part.

`import { useAssistantDataUI } from "@assistant-ui/react-native"; useAssistantDataUI({ name: "weather_card", render: ({ data }) => ( <View> <Text>{data.city}: {data.temperature}°F</Text> </View> ), });`

### [useAssistantInstructions](#useassistantinstructions)

Register system instructions in the model context.

`import { useAssistantInstructions } from "@assistant-ui/react-native"; useAssistantInstructions("You are a helpful weather assistant.");`

### [useInlineRender](#useinlinerender)

Wrap a tool UI component so that inline state updates (from a parent component's render) are reflected without remounting. Use this when the render function closes over props that change over time.

`import { useInlineRender } from "@assistant-ui/react-native"; const stableRender = useInlineRender(({ args, result }) => ( <Text>{someOuterProp}: {result?.value}</Text> )); useAssistantToolUI({ toolName: "my_tool", render: stableRender });`

### [makeAssistantTool](#makeassistanttool)

Create a component that registers a tool when mounted. Useful for declarative tool registration.

`import { makeAssistantTool } from "@assistant-ui/react-native"; const WeatherTool = makeAssistantTool({ toolName: "get_weather", description: "Get weather", parameters: { type: "object", properties: { city: { type: "string" } }, required: ["city"] }, execute: async ({ city }) => ({ temperature: 72 }), render: ({ args, result }) => <Text>{args.city}: {result?.temperature}°F</Text>, }); // Mount inside AssistantRuntimeProvider to register <WeatherTool />`

### [makeAssistantToolUI](#makeassistanttoolui)

Create a component that registers only a tool UI renderer when mounted.

`import { makeAssistantToolUI } from "@assistant-ui/react-native"; const WeatherToolUI = makeAssistantToolUI({ toolName: "get_weather", render: ({ args, result }) => <Text>{args.city}: {result?.temperature}°F</Text>, }); <WeatherToolUI />`

### [makeAssistantDataUI](#makeassistantdataui)

Create a component that registers a data UI renderer when mounted.

`import { makeAssistantDataUI } from "@assistant-ui/react-native"; const WeatherCard = makeAssistantDataUI({ name: "weather_card", render: ({ data }) => <Text>{data.city}: {data.temperature}°F</Text>, }); <WeatherCard />`

## [Shared Providers](#shared-providers)

These context providers are re-exported from `@assistant-ui/core/react` and are used internally by the primitives to scope the `aui` store to a particular item (message, part, thread list item, etc.). They are available for advanced custom rendering scenarios.

### [MessageByIndexProvider](#messagebyindexprovider)

Scopes the `aui` context to a specific message by its index in the thread.

`import { MessageByIndexProvider } from "@assistant-ui/react-native"; <MessageByIndexProvider index={2}> {/* children can read s.message, s.composer */} </MessageByIndexProvider>`

### [PartByIndexProvider](#partbyindexprovider)

Scopes the `aui` context to a specific message part by its index.

`import { PartByIndexProvider } from "@assistant-ui/react-native"; <PartByIndexProvider index={0}> {/* children can read s.part */} </PartByIndexProvider>`

### [TextMessagePartProvider](#textmessagepartprovider)

Provides a synthetic text part context from a plain string. Useful for rendering text outside the normal message-part pipeline.

`import { TextMessagePartProvider } from "@assistant-ui/react-native"; <TextMessagePartProvider text="Hello world" isRunning={false}> {/* children can read s.part as a text part */} </TextMessagePartProvider>`

| Prop        | Type      | Description                                           |
| ----------- | --------- | ----------------------------------------------------- |
| `text`      | `string`  | The text content                                      |
| `isRunning` | `boolean` | Whether the part is still streaming (default `false`) |

### [ChainOfThoughtByIndicesProvider](#chainofthoughtbyindicesprovider)

Scopes the `aui` context to a slice of message parts that form a chain-of-thought block.

`import { ChainOfThoughtByIndicesProvider } from "@assistant-ui/react-native"; <ChainOfThoughtByIndicesProvider startIndex={1} endIndex={3}> {/* children can read s.chainOfThought */} </ChainOfThoughtByIndicesProvider>`

### [ChainOfThoughtPartByIndexProvider](#chainofthoughtpartbyindexprovider)

Scopes the `aui` context to a specific part within a chain-of-thought block.

`import { ChainOfThoughtPartByIndexProvider } from "@assistant-ui/react-native"; <ChainOfThoughtPartByIndexProvider index={0}> {/* children can read s.part */} </ChainOfThoughtPartByIndexProvider>`

### [ThreadListItemByIndexProvider](#threadlistitembyindexprovider)

Scopes the `aui` context to a specific thread list item by its index.

`import { ThreadListItemByIndexProvider } from "@assistant-ui/react-native"; <ThreadListItemByIndexProvider index={0} archived={false}> {/* children can read s.threadListItem */} </ThreadListItemByIndexProvider>`

### [SuggestionByIndexProvider](#suggestionbyindexprovider)

Scopes the `aui` context to a specific suggestion by its index.

`import { SuggestionByIndexProvider } from "@assistant-ui/react-native"; <SuggestionByIndexProvider index={0}> {/* children can read s.suggestion */} </SuggestionByIndexProvider>`