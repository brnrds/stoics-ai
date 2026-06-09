# Message
URL: /docs/primitives/message

Build custom message rendering with content parts, attachments, and hover state.

The Message primitive handles individual message rendering: content parts, attachments, quotes, hover state, and error display. It's the building block inside each message bubble, resolving text, images, tool calls, and more through a parts pipeline.

- items

  - Preview
  - Code

`import { MessagePrimitive, MessagePartPrimitive, } from "@assistant-ui/react"; function UserMessage() { return ( <MessagePrimitive.Root className="flex justify-end"> <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"> <MessagePrimitive.Parts> {({ part }) => { if (part.type === "text") return <UserText />; return null; }} </MessagePrimitive.Parts> </div> </MessagePrimitive.Root> ); } function AssistantMessage() { return ( <MessagePrimitive.Root className="flex justify-start gap-3"> <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"> AI </div> <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm"> <MessagePrimitive.Parts> {({ part }) => { if (part.type === "text") return <AssistantText />; return part.toolUI ?? null; }} </MessagePrimitive.Parts> </div> </MessagePrimitive.Root> ); } function UserText() { return ( <p> <MessagePartPrimitive.Text /> </p> ); } function AssistantText() { return ( <p className="leading-relaxed"> <MessagePartPrimitive.Text /> </p> ); }`

## [Quick Start](#quick-start)

A minimal message with parts rendering:

`import { MessagePrimitive } from "@assistant-ui/react"; <MessagePrimitive.Root> <MessagePrimitive.Parts /> </MessagePrimitive.Root>`

`Root` renders a `<div>` that provides message context and tracks hover state. `Parts` iterates over the message's content parts and renders each one. Without custom components, parts render with sensible defaults: `Text` renders a `<p>` with `white-space: pre-line` and a streaming indicator, `Image` renders via `MessagePartPrimitive.Image`, and tool calls render nothing unless a tool UI is registered globally or inline. Reasoning, source, file, and audio parts render nothing by default.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Parts Pipeline](#parts-pipeline)

`MessagePrimitive.Parts` now prefers a children render function. It gives you the current enriched part state directly, so you can branch inline and return exactly the UI you want:

`<MessagePrimitive.Parts> {({ part }) => { if (part.type === "text") return <MyTextRenderer />; if (part.type === "image") return <MyImageRenderer />; if (part.type === "tool-call") return part.toolUI ?? <GenericToolUI {...part} />; return null; }} </MessagePrimitive.Parts>`

For most new code, prefer `MessagePrimitive.Parts` with a `children` render function. When you need adjacent grouping, use `MessagePrimitive.GroupedParts`.

### [Tool Resolution](#tool-resolution)

Tool call parts resolve in this order:

1. **`tools.Override`**: if provided inline through the deprecated `components` prop, handles **all** tool calls
2. **Globally registered tools**: tools registered via `makeAssistantTool` / `useAssistantToolUI`
3. **`tools.by_name[toolName]`**: per-`MessagePrimitive.Parts` inline overrides from the deprecated `components` prop
4. **`tools.Fallback`**: catch-all for unmatched tool calls from the deprecated `components` prop
5. **`part.toolUI`**: the resolved tool UI exposed directly in the children render function

In the children API, tool and data parts expose resolved UI helpers directly:

`<MessagePrimitive.Parts> {({ part }) => { if (part.type === "tool-call") return part.toolUI ?? <ToolFallback {...part} />; if (part.type === "data") return part.dataRendererUI ?? null; return null; }} </MessagePrimitive.Parts>`

Returning `null` still allows registered tool UIs and data renderer UIs to render automatically. Return `<></>` if you want to suppress them entirely.

### [Components Prop (Deprecated)](#components-prop-deprecated)

`components` is deprecated. This section only documents it so older code is still understandable:

- `ToolGroup` wraps consecutive tool-call parts
- `ReasoningGroup` wraps consecutive reasoning parts
- `components.ChainOfThought` takes over all reasoning and tool-call rendering (mutually exclusive with `ToolGroup`, `ReasoningGroup`, `tools`, and `Reasoning`). This legacy path is deprecated; use `MessagePrimitive.GroupedParts` for grouped Chain of Thought in new code.
- `data.by_name` and `data.Fallback` let you route custom data part types
- `Quote` renders quoted message references from metadata
- `Empty` and `Unstable_Audio` are available for edge and experimental rendering paths

`<MessagePrimitive.Parts components={{ Text: () => ( <p className="whitespace-pre-wrap"> <MessagePartPrimitive.Text /> </p> ), Image: () => <MessagePartPrimitive.Image className="max-w-sm rounded-xl" />, File: () => <div className="rounded-md border px-2 py-1 text-xs">File part</div>, tools: { by_name: { get_weather: () => <div>Weather tool</div>, }, Fallback: ({ toolName }) => <div>Unknown tool: {toolName}</div>, }, data: { by_name: { "my-event": ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>, }, Fallback: ({ name }) => <div>Unknown data event: {name}</div>, }, ToolGroup: ({ children }) => ( <div className="space-y-2 rounded-lg border p-2">{children}</div> ), ReasoningGroup: ({ children }) => ( <details className="rounded-lg border p-2"> <summary>Reasoning</summary> {children} </details> ), Empty: () => <span className="text-muted-foreground">...</span>, Unstable_Audio: () => null, }} />`

For new code, use the `children` render function or `GroupedParts` instead.

### [Hover State](#hover-state)

`MessagePrimitive.Root` automatically tracks mouse enter/leave events. This hover state is consumed by `ActionBarPrimitive` to implement auto-hide behavior, with no extra wiring needed.

### [MessagePartPrimitive](#messagepartprimitive)

Inside your custom part components, use these sub-primitives to access the actual content:

- **`MessagePartPrimitive.Text`**: renders the text content of a text part
- **`MessagePartPrimitive.Image`**: renders the image of an image part
- **`MessagePartPrimitive.InProgress`**: renders only while the part is still streaming

`function MyText() { return ( <p className="whitespace-pre-wrap"> <MessagePartPrimitive.Text /> <MessagePartPrimitive.InProgress> <span className="animate-pulse">▊</span> </MessagePartPrimitive.InProgress> </p> ); }`

## [Parts](#parts)

### [Root](#root)

Container for a single message. Renders a `<div>` element unless `asChild` is set.

`<MessagePrimitive.Root className="flex flex-col gap-2"> <MessagePrimitive.Quote> {({ text }) => <blockquote className="mb-2 border-l pl-3 italic">{text}</blockquote>} </MessagePrimitive.Quote> <MessagePrimitive.Parts /> </MessagePrimitive.Root>`

### [Parts](#parts-1)

Renders each content part with type-based component resolution.

`<MessagePrimitive.Parts> {({ part }) => { if (part.type === "text") return <MyTextRenderer />; if (part.type === "image") return <MyImageRenderer />; if (part.type === "tool-call") return part.toolUI ?? <GenericToolUI {...part} />; return null; }} </MessagePrimitive.Parts>`

- rows

  - - name

      components

    - type

      ```
      StandardComponents | ChainOfThoughtComponents
      ```

    - typeFull

      ```
      StandardComponents | ChainOfThoughtComponents | undefined
      ```

    - description

      - Component configuration for rendering different types of message content.\
        \
        Use either \`Reasoning\`/\`tools\`/\`ToolGroup\`/\`ReasoningGroup\` for standard rendering,\
        or \`ChainOfThought\` to group all reasoning and tool-call parts into a single\
        collapsible component. These two modes are mutually exclusive.

  - - name

      unstable\_showEmptyOnNonTextEnd

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - - variant

          unstable

      - When enabled, shows the Empty component if the last part in the message\
        is anything other than Text or Reasoning.

    - default

      ```
      true
      ```

  - - name

      children

    - type

      ```
      (value: object) => ReactNode
      ```

    - typeFull

      ```
      (value: { part: EnrichedPartState; }) => ReactNode
      ```

    - description

      - Render function called for each part. Receives the enriched part state.

### [GroupedParts](#groupedparts)

Groups adjacent message parts into a nested tree. Use `groupBy` to return group keys for parts that should be grouped, then switch on `part.type` in the render function. Group cases render `children`; leaf cases render their own UI.

`<MessagePrimitive.GroupedParts groupBy={(part) => { if (part.type === "reasoning") return ["group-chainOfThought", "group-reasoning"]; if (part.type === "tool-call") return ["group-chainOfThought", "group-tool"]; return null; }} > {({ part, children }) => { switch (part.type) { case "group-chainOfThought": return <div>{children}</div>; case "group-reasoning": return <ReasoningRoot>{children}</ReasoningRoot>; case "group-tool": return <ToolGroupRoot>{children}</ToolGroupRoot>; case "text": return <MarkdownText />; case "reasoning": return <Reasoning {...part} />; case "tool-call": return part.toolUI ?? <ToolFallback {...part} />; case "data": return part.dataRendererUI; default: return null; } }} </MessagePrimitive.GroupedParts>`

- rows

  - - name

      groupBy

    - type

      ```
      (part: PartState, index: number, parts: readonly PartStat...
      ```

    - typeFull

      ```
      (part: PartState, index: number, parts: readonly PartState[]) => GroupKey<TKey>
      ```

    - description

      - Maps each part to its group key path. Adjacent parts that share a\
        prefix coalesce up to that prefix. Return \`null\`, \`undefined\`, or\
        \`\[]\` to leave a part ungrouped — it will be rendered as a leaf\
        through \`children\` with \`part\` set to its EnrichedPartState.\
        \
        Keys must start with \`"group-"\` so the renderer's\
        \`switch (part.type)\` can distinguish groups from real part types.\
        \
        For best performance, pass a stable reference (module-level\
        constant or \`useCallback\`).

  - - name

      children

    - type

      ```
      (info: RenderInfo<TKey>) => ReactNode
      ```

    - description

      - Render function called once per group node and once per leaf part.\
        Switch on \`part.type\`: \`"group-…"\` cases wrap \`children\`; real\
        part types (\`"text"\`, \`"tool-call"\`, …) render the part directly.\
        \
        Leaf parts receive the same EnrichedPartState that\
        \`\<MessagePrimitive.Parts>\` would produce (\`toolUI\`, \`addResult\`,\
        \`resume\`, \`dataRendererUI\`).

### [Content](#content)

Legacy alias for `Parts`.

`<MessagePrimitive.Content> {({ part }) => { if (part.type === "text") return <MyTextRenderer />; return null; }} </MessagePrimitive.Content>`

### [PartByIndex](#partbyindex)

Renders a single part at a specific index.

`<MessagePrimitive.PartByIndex index={0} components={{ Text: MyTextRenderer }} />`

### [Attachments](#attachments)

Renders all user message attachments.

`<MessagePrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") { const imageSrc = attachment.content?.find((part) => part.type === "image")?.image; if (!imageSrc) return null; return <img src={imageSrc} alt={attachment.name} className="max-w-xs rounded-lg" />; } if (attachment.type === "document") { return ( <div className="rounded-lg border p-2 text-sm"> {attachment.name} </div> ); } return null; }} </MessagePrimitive.Attachments>`

- rows

  - - name

      components

    - type

      ```
      MessageAttachmentsComponentConfig
      ```

    - description

      - - variant

          deprecated

        Use the children render function instead.

  - - name

      children

    - type

      ```
      (value: object) => ReactNode
      ```

    - typeFull

      ```
      (value: { attachment: CompleteAttachment; }) => ReactNode
      ```

    - description

      - Render function called for each attachment. Receives the attachment.

### [AttachmentByIndex](#attachmentbyindex)

Renders a single attachment at the specified index within the current message.

`<MessagePrimitive.AttachmentByIndex index={0} components={{ Attachment: MyAttachment }} />`

- rows

  - - name

      index

    - type

      ```
      number
      ```

  - - name

      components

    - type

      ```
      MessageAttachmentsComponentConfig
      ```

### [Error](#error)

Renders children only when the message has an error.

`<MessagePrimitive.Error> <ErrorPrimitive.Root className="mt-2 rounded-md border border-destructive/20 bg-destructive/5 p-3"> <ErrorPrimitive.Message /> </ErrorPrimitive.Root> </MessagePrimitive.Error>`

### [Quote](#quote)

Renders quote metadata when the current message includes a quote. Place it above `MessagePrimitive.Parts`.

`<MessagePrimitive.Quote> {({ text, messageId }) => ( <blockquote className="mb-2 border-l pl-3 italic" data-message-id={messageId}> {text} </blockquote> )} </MessagePrimitive.Quote>`

### [Unstable\_PartsGrouped](#unstable_partsgrouped)

Groups parts by a custom grouping function *(unstable; use `GroupedParts` for adjacent grouping)*.

`<MessagePrimitive.Unstable_PartsGrouped groupingFunction={myGroupFn} components={{ Text: MyText, Group: MyGroupWrapper }} />`

- rows

  - - name

      groupingFunction

    - type

      ```
      GroupingFunction
      ```

    - description

      - Function that takes an array of message parts and returns an array of groups.\
        Each group contains a key (for identification) and an array of indices.

  - - name

      components

    - type

      ```
      { Empty?: EmptyMessagePartComponent | undefined; Text?: T...
      ```

    - typeFull

      ```
      { Empty?: EmptyMessagePartComponent | undefined; Text?: TextMessagePartComponent | undefined; Reasoning?: ReasoningMessagePartComponent | undefined; Source?: SourceMessagePartComponent | undefined; Image?: ImageMessagePartComponent | undefined; File?: FileMessagePartComponent | undefined; Unstable_Audio?: Unstable_AudioMessagePartComponent | undefined; data?: { by_name?: Record<string, DataMessagePartComponent | undefined> | undefined; ... } | undefined; tools?: { by_name?: Record<string, ToolCallMessagePartComponent | undefined> | undefined; ... } | { Override: ComponentType<ToolCallMessagePartProps>; } | undefined; Group?: ComponentType<PropsWithChildren<{ groupKey: string | undefined; indices: number[]; }>>; } | undefined
      ```

    - description

      - Component configuration for rendering different types of message content.\
        \
        You can provide custom components for each content type (text, image, file, etc.)\
        and configure tool rendering behavior. If not provided, default components will be used.

    - children

      - - rows

          - - name

              Empty

            - type

              ```
              EmptyMessagePartComponent
              ```

            - typeFull

              ```
              EmptyMessagePartComponent | undefined
              ```

            - description

              - Component for rendering empty messages

          - - name

              Text

            - type

              ```
              TextMessagePartComponent
              ```

            - typeFull

              ```
              TextMessagePartComponent | undefined
              ```

            - description

              - Component for rendering text content

          - - name

              Reasoning

            - type

              ```
              ReasoningMessagePartComponent
              ```

            - typeFull

              ```
              ReasoningMessagePartComponent | undefined
              ```

            - description

              - Component for rendering reasoning content (typically hidden)

          - - name

              Source

            - type

              ```
              SourceMessagePartComponent
              ```

            - typeFull

              ```
              SourceMessagePartComponent | undefined
              ```

            - description

              - Component for rendering source content

          - - name

              Image

            - type

              ```
              ImageMessagePartComponent
              ```

            - typeFull

              ```
              ImageMessagePartComponent | undefined
              ```

            - description

              - Component for rendering image content

          - - name

              File

            - type

              ```
              FileMessagePartComponent
              ```

            - typeFull

              ```
              FileMessagePartComponent | undefined
              ```

            - description

              - Component for rendering file content

          - - name

              Unstable\_Audio

            - type

              ```
              Unstable_AudioMessagePartComponent
              ```

            - typeFull

              ```
              Unstable_AudioMessagePartComponent | undefined
              ```

            - description

              - Component for rendering audio content (experimental)

          - - name

              data

            - type

              ```
              object
              ```

            - typeFull

              ```
              { by_name?: Record<string, DataMessagePartComponent | undefined> | undefined; ... } | undefined
              ```

            - description

              - Configuration for data part rendering

          - - name

              tools

            - type

              ```
              object
              ```

            - typeFull

              ```
              { by_name?: Record<string, ToolCallMessagePartComponent | undefined> | undefined; ... } | { Override: ComponentType<ToolCallMessagePartProps>; } | undefined
              ```

            - description

              - Configuration for tool call rendering

          - - name

              Group

            - type

              ```
              ComponentType<PropsWithChildren<object>>
              ```

            - typeFull

              ```
              ComponentType<PropsWithChildren<{ groupKey: string | undefined; indices: number[]; }>>
              ```

            - description

              - Component for rendering grouped message parts.\
                \
                When provided, this component will automatically wrap message parts that share\
                the same group key as determined by the groupingFunction.\
                \
                The component receives:\
                \- \`groupKey\`: The group key (or undefined for ungrouped parts)\
                \- \`indices\`: Array of indices for the parts in this group\
                \- \`children\`: The rendered message part components

### [Unstable\_PartsGroupedByParentId](#unstable_partsgroupedbyparentid)

Groups parts by parent ID *(unstable, deprecated; use `Unstable_PartsGrouped`)*.

`<MessagePrimitive.Unstable_PartsGroupedByParentId components={{ Text: MyText, Group: MyGroupWrapper }} />`

### [If (deprecated)](#if-deprecated)

Deprecated. Use

- href

  /docs/api-reference/primitives/assistant-if

`AuiIf`

instead.

`// Before (deprecated) <MessagePrimitive.If user>...</MessagePrimitive.If> <MessagePrimitive.If assistant>...</MessagePrimitive.If> // After <AuiIf condition={(s) => s.message.role === "user"}>...</AuiIf> <AuiIf condition={(s) => s.message.role === "assistant"}>...</AuiIf>`

## [Patterns](#patterns)

### [Custom Text Rendering](#custom-text-rendering)

`function MarkdownText() { return ( <div className="prose prose-sm"> <MessagePartPrimitive.Text /> </div> ); } <MessagePrimitive.Parts> {({ part }) => { if (part.type === "text") return <MarkdownText />; return null; }} </MessagePrimitive.Parts>`

### [Tool UI with by\_name](#tool-ui-with-by_name)

``<MessagePrimitive.Parts components={{ Text: MyText, tools: { by_name: { get_weather: ({ result }) => ( <div className="rounded-lg border p-3"> <p className="font-medium">Weather</p> <p>{result?.temperature}°F, {result?.condition}</p> </div> ), }, Fallback: ({ toolName, status }) => ( <div className="text-muted-foreground text-sm"> {status.type === "running" ? `Running ${toolName}...` : `${toolName} completed`} </div> ), }, }} />``

### [Error Display](#error-display)

`<MessagePrimitive.Root> <MessagePrimitive.Parts /> <MessagePrimitive.Error> <div className="mt-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive"> Something went wrong. Please try again. </div> </MessagePrimitive.Error> </MessagePrimitive.Root>`

### [Error Display with ErrorPrimitive](#error-display-with-errorprimitive)

For more control over error rendering, `ErrorPrimitive` provides a dedicated component that auto-reads the error string from the message status:

`import { ErrorPrimitive, MessagePrimitive } from "@assistant-ui/react"; <MessagePrimitive.Root> <MessagePrimitive.Parts /> <ErrorPrimitive.Root className="mt-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive" role="alert"> <ErrorPrimitive.Message /> </ErrorPrimitive.Root> </MessagePrimitive.Root>`

`ErrorPrimitive.Root` renders a `<div>` container with `role="alert"` and `ErrorPrimitive.Message` renders a `<span>` that displays the error text. `Root` always renders. Only `Message` conditionally returns `null` when there is no error. Wrap in `<MessagePrimitive.Error>` if you want the entire block to be conditional. See the

- href

  /docs/api-reference/primitives/error

ErrorPrimitive API Reference

for full details.

### [Render After Stream Completes](#render-after-stream-completes)

To render content only once the assistant message has finished streaming (a follow-up card, a feedback prompt, a generated component that should not flicker through partial states), gate it with

- href

  /docs/api-reference/primitives/assistant-if

`AuiIf`

on `s.message.status`:`import { MessagePrimitive, AuiIf } from "@assistant-ui/react"; <MessagePrimitive.Root> <MessagePrimitive.Parts /> <AuiIf condition={(s) => s.message.role === "assistant" && s.message.status?.type === "complete" } > <FollowUpCard /> </AuiIf> </MessagePrimitive.Root>;`

`s.message.status` is a discriminated union of `running | requires-action | complete | incomplete`, defined only on assistant messages. The `role === "assistant"` guard keeps the predicate type-safe. For tool-call-driven generative UI that defers rendering inside the part itself, see

- href

  /docs/guides/tool-ui#deferred-rendering

Deferred Rendering

in the Generative UI guide.

### [Legacy and Unstable APIs](#legacy-and-unstable-apis)

- `MessagePrimitive.Unstable_PartsGrouped` and `MessagePrimitive.Unstable_PartsGroupedByParentId` are unstable APIs for non-adjacent custom grouping.
- `Unstable_PartsGroupedByParentId` is deprecated in favor of `Unstable_PartsGrouped`.

### [Role-Based Styling](#role-based-styling)

`MessagePrimitive.Root` sets `data-message-id` automatically but does not set a `data-role` attribute. Style by role in your message components:

`// In your ThreadPrimitive.Messages children render function: function UserMessage() { return ( <MessagePrimitive.Root data-role="user" className="flex justify-end"> <MessagePrimitive.Parts /> </MessagePrimitive.Root> ); } function AssistantMessage() { return ( <MessagePrimitive.Root data-role="assistant" className="flex justify-start"> <MessagePrimitive.Parts /> </MessagePrimitive.Root> ); }`

### [Attachments](#attachments-1)

`<MessagePrimitive.Root> <MessagePrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") { const imageSrc = attachment.content?.find((part) => part.type === "image")?.image; if (!imageSrc) return null; return <img src={imageSrc} alt={attachment.name} className="max-w-xs rounded-lg" />; } if (attachment.type === "document") { return ( <div className="flex items-center gap-2 rounded-lg border p-2 text-sm"> 📄 {attachment.name} </div> ); } return null; }} </MessagePrimitive.Attachments> <MessagePrimitive.Parts /> </MessagePrimitive.Root>`

## [Relationship to Components](#relationship-to-components)

The shadcn

- href

  /docs/ui/thread

Thread

component renders user and assistant messages built from these primitives. The pre-built `AssistantMessage` and `UserMessage` components handle text rendering, tool UIs, error display, and action bars, all using `MessagePrimitive` under the hood.

Messages are commonly paired with

- href

  /docs/primitives/action-bar

ActionBar

for copy/reload/edit actions and

- href

  /docs/primitives/branch-picker

BranchPicker

for navigating between alternative responses.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/message

MessagePrimitive API Reference

.

Related:

- - href

    /docs/api-reference/primitives/message-part

  MessagePartPrimitive API Reference

- - href

    /docs/api-reference/primitives/action-bar

  ActionBarPrimitive API Reference

- - href

    /docs/api-reference/primitives/branch-picker

  BranchPickerPrimitive API Reference