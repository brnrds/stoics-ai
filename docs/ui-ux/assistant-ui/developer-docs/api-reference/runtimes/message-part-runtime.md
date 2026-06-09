# MessagePartRuntime
URL: /docs/api-reference/runtimes/message-part-runtime

MessagePartRuntime state and helpers for inspecting assistant-ui text, tool calls, data parts, reasoning, and custom message content.

## [API Reference](#api-reference)

### [EnrichedPartState](#enrichedpartstate)

Enriched part state passed to children render functions.

For tool-call parts, adds `toolUI`, `addResult`, and `resume`. For data parts, adds `dataRendererUI`.

The render function is also invoked once with a synthetic empty text part (`{ type: "text", text: "", status: { type: "running" } }`) when the assistant message has no parts yet but is in the running state, so a loading indicator can render. Differentiate this from a real empty text via `part.status?.type === "running" && part.text === ""`.

`EnrichedPartState`

- `type` `: "text"`

  Identifies this part as a tool call.

- `status` `: MessagePartStatus | ToolCallMessagePartStatus`

  - `type` `: "running"`

    The tool call is waiting for UI or human input before continuing.

### [MessagePartRuntime](#messagepartruntime)

`MessagePartRuntime`

- `addToolResult` `: (result: any | ToolResponse<any>) => void`

- `resumeToolCall` `: (payload: unknown) => void`

- `path` `: MessagePartRuntimePath`

  - `ref` `: string`

  - `threadSelector` `: MessagePartRuntimePath["threadSelector"]`

    - `type` `: "main"`

  - `messageSelector` `: MessagePartRuntimePath["messageSelector"]`

    - `type` `: "messageId"`

  - `messagePartSelector` `: MessagePartRuntimePath["messagePartSelector"]`

    - `type` `: "index"`

- `getState` `: () => MessagePartState`

- `subscribe` `: (callback: () => void) => Unsubscribe`

### [MessagePartState](#messagepartstate)

`MessagePartState`

- `type` `: "text"`

  Identifies this part as a tool call.

- `status` `: MessagePartStatus | ToolCallMessagePartStatus`

  - `type` `: "running"`

    The tool call is waiting for UI or human input before continuing.

### [PartState](#partstate)

`PartState`

- `type` `: "text"`

  Identifies this part as a tool call.

- `status` `: MessagePartStatus | ToolCallMessagePartStatus`

  - `type` `: "running"`

    The tool call is waiting for UI or human input before continuing.