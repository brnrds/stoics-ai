# ComposerPrimitive
URL: /docs/api-reference/primitives/composer

Composable input primitives for assistant-ui prompts, send controls, cancellation, attachments, and composer state.

For examples and usage patterns, see

- href

  /docs/primitives/composer

Composer

.

## [Anatomy](#anatomy)

`import { ComposerPrimitive } from "@assistant-ui/react"; // creating a new message const Composer = () => ( <ComposerPrimitive.Root> <ComposerPrimitive.AttachmentDropzone> <ComposerPrimitive.Quote> <ComposerPrimitive.QuoteText /> <ComposerPrimitive.QuoteDismiss /> </ComposerPrimitive.Quote> <ComposerPrimitive.Attachments /> <ComposerPrimitive.AddAttachment /> <ComposerPrimitive.Input /> <ComposerPrimitive.Send /> </ComposerPrimitive.AttachmentDropzone> </ComposerPrimitive.Root> ); // editing an existing message const EditComposer = () => ( <ComposerPrimitive.Root> <ComposerPrimitive.Input /> <ComposerPrimitive.Send /> <ComposerPrimitive.Cancel /> </ComposerPrimitive.Root> ); // with voice input (dictation) const ComposerWithDictation = () => ( <ComposerPrimitive.Root> <ComposerPrimitive.Input /> <AuiIf condition={(s) => s.composer.dictation == null}> <ComposerPrimitive.Dictate /> </AuiIf> <AuiIf condition={(s) => s.composer.dictation != null}> <ComposerPrimitive.StopDictation /> </AuiIf> <ComposerPrimitive.Send /> </ComposerPrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

The root form container for message composition. This component provides a form wrapper that handles message submission when the form is submitted (e.g., via Enter key or submit button). It automatically prevents the default form submission and triggers the composer's send functionality.

This primitive renders a `<form>` element unless `asChild` is set.

`ComposerPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Input](#input)

A text input component for composing messages. This component provides a rich text input experience with automatic resizing, keyboard shortcuts, file paste support, and intelligent focus management. It integrates with the composer context to manage message state and submission. When rendered inside \`Unstable\_TriggerPopoverRoot\` and a popover is open, the underlying \`\<textarea>\` automatically receives \`aria-controls\`, \`aria-expanded\`, \`aria-haspopup\`, and \`aria-activedescendant\` for the combobox relationship. These computed attributes override user-provided values for those four ARIA props while the popover is open.

This primitive renders a `<textarea>` element unless `asChild` is set.

`ComposerPrimitiveInputProps`

- `asChild` `: boolean` = false

  Whether to render as a child component using Slot. When true, the component will merge its props with its child.

- `render` `?: ReactElement`

  A React element to use as the input container, with props merged in.

- `cancelOnEscape` `: boolean` = true

  Whether to cancel message composition when Escape is pressed.

- `unstable_focusOnRunStart`

  - variant

    unstable

  `: boolean` = true

  Whether to automatically focus the input when a new run starts.

- `unstable_focusOnScrollToBottom`

  - variant

    unstable

  `: boolean` = true

  Whether to automatically focus the input when scrolling to bottom.

- `unstable_focusOnThreadSwitched`

  - variant

    unstable

  `: boolean` = true

  Whether to automatically focus the input when switching threads.

- `addAttachmentOnPaste` `: boolean` = true

  Whether to automatically add pasted files as attachments.

- `submitMode` `: "enter" | "ctrlEnter" | "none"` = "enter"

  Controls how the Enter key submits messages. - "enter": Plain Enter submits (Shift+Enter for newline) - "ctrlEnter": Ctrl/Cmd+Enter submits (plain Enter for newline) - "none": Keyboard submission disabled

- `submitOnEnter`

  - variant

    deprecated

  `: boolean` = true

  Whether to submit the message when Enter is pressed (without Shift).

  Deprecated: Use \`submitMode\` instead

#### [Keyboard Shortcuts](#keyboard-shortcuts)

Default (`submitMode="enter"`):

| Key             | Description            |
| --------------- | ---------------------- |
| `Enter`         | Sends the message.     |
| `Shift + Enter` | Inserts a newline.     |
| `Escape`        | Sends a cancel action. |

With `submitMode="ctrlEnter"`:

| Key                | Description            |
| ------------------ | ---------------------- |
| `Ctrl/Cmd + Enter` | Sends the message.     |
| `Enter`            | Inserts a newline.     |
| `Escape`           | Sends a cancel action. |

### [Send](#send)

A button component that sends the current message in the composer. This component automatically handles the send functionality and is disabled when sending is not available (e.g., when the thread is running, the composer is empty, or not in editing mode).

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveSendProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Cancel](#cancel)

A button component that cancels the current message composition. This component automatically handles the cancel functionality and is disabled when canceling is not available.

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveCancelProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [AddAttachment](#addattachment)

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveAddAttachmentProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `multiple` `?: boolean`

  allow selecting multiple files

### [Attachments](#attachments)

`ComposerPrimitiveAttachmentsProps`

- `components`

  - variant

    deprecated

  `?: ComposerAttachmentsComponentConfig`

  Deprecated: Use the children render function instead.

  - `Image` `?: ComponentType`
  - `Document` `?: ComponentType`
  - `File` `?: ComponentType`
  - `Attachment` `?: ComponentType`

- `children` `?: (value: { attachment: Attachment }) => ReactNode`

  Render function called for each attachment. Receives the attachment.

### [AttachmentByIndex](#attachmentbyindex)

Renders a single attachment at the specified index within the composer.

`ComposerPrimitiveAttachmentByIndexProps`

- `index` `: number`

- `components` `?: ComposerAttachmentsComponentConfig`

  - `Image` `?: ComponentType`
  - `Document` `?: ComponentType`
  - `File` `?: ComponentType`
  - `Attachment` `?: ComponentType`

### [AttachmentDropzone](#attachmentdropzone)

This primitive renders a `<div>` element unless `asChild` is set.

`ComposerPrimitiveAttachmentDropzoneProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `disabled` `?: boolean`

| Data attribute    | Values                                                   |
| ----------------- | -------------------------------------------------------- |
| `[data-dragging]` | Present while a file is being dragged over the dropzone. |

### [Dictate](#dictate)

A button that starts dictation to convert voice to text. Requires a DictationAdapter to be configured in the runtime.

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveDictateProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [StopDictation](#stopdictation)

A button that stops the current dictation session. Only rendered when dictation is active.

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveStopDictationProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [DictationTranscript](#dictationtranscript)

Renders the current interim (partial) transcript while dictation is active. This component displays real-time feedback of what the user is saying before the transcription is finalized and committed to the composer input.

This primitive renders a `<span>` element unless `asChild` is set.

`ComposerPrimitiveDictationTranscriptProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [If](#if)

**Deprecated.** Use \`\<AuiIf condition={(s) => s.composer...} />\` instead.

`ComposerPrimitiveIfProps`

- `editing` `?: boolean`

  Whether the composer is in editing mode

- `dictation` `?: boolean`

  Whether dictation is currently active

### [Quote](#quote)

Renders a container for the quoted text preview in the composer. Only renders when a quote is set.

This primitive renders a `<div>` element unless `asChild` is set.

`ComposerPrimitiveQuoteProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [QuoteText](#quotetext)

Renders the quoted text content.

This primitive renders a `<span>` element unless `asChild` is set.

`ComposerPrimitiveQuoteTextProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [QuoteDismiss](#quotedismiss)

A button that clears the current quote from the composer.

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveQuoteDismissProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Queue](#queue)

Renders all queue items in the composer.

`ComposerPrimitiveQueueProps`

- `children` `: (value: { queueItem: QueueItemState }) => ReactNode`

  Render function called for each queue item. Receives the queue item state.

### [Unstable\_TriggerPopover](#unstable_triggerpopover)

`ComposerPrimitiveUnstable_TriggerPopoverProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `char` `: string`

  The character(s) that activate this trigger (e.g. \`"@"\`, \`"/"\`). Also serves as the trigger identity within the root.

- `adapter` `?: Unstable_TriggerAdapter`

  Adapter providing categories and items.

  - `categories` `: () => readonly Unstable_TriggerCategory[]`

    Return the top-level categories for the trigger popover.

  - `categoryItems` `: (categoryId: string) => readonly Unstable_TriggerItem[]`

    Return items within a category.

  - `search` `?: (query: string) => readonly Unstable_TriggerItem[]`

    Global search across all categories (optional).

| Data attribute | Values                                     |
| -------------- | ------------------------------------------ |
| `[data-state]` | `"open"` when the trigger popover is open. |

### [Unstable\_TriggerPopoverRoot](#unstable_triggerpopoverroot)

Provider that groups one or more \`TriggerPopover\` declarations. Each trigger is identified by its \`char\` (unique within the root). Behavior is contributed by a child \`TriggerPopover.Directive\` or \`TriggerPopover.Action\`.

`ComposerPrimitiveUnstable_TriggerPopoverRootProps`

- `children` `?: ReactNode`

### [Unstable\_TriggerPopoverCategories](#unstable_triggerpopovercategories)

Renders the top-level category list via a render function. Only renders when no category is active and search mode is off.

This primitive renders a `<div>` element unless `asChild` is set.

`ComposerPrimitiveUnstable_TriggerPopoverCategoriesProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `children` `: (categories: readonly Unstable_TriggerCategory[]) => ReactNode`

### [Unstable\_TriggerPopoverCategoryItem](#unstable_triggerpopovercategoryitem)

A button that selects a category and triggers drill-down navigation. Automatically receives \`data-highlighted\` when keyboard-navigated.

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveUnstable_TriggerPopoverCategoryItemProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `categoryId` `: string`

| Data attribute       | Values                             |
| -------------------- | ---------------------------------- |
| `[data-highlighted]` | Present when keyboard-highlighted. |

### [Unstable\_TriggerPopoverItems](#unstable_triggerpopoveritems)

Renders the list of items within a category or search results via a render function. Only renders when a category is active or search mode is on.

This primitive renders a `<div>` element unless `asChild` is set.

`ComposerPrimitiveUnstable_TriggerPopoverItemsProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `children` `: (items: readonly Unstable_TriggerItem[]) => ReactNode`

### [Unstable\_TriggerPopoverItem](#unstable_triggerpopoveritem)

A button that selects a trigger item. Automatically receives \`data-highlighted\` when keyboard-navigated.

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveUnstable_TriggerPopoverItemProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `item` `: Unstable_TriggerItem`

  - `id` `: string`
  - `type` `: string`
  - `label` `: string`
  - `description` `?: string`
  - `metadata` `?: ReadonlyJSONObject`

- `index` `?: number`

| Data attribute       | Values                             |
| -------------------- | ---------------------------------- |
| `[data-highlighted]` | Present when keyboard-highlighted. |

### [Unstable\_TriggerPopoverBack](#unstable_triggerpopoverback)

A button that navigates back from category items to the category list. Only renders when a category is active (drill-down view).

This primitive renders a `<button>` element unless `asChild` is set.

`ComposerPrimitiveUnstable_TriggerPopoverBackProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Unstable\_RegisteredTrigger](#unstable_registeredtrigger)