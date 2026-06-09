# Attachment Adapters
URL: /docs/api-reference/adapters/attachments

Attachment adapters for uploading files, handling lifecycle events, and bringing app-owned content into assistant-ui composers and messages.

## [API Reference](#api-reference)

### [AttachmentAdapter](#attachmentadapter)

`AttachmentAdapter`

- `accept` `: string`
- `add` `: (state: { file: File; }) => Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void>`
- `remove` `: (attachment: Attachment) => Promise<void>`
- `send` `: (attachment: PendingAttachment) => Promise<CompleteAttachment>`

### [CloudFileAttachmentAdapter](#cloudfileattachmentadapter)

`CloudFileAttachmentAdapter`

- `constructor` `?: (cloud: AssistantCloud) => CloudFileAttachmentAdapter`
- `accept` `?: string`
- `add` `?: ({ file, }: { file: File; }) => AsyncGenerator<PendingAttachment, void>`
- `remove` `?: (attachment: Attachment) => Promise<void>`
- `send` `?: (attachment: PendingAttachment) => Promise<CompleteAttachment>`

### [CompositeAttachmentAdapter](#compositeattachmentadapter)

`CompositeAttachmentAdapter`

- `constructor` `?: (adapters: AttachmentAdapter[]) => CompositeAttachmentAdapter`
- `accept` `?: string`
- `add` `?: (state: { file: File }) => Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void, any>`
- `send` `?: (attachment: PendingAttachment) => Promise<CompleteAttachment>`
- `remove` `?: (attachment: Attachment) => Promise<void>`

### [SimpleImageAttachmentAdapter](#simpleimageattachmentadapter)

`SimpleImageAttachmentAdapter`

- `accept` `?: string`
- `add` `?: (state: { file: File }) => Promise<PendingAttachment>`
- `send` `?: (attachment: PendingAttachment) => Promise<CompleteAttachment>`
- `remove` `?: () => Promise<void>`

### [SimpleTextAttachmentAdapter](#simpletextattachmentadapter)

`SimpleTextAttachmentAdapter`

- `accept` `?: string`
- `add` `?: (state: { file: File }) => Promise<PendingAttachment>`
- `send` `?: (attachment: PendingAttachment) => Promise<CompleteAttachment>`
- `remove` `?: () => Promise<void>`