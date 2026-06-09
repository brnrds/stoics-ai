# MessagePrimitive
URL: /docs/api-reference/primitives/message

Message primitives for rendering assistant and user turns, message parts, attachments, actions, editing, and branch controls.

For examples and usage patterns, see

- href

  /docs/primitives/message

Message

.

## [Anatomy](#anatomy)

`import { MessagePrimitive } from "@assistant-ui/react"; const UserMessage = () => ( <MessagePrimitive.Root> User: <MessagePrimitive.Parts /> <BranchPicker /> <ActionBar /> </MessagePrimitive.Root> ); const AssistantMessage = () => ( <MessagePrimitive.Root> Assistant: <MessagePrimitive.Parts /> <BranchPicker /> <ActionBar /> </MessagePrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

The root container component for a message. This component provides the foundational wrapper for message content and handles hover state management for the message. It automatically tracks when the user is hovering over the message, which can be used by child components like action bars. When \`turnAnchor="top"\` is set on the viewport, this component automatically registers itself as the top-anchor user message (when it's the previous user message) or as the top-anchor target (when it's the streaming assistant response). No additional component is required.

This primitive renders a `<div>` element unless `asChild` is set.

`MessagePrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Parts](#parts)

Renders the parts of a message with web-specific default components.

`MessagePrimitivePartsProps`

- `components` `?: StandardComponents | ChainOfThoughtComponents`

  Component configuration for rendering different types of message content. Use either \`Reasoning\`/\`tools\`/\`ToolGroup\`/\`ReasoningGroup\` for standard rendering, or \`ChainOfThought\` to group all reasoning and tool-call parts into a single collapsible component. These two modes are mutually exclusive.

  - `Empty` `?: EmptyMessagePartComponent`

    Component for rendering empty messages

  - `Text` `?: TextMessagePartComponent`

    Component for rendering text content

  - `Source` `?: SourceMessagePartComponent`

    Component for rendering source content

  - `Image` `?: ImageMessagePartComponent`

    Component for rendering image content

  - `File` `?: FileMessagePartComponent`

    Component for rendering file content

  - `Unstable_Audio` `?: Unstable_AudioMessagePartComponent`

    Component for rendering audio content (experimental)

  - `data` `?: DataConfig`

    Configuration for data part rendering

    - `by_name` `?: Record<string, DataMessagePartComponent | undefined>`

      Map data event names to specific components

    - `Fallback` `?: DataMessagePartComponent`

      Fallback component for unmatched data events

  - `Quote` `?: QuoteMessagePartComponent`

    Component for rendering a quoted message reference (from metadata, not parts)

  - `Reasoning` `?: ReasoningMessagePartComponent`

    Component for rendering reasoning content (typically hidden)

  - `tools` `?: ToolsConfig`

    Configuration for tool call rendering

    - `by_name` `?: Record<string, ToolCallMessagePartComponent | undefined>`

      Map of tool names to their specific components

    - `Fallback` `?: ComponentType<ToolCallMessagePartProps>`

      Fallback component for unregistered tools

    - `Override` `: ComponentType<ToolCallMessagePartProps>`

      Override component that handles all tool calls

  - `ToolGroup`

    - variant

      deprecated

    `?: ComponentType< PropsWithChildren<{ startIndex: number; endIndex: number }> >`

    Component for rendering grouped consecutive tool calls.

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a custom \`groupBy\` instead.

  - `ReasoningGroup`

    - variant

      deprecated

    `?: ReasoningGroupComponent`

    Component for rendering grouped reasoning parts.

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a custom \`groupBy\` instead.

  - `ChainOfThought`

    - variant

      deprecated

    `: ComponentType`

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a \`groupBy\` that returns \`\["group-thought", ...]\` for reasoning and tool-call parts. See \`@assistant-ui/ui\` for a worked example.

- `unstable_showEmptyOnNonTextEnd`

  - variant

    unstable

  `: boolean` = true

  When enabled, shows the Empty component if the last part in the message is anything other than Text or Reasoning.

- `children` `?: (value: { part: EnrichedPartState }) => ReactNode`

  Render function called for each part. Receives the enriched part state.

### [PartByIndex](#partbyindex)

Renders a single message part at the specified index.

`MessagePrimitivePartByIndexProps`

- `index` `: number`

- `components` `?: MessagePrimitiveParts.Props["components"]`

  - `Empty` `?: EmptyMessagePartComponent`

    Component for rendering empty messages

  - `Text` `?: TextMessagePartComponent`

    Component for rendering text content

  - `Source` `?: SourceMessagePartComponent`

    Component for rendering source content

  - `Image` `?: ImageMessagePartComponent`

    Component for rendering image content

  - `File` `?: FileMessagePartComponent`

    Component for rendering file content

  - `Unstable_Audio` `?: Unstable_AudioMessagePartComponent`

    Component for rendering audio content (experimental)

  - `data` `?: DataConfig`

    Configuration for data part rendering

    - `by_name` `?: Record<string, DataMessagePartComponent | undefined>`

      Map data event names to specific components

    - `Fallback` `?: DataMessagePartComponent`

      Fallback component for unmatched data events

  - `Quote` `?: QuoteMessagePartComponent`

    Component for rendering a quoted message reference (from metadata, not parts)

  - `Reasoning` `?: ReasoningMessagePartComponent`

    Component for rendering reasoning content (typically hidden)

  - `tools` `?: ToolsConfig`

    Configuration for tool call rendering

    - `by_name` `?: Record<string, ToolCallMessagePartComponent | undefined>`

      Map of tool names to their specific components

    - `Fallback` `?: ComponentType<ToolCallMessagePartProps>`

      Fallback component for unregistered tools

    - `Override` `: ComponentType<ToolCallMessagePartProps>`

      Override component that handles all tool calls

  - `ToolGroup`

    - variant

      deprecated

    `?: ComponentType< PropsWithChildren<{ startIndex: number; endIndex: number }> >`

    Component for rendering grouped consecutive tool calls.

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a custom \`groupBy\` instead.

  - `ReasoningGroup`

    - variant

      deprecated

    `?: ReasoningGroupComponent`

    Component for rendering grouped reasoning parts.

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a custom \`groupBy\` instead.

  - `ChainOfThought`

    - variant

      deprecated

    `: ComponentType`

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a \`groupBy\` that returns \`\["group-thought", ...]\` for reasoning and tool-call parts. See \`@assistant-ui/ui\` for a worked example.

### [Content](#content)

`MessagePrimitiveContentProps`

- `components` `?: StandardComponents | ChainOfThoughtComponents`

  Component configuration for rendering different types of message content. Use either \`Reasoning\`/\`tools\`/\`ToolGroup\`/\`ReasoningGroup\` for standard rendering, or \`ChainOfThought\` to group all reasoning and tool-call parts into a single collapsible component. These two modes are mutually exclusive.

  - `Empty` `?: EmptyMessagePartComponent`

    Component for rendering empty messages

  - `Text` `?: TextMessagePartComponent`

    Component for rendering text content

  - `Source` `?: SourceMessagePartComponent`

    Component for rendering source content

  - `Image` `?: ImageMessagePartComponent`

    Component for rendering image content

  - `File` `?: FileMessagePartComponent`

    Component for rendering file content

  - `Unstable_Audio` `?: Unstable_AudioMessagePartComponent`

    Component for rendering audio content (experimental)

  - `data` `?: DataConfig`

    Configuration for data part rendering

    - `by_name` `?: Record<string, DataMessagePartComponent | undefined>`

      Map data event names to specific components

    - `Fallback` `?: DataMessagePartComponent`

      Fallback component for unmatched data events

  - `Quote` `?: QuoteMessagePartComponent`

    Component for rendering a quoted message reference (from metadata, not parts)

  - `Reasoning` `?: ReasoningMessagePartComponent`

    Component for rendering reasoning content (typically hidden)

  - `tools` `?: ToolsConfig`

    Configuration for tool call rendering

    - `by_name` `?: Record<string, ToolCallMessagePartComponent | undefined>`

      Map of tool names to their specific components

    - `Fallback` `?: ComponentType<ToolCallMessagePartProps>`

      Fallback component for unregistered tools

    - `Override` `: ComponentType<ToolCallMessagePartProps>`

      Override component that handles all tool calls

  - `ToolGroup`

    - variant

      deprecated

    `?: ComponentType< PropsWithChildren<{ startIndex: number; endIndex: number }> >`

    Component for rendering grouped consecutive tool calls.

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a custom \`groupBy\` instead.

  - `ReasoningGroup`

    - variant

      deprecated

    `?: ReasoningGroupComponent`

    Component for rendering grouped reasoning parts.

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a custom \`groupBy\` instead.

  - `ChainOfThought`

    - variant

      deprecated

    `: ComponentType`

    Deprecated: Use \`\<MessagePrimitive.GroupedParts>\` with a \`groupBy\` that returns \`\["group-thought", ...]\` for reasoning and tool-call parts. See \`@assistant-ui/ui\` for a worked example.

- `unstable_showEmptyOnNonTextEnd`

  - variant

    unstable

  `: boolean` = true

  When enabled, shows the Empty component if the last part in the message is anything other than Text or Reasoning.

- `children` `?: (value: { part: EnrichedPartState }) => ReactNode`

  Render function called for each part. Receives the enriched part state.

### [If](#if)

**Deprecated.** Use \`\<AuiIf condition={(s) => s.message...} />\` instead.

`MessagePrimitiveIfProps`

- `system` `?: boolean`
- `user` `?: boolean`
- `assistant` `?: boolean`
- `speaking` `?: boolean`
- `hasBranches` `?: boolean`
- `copied` `?: boolean`
- `lastOrHover` `?: boolean`
- `last` `?: boolean`
- `hasAttachments` `?: boolean`
- `hasContent` `?: boolean`
- `submittedFeedback` `?: "positive" | "negative" | null`

### [Attachments](#attachments)

`MessagePrimitiveAttachmentsProps`

- `components`

  - variant

    deprecated

  `?: MessageAttachmentsComponentConfig`

  Deprecated: Use the children render function instead.

  - `Image` `?: ComponentType`
  - `Document` `?: ComponentType`
  - `File` `?: ComponentType`
  - `Attachment` `?: ComponentType`

- `children` `?: (value: { attachment: CompleteAttachment }) => ReactNode`

  Render function called for each attachment. Receives the attachment.

### [AttachmentByIndex](#attachmentbyindex)

Renders a single attachment at the specified index within the current message.

`MessagePrimitiveAttachmentByIndexProps`

- `index` `: number`

- `components` `?: MessageAttachmentsComponentConfig`

  - `Image` `?: ComponentType`
  - `Document` `?: ComponentType`
  - `File` `?: ComponentType`
  - `Attachment` `?: ComponentType`

### [Quote](#quote)

`MessagePrimitiveQuoteProps`

- `children` `: (value: QuoteInfo) => ReactNode`

  Render function called when a quote is present. Receives quote info.

### [Error](#error)

### [GroupedParts](#groupedparts)

Groups adjacent message parts into a tree of coalesced runs and renders each node — group or part — through a single \`children\` function. The render function receives \`{ part, children }\` where \`part.type\` is either a \`"group-…"\` literal (for a group, \`children\` is the recursively-rendered subtree) or a real part type (\`"text"\`, \`"tool-call"\`, …) for a leaf (\`children\` is a sentinel that throws if rendered — use \`part.type\` to distinguish).

`MessagePrimitiveGroupedPartsProps`

- `groupBy` `: ( part: PartState, index: number, parts: readonly PartState[], ) => GroupKey<TKey>`

  Maps each part to its group key path. Adjacent parts that share a prefix coalesce up to that prefix. Return \`null\`, \`undefined\`, or \`\[]\` to leave a part ungrouped — it will be rendered as a leaf through \`children\` with \`part\` set to its

  - href

    /docs/api-reference/runtimes/message-part-runtime#enrichedpartstate

  EnrichedPartState

  . Keys must start with \`"group-"\` so the renderer's \`switch (part.type)\` can distinguish groups from real part types. For best performance, pass a stable reference (module-level constant or \`useCallback\`).

- `children` `: (info: RenderInfo<TKey>) => ReactNode`

  Render function called once per group node and once per leaf part. Switch on \`part.type\`: \`"group-…"\` cases wrap \`children\`; real part types (\`"text"\`, \`"tool-call"\`, …) render the part directly. Leaf parts receive the same

  - href

    /docs/api-reference/runtimes/message-part-runtime#enrichedpartstate

  EnrichedPartState

  that \`\<MessagePrimitive.Parts>\` would produce (\`toolUI\`, \`addResult\`, \`resume\`, \`dataRendererUI\`).

### [Unstable\_PartsGrouped](#unstable_partsgrouped)

**Deprecated.** Prefer \`\<MessagePrimitive.GroupedParts>\` for adjacent grouping — it dispatches all rendering through one \`switch (part.type)\` and supports nested group paths. Keep this primitive only for non-adjacent clustering (e.g., gathering parts with the same parent-id across the message).

Renders the parts of a message grouped by a custom grouping function. This component allows you to group message parts based on any criteria you define. The grouping function receives all message parts and returns an array of groups, where each group has a key and an array of part indices.

`MessagePrimitiveUnstable_PartsGroupedProps`

- `groupingFunction` `: GroupingFunction`

  Function that takes an array of message parts and returns an array of groups. Each group contains a key (for identification) and an array of indices.

- `components` `?: MessagePrimitiveUnstable_PartsGroupedProps["components"]`

  Component configuration for rendering different types of message content. You can provide custom components for each content type (text, image, file, etc.) and configure tool rendering behavior. If not provided, default components will be used.

  - `Empty` `?: EmptyMessagePartComponent`

    Component for rendering empty messages

  - `Text` `?: TextMessagePartComponent`

    Component for rendering text content

  - `Reasoning` `?: ReasoningMessagePartComponent`

    Component for rendering reasoning content (typically hidden)

  - `Source` `?: SourceMessagePartComponent`

    Component for rendering source content

  - `Image` `?: ImageMessagePartComponent`

    Component for rendering image content

  - `File` `?: FileMessagePartComponent`

    Component for rendering file content

  - `Unstable_Audio` `?: Unstable_AudioMessagePartComponent`

    Component for rendering audio content (experimental)

  - `data` `?: MessagePrimitiveUnstable_PartsGroupedProps["components"]["data"]`

    Configuration for data part rendering

    - `by_name` `?: Record<string, DataMessagePartComponent | undefined>`

      Map data event names to specific components

    - `Fallback` `?: DataMessagePartComponent`

      Fallback component for unmatched data events

  - `tools` `?: MessagePrimitiveUnstable_PartsGroupedProps["components"]["tools"]`

    Configuration for tool call rendering

    - `by_name` `?: Record<string, ToolCallMessagePartComponent | undefined>`

      Map of tool names to their specific components

    - `Fallback` `?: ComponentType<ToolCallMessagePartProps>`

      Fallback component for unregistered tools

    - `Override` `: ComponentType<ToolCallMessagePartProps>`

      Override component that handles all tool calls

  - `Group` `?: ComponentType< PropsWithChildren<{ groupKey: string | undefined; indices: number[]; }> >`

    Component for rendering grouped message parts. When provided, this component will automatically wrap message parts that share the same group key as determined by the groupingFunction. The component receives: - \`groupKey\`: The group key (or undefined for ungrouped parts) - \`indices\`: Array of indices for the parts in this group - \`children\`: The rendered message part components

### [Unstable\_PartsGroupedByParentId](#unstable_partsgroupedbyparentid)

**Deprecated.** Use MessagePrimitive.Unstable\_PartsGrouped instead for more flexibility

Renders the parts of a message grouped by their parent ID. This is a convenience wrapper around Unstable\_PartsGrouped with parent ID grouping.

`MessagePrimitiveUnstable_PartsGroupedByParentIdProps`

- `components` `?: MessagePrimitiveUnstable_PartsGroupedByParentIdProps props["components"]`

  Component configuration for rendering different types of message content. You can provide custom components for each content type (text, image, file, etc.) and configure tool rendering behavior. If not provided, default components will be used.

  - `Empty` `?: EmptyMessagePartComponent`

    Component for rendering empty messages

  - `Text` `?: TextMessagePartComponent`

    Component for rendering text content

  - `Reasoning` `?: ReasoningMessagePartComponent`

    Component for rendering reasoning content (typically hidden)

  - `Source` `?: SourceMessagePartComponent`

    Component for rendering source content

  - `Image` `?: ImageMessagePartComponent`

    Component for rendering image content

  - `File` `?: FileMessagePartComponent`

    Component for rendering file content

  - `Unstable_Audio` `?: Unstable_AudioMessagePartComponent`

    Component for rendering audio content (experimental)

  - `data` `?: MessagePrimitiveUnstable_PartsGroupedByParentIdProps props["components"]["data"]`

    Configuration for data part rendering

    - `by_name` `?: Record<string, DataMessagePartComponent | undefined>`

      Map data event names to specific components

    - `Fallback` `?: DataMessagePartComponent`

      Fallback component for unmatched data events

  - `tools` `?: MessagePrimitiveUnstable_PartsGroupedByParentIdProps props["components"]["tools"]`

    Configuration for tool call rendering

    - `by_name` `?: Record<string, ToolCallMessagePartComponent | undefined>`

      Map of tool names to their specific components

    - `Fallback` `?: ComponentType<ToolCallMessagePartProps>`

      Fallback component for unregistered tools

    - `Override` `: ComponentType<ToolCallMessagePartProps>`

      Override component that handles all tool calls

  - `Group` `?: ComponentType< PropsWithChildren<{ groupKey: string | undefined; indices: number[]; }> >`

    Component for rendering grouped message parts. When provided, this component will automatically wrap message parts that share the same group key as determined by the groupingFunction. The component receives: - \`groupKey\`: The group key (or undefined for ungrouped parts) - \`indices\`: Array of indices for the parts in this group - \`children\`: The rendered message part components