# SelectionToolbarPrimitive
URL: /docs/api-reference/primitives/selection-toolbar

Selection toolbar primitives for quote, copy, and contextual actions on selected chat text.

For examples and usage patterns, see

- href

  /docs/primitives/selection-toolbar

SelectionToolbar

.

## [Anatomy](#anatomy)

`import { SelectionToolbarPrimitive } from "@assistant-ui/react"; const FloatingSelectionToolbar = () => ( <SelectionToolbarPrimitive.Root> <SelectionToolbarPrimitive.Quote>Quote</SelectionToolbarPrimitive.Quote> </SelectionToolbarPrimitive.Root> );`

Place this component inside `ThreadPrimitive.Root`:

`<ThreadPrimitive.Root> <ThreadPrimitive.Viewport>...</ThreadPrimitive.Viewport> <FloatingSelectionToolbar /> </ThreadPrimitive.Root>`

## [API Reference](#api-reference)

### [Root](#root)

A floating toolbar that appears when text is selected within a message. Listens for mouse and keyboard selection events, validates that the selection is within a single message, and renders a positioned portal near the selection. Prevents mousedown from clearing the selection.

This primitive renders a `<div>` element unless `asChild` is set.

`SelectionToolbarPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Quote](#quote)

A button that quotes the currently selected text. Must be placed inside \`SelectionToolbarPrimitive.Root\`. Reads the selection info from context (captured by the Root), sets it as a quote in the thread composer, and clears the selection.

This primitive renders a `<button>` element unless `asChild` is set.

`SelectionToolbarPrimitiveQuoteProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`