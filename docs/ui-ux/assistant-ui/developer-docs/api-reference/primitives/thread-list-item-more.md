# ThreadListItemMorePrimitive
URL: /docs/api-reference/primitives/thread-list-item-more

Overflow menu primitives for secondary thread list item actions in custom assistant-ui sidebars.

## [Anatomy](#anatomy)

`import { ThreadListItemPrimitive, ThreadListItemMorePrimitive } from "@assistant-ui/react"; const ThreadListItemMore = () => ( <ThreadListItemMorePrimitive.Root> <ThreadListItemMorePrimitive.Trigger> More options </ThreadListItemMorePrimitive.Trigger> <ThreadListItemMorePrimitive.Content> <ThreadListItemPrimitive.Archive asChild> <ThreadListItemMorePrimitive.Item> Archive </ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Archive> <ThreadListItemMorePrimitive.Separator /> <ThreadListItemPrimitive.Delete asChild> <ThreadListItemMorePrimitive.Item> Delete </ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Delete> </ThreadListItemMorePrimitive.Content> </ThreadListItemMorePrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

`ThreadListItemMorePrimitiveRootProps`

- `dir` `?: Direction`
- `open` `?: boolean`
- `defaultOpen` `?: boolean`
- `onOpenChange` `?: (open: boolean) => void`
- `modal` `?: boolean`

### [Trigger](#trigger)

This primitive renders a `<button>` element unless `asChild` is set.

`ThreadListItemMorePrimitiveTriggerProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Content](#content)

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadListItemMorePrimitiveContentProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `side` `?: Side`

- `sideOffset` `?: number`

- `align` `?: Align`

- `alignOffset` `?: number`

- `arrowPadding` `?: number`

- `avoidCollisions` `?: boolean`

- `collisionBoundary` `?: Boundary | Boundary[]`

- `collisionPadding` `?: number | Partial<Record<Side, number>>`

- `sticky` `?: 'partial' | 'always'`

- `hideWhenDetached` `?: boolean`

- `updatePositionStrategy` `?: 'optimized' | 'always'`

- `onCloseAutoFocus` `?: FocusScopeProps['onUnmountAutoFocus']`

  Event handler called when auto-focusing on close. Can be prevented.

- `loop` `?: RovingFocusGroupProps['loop']`

  Whether keyboard navigation should loop around

- `onEscapeKeyDown` `?: DismissableLayerProps['onEscapeKeyDown']`

- `onPointerDownOutside` `?: DismissableLayerProps['onPointerDownOutside']`

- `onFocusOutside` `?: DismissableLayerProps['onFocusOutside']`

- `onInteractOutside` `?: DismissableLayerProps['onInteractOutside']`

- `forceMount` `?: true`

  Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.

- `render` `?: ReactElement`

- `portalProps` `?: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Portal>`

  - `container` `?: PortalProps['container']`

    Specify a container element to portal the content into.

  - `forceMount` `?: true`

    Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.

### [Item](#item)

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadListItemMorePrimitiveItemProps`

- `disabled` `?: boolean`

- `onSelect` `?: (event: Event) => void`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `textValue` `?: string`

- `render` `?: ReactElement`

### [Separator](#separator)

This primitive renders a `<div>` element unless `asChild` is set.

`ThreadListItemMorePrimitiveSeparatorProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`