# Tool Definitions
URL: /docs/api-reference/tools/definition

Define assistant tools, compose toolkits, and expose callable app capabilities to assistant-ui runtimes.

## [API Reference](#api-reference)

### [makeAssistantTool](#makeassistanttool)

Creates a React component that registers an assistant tool when rendered.

Use this when exporting reusable tool modules that can be included in JSX rather than calling

- href

  /docs/api-reference/tools/definition#useassistanttool

useAssistantTool

directly.`type AssistantToolProps = CoreAssistantToolProps<TArgs, TResult> & { /** Component used to render calls to this tool in assistant messages. */ render?: ToolCallMessagePartComponent<TArgs, TResult> | undefined; }; const makeAssistantTool: <TArgs extends Record<string, unknown>, TResult>(tool: AssistantToolProps<TArgs, TResult>) => AssistantTool;`

### [tool](#tool)

Defines a model tool with its argument schema, execution behavior, and optional model-output conversion.

This helper keeps reusable tool definitions type-checked and convenient to export for a

- href

  /docs/api-reference/tools/definition#toolkit

Toolkit

,

- href

  /docs/api-reference/tools/definition#tools

Tools

, or

- href

  /docs/api-reference/tools/definition#useassistanttool

useAssistantTool

. Inference from parameter schemas is currently limited, so provide generic arguments when you need precise args or result types.

`tool`

- `tool` `: Tool<TArgs, TResult>`

  - `streamCall`

    - variant

      deprecated

    `?: ToolStreamCallFunction<TArgs, TResult>`

    Deprecated: Experimental, API may change.

  - `type` `?: "frontend"`

    Tool that is executed in the frontend runtime.

  - `description` `?: string`

    Natural-language description shown to the model when selecting tools.

  - `parameters` `?: StandardSchemaV1<TArgs> | JSONSchema7`

    Schema for the arguments the model must provide when calling the tool.

  - `disabled` `?: boolean`

    Prevents the tool from being exposed to the model while true.

  - `execute` `?: ToolExecuteFunction<TArgs, TResult>`

    Executes the tool after the model provides valid arguments.

  - `toModelOutput` `?: ToolModelOutputFunction<TArgs, TResult>`

    Converts the execution result into model-visible output.

  - `experimental_onSchemaValidationError` `?: OnSchemaValidationErrorFunction<TResult>`

    Handles invalid tool arguments when schema validation fails.

### [ToolDefinition](#tooldefinition)

Tool definition accepted by the React tool registry.

Extends the core tool contract with a render component. Human tools rely on the renderer to collect input from the user. Frontend tools execute in the browser and require a UI surface for their progress and result. Backend tools execute server-side and may omit a renderer. The `render` component is required for frontend and human tools and optional for backend tools.

`ToolDefinition`

- `streamCall`

  - variant

    deprecated

  `?: ToolStreamCallFunction<TArgs, TResult>`

  Deprecated: Experimental, API may change.

- `type` `?: "frontend"`

  Tool that is executed in the frontend runtime.

- `description` `?: string`

  Natural-language description shown to the model when selecting tools.

- `parameters` `?: StandardSchemaV1<TArgs> | JSONSchema7`

  Schema for the arguments the model must provide when calling the tool.

- `disabled` `?: boolean`

  Prevents the tool from being exposed to the model while true.

- `execute` `?: ToolExecuteFunction<TArgs, TResult>`

  Executes the tool after the model provides valid arguments.

- `toModelOutput` `?: ToolModelOutputFunction<TArgs, TResult>`

  Converts the execution result into model-visible output.

- `experimental_onSchemaValidationError` `?: OnSchemaValidationErrorFunction<TResult>`

  Handles invalid tool arguments when schema validation fails.

- `render` `?: ToolCallMessagePartComponent<TArgs, TResult>`

### [Toolkit](#toolkit)

Named collection of tools exposed to the assistant model.

Keys are the tool names the model receives and uses in tool calls.

`type Toolkit = Record<string, ToolDefinition<any, any>>;`

### [Tools](#tools)

Registers tools with model context and installs tool-call renderers.

Mount this resource near an assistant subtree when you want to expose a group of tools declaratively. Tool definitions are registered with model context, while each tool renderer is registered with the tools scope for message rendering.

`Tools props`

- `toolkit` `?: Toolkit`

  Tools to expose to the model and optional renderers to install.

- `mcpApp` `?: ResourceElement<McpAppResourceOutput>`

  Optional MCP app resource whose tools should be merged into context.

  - `type` `: Resource<R, P> & { [fnSymbol]: (props: P) => R }`
  - `props` `: P`
  - `key` `?: string | number`

### [useAssistantTool](#useassistanttool)

Registers a tool with the assistant model context while the component is mounted.

If `render` is provided, it is also installed as the renderer for matching tool-call message parts. The registration is removed automatically when the component unmounts or the tool definition changes.

Pass a referentially stable tool object, such as one declared at module scope or memoized with `useMemo`, to avoid re-registering on every render.

`useAssistantTool`

- `tool` `: AssistantToolProps<TArgs, TResult>`

  - `streamCall`

    - variant

      deprecated

    `?: ToolStreamCallFunction<TArgs, TResult>`

    Deprecated: Experimental, API may change.

  - `type` `?: "frontend"`

    Tool that is executed in the frontend runtime.

  - `description` `?: string`

    Natural-language description shown to the model when selecting tools.

  - `parameters` `?: StandardSchemaV1<TArgs> | JSONSchema7`

    Schema for the arguments the model must provide when calling the tool.

  - `disabled` `?: boolean`

    Prevents the tool from being exposed to the model while true.

  - `execute` `?: ToolExecuteFunction<TArgs, TResult>`

    Executes the tool after the model provides valid arguments.

  - `toModelOutput` `?: ToolModelOutputFunction<TArgs, TResult>`

    Converts the execution result into model-visible output.

  - `experimental_onSchemaValidationError` `?: OnSchemaValidationErrorFunction<TResult>`

    Handles invalid tool arguments when schema validation fails.

  - `toolName` `: string`

  - `render` `?: unknown`

    Component used to render calls to this tool in assistant messages.