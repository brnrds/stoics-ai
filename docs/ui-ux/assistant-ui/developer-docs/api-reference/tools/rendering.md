# Tool Rendering
URL: /docs/api-reference/tools/rendering

Register React renderers for assistant-ui tool calls, tool results, and model data parts.

## [API Reference](#api-reference)

### [DataRenderers](#datarenderers)

Registers renderers for `data` message parts.

Data renderers are looked up by the part's `name` field. Use this resource directly for a renderer scope, or prefer

- href

  /docs/api-reference/tools/rendering#useassistantdataui

useAssistantDataUI

/

- href

  /docs/api-reference/tools/rendering#makeassistantdataui

makeAssistantDataUI

when registering from React components.`const DataRenderers: () => ResourceElement<ClientOutput<"dataRenderers">, undefined>;`

### [makeAssistantDataUI](#makeassistantdataui)

Creates a React component that registers a named data-part renderer when rendered.

`type AssistantDataUIProps = { /** Data part name this renderer handles. */ name: string; /** Component rendered for matching data message parts. */ render: DataMessagePartComponent<T>; }; const makeAssistantDataUI: <T = any>(dataUI: AssistantDataUIProps<T>) => AssistantDataUI;`

### [makeAssistantToolUI](#makeassistanttoolui)

Creates a React component that registers a tool-call renderer when rendered.

Use this to package reusable display components for tools whose definitions are registered elsewhere.

`type AssistantToolUIProps = { /** Name of the tool whose calls should use this renderer. */ toolName: string; /** Component rendered for matching tool-call message parts. */ render: ToolCallMessagePartComponent<TArgs, TResult>; }; const makeAssistantToolUI: <TArgs, TResult>(tool: AssistantToolUIProps<TArgs, TResult>) => AssistantToolUI;`

### [useAssistantDataUI](#useassistantdataui)

Registers a renderer for named `data` message parts while the component is mounted.

`useAssistantDataUI`

- `dataUI` `: AssistantDataUIProps<any> | null`

  - `name` `: string`

    Data part name this renderer handles.

  - `render` `: DataMessagePartComponent<T>`

    Component rendered for matching data message parts.

### [useAssistantToolUI](#useassistanttoolui)

Registers a tool-call renderer while the component is mounted.

This only affects rendering. Pair it with

- href

  /docs/api-reference/tools/definition#useassistanttool

useAssistantTool

,

- href

  /docs/api-reference/tools/definition#tools

Tools

, or a backend tool registry to expose the actual tool definition to the model.

`useAssistantToolUI`

- `tool` `: AssistantToolUIProps<any, any> | null`

  - `toolName` `: string`

    Name of the tool whose calls should use this renderer.

  - `render` `: ToolCallMessagePartComponent<TArgs, TResult>`

    Component rendered for matching tool-call message parts.