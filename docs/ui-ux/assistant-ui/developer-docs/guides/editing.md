# Message Editing
URL: /docs/guides/editing

Let users edit their messages and regenerate AI responses with custom editor interfaces. Edit-and-resubmit patterns for React chat via assistant-ui.

## [Mental Model](#mental-model)

Editing re-submits a message from a past point in the conversation and creates a new branch. The messages after the edited one are discarded, and the assistant generates a fresh response from that point forward. Each user message has an independent edit composer; only one can be active at a time.

The recommended way to wire this up is via the `children` render prop on `ThreadPrimitive.Messages`, branching on `message.role` and on `message.composer.isEditing` to swap in an edit composer when needed.

## [Enabling Edit Support](#enabling-edit-support)

`import { ActionBarPrimitive, ComposerPrimitive, MessagePrimitive, ThreadPrimitive, } from "@assistant-ui/react"; const Thread = () => { return ( <ThreadPrimitive.Root> <ThreadPrimitive.Viewport> <ThreadPrimitive.Messages> {({ message }) => { if (message.role === "user") { if (message.composer.isEditing) return <UserEditComposer />; return <UserMessage />; } return <AssistantMessage />; }} </ThreadPrimitive.Messages> </ThreadPrimitive.Viewport> </ThreadPrimitive.Root> ); }; const UserMessage = () => { return ( <MessagePrimitive.Root> {/* message content */} <ActionBarPrimitive.Root> <ActionBarPrimitive.Edit /> </ActionBarPrimitive.Root> </MessagePrimitive.Root> ); }; const UserEditComposer = () => { return ( <MessagePrimitive.Root> <ComposerPrimitive.Root> <ComposerPrimitive.Input /> <ComposerPrimitive.Cancel /> <ComposerPrimitive.Send /> </ComposerPrimitive.Root> </MessagePrimitive.Root> ); }; const AssistantMessage = () => { return <MessagePrimitive.Root>{/* message content */}</MessagePrimitive.Root>; };`

`ActionBarPrimitive.Edit` calls `aui.composer().beginEdit()` under the hood and is disabled when the composer is already in edit mode.

`ComposerPrimitive.Cancel` calls `aui.composer().cancel()`, which exits edit mode and restores the original message content. See

- href

  /docs/primitives/composer

Composer primitives

for the full composer API.

## [Detecting Edit Mode](#detecting-edit-mode)

The `isEditing` flag is available on both `ThreadComposerState` and `EditComposerState`, so `useAuiState((s) => s.composer.isEditing)` works inside any composer context. The more idiomatic path is to rely on the `UserEditComposer` slot in the render function (shown above), which scopes the component tree automatically and avoids manual state checks.

## [Imperative API](#imperative-api)

`aui.composer().beginEdit()` is the programmatic entry point for entering edit mode on a message. Use it for headless or keyboard-shortcut-driven flows where `ActionBarPrimitive.Edit` is not rendered:

`import { useAui } from "@assistant-ui/react"; const EditButton = () => { const aui = useAui(); return ( <button onClick={() => aui.composer().beginEdit()}>Edit</button> ); };`

`aui.composer().cancel()` exits edit mode without re-submitting.

## [Editing While Streaming](#editing-while-streaming)

If a user triggers edit mode while the assistant is still generating a response, the in-progress run is cancelled and a new branch is started from the edited message. The hook does not block this. If your UI should prevent editing during streaming, gate the edit button on the thread run state before rendering `ActionBarPrimitive.Edit` or calling `beginEdit()`.

## [References](#references)

- - href

    /docs/primitives/action-bar

  ActionBar primitives

  — `ActionBarPrimitive.Edit` and related actions

- - href

    /docs/primitives/composer

  Composer primitives

  — full composer anatomy including `Cancel`, `Send`, and `Input`

- - href

    /docs/primitives/message

  Message primitives

  — `MessagePrimitive.Root` and content parts