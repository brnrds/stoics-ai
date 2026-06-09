# ErrorPrimitive
URL: /docs/api-reference/primitives/error

Error primitives for rendering assistant-ui runtime, thread, and message failures inside custom chat interfaces.

For examples and usage patterns, see

- href

  /docs/primitives/error

Error

.

## [Anatomy](#anatomy)

`import { ErrorPrimitive } from "@assistant-ui/react"; const ErrorDisplay = () => ( <ErrorPrimitive.Root> <ErrorPrimitive.Message /> </ErrorPrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

This primitive renders a `<div>` element unless `asChild` is set.

`ErrorPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Message](#message)

This primitive renders a `<span>` element unless `asChild` is set.

`ErrorPrimitiveMessageProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`