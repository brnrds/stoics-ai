# ThreadListItemPrimitive
URL: /docs/api-reference/primitives/thread-list-item

Thread list item primitives for rendering selectable conversation rows with titles, archive controls, delete actions, and menus.

## [Anatomy](#anatomy)

`import { ThreadListItemPrimitive } from "@assistant-ui/react"; const ThreadListItem = () => ( <ThreadListItemPrimitive.Root> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title /> </ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Archive /> <ThreadListItemPrimitive.Unarchive /> <ThreadListItemPrimitive.Delete /> </ThreadListItemPrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadListItemPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

| Data attribute  | Values                                   |
| --------------- | ---------------------------------------- |
| `[data-active]` | Present when this is the current thread. |

### [Archive](#archive)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadListItemPrimitiveArchiveProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Unarchive](#unarchive)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadListItemPrimitiveUnarchiveProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Delete](#delete)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadListItemPrimitiveDeleteProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Trigger](#trigger)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadListItemPrimitiveTriggerProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Title](#title)

`ThreadListItemPrimitiveTitleProps`

- `fallback` `?: ReactNode`