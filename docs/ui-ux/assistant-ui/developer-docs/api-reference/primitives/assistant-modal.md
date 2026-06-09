# AssistantModalPrimitive
URL: /docs/api-reference/primitives/assistant-modal

Floating assistant modal primitives for building support chat, copilot, and embedded assistant experiences.

For examples and usage patterns, see

- href

  /docs/primitives/assistant-modal

AssistantModal

.

## [Anatomy](#anatomy)

`import { AssistantModalPrimitive } from "@assistant-ui/react"; const AssistantModal = () => ( <AssistantModalPrimitive.Root> <AssistantModalPrimitive.Trigger> <FloatingAssistantButton /> </AssistantModalPrimitive.Trigger> <AssistantModalPrimitive.Content> <Thread /> </AssistantModalPrimitive.Content> </AssistantModalPrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

`AssistantModalPrimitiveRootProps`

- `open` `?: boolean`

- `defaultOpen` `?: boolean`

- `onOpenChange` `?: (open: boolean) => void`

- `modal` `?: boolean`

- `unstable_openOnRunStart`

  - variant

    unstable

  `?: boolean`

### [Trigger](#trigger)

This primitive renders a `<button>` element unless `asChild` is set.

`AssistantModalPrimitiveTriggerProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

| Data attribute | Values               |
| -------------- | -------------------- |
| `[data-state]` | `"open" \| "closed"` |

### [Content](#content)

This primitive renders a `<div>` element unless `asChild` is set.

`AssistantModalPrimitiveContentProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `onOpenAutoFocus` `?: FocusScopeProps['onMountAutoFocus']`

  Event handler called when auto-focusing on open. Can be prevented.

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

- `onEscapeKeyDown` `?: (event: KeyboardEvent) => void`

  Event handler called when the escape key is down. Can be prevented.

- `onPointerDownOutside` `?: (event: PointerDownOutsideEvent) => void`

  Event handler called when the a \`pointerdown\` event happens outside of the \`DismissableLayer\`. Can be prevented.

- `onFocusOutside` `?: (event: FocusOutsideEvent) => void`

  Event handler called when the focus moves outside of the \`DismissableLayer\`. Can be prevented.

- `onInteractOutside` `?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void`

  Event handler called when an interaction happens outside the \`DismissableLayer\`. Specifically, when a \`pointerdown\` event happens outside or focus moves outside of it. Can be prevented.

- `forceMount` `?: true`

  Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.

- `portalProps` `?: ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>`

  - `container` `?: PortalProps['container']`

    Specify a container element to portal the content into.

  - `forceMount` `?: true`

    Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.

- `dissmissOnInteractOutside` `?: boolean`

### [Anchor](#anchor)

This primitive renders a `<div>` element unless `asChild` is set.

`AssistantModalPrimitiveAnchorProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `virtualRef` `?: React.RefObject<Measurable>`