# Runtime Adapter Context
URL: /docs/api-reference/adapters/runtime

Provide assistant-ui runtime adapters through React context for model, attachment, speech, and feedback behavior.

## [API Reference](#api-reference)

### [RuntimeAdapters](#runtimeadapters)

`RuntimeAdapters`

- `modelContext` `?: ModelContextProvider`

  - `getModelContext` `: () => ModelContext`
  - `subscribe` `?: (callback: () => void) => Unsubscribe`

- `history` `?: ThreadHistoryAdapter`

  - `load` `: () => Promise<ExportedMessageRepository & { unstable_resume?: boolean; }>`

  - `resume` `?: (options: ChatModelRunOptions) => AsyncGenerator<ChatModelRunResult, void, unknown>`

  - `append` `: (item: ExportedMessageRepositoryItem) => Promise<void>`

  - `withFormat` `?: <TMessage, TStorageFormat extends Record<string, unknown>>(formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>) => GenericThreadHistoryAdapter<TMessage>`

    Required when used with \`useAISDKRuntime\` / \`useChatRuntime\`.

- `attachments` `?: AttachmentAdapter`

  - `accept` `: string`
  - `add` `: (state: { file: File; }) => Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void>`
  - `remove` `: (attachment: Attachment) => Promise<void>`
  - `send` `: (attachment: PendingAttachment) => Promise<CompleteAttachment>`