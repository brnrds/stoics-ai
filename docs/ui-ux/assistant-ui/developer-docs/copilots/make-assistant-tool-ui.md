# makeAssistantToolUI
URL: /docs/copilots/make-assistant-tool-ui

Register custom UI components to render tool executions and their status.

Prefer pre-registering tool UIs via the

- href

  /docs/guides/tools

`Tools()` API

(set `render` on the tool definition) or by mounting `makeAssistantToolUI` near the root of your tree. A tool UI that is only registered while a specific component is mounted will not appear when chat history is replayed or during server-side rendering, since the registering component may not be mounted at that point. Tool execution can still be registered dynamically via

- href

  /docs/copilots/make-assistant-tool

`makeAssistantTool`

; this caveat applies specifically to the UI render function.

The `makeAssistantToolUI` utility is used to register a tool UI component with the Assistant.

## [Usage](#usage)

`import { makeAssistantToolUI } from "@assistant-ui/react"; const MyToolUI = makeAssistantToolUI({ toolName: "myTool", render: ({ args, result, status }) => { // render your tool UI here }, });`

## [API](#api)

### [Parameters](#parameters)

`AssistantToolUIProps<TArgs, TResult>`

- `toolName` `?: string`

  The name of the tool. This must match the name of the tool defined in the assistant.

- `render` `: ComponentType<ToolCallMessagePartProps<TArgs, TResult>>`

  A React component that renders the tool UI. Receives the following props:

  - `type` `?: "tool-call"`

    The message part type

  - `toolCallId` `?: string`

    Unique identifier for this tool call

  - `toolName` `?: string`

    The name of the tool being called

  - `args` `?: TArgs`

    The arguments passed to the tool

  - `argsText` `?: string`

    String representation of the arguments

  - `result` `?: TResult | undefined`

    The result of the tool execution (if complete)

  - `isError` `?: boolean | undefined`

    Whether the result is an error

  - `status` `?: ToolCallMessagePartStatus`

    The execution status object with a type property: "running", "complete", "incomplete", or "requires-action"

  - `addResult` `?: (result: TResult | ToolResponse<TResult>) => void`

    Function to add a result (useful for human-in-the-loop tools)

  - `artifact` `?: unknown`

    Optional artifact data associated with the tool call

### [Returns](#returns)

A React functional component that should be included in your component tree. This component doesn't render anything itself, but it registers the tool UI with the Assistant.

## [Example](#example)

`import { makeAssistantToolUI } from "@assistant-ui/react"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; const GetWeatherUI = makeAssistantToolUI({ toolName: "get_weather", render: ({ args, result, status }) => { if (status.type === "requires-action") return <p>Getting weather for {args.location}...</p>; if (status.type === "running") return <p>Loading...</p>; if (status.type === "incomplete" && status.reason === "error") return <p>Error getting weather.</p>; if (status.type === "complete") return <p>The weather is {result.weather}.</p>; return null; }, }); function App() { const runtime = /* your runtime setup */; return ( <AssistantRuntimeProvider runtime={runtime}> {/* ...your other components */} <GetWeatherUI /> </AssistantRuntimeProvider> ); }`

This example shows how to create a simple UI for a `get_weather` tool. The UI will display different messages depending on the status of the tool execution.