# ThreadListPrimitive
URL: /docs/api-reference/primitives/thread-list

Thread list primitives for rendering conversation navigation, new thread actions, and custom assistant sidebars.

For examples and usage patterns, see

- href

  /docs/primitives/thread-list

ThreadList

.

## [Anatomy](#anatomy)

`import { ThreadListPrimitive } from "@assistant-ui/react"; const ThreadList = () => ( <ThreadListPrimitive.Root> <ThreadListPrimitive.New /> <ThreadListPrimitive.Items> {() => <MyThreadListItem />} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadListPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [New](#new)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadListPrimitiveNewProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

| Data attribute  | Values                                                                  |
| --------------- | ----------------------------------------------------------------------- |
| `[data-active]` | Present when the new-thread button represents the current fresh thread. |

### [Items](#items)

`ThreadListPrimitiveItemsProps`

- `archived` `?: boolean`

- `components`

  - variant

    deprecated

  `?: ThreadListItemsComponentConfig`

  Deprecated: Use the children render function instead.

  - `ThreadListItem` `: ComponentType`

- `children` `?: (value: { threadListItem: ThreadListItemState }) => ReactNode`

  Render function called for each thread list item. Receives the item.

### [ItemByIndex](#itembyindex)

Renders a single thread list item at the specified index.

`ThreadListPrimitiveItemByIndexProps`

- `index` `: number`

- `archived` `?: boolean`

- `components` `: ThreadListItemsComponentConfig`

  - `ThreadListItem` `: ComponentType`

### [LoadMore](#loadmore)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadListPrimitiveLoadMoreProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`