# AssistantModal
URL: /docs/primitives/assistant-modal

A floating chat popover with a fixed-position trigger button that opens a chat panel.

The AssistantModal primitive is a floating chat popover built on

- href

  https\://www\.radix-ui.com/primitives/docs/components/popover

Radix Popover

. A trigger button opens a chat panel, which is a common floating assistant launcher pattern. You control the trigger, content, positioning, and animations.

- items

  - Preview
  - Code

`import { AssistantModalPrimitive } from "@assistant-ui/react"; function MinimalAssistantModal() { return ( <AssistantModalPrimitive.Root> <AssistantModalPrimitive.Anchor> <AssistantModalPrimitive.Trigger> Open Chat </AssistantModalPrimitive.Trigger> </AssistantModalPrimitive.Anchor> <AssistantModalPrimitive.Content> {/* Your Thread goes here */} </AssistantModalPrimitive.Content> </AssistantModalPrimitive.Root> ); }`

## [Quick Start](#quick-start)

Minimal example:

`import { AssistantModalPrimitive } from "@assistant-ui/react"; <AssistantModalPrimitive.Root> <AssistantModalPrimitive.Anchor> <AssistantModalPrimitive.Trigger>Open</AssistantModalPrimitive.Trigger> </AssistantModalPrimitive.Anchor> <AssistantModalPrimitive.Content> <Thread /> </AssistantModalPrimitive.Content> </AssistantModalPrimitive.Root>`

`Root` is a Radix Popover provider (no DOM), `Trigger` renders a `<button>`, `Anchor` renders a `<div>`, and `Content` renders a `<div>` inside a portal. Add your own classes, animations, and layout.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Popover Architecture](#popover-architecture)

AssistantModal is built directly on Radix Popover. `Root` manages open/close state, `Trigger` toggles it, `Anchor` positions the popover, and `Content` is the floating panel. All Radix Popover props are available on the corresponding parts.

### [Anchor vs Trigger](#anchor-vs-trigger)

`Content` positions itself relative to `Anchor`, not `Trigger`. The common pattern is wrapping `Trigger` inside `Anchor` so the popover aligns to a larger area (like a fixed-position button container) rather than the button itself:

`<AssistantModalPrimitive.Anchor className="fixed right-4 bottom-4 size-11"> <AssistantModalPrimitive.Trigger> Open </AssistantModalPrimitive.Trigger> </AssistantModalPrimitive.Anchor>`

### [Auto-Open on Run Start](#auto-open-on-run-start)

The `unstable_openOnRunStart` prop (default `true`) automatically opens the modal when the assistant starts responding. This means if a user triggers a run programmatically while the modal is closed, it pops open to show the response. Set to `false` to disable.

### [Dismiss Behavior](#dismiss-behavior)

`Content` uses `dissmissOnInteractOutside` *(intentional current API spelling, with the extra `s`)* and defaults it to `false`. Clicking outside the modal does **not** close it. This matches expected chat UX where users interact with the page while keeping the chat open. Set it to `true` for standard popover dismiss behavior.

### [Open/Close Animations](#openclose-animations)

`Content` exposes `data-[state=open]` and `data-[state=closed]` attributes for CSS animations:

`<AssistantModalPrimitive.Content className="data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" >`

## [Parts](#parts)

### [Root](#root)

Radix Popover provider, manages open/close state. No DOM element rendered.

`<AssistantModalPrimitive.Root unstable_openOnRunStart={false}> ... </AssistantModalPrimitive.Root>`

- rows

  - - name

      unstable\_openOnRunStart

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - - variant

          unstable

### [Trigger](#trigger)

Button that toggles the modal open and closed. Renders a `<button>` element unless `asChild` is set.

`<AssistantModalPrimitive.Trigger className="rounded-full bg-primary px-4 py-2 text-primary-foreground"> Open Chat </AssistantModalPrimitive.Trigger>`

### [Anchor](#anchor)

Positions the trigger and content relative to a shared anchor. Renders a `<div>` element unless `asChild` is set.

`<AssistantModalPrimitive.Anchor className="fixed right-4 bottom-4"> <AssistantModalPrimitive.Trigger>Chat</AssistantModalPrimitive.Trigger> </AssistantModalPrimitive.Anchor>`

### [Content](#content)

The floating chat panel. Renders a `<div>` element inside a portal.

`<AssistantModalPrimitive.Content sideOffset={16} className="h-[600px] w-[400px] rounded-xl border bg-background shadow-lg" > <Thread /> </AssistantModalPrimitive.Content>`

- rows

  - - name

      asChild

    - type

      ```
      boolean
      ```

    - description

      - Change the default rendered element for the one passed as a child, merging their props and behavior.
        - href

          /docs/api-reference/primitives/composition
        Composition guide

    - default

      ```
      false
      ```

  - - name

      portalProps

    - type

      ```
      PopoverPrimitive.PopoverPortalProps
      ```

    - typeFull

      ```
      PopoverPrimitive.PopoverPortalProps | undefined
      ```

  - - name

      dissmissOnInteractOutside

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

## [Patterns](#patterns)

### [Floating Bottom-Right Widget](#floating-bottom-right-widget)

`<AssistantModalPrimitive.Root> <AssistantModalPrimitive.Anchor className="fixed right-4 bottom-4 size-11"> <AssistantModalPrimitive.Trigger className="size-full rounded-full bg-primary text-primary-foreground shadow-lg"> <BotIcon className="size-6" /> </AssistantModalPrimitive.Trigger> </AssistantModalPrimitive.Anchor> <AssistantModalPrimitive.Content sideOffset={16} className="h-[600px] w-[400px] rounded-xl border bg-background shadow-lg" > <Thread /> </AssistantModalPrimitive.Content> </AssistantModalPrimitive.Root>`

### [Trigger Icon Swap](#trigger-icon-swap)

The `Trigger` button receives a `data-state` attribute from Radix (`"open"` or `"closed"`). To pass that state down to child icons, use `asChild` with a wrapper component that destructures and forwards it:

`import { forwardRef } from "react"; const ModalButton = forwardRef< HTMLButtonElement, React.ComponentPropsWithoutRef<"button"> & { "data-state"?: string } >(({ "data-state": state, ...props }, ref) => ( <button ref={ref} {...props} className="relative size-11 rounded-full"> <BotIcon data-state={state} className="absolute size-6 transition-all data-[state=open]:rotate-90 data-[state=open]:scale-0" /> <XIcon data-state={state} className="absolute size-6 transition-all data-[state=closed]:-rotate-90 data-[state=closed]:scale-0" /> </button> )); <AssistantModalPrimitive.Trigger asChild> <ModalButton /> </AssistantModalPrimitive.Trigger>`

### [Custom Portal Container](#custom-portal-container)

Render the content inside a specific container instead of `document.body`:

`<AssistantModalPrimitive.Content portalProps={{ container: myContainerRef.current }} > <Thread /> </AssistantModalPrimitive.Content>`

## [Relationship to Components](#relationship-to-components)

The shadcn

- href

  /docs/ui/assistant-modal

AssistantModal

component wraps these primitives with slide/fade animations, icon transitions between open and closed states, and responsive sizing. Start there for a prebuilt floating chat widget.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/assistant-modal

AssistantModalPrimitive API Reference

.

Related:

- - href

    /docs/primitives/thread

  ThreadPrimitive

- - href

    /docs/primitives/composer

  ComposerPrimitive