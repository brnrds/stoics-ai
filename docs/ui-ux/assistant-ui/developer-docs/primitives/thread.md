# Thread
URL: /docs/primitives/thread

Build custom scrollable message containers with auto-scroll, empty states, and message rendering.

The Thread primitive is the scrollable message container, and the backbone of any chat interface. It handles viewport management, auto-scrolling, empty states, message rendering, and suggestions. You provide the layout and styling.

- items

  - Preview
  - Code

`import { AuiIf, ComposerPrimitive, ThreadPrimitive, MessagePrimitive, } from "@assistant-ui/react"; import { ArrowUpIcon } from "lucide-react"; function MinimalThread() { return ( <ThreadPrimitive.Root className="flex h-full flex-col"> <ThreadPrimitive.Viewport className="flex flex-1 flex-col gap-3 overflow-y-auto p-3"> <AuiIf condition={(s) => s.thread.isEmpty}> <p>Welcome! Ask a question to get started.</p> </AuiIf> <ThreadPrimitive.Messages> {({ message }) => { if (message.role === "user") return <UserMessage />; return <AssistantMessage />; }} </ThreadPrimitive.Messages> <ThreadPrimitive.ViewportFooter className="sticky bottom-0 pt-2"> <ComposerPrimitive.Root className="flex w-full flex-col rounded-3xl border bg-muted"> <ComposerPrimitive.Input placeholder="Ask anything..." className="min-h-10 w-full resize-none bg-transparent px-5 pt-3.5 pb-2.5 text-sm focus:outline-none" rows={1} /> <div className="flex items-center justify-end px-2.5 pb-2.5"> <ComposerPrimitive.Send className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-30"> <ArrowUpIcon className="size-4" /> </ComposerPrimitive.Send> </div> </ComposerPrimitive.Root> </ThreadPrimitive.ViewportFooter> </ThreadPrimitive.Viewport> </ThreadPrimitive.Root> ); } function UserMessage() { return ( <MessagePrimitive.Root className="flex justify-end"> <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"> <MessagePrimitive.Parts /> </div> </MessagePrimitive.Root> ); } function AssistantMessage() { return ( <MessagePrimitive.Root className="flex justify-start"> <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm"> <MessagePrimitive.Parts /> </div> </MessagePrimitive.Root> ); }`

## [Quick Start](#quick-start)

Minimal example:

`import { ThreadPrimitive } from "@assistant-ui/react"; <ThreadPrimitive.Root> <ThreadPrimitive.Viewport> <ThreadPrimitive.Messages> {() => <MyMessage />} </ThreadPrimitive.Messages> </ThreadPrimitive.Viewport> </ThreadPrimitive.Root>`

`Root` renders a `<div>`, `Viewport` renders a scrollable `<div>`, and `Messages` iterates over the thread's messages. Add your own styles and components; the primitive handles the rest.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Viewport & Auto-Scroll](#viewport--auto-scroll)

`Viewport` is the scrollable container. It auto-scrolls to the bottom as new content streams in, but only if the user hasn't scrolled up manually. Set `autoScroll={false}` to disable this entirely.

`<ThreadPrimitive.Viewport autoScroll={true}> {/* messages */} </ThreadPrimitive.Viewport>`

### [Turn Anchor](#turn-anchor)

By default, new messages appear at the bottom and scroll down. With `turnAnchor="top"`, the user's message anchors to the top of the viewport. This creates the modern reading experience where you see the question at the top and the response flowing below it.

`<ThreadPrimitive.Viewport turnAnchor="top"> {/* messages */} </ThreadPrimitive.Viewport>`

When `turnAnchor="top"` is set, `MessagePrimitive.Root` automatically registers the latest assistant message as the top-anchor target and the preceding user message as the anchor — no additional component is required. The viewport itself manages a stable reserve element that provides the missing scroll range while the assistant response grows. This is the behavior used by the

- href

  /docs/ui/thread

Thread

component by default.

Use `topAnchorMessageClamp` to control how much of a long user message remains visible when `turnAnchor="top"`. Messages up to `tallerThan` stay fully visible. For messages taller than that, `visibleHeight` controls how much of the message's bottom edge remains visible above the assistant response:

`<ThreadPrimitive.Viewport turnAnchor="top" topAnchorMessageClamp={{ tallerThan: "10em", visibleHeight: "6em" }} > {/* messages */} </ThreadPrimitive.Viewport>`

### [Viewport Scroll Options](#viewport-scroll-options)

`ThreadPrimitive.Viewport` has three event-specific scroll controls:

- `scrollToBottomOnRunStart` (default `true`): scrolls when `thread.runStart` fires
- `scrollToBottomOnInitialize` (default `true`): scrolls when `thread.initialize` fires
- `scrollToBottomOnThreadSwitch` (default `true`): scrolls when `threadListItem.switchedTo` fires

These work alongside `autoScroll`. If `autoScroll` is omitted, it defaults to `true` for `turnAnchor="bottom"` and `false` for `turnAnchor="top"`.

`<ThreadPrimitive.Viewport turnAnchor="top" autoScroll={false} scrollToBottomOnRunStart={true} scrollToBottomOnInitialize={false} scrollToBottomOnThreadSwitch={true} > <ThreadPrimitive.Messages> {({ message }) => { if (message.role === "user") return <UserMessage />; return <AssistantMessage />; }} </ThreadPrimitive.Messages> </ThreadPrimitive.Viewport>`

### [ViewportFooter](#viewportfooter)

`ViewportFooter` sticks to the bottom of the viewport and registers its height so the auto-scroll system accounts for it. This is where you place your composer:

`<ThreadPrimitive.Viewport> <ThreadPrimitive.Messages> {() => <MyMessage />} </ThreadPrimitive.Messages> <ThreadPrimitive.ViewportFooter className="sticky bottom-0"> <MyComposer /> </ThreadPrimitive.ViewportFooter> </ThreadPrimitive.Viewport>`

### [Empty State](#empty-state)

`ThreadPrimitive.Empty` is deprecated. Use

- href

  /docs/api-reference/primitives/assistant-if

`AuiIf`

instead.

`<AuiIf condition={(s) => s.thread.isEmpty}> <div className="flex flex-col items-center gap-2 text-center"> <h2>Welcome!</h2> <p>How can I help you today?</p> </div> </AuiIf>`

### [Messages Iterator](#messages-iterator)

`Messages` now prefers a children render function. It gives you the current message state so you can branch inline:

`<ThreadPrimitive.Messages> {({ message }) => { if (message.composer.isEditing) return <MyEditComposer />; if (message.role === "user") return <MyUserMessage />; return <MyAssistantMessage />; }} </ThreadPrimitive.Messages>`

`components` is deprecated. Use the `children` render function instead.

### [Suggestions Iterator](#suggestions-iterator)

`Suggestions` follows the same pattern. Prefer the children render function when rendering custom suggestion UIs:

`<ThreadPrimitive.Suggestions> {() => <MySuggestionButton />} </ThreadPrimitive.Suggestions>`

## [Parts](#parts)

### [Root](#root)

Top-level container for a thread layout. Renders a `<div>` element unless `asChild` is set.

`<ThreadPrimitive.Root className="flex h-full flex-col"> <ThreadPrimitive.Viewport> <ThreadPrimitive.Messages> {() => <MyMessage />} </ThreadPrimitive.Messages> </ThreadPrimitive.Viewport> </ThreadPrimitive.Root>`

### [Viewport](#viewport)

The scrollable area with auto-scroll behavior. Renders a `<div>` element unless `asChild` is set.

`<ThreadPrimitive.Viewport turnAnchor="top" autoScroll={false} scrollToBottomOnRunStart={true} > <ThreadPrimitive.Messages> {({ message }) => { if (message.role === "user") return <UserMessage />; return <AssistantMessage />; }} </ThreadPrimitive.Messages> </ThreadPrimitive.Viewport>`

- rows

  - - name

      render

    - type

      ```
      ReactElement<unknown, string | JSXElementConstructor<any>>
      ```

    - typeFull

      ```
      ReactElement<unknown, string | JSXElementConstructor<any>> | undefined
      ```

  - - name

      autoScroll

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - Whether to automatically scroll to the bottom when new messages are added.\
        When enabled, the viewport will automatically scroll to show the latest content.\
        \
        Default false if \`turnAnchor\` is "top", otherwise defaults to true.

  - - name

      turnAnchor

    - type

      ```
      "top" | "bottom"
      ```

    - typeFull

      ```
      "top" | "bottom" | undefined
      ```

    - description

      - Controls scroll anchoring behavior for new messages.\
        \- "bottom" (default): Messages anchor at the bottom, classic chat behavior.\
        \- "top": New user messages anchor at the top of the viewport for a focused reading experience.

  - - name

      topAnchorMessageClamp

    - type

      ```
      object
      ```

    - typeFull

      ```
      { tallerThan?: string; visibleHeight?: string; }
      ```

    - description

      - Clamps tall user messages so the assistant response stays in view.

    - default

      ```
      { tallerThan: "10em", visibleHeight: "6em" }
      ```

    - children

      - - type

          ThreadPrimitiveViewportProps\["topAnchorMessageClamp"]

        - rows

          - - name

              tallerThan

            - type

              ```
              string
              ```

            - description

              - Clamp messages taller than this. Supports \`px\`, \`em\`, and \`rem\`.

            - default

              ```
              "10em"
              ```

          - - name

              visibleHeight

            - type

              ```
              string
              ```

            - description

              - Visible portion of clamped messages. Supports \`px\`, \`em\`, and \`rem\`.

            - default

              ```
              "6em"
              ```

  - - name

      scrollToBottomOnRunStart

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - Whether to scroll to bottom when a new run starts.\
        \
        Defaults to true.

  - - name

      scrollToBottomOnInitialize

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - Whether to scroll to bottom when thread history is first loaded.\
        \
        Defaults to true.

  - - name

      scrollToBottomOnThreadSwitch

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - Whether to scroll to bottom when switching to a different thread.\
        \
        Defaults to true.

### [ViewportFooter](#viewportfooter-1)

Footer container that registers its height with the viewport scroll system. Renders a `<div>` element unless `asChild` is set.

`<ThreadPrimitive.ViewportFooter className="sticky bottom-0 pt-2"> <ComposerPrimitive.Root>...</ComposerPrimitive.Root> </ThreadPrimitive.ViewportFooter>`

### [ViewportProvider](#viewportprovider)

Provides viewport context without rendering a scrollable element. Use this when you have a custom scroll container.

`<ThreadPrimitive.ViewportProvider> <div className="flex-1 overflow-y-auto"> <ThreadPrimitive.Messages> {() => <MyMessage />} </ThreadPrimitive.Messages> <ThreadPrimitive.ViewportFooter> <MyComposer /> </ThreadPrimitive.ViewportFooter> </div> </ThreadPrimitive.ViewportProvider>`

### [ViewportSlack](#viewportslack)

`ThreadPrimitive.ViewportSlack` has been removed from the public API. Top-anchor target registration is handled automatically by `MessagePrimitive.Root` when `turnAnchor="top"`. Remove `ViewportSlack` from your tree; if you customized `fillClampThreshold` or `fillClampOffset` on `ViewportSlack` or `MessagePrimitive.Root`, replace those props with `topAnchorMessageClamp` on `ThreadPrimitive.Viewport`.

### [Messages](#messages)

Renders a component for each message in the thread, resolved by role and edit state.

`<ThreadPrimitive.Messages> {({ message }) => { if (message.composer.isEditing) return <MyEditComposer />; if (message.role === "user") return <MyUserMessage />; return <MyAssistantMessage />; }} </ThreadPrimitive.Messages>`

- rows

  - - name

      components

    - type

      ```
      MessagesComponentConfig
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
      (value: { message: MessageState; }) => ReactNode
      ```

    - description

      - Render function called for each message. Receives the message.

### [MessageByIndex](#messagebyindex)

Renders a single message at a specific index in the thread.

`<ThreadPrimitive.MessageByIndex index={0} components={{ Message: MyMessage }} />`

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
      MessagesComponentConfig
      ```

### [ScrollToBottom](#scrolltobottom)

Scrolls the viewport to the bottom. Automatically disabled when already at the bottom. Renders a `<button>` element unless `asChild` is set.

`<ThreadPrimitive.ScrollToBottom className="rounded-full bg-background p-2 shadow-md"> <ArrowDownIcon /> </ThreadPrimitive.ScrollToBottom>`

- rows

  - - name

      behavior

    - type

      ```
      ScrollBehavior
      ```

### [Suggestions](#suggestions)

Renders suggestion prompts via a component.

`<ThreadPrimitive.Suggestions> {({ suggestion }) => <MySuggestionButton prompt={suggestion.prompt} />} </ThreadPrimitive.Suggestions>`

- rows

  - - name

      components

    - type

      ```
      SuggestionsComponentConfig
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
      (value: { suggestion: SuggestionState; }) => ReactNode
      ```

    - description

      - Render function called for each suggestion. Receives the suggestion.

### [SuggestionByIndex](#suggestionbyindex)

Renders a single suggestion at a specific index.

`<ThreadPrimitive.SuggestionByIndex index={0} components={{ Suggestion: MySuggestion }} />`

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
      SuggestionsComponentConfig
      ```

### [Suggestion](#suggestion)

Self-contained suggestion button. Renders a `<button>` element unless `asChild` is set. *(Legacy -- prefer `Suggestions` iterator.)*

`<ThreadPrimitive.Suggestion prompt="Write a blog post" send />`

- rows

  - - name

      prompt

    - type

      ```
      string
      ```

    - description

      - The suggestion prompt.

  - - name

      send

    - type

      ```
      boolean
      ```

    - description

      - When true, automatically sends the message.\
        When false, replaces or appends the composer text with the suggestion - depending on the value of \`clearComposer\`.

  - - name

      clearComposer

    - type

      ```
      boolean
      ```

    - description

      - Whether to clear the composer after sending.\
        When send is set to false, determines if composer text is replaced with suggestion (true, default),\
        or if it's appended to the composer text (false).

    - default

      ```
      true
      ```

  - - name

      autoSend

    - type

      ```
      boolean
      ```

    - description

      - - variant

          deprecated

        Use \`send\` instead.

  - - name

      method

    - type

      ```
      "replace"
      ```

    - description

      - - variant

          deprecated

        Use \`clearComposer\` instead.

### [Empty](#empty)

Deprecated. Use

- href

  /docs/api-reference/primitives/assistant-if

`AuiIf`

with `s.thread.isEmpty` instead.

Legacy helper that only renders its children when the thread is empty.

`<ThreadPrimitive.Empty> <div className="text-center text-muted-foreground"> No messages yet. </div> </ThreadPrimitive.Empty>`

### [If (deprecated)](#if-deprecated)

Deprecated. Use

- href

  /docs/api-reference/primitives/assistant-if

`AuiIf`

instead.

`// Before (deprecated) <ThreadPrimitive.If empty>...</ThreadPrimitive.If> <ThreadPrimitive.If running>...</ThreadPrimitive.If> <ThreadPrimitive.If disabled>...</ThreadPrimitive.If> // After <AuiIf condition={(s) => s.thread.isEmpty}>...</AuiIf> <AuiIf condition={(s) => s.thread.isRunning}>...</AuiIf> <AuiIf condition={(s) => s.thread.isDisabled}>...</AuiIf>`

## [Patterns](#patterns)

### [Welcome Screen with Suggestions](#welcome-screen-with-suggestions)

`<AuiIf condition={(s) => s.thread.isEmpty}> <div className="flex flex-col items-center gap-4 text-center"> <h2>What can I help with?</h2> <div className="grid grid-cols-2 gap-2"> <ThreadPrimitive.Suggestions> {() => <MySuggestionButton />} </ThreadPrimitive.Suggestions> </div> </div> </AuiIf>`

### [Scroll-to-Bottom Button](#scroll-to-bottom-button)

`<ThreadPrimitive.ScrollToBottom className="fixed bottom-24 right-4 rounded-full bg-background p-2 shadow-md"> <ArrowDownIcon /> </ThreadPrimitive.ScrollToBottom>`

The button is automatically disabled when the viewport is already scrolled to the bottom.

### [Turn Anchor Top Layout](#turn-anchor-top-layout)

`<ThreadPrimitive.Root className="flex h-full flex-col"> <ThreadPrimitive.Viewport turnAnchor="top" className="flex-1 overflow-y-auto"> <ThreadPrimitive.Messages> {({ message }) => { if (message.role === "user") return <UserMessage />; return <AssistantMessage />; }} </ThreadPrimitive.Messages> <ThreadPrimitive.ViewportFooter className="sticky bottom-0"> <MyComposer /> </ThreadPrimitive.ViewportFooter> </ThreadPrimitive.Viewport> </ThreadPrimitive.Root>`

### [Custom Message Components](#custom-message-components)

`<ThreadPrimitive.Messages> {({ message }) => { if (message.role === "user") { return ( <MessagePrimitive.Root> <div className="ml-auto rounded-xl bg-blue-500 p-3 text-white"> <MessagePrimitive.Parts /> </div> </MessagePrimitive.Root> ); } return ( <MessagePrimitive.Root> <div className="rounded-xl bg-gray-100 p-3"> <MessagePrimitive.Parts /> </div> </MessagePrimitive.Root> ); }} </ThreadPrimitive.Messages>`

## [Relationship to Components](#relationship-to-components)

The

- href

  /docs/ui/thread

Thread

component is a full chat interface built from these primitives with Tailwind styling. Start there for a default implementation. Reach for `ThreadPrimitive` when you need a custom layout, different scroll behavior, or a non-standard thread structure.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/thread

ThreadPrimitive API Reference

.

Related:

- - href

    /docs/api-reference/primitives/message

  MessagePrimitive API Reference

- - href

    /docs/api-reference/primitives/composer

  ComposerPrimitive API Reference

- - href

    /docs/api-reference/primitives/thread-list

  ThreadListPrimitive API Reference