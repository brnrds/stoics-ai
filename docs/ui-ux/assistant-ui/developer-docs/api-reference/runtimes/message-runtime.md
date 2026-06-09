# MessageRuntime
URL: /docs/api-reference/runtimes/message-runtime

MessageRuntime state and actions for editing, reloading, copying, rating, speaking, and branching assistant-ui messages.

## [API Reference](#api-reference)

### [MessageRuntime](#messageruntime)

`MessageRuntime`

- `path` `: MessageRuntimePath`

  - `ref` `: string`

  - `threadSelector` `: MessageRuntimePath["threadSelector"]`

    - `type` `: "main"`

  - `messageSelector` `: MessageRuntimePath["messageSelector"]`

    - `type` `: "messageId"`

- `composer` `: EditComposerRuntime`

  - `type` `: "edit" | "thread"`

  - `reset` `: () => Promise<void>`

    Reset the composer. This will clear the entire state of the composer, including all text and attachments.

  - `subscribe` `: (callback: () => void) => Unsubscribe`

    Listens for changes to the composer state.

  - `setText` `: (text: string) => void`

    Set the text of the composer.

  - `setRole` `: (role: MessageRole) => void`

    Set the role of the composer. For instance, if you'd like a specific message to have the 'assistant' role, you can do so here.

  - `setRunConfig` `: (runConfig: RunConfig) => void`

    Set the run config of the composer. This is used to send custom configuration data to the model. Within your backend, you can use the \`runConfig\` object. Example: \`\`\`ts composerRuntime.setRunConfig({ custom: { customField: "customValue" } }); \`\`\`

  - `addAttachment` `: (fileOrAttachment: File | CreateAttachment) => Promise<void>`

    Add an attachment to the composer. Accepts either a standard File object (processed through the AttachmentAdapter) or a CreateAttachment descriptor for external-source attachments (URLs, API data, CMS references). External descriptors bypass the adapter's \`add()\` step but still respect \`adapter.accept\` when an adapter is configured; without an adapter they are added as-is.

  - `clearAttachments` `: () => Promise<void>`

    Clear all attachments from the composer.

  - `send` `: (options?: SendOptions) => void`

    Send a message. This will send whatever text or attachments are in the composer.

  - `cancel` `: () => void`

    Cancel the current run. In edit mode, this will exit edit mode.

  - `startDictation` `: () => void`

    Start dictation to convert voice to text input. Requires a DictationAdapter to be configured.

  - `stopDictation` `: () => void`

    Stop the current dictation session.

  - `setQuote` `: (quote: QuoteInfo | undefined) => void`

    Set a quote for the next message. Pass undefined to clear.

  - `path` `: ComposerRuntimePath`

    - `ref` `: string`

    - `threadSelector` `: EditComposerRuntime["path"]["threadSelector"]`

      - `type` `: "main"`

    - `messageSelector` `: EditComposerRuntime["path"]["messageSelector"]`

      - `type` `: "messageId"`

    - `composerSource` `: "edit"`

  - `unstable_on`

    - variant

      deprecated

    * variant

      unstable

    `: <E extends ComposerRuntimeEventType>(event: E, callback: ComposerRuntimeEventCallback<E>) => Unsubscribe`

    Deprecated: This API is still under active development and might change without notice.

  - `getState` `: () => EditComposerState`

  - `beginEdit` `: () => void`

  - `getAttachmentByIndex` `: (idx: number) => AttachmentRuntime & { source: "edit-composer"; }`

- `getState` `: () => MessageState`

- `reload` `: (config?: ReloadConfig) => void`

- `speak`

  - variant

    deprecated

  `: () => void`

  Deprecated: This API is still under active development and might change without notice.

- `stopSpeaking`

  - variant

    deprecated

  `: () => void`

  Deprecated: This API is still under active development and might change without notice.

- `submitFeedback` `: ({ type }: { type: "positive" | "negative"; }) => void`

- `switchToBranch` `: ({ position, branchId, }: { position?: "previous" | "next" | undefined; branchId?: string | undefined; }) => void`

- `unstable_getCopyText`

  - variant

    unstable

  `: () => string`

- `subscribe` `: (callback: () => void) => Unsubscribe`

- `getMessagePartByIndex` `: (idx: number) => MessagePartRuntime`

- `getMessagePartByToolCallId` `: (toolCallId: string) => MessagePartRuntime`

- `getAttachmentByIndex` `: (idx: number) => AttachmentRuntime & { source: "message"; }`

### [MessageState](#messagestate)

`MessageState`

- `status` `?: ThreadAssistantMessage["status"]`

  - `type` `: "running"`

- `metadata` `: MessageState["metadata"]`

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

  - `submittedFeedback` `?: MessageState["metadata"]["submittedFeedback"]`

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

- `parentId` `: string | null`

- `index` `: number`

  The position of this message in the thread (0 for first message)

- `isLast` `: boolean`

- `branchNumber` `: number`

- `branchCount` `: number`

- `speech`

  - variant

    deprecated

  `?: SpeechState`

  Deprecated: This API is still under active development and might change without notice.

  - `messageId` `: string`

  - `status` `: SpeechSynthesisAdapter.Status`

    - `type` `: "starting" | "running"`