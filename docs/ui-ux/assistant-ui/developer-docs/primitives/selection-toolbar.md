# SelectionToolbar
URL: /docs/primitives/selection-toolbar

A floating toolbar that appears when text is selected within a message.

The SelectionToolbar primitive is a floating toolbar that appears when the user selects text within a message. It lets users quote selected text into the composer. Styling and action layout are fully customizable.

- items

  - Preview
  - Code

`import { SelectionToolbarPrimitive } from "@assistant-ui/react"; import { QuoteIcon } from "lucide-react"; function FloatingSelectionToolbar() { return ( <SelectionToolbarPrimitive.Root className="flex items-center gap-1 rounded-lg border bg-popover px-1 py-1 shadow-md"> <SelectionToolbarPrimitive.Quote className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-popover-foreground text-sm hover:bg-accent"> <QuoteIcon className="size-3.5" /> Quote </SelectionToolbarPrimitive.Quote> </SelectionToolbarPrimitive.Root> ); }`

## [Quick Start](#quick-start)

A minimal selection toolbar:

`import { SelectionToolbarPrimitive } from "@assistant-ui/react"; <SelectionToolbarPrimitive.Root> <SelectionToolbarPrimitive.Quote> Quote </SelectionToolbarPrimitive.Quote> </SelectionToolbarPrimitive.Root>`

`Root` renders a `<div>` inside a portal, positioned above the text selection. `Quote` renders a `<button>` that copies the selected text into the composer as a quote.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Automatic Positioning](#automatic-positioning)

`Root` renders via a portal to `document.body`. In the current implementation, it positions itself with `position: fixed`, `top: rect.top - 8px`, `left: rect.left + rect.width / 2`, `transform: translate(-50%, -100%)` (placing it centered above the selection), and `z-index: 50`.

### [Single-Message Validation](#single-message-validation)

The toolbar only appears when the selection is entirely within a single message. Cross-message selections are ignored. Detection works by checking for `data-message-id` attributes on ancestor elements, which `MessagePrimitive.Root` sets automatically.

`Root` returns `null` when there is no valid selection (collapsed selection, empty text, or no single-message match).

### [Quote Action](#quote-action)

The `Quote` button does two things on click:

1. Calls `composer.setQuote({ text, messageId })` to populate the composer with the selected text as a quoted snippet
2. Clears the browser selection via `window.getSelection()?.removeAllRanges()`

The composer then shows the quoted text, and the user can type a follow-up message around it.

### [Dismissal](#dismissal)

The toolbar hides automatically when:

- The user scrolls
- The selection collapses (click away or arrow keys)
- The selection is cleared programmatically (e.g., after quoting)

Clicking the toolbar itself does not dismiss the selection. `Root` calls `preventDefault` on `mousedown` to preserve it.

### [Placement in Thread](#placement-in-thread)

The SelectionToolbar must be placed inside `ThreadPrimitive.Root` but **outside** `ThreadPrimitive.Viewport`. It positions itself via a portal based on the browser selection, independent of the scroll container:

`<ThreadPrimitive.Root> <ThreadPrimitive.Viewport> <ThreadPrimitive.Messages ... /> </ThreadPrimitive.Viewport> <SelectionToolbarPrimitive.Root> <SelectionToolbarPrimitive.Quote>Quote</SelectionToolbarPrimitive.Quote> </SelectionToolbarPrimitive.Root> <ComposerPrimitive.Root>...</ComposerPrimitive.Root> </ThreadPrimitive.Root>`

## [Parts](#parts)

### [Root](#root)

Floating toolbar container that appears for a valid text selection. Renders a `<div>` element unless `asChild` is set.

`<SelectionToolbarPrimitive.Root className="flex items-center gap-1 rounded-lg border bg-popover px-1 py-1 shadow-md"> <SelectionToolbarPrimitive.Quote>Quote</SelectionToolbarPrimitive.Quote> </SelectionToolbarPrimitive.Root>`

### [Quote](#quote)

Quotes the currently selected text into the composer. Renders a `<button>` element unless `asChild` is set.

`<SelectionToolbarPrimitive.Quote className="rounded-md px-2.5 py-1 text-sm hover:bg-accent"> Quote </SelectionToolbarPrimitive.Quote>`

## [Patterns](#patterns)

### [Basic Toolbar with Quote](#basic-toolbar-with-quote)

`<SelectionToolbarPrimitive.Root className="flex items-center gap-1 rounded-lg border bg-popover px-1 py-1 shadow-md"> <SelectionToolbarPrimitive.Quote className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-popover-foreground hover:bg-accent"> <QuoteIcon className="size-3.5" /> Quote </SelectionToolbarPrimitive.Quote> </SelectionToolbarPrimitive.Root>`

### [Toolbar with Multiple Actions](#toolbar-with-multiple-actions)

You can add custom buttons alongside `Quote` for additional actions:

`<SelectionToolbarPrimitive.Root className="flex items-center gap-1 rounded-lg border bg-popover px-1 py-1 shadow-md"> <SelectionToolbarPrimitive.Quote className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm hover:bg-accent"> <QuoteIcon className="size-3.5" /> Quote </SelectionToolbarPrimitive.Quote> <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm hover:bg-accent" onClick={() => navigator.clipboard.writeText(window.getSelection()?.toString() ?? "")} > <CopyIcon className="size-3.5" /> Copy </button> </SelectionToolbarPrimitive.Root>`

## [Relationship to Components](#relationship-to-components)

There is no pre-built shadcn component for SelectionToolbar. See the

- href

  /docs/guides/quoting

Quoting guide

for the full workflow including composer quote display and dismiss.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/selection-toolbar

SelectionToolbarPrimitive API Reference

.

Related:

- - href

    /docs/guides/quoting

  Quoting Guide

- - href

    /docs/api-reference/primitives/composer

  ComposerPrimitive API Reference