# Scoped Providers
URL: /docs/api-reference/context-providers/scoped-providers

Lower-level assistant-ui providers for custom renderers, scoped message parts, attachments, and advanced composition.

## [API Reference](#api-reference)

### [ChainOfThoughtByIndicesProvider](#chainofthoughtbyindicesprovider)

`ChainOfThoughtByIndicesProvider props`

- `startIndex` `: number`
- `endIndex` `: number`

### [ComposerAttachmentByIndexProvider](#composerattachmentbyindexprovider)

`ComposerAttachmentByIndexProvider props`

- `index` `: number`

### [MessageAttachmentByIndexProvider](#messageattachmentbyindexprovider)

`MessageAttachmentByIndexProvider props`

- `index` `: number`

### [MessageByIndexProvider](#messagebyindexprovider)

`MessageByIndexProvider props`

- `index` `: number`

### [MessageProvider](#messageprovider)

`MessageProvider props`

- `message` `: ThreadMessage`

  - `status` `?: ThreadAssistantMessage["status"]`

    - `type` `: "running"`

  - `metadata` `: ThreadMessage["metadata"]`

    - `unstable_state`

      - variant

        unstable

      `?: ReadonlyJSONValue`

    - `unstable_annotations`

      - variant

        unstable

      `?: readonly ReadonlyJSONValue[]`

    - `unstable_data`

      - variant

        unstable

      `?: readonly ReadonlyJSONValue[]`

    - `steps` `?: readonly ThreadStep[]`

    - `submittedFeedback` `?: ThreadMessage["metadata"]["submittedFeedback"]`

      - `type` `: "positive" | "negative"`

    - `timing` `?: MessageTiming`

      - `streamStartTime` `: number`
      - `firstTokenTime` `?: number`
      - `totalStreamTime` `?: number`
      - `tokenCount` `?: number`
      - `tokensPerSecond` `?: number`
      - `totalChunks` `: number`
      - `toolCallCount` `: number`

    - `custom` `: Record<string, unknown>`

  - `attachments` `?: ThreadUserMessage["attachments"]`

  - `id` `: string`

  - `createdAt` `: Date`

  - `role` `: "system"`

  - `content` `: readonly [TextMessagePart]`

- `index` `: number`

- `isLast` `?: boolean`

- `branchNumber` `?: number`

- `branchCount` `?: number`

### [PartByIndexProvider](#partbyindexprovider)

`PartByIndexProvider props`

- `index` `: number`

### [ReadonlyThreadProvider](#readonlythreadprovider)

`ReadonlyThreadProvider props`

- `messages` `: readonly ThreadMessage[]`

### [RuntimeAdapterProvider](#runtimeadapterprovider)

`RuntimeAdapterProvider props`

- `adapters` `: RuntimeAdapters`

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

- `children` `?: ReactNode`

### [SuggestionByIndexProvider](#suggestionbyindexprovider)

`SuggestionByIndexProvider props`

- `index` `: number`

### [TextMessagePartProvider](#textmessagepartprovider)

`TextMessagePartProvider props`

- `text` `: string`
- `isRunning` `?: boolean`

### [ThreadListItemByIndexProvider](#threadlistitembyindexprovider)

`ThreadListItemByIndexProvider props`

- `index` `: number`
- `archived` `: boolean`

### [ThreadListItemRuntimeProvider](#threadlistitemruntimeprovider)

`ThreadListItemRuntimeProvider props`

- `runtime` `: ThreadListItemRuntime`

  - `path` `: ThreadListItemRuntimePath`

    - `ref` `: string`

    - `threadSelector` `: ThreadListItemRuntimePath["threadSelector"]`

      - `type` `: "main"`

  - `getState` `: () => ThreadListItemState`

  - `initialize` `: () => Promise<{ remoteId: string; externalId: string | undefined; }>`

  - `generateTitle` `: () => Promise<void>`

  - `switchTo` `: () => Promise<void>`

  - `rename` `: (newTitle: string) => Promise<void>`

  - `archive` `: () => Promise<void>`

  - `unarchive` `: () => Promise<void>`

  - `delete` `: () => Promise<void>`

  - `detach` `: () => void`

  - `subscribe` `: (callback: () => void) => Unsubscribe`

  - `unstable_on`

    - variant

      unstable

    `: <E extends ThreadListItemEventType>(event: E, callback: ThreadListItemEventCallback<E>) => Unsubscribe`