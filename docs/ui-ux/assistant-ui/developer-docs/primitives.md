# Headless Chat Primitives
URL: /docs/primitives

Unstyled, accessible Radix-style building blocks for React AI chat interfaces — Thread, Composer, Message, and more, ready to compose with assistant-ui.

Primitives are the foundation of assistant-ui. They are unstyled, accessible React components that handle all the wiring for AI chat, including state management, keyboard shortcuts, auto-scrolling, streaming, and tool calls, so you can focus entirely on your UI.

## [Why Primitives?](#why-primitives)

Every assistant-ui

- href

  /docs/ui/thread

Component

is built from primitives. When you install a component like `Thread`, you get a pre-styled composition of primitives with default styling and behavior included.

But when you need a UI that doesn't fit the defaults, such as a floating composer, a custom message layout, or an inline editing experience, you reach for the primitives directly.

`import { ComposerPrimitive } from "@assistant-ui/react"; <ComposerPrimitive.Root> <ComposerPrimitive.Input placeholder="Ask anything..." /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

This renders an unstyled `<form>` with a `<textarea>` and a `<button>`. No styles, no opinions, but it already handles submit-on-enter, focus management, empty-state disabling, and streaming state.

## [How They Work](#how-they-work)

Every primitive follows the same pattern inspired by

- href

  https\://www\.radix-ui.com/

Radix UI

:

- **`Primitive.Root`**: container that provides context to child parts
- **`Primitive.PartName`**: individual elements (input, button, text, etc.)
- **`asChild`**: merge primitive behavior onto your own element instead of rendering a wrapper
- **`AuiIf`**: conditional rendering based on state

Primitives read from the nearest runtime context. Place them inside an `AssistantRuntimeProvider` and they work without prop drilling or manual state wiring.

## [Available Primitives](#available-primitives)

- href

  /docs/primitives/composer

Composer

Text input, send button, attachments, and dictation. The interface for composing new messages or editing existing ones.

- href

  /docs/primitives/thread

Thread

The scrollable message container with auto-scroll, empty states, and message rendering.

- href

  /docs/primitives/message

Message

Individual message rendering with role-based content, parts, and metadata.

- href

  /docs/primitives/action-bar

ActionBar

Copy, reload, edit, and other message actions.

- href

  /docs/primitives/branch-picker

BranchPicker

Navigate between message branches (alternative responses).

- href

  /docs/primitives/thread-list

ThreadList

Multi-thread management: list, create, switch, and archive threads.

- href

  /docs/primitives/assistant-modal

AssistantModal

Floating chat popover built on Radix UI Popover.

- href

  /docs/primitives/attachment

Attachment

File and image attachment rendering.

- href

  /docs/primitives/suggestion

Suggestion

Suggested prompts and quick actions.

- href

  /docs/primitives/selection-toolbar

SelectionToolbar

Floating toolbar for text selection actions like quoting.

- href

  /docs/primitives/error

Error

Error display with accessible alert role and automatic error text.

- href

  /docs/primitives/chain-of-thought

ChainOfThought

Collapsible reasoning accordion for thinking steps and tool calls.

`MessagePartPrimitive` (for rendering individual text, image, and streaming parts) is documented within the

- href

  /docs/primitives/message#messagepartprimitive

Message

primitive page.

## [Related Primitive References](#related-primitive-references)

Additional primitive references:

- - href

    /docs/api-reference/primitives/message-part

  MessagePartPrimitive

- - href

    /docs/api-reference/primitives/thread-list-item

  ThreadListItemPrimitive

- - href

    /docs/api-reference/primitives/thread-list-item-more

  ThreadListItemMorePrimitive

- - href

    /docs/api-reference/primitives/action-bar-more

  ActionBarMorePrimitive

- - href

    /docs/api-reference/primitives/assistant-if

  AuiIf

## [Common Mistakes](#common-mistakes)

- Forgetting to wrap primitives with runtime context (`AssistantRuntimeProvider` + runtime hook)
- Mixing deprecated props with current APIs (`submitOnEnter`, `autoSend`, legacy `Suggestion`)
- Mounting primitives in the wrong context (`ActionBarPrimitive` / `BranchPickerPrimitive` outside `MessagePrimitive.Root`)
- Using unstable props unintentionally (`unstable_*` APIs)

## [Next Steps](#next-steps)

Start with the

- href

  /docs/primitives/composer

Composer

primitive to see how primitives work in practice, or jump to the

- href

  /docs/api-reference/primitives/composer

API Reference

for full prop details.