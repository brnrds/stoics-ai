# Tool Status
URL: /docs/api-reference/tools/status

Read tool arguments, execution status, and result state inside assistant-ui tool UI components.

## [API Reference](#api-reference)

### [useToolArgsStatus](#usetoolargsstatus)

Reads whether each argument field for the current tool-call message part is still streaming or complete.

Use inside a tool-call renderer to avoid showing incomplete argument values as final.

`const useToolArgsStatus: <TArgs extends Record<string, unknown> = Record<string, unknown>>() => ToolArgsStatus<TArgs>;`