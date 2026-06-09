# ThreadPrimitive
URL: /docs/api-reference/primitives/thread

Thread primitives for rendering chat transcripts, message lists, viewport state, suggestions, and composers in assistant-ui.

For examples and usage patterns, see

- href

  /docs/primitives/thread

Thread

.

## [Anatomy](#anatomy)

`import { ThreadPrimitive } from "@assistant-ui/react"; const Thread = () => ( <ThreadPrimitive.Root> <ThreadPrimitive.Viewport> <AuiIf condition={(s) => s.thread.isEmpty}>...</AuiIf> <ThreadPrimitive.Messages>{...}</ThreadPrimitive.Messages> <ThreadPrimitive.ViewportFooter className="sticky bottom-0"> <Composer /> </ThreadPrimitive.ViewportFooter> </ThreadPrimitive.Viewport> </ThreadPrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

The root container component for a thread. This component serves as the foundational wrapper for all thread-related components. It provides the basic structure and context needed for thread functionality.

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Empty](#empty)

**Deprecated.** Use \`\<AuiIf condition={(s) => s.thread.isEmpty} />\` instead.

### [If](#if)

**Deprecated.** Use \`\<AuiIf condition={(s) => s.thread...} />\` instead.

`ThreadPrimitiveIfProps`

- `disabled` `?: boolean`
- `running` `?: boolean`
- `empty` `?: boolean`

### [Viewport](#viewport)

A scrollable viewport container for thread messages. This component provides a scrollable area for displaying thread messages with automatic scrolling capabilities. It manages the viewport state and provides context for child components to access viewport-related functionality.

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadPrimitiveViewportProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `autoScroll` `?: boolean`

  Whether to automatically scroll to the bottom when new messages are added. When enabled, the viewport will automatically scroll to show the latest content. Default false if \`turnAnchor\` is "top", otherwise defaults to true.

- `turnAnchor` `?: "top" | "bottom"`

  Controls scroll anchoring behavior for new messages. - "bottom" (default): Messages anchor at the bottom, classic chat behavior. - "top": New user messages anchor at the top of the viewport for a focused reading experience.

- `topAnchorMessageClamp` `: ThreadPrimitiveViewportProps["topAnchorMessageClamp"]` = { tallerThan: "10em", visibleHeight: "6em" }

  Clamps tall user messages so the assistant response stays in view.

  - `tallerThan` `: string` = "10em"

    Clamp messages taller than this. Supports \`px\`, \`em\`, and \`rem\`.

  - `visibleHeight` `: string` = "6em"

    Visible portion of clamped messages. Supports \`px\`, \`em\`, and \`rem\`.

- `scrollToBottomOnRunStart` `?: boolean`

  Whether to scroll to bottom when a new run starts. Defaults to true.

- `scrollToBottomOnInitialize` `?: boolean`

  Whether to scroll to bottom when thread history is first loaded. Defaults to true.

- `scrollToBottomOnThreadSwitch` `?: boolean`

  Whether to scroll to bottom when switching to a different thread. Defaults to true.

### [ViewportProvider](#viewportprovider)

`ThreadPrimitiveViewportProviderProps`

- `options` `?: ThreadViewportStoreOptions`

  - `turnAnchor` `?: "top" | "bottom"`

  - `topAnchorMessageClamp` `?: ThreadViewportStoreOptions["topAnchorMessageClamp"]`

    - `tallerThan` `?: string`
    - `visibleHeight` `?: string`

### [ViewportFooter](#viewportfooter)

A footer container that measures its height for scroll calculations. This component measures its height and provides it to the viewport context so the auto-scroll system can account for any sticky footer overlapping the message list. Multiple ViewportFooter components can be used - their heights are summed. Typically used with \`className="sticky bottom-0"\` to keep the footer visible at the bottom of the viewport while scrolling.

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadPrimitiveViewportFooterProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Messages](#messages)

`ThreadPrimitiveMessagesProps`

- `components`

  - variant

    deprecated

  `?: MessagesComponentConfig`

  Deprecated: Use the children render function instead.

  - `Message` `?: ComponentType`

    Component used to render all message types

  - `EditComposer` `?: ComponentType`

    Component used when editing any message type

  - `UserEditComposer` `?: ComponentType`

    Component used when editing user messages specifically

  - `AssistantEditComposer` `?: ComponentType`

    Component used when editing assistant messages specifically

  - `SystemEditComposer` `?: ComponentType`

    Component used when editing system messages specifically

  - `UserMessage` `?: ComponentType`

    Component used to render user messages specifically

  - `AssistantMessage` `?: ComponentType`

    Component used to render assistant messages specifically

  - `SystemMessage` `?: ComponentType`

    Component used to render system messages specifically

- `children` `?: (value: { message: MessageState }) => ReactNode`

  Render function called for each message. Receives the message.

### [MessageByIndex](#messagebyindex)

Renders a single message at the specified index in the current thread.

`ThreadPrimitiveMessageByIndexProps`

- `index` `: number`

- `components` `: MessagesComponentConfig`

  - `Message` `?: ComponentType`

    Component used to render all message types

  - `EditComposer` `?: ComponentType`

    Component used when editing any message type

  - `UserEditComposer` `?: ComponentType`

    Component used when editing user messages specifically

  - `AssistantEditComposer` `?: ComponentType`

    Component used when editing assistant messages specifically

  - `SystemEditComposer` `?: ComponentType`

    Component used when editing system messages specifically

  - `UserMessage` `?: ComponentType`

    Component used to render user messages specifically

  - `AssistantMessage` `?: ComponentType`

    Component used to render assistant messages specifically

  - `SystemMessage` `?: ComponentType`

    Component used to render system messages specifically

### [ScrollToBottom](#scrolltobottom)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadPrimitiveScrollToBottomProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `behavior` `?: ScrollBehavior`

### [Suggestion](#suggestion)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadPrimitiveSuggestionProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `prompt` `: string`

  The suggestion prompt.

- `send` `?: boolean`

  When true, automatically sends the message. When false, replaces or appends the composer text with the suggestion - depending on the value of \`clearComposer\`.

- `clearComposer` `: boolean` = true

  Whether to clear the composer after sending. When send is set to false, determines if composer text is replaced with suggestion (true, default), or if it's appended to the composer text (false).

- `autoSend`

  - variant

    deprecated

  `?: boolean`

  Deprecated: Use \`send\` instead.

- `method`

  - variant

    deprecated

  `?: "replace"`

  Deprecated: Use \`clearComposer\` instead.

### [Suggestions](#suggestions)

`ThreadPrimitiveSuggestionsProps`

- `components`

  - variant

    deprecated

  `?: SuggestionsComponentConfig`

  Deprecated: Use the children render function instead.

  - `Suggestion` `: ComponentType`

    Component used to render each suggestion

- `children` `?: (value: { suggestion: SuggestionState }) => ReactNode`

  Render function called for each suggestion. Receives the suggestion.

### [SuggestionByIndex](#suggestionbyindex)

Renders a single suggestion at the specified index.

`ThreadPrimitiveSuggestionByIndexProps`

- `index` `: number`

- `components` `: SuggestionsComponentConfig`

  - `Suggestion` `: ComponentType`

    Component used to render each suggestion