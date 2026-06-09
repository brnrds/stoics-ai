# QueueItemPrimitive
URL: /docs/api-reference/primitives/queue-item

Queue item primitives for rendering pending assistant-ui thread operations, optimistic work, and runtime queue state.

## [API Reference](#api-reference)

### [Text](#text)

Renders the prompt text of a queue item.

This primitive renders a `<span>` element unless `asChild` is set.

`QueueItemPrimitiveTextProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Steer](#steer)

A button that steers the current run to process this queue item immediately.

This primitive renders a `<button>` element unless `asChild` is set.

`QueueItemPrimitiveSteerProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Remove](#remove)

A button that removes this item from the queue.

This primitive renders a `<button>` element unless `asChild` is set.

`QueueItemPrimitiveRemoveProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`