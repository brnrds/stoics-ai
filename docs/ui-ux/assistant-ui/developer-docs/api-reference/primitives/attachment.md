# AttachmentPrimitive
URL: /docs/api-reference/primitives/attachment

Attachment primitives for rendering file previews, names, thumbnails, and remove controls in assistant-ui messages and composers.

For examples and usage patterns, see

- href

  /docs/primitives/attachment

Attachment

.

## [Anatomy](#anatomy)

`import { AttachmentPrimitive } from "@assistant-ui/react"; const MyMessageAttachment = () => ( <AttachmentPrimitive.Root> <AttachmentPrimitive.unstable_Thumb /> <AttachmentPrimitive.Name /> </AttachmentPrimitive.Root> ); const MyComposerAttachment = () => ( <AttachmentPrimitive.Root> <AttachmentPrimitive.unstable_Thumb /> <AttachmentPrimitive.Name /> <AttachmentPrimitive.Remove /> </AttachmentPrimitive.Root> );`

## [API Reference](#api-reference)

### [Root](#root)

The root container component for an attachment. This component provides the foundational wrapper for attachment-related components and content. It serves as the context provider for attachment state and actions.

This primitive renders a `<div>` element unless `asChild` is set.

`AttachmentPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Name](#name)

### [Remove](#remove)

This primitive renders a `<button>` element unless `asChild` is set.

`AttachmentPrimitiveRemoveProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`