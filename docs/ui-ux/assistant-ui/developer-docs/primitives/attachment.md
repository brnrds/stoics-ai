# Attachment
URL: /docs/primitives/attachment

File and image attachment rendering for the composer and messages.

The Attachment primitive renders file and image attachments. It appears in two places: inside the composer for pending uploads (with a remove button), and inside messages for sent attachments (read-only). You provide the layout and styling.

- items

  - Preview
  - Code

`import { AttachmentPrimitive, ComposerPrimitive, } from "@assistant-ui/react"; import { XIcon } from "lucide-react"; function ComposerAttachment() { return ( <AttachmentPrimitive.Root className="flex items-center gap-2 rounded-lg border p-2"> <AttachmentPrimitive.unstable_Thumb className="flex size-10 items-center justify-center rounded bg-muted text-xs" /> <span className="text-sm"> <AttachmentPrimitive.Name /> </span> <AttachmentPrimitive.Remove className="ml-auto rounded-full p-1 hover:bg-muted"> <XIcon className="size-3" /> </AttachmentPrimitive.Remove> </AttachmentPrimitive.Root> ); }`

## [Quick Start](#quick-start)

An attachment inside a composer:

`import { AttachmentPrimitive, ComposerPrimitive } from "@assistant-ui/react"; <ComposerPrimitive.Root> <ComposerPrimitive.Attachments> {() => <MyAttachment />} </ComposerPrimitive.Attachments> <ComposerPrimitive.Input placeholder="Ask anything..." /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

`Root` renders a `<div>`, `unstable_Thumb` renders a `<div>` showing the file extension with a leading dot (e.g., `.pdf`), `Name` renders plain text, and `Remove` renders a `<button>`.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Two Contexts](#two-contexts)

Attachments appear in two different contexts:

- **Composer**: via `ComposerPrimitive.Attachments`. These are pending uploads that can be removed before sending.
- **Messages**: via `MessagePrimitive.Attachments`. These are sent attachments, displayed read-only (the iterator renders attachments for user messages).

The same `AttachmentPrimitive` parts work in both contexts. The difference is behavioral: `Remove` only works in the composer context.

### [Iterator Pattern](#iterator-pattern)

You don't loop over attachments yourself. Instead, use the children render function:

`// Composer attachments <ComposerPrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") return <ImageAttachment />; if (attachment.type === "document") return <DocumentAttachment />; return <GenericAttachment />; }} </ComposerPrimitive.Attachments> // Message attachments <MessagePrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") return <ImageAttachment />; if (attachment.type === "document") return <DocumentAttachment />; return <GenericAttachment />; }} </MessagePrimitive.Attachments>`

Each component receives its attachment context automatically, with no props to pass. `components` is deprecated — use the `children` render function instead.

### [Remove Button](#remove-button)

`Remove` calls the attachment runtime remove action. In composer attachments it removes the attachment from the pending message. In message attachments, this action is not supported and clicking `Remove` will throw `"Message attachments cannot be removed"`. Only render `Remove` in composer UIs.

### [Name as Text](#name-as-text)

`Name` renders plain text with no wrapper element. Wrap it in a `<span>` or other element for styling:

`<span className="text-sm font-medium"> <AttachmentPrimitive.Name /> </span>`

## [Parts](#parts)

### [Root](#root)

Container for a single attachment item. Renders a `<div>` element unless `asChild` is set.

`<AttachmentPrimitive.Root className="flex items-center gap-2 rounded-lg border p-2"> <AttachmentPrimitive.Name /> </AttachmentPrimitive.Root>`

### [unstable\_Thumb](#unstable_thumb)

Thumbnail slot for attachment previews. Renders a `<div>` element unless `asChild` is set.

`<AttachmentPrimitive.unstable_Thumb className="flex size-10 items-center justify-center rounded bg-muted text-xs" />`

### [Name](#name)

Renders the attachment filename text.

`<AttachmentPrimitive.Name />`

### [Remove](#remove)

Button that removes the current attachment when used in a removable attachment context. Renders a `<button>` element unless `asChild` is set.

`<AttachmentPrimitive.Remove className="rounded-full p-1 hover:bg-muted"> <XIcon className="size-3" /> </AttachmentPrimitive.Remove>`

## [Patterns](#patterns)

### [Composer Attachment with Remove](#composer-attachment-with-remove)

`function ComposerAttachmentItem() { return ( <AttachmentPrimitive.Root className="flex items-center gap-2 rounded-lg border p-2"> <AttachmentPrimitive.unstable_Thumb className="flex size-10 items-center justify-center rounded bg-muted text-xs font-mono" /> <span className="min-w-0 flex-1 truncate text-sm"> <AttachmentPrimitive.Name /> </span> <AttachmentPrimitive.Remove className="rounded-full p-1 hover:bg-muted"> <XIcon className="size-3" /> </AttachmentPrimitive.Remove> </AttachmentPrimitive.Root> ); } <ComposerPrimitive.Root> <ComposerPrimitive.Attachments components={{ Attachment: ComposerAttachmentItem }} /> <ComposerPrimitive.Input placeholder="Ask anything..." /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

### [Message Attachment (Read-Only)](#message-attachment-read-only)

`function MessageAttachment() { return ( <AttachmentPrimitive.Root className="flex items-center gap-2 rounded-lg border p-2"> <AttachmentPrimitive.unstable_Thumb className="flex size-10 items-center justify-center rounded bg-muted text-xs font-mono" /> <span className="text-sm"> <AttachmentPrimitive.Name /> </span> </AttachmentPrimitive.Root> ); }`

### [Custom Layout with asChild](#custom-layout-with-aschild)

`<AttachmentPrimitive.Root asChild> <li className="flex items-center gap-3 py-1"> <AttachmentPrimitive.unstable_Thumb className="size-8 rounded bg-muted text-xs" /> <span className="text-sm"> <AttachmentPrimitive.Name /> </span> </li> </AttachmentPrimitive.Root>`

## [Relationship to Components](#relationship-to-components)

The shadcn

- href

  /docs/ui/attachment

Attachment

component wraps these primitives with styled thumbnails, tooltip filenames, remove buttons, and image preview dialogs. Start there for a prebuilt attachment UI.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/attachment

AttachmentPrimitive API Reference

.

Related:

- - href

    /docs/api-reference/primitives/composer

  ComposerPrimitive API Reference

- - href

    /docs/api-reference/primitives/message

  MessagePrimitive API Reference