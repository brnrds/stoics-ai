# Error
URL: /docs/primitives/error

Accessible error display for messages with automatic error text extraction.

The Error primitive renders error states on messages using an accessible `role="alert"` container with automatic error text extraction. `Root` always renders its container; `Message` only renders when the message has an error. Wrap in `MessagePrimitive.Error` if you need the entire block to be conditional.

- items

  - Preview
  - Code

`import { ErrorPrimitive, MessagePrimitive } from "@assistant-ui/react"; function AssistantMessage() { return ( <MessagePrimitive.Root> <MessagePrimitive.Parts /> <ErrorPrimitive.Root className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"> <ErrorPrimitive.Message /> </ErrorPrimitive.Root> </MessagePrimitive.Root> ); }`

## [Quick Start](#quick-start)

A minimal error display below a message:

`import { ErrorPrimitive, MessagePrimitive } from "@assistant-ui/react"; <MessagePrimitive.Root> <MessagePrimitive.Parts /> <ErrorPrimitive.Root> <ErrorPrimitive.Message /> </ErrorPrimitive.Root> </MessagePrimitive.Root>`

`Root` renders a `<div>` with `role="alert"` for screen reader accessibility. `Message` renders a `<span>` that auto-reads the error text from message state, and it returns `null` when there is no error. `Root` itself always renders. Wrap in `<MessagePrimitive.Error>` if you want the entire block (including `Root`) to be conditional.

ErrorPrimitive must be placed inside a `MessagePrimitive.Root` because it reads the error state from the nearest message context.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Auto-Rendering on Error](#auto-rendering-on-error)

`Message` checks the message status and only renders when `status.type === "incomplete"` and `status.reason === "error"`. `Root` always renders its `<div role="alert">` container. For fully conditional rendering, wrap in `<MessagePrimitive.Error>`.

### [Automatic Error Text](#automatic-error-text)

`ErrorPrimitive.Message` reads the error object from message state and converts it to a string. If you pass `children`, they override the automatic text:

`// Auto-reads error text from state <ErrorPrimitive.Message /> // Custom children override the default <ErrorPrimitive.Message> Something went wrong. Please try again. </ErrorPrimitive.Message>`

### [ErrorPrimitive vs MessagePrimitive.Error](#errorprimitive-vs-messageprimitiveerror)

`MessagePrimitive.Error` is a simpler alternative. It renders its children when the message has an error but does not provide `role="alert"` or auto-extract the error text. Use `ErrorPrimitive` when you want accessible error rendering with automatic text.

`// ErrorPrimitive: accessible, auto-reads error text <ErrorPrimitive.Root role="alert"> <ErrorPrimitive.Message /> </ErrorPrimitive.Root> // MessagePrimitive.Error: simpler, manual text <MessagePrimitive.Error> <div>Something went wrong.</div> </MessagePrimitive.Error>`

## [Parts](#parts)

### [Root](#root)

Container for an error message block. Renders a `<div>` element unless `asChild` is set.

`<ErrorPrimitive.Root className="rounded-md border border-destructive/20 bg-destructive/5 p-3"> <ErrorPrimitive.Message /> </ErrorPrimitive.Root>`

### [Message](#message)

Renders the current error text for the active message.

`<ErrorPrimitive.Message className="text-destructive text-sm" />`

## [Patterns](#patterns)

### [Styled Error Alert](#styled-error-alert)

`<ErrorPrimitive.Root className="mt-2 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"> <ErrorPrimitive.Message /> </ErrorPrimitive.Root>`

### [Custom Error Content](#custom-error-content)

`<ErrorPrimitive.Root className="mt-2 rounded-md border border-destructive/20 bg-destructive/5 p-3"> <p className="font-medium text-destructive text-sm">Error</p> <ErrorPrimitive.Message className="text-destructive/80 text-sm" /> </ErrorPrimitive.Root>`

## [Relationship to Components](#relationship-to-components)

The shadcn

- href

  /docs/ui/thread

Thread

component uses `ErrorPrimitive` inside its `AssistantMessage` to display errors below the message content. If you need a pre-built error display, start there.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/error

ErrorPrimitive API Reference

.

Related:

- - href

    /docs/api-reference/primitives/message

  MessagePrimitive API Reference