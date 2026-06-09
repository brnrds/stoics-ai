# AuiIf
URL: /docs/api-reference/primitives/assistant-if

Conditional rendering primitive for showing React UI from assistant-ui thread, message, composer, and runtime state.

## [Anatomy](#anatomy)

`import { AuiIf } from "@assistant-ui/react"; <AuiIf condition={(s) => s.thread.isEmpty}> <WelcomeScreen /> </AuiIf>;`

## [Overview](#overview)

`AuiIf` is a generic conditional rendering component that provides access to the full assistant state. It replaces the deprecated `ThreadPrimitive.If`, `MessagePrimitive.If`, and `ComposerPrimitive.If` components with a single, flexible API.

## [API Reference](#api-reference)

`AuiIfProps`

- `condition` `: (state: AssistantState) => boolean`

  A function that receives the assistant state and returns whether to render children.

- `children` `?: ReactNode`

  Content to render when the condition returns true.

## [AssistantState](#assistantstate)

The condition function receives an `AssistantState` object with the following properties:

`AssistantState`

- `thread` `?: ThreadState`

  The current thread state (always available).

- `message` `?: MessageState`

  The current message state (available within a message context).

- `composer` `?: ComposerState`

  The current composer state (always available).

- `part` `?: PartState`

  The current message part state (available within a part context).

- `attachment` `?: AttachmentState`

  The current attachment state (available within an attachment context).

## [Examples](#examples)

### [Thread State Conditions](#thread-state-conditions)

`// Show welcome screen when thread is empty <AuiIf condition={(s) => s.thread.isEmpty}> <WelcomeScreen /> </AuiIf> // Show loading indicator while running <AuiIf condition={(s) => s.thread.isRunning}> <LoadingSpinner /> </AuiIf> // Conditional send/cancel button <AuiIf condition={(s) => !s.thread.isRunning}> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </AuiIf> <AuiIf condition={(s) => s.thread.isRunning}> <ComposerPrimitive.Cancel>Cancel</ComposerPrimitive.Cancel> </AuiIf>`

### [Message State Conditions](#message-state-conditions)

`// Show avatar only for assistant messages <AuiIf condition={(s) => s.message.role === "assistant"}> <AssistantAvatar /> </AuiIf> // Show disclaimer on last message <AuiIf condition={(s) => s.message.isLast}> <Disclaimer /> </AuiIf> // Render content only after the assistant finishes streaming <AuiIf condition={(s) => s.message.role === "assistant" && s.message.status?.type === "complete" }> <FollowUpCard /> </AuiIf> // Toggle copy icon based on copied state <ActionBarPrimitive.Copy> <AuiIf condition={(s) => !s.message.isCopied}> <CopyIcon /> </AuiIf> <AuiIf condition={(s) => s.message.isCopied}> <CheckIcon /> </AuiIf> </ActionBarPrimitive.Copy> // Show speak/stop button based on speech state <AuiIf condition={(s) => s.message.speech == null}> <ActionBarPrimitive.Speak> <SpeakIcon /> </ActionBarPrimitive.Speak> </AuiIf> <AuiIf condition={(s) => s.message.speech != null}> <ActionBarPrimitive.StopSpeaking> <StopIcon /> </ActionBarPrimitive.StopSpeaking> </AuiIf>`

### [Composer State Conditions](#composer-state-conditions)

`// Show placeholder when composer is empty <AuiIf condition={(s) => s.composer.isEmpty}> <PlaceholderText /> </AuiIf> // Show attachment preview when editing <AuiIf condition={(s) => s.composer.isEditing}> <EditingIndicator /> </AuiIf>`

### [Complex Conditions](#complex-conditions)

`// Combine multiple conditions <AuiIf condition={(s) => !s.thread.isRunning && s.message.role === "assistant" }> <ActionBar /> </AuiIf> // Custom logic <AuiIf condition={(s) => s.thread.messages.length > 0 && !s.thread.isRunning }> <FollowUpSuggestions /> </AuiIf>`

## [Type Export](#type-export)

You can import the `AuiIf.Condition` type for typing your condition functions:

`import { AuiIf } from "@assistant-ui/react"; const isThreadEmpty: AuiIf.Condition = (s) => s.thread.isEmpty; <AuiIf condition={isThreadEmpty}> <WelcomeScreen /> </AuiIf>;`

## [Migration from Deprecated Components](#migration-from-deprecated-components)

`ThreadPrimitive.If`, `MessagePrimitive.If`, and `ComposerPrimitive.If` are deprecated. Use `AuiIf` instead.

| Before                                 | After                                                       |
| -------------------------------------- | ----------------------------------------------------------- |
| `<ThreadPrimitive.If empty>`           | `<AuiIf condition={(s) => s.thread.isEmpty}>`               |
| `<ThreadPrimitive.If running>`         | `<AuiIf condition={(s) => s.thread.isRunning}>`             |
| `<ThreadPrimitive.If running={false}>` | `<AuiIf condition={(s) => !s.thread.isRunning}>`            |
| `<MessagePrimitive.If user>`           | `<AuiIf condition={(s) => s.message.role === "user"}>`      |
| `<MessagePrimitive.If assistant>`      | `<AuiIf condition={(s) => s.message.role === "assistant"}>` |
| `<MessagePrimitive.If copied>`         | `<AuiIf condition={(s) => s.message.isCopied}>`             |
| `<MessagePrimitive.If speaking>`       | `<AuiIf condition={(s) => s.message.speech != null}>`       |
| `<MessagePrimitive.If last>`           | `<AuiIf condition={(s) => s.message.isLast}>`               |
| `<ComposerPrimitive.If editing>`       | `<AuiIf condition={(s) => s.composer.isEditing}>`           |

## [AssistantIf](#assistantif)

**Deprecated:** Use `AuiIf` instead. This alias was removed in v0.13.

`import { AssistantIf } from "@assistant-ui/react";`