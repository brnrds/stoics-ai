# External Store Runtime
URL: /docs/api-reference/external-store/runtime

Runtime components, options, and adapters for using assistant-ui with externally owned chat state.

## [API Reference](#api-reference)

### [ExternalStoreAdapter](#externalstoreadapter)

`ExternalStoreAdapter`

- `isDisabled` `?: boolean`

  Whether the entire thread is disabled. When \`true\`, the composer's input is also disabled (the user cannot type, attach files, or submit). For a narrower gate that keeps the input usable but blocks only sending, use \`isSendDisabled\`.

- `isSendDisabled` `?: boolean`

  Whether sending new messages is currently disabled. When \`true\`, the thread composer's input remains usable but \`send()\` becomes a no-op and the thread composer's \`canSend\` is \`false\`. Use this to gate sending on external React state (e.g. while tool config is loading) without disabling the input itself the way \`isDisabled\` does. Edit composers (saving message edits) intentionally ignore this flag.

- `isRunning` `?: boolean`

  Whether the thread is running. When provided, this value flows directly to \`thread.isRunning\`, letting the application keep the thread in a running state even after the last assistant message has completed (for example while non-message stream chunks like suggestions or metadata updates are still arriving). When omitted, \`thread.isRunning\` falls back to the last-message-status heuristic.

- `isLoading` `?: boolean`

- `messages` `?: readonly T[]`

- `messageRepository` `?: ExportedMessageRepository`

  - `headId` `?: string | null`
  - `messages` `: Array<{ message: ThreadMessage; parentId: string | null; runConfig?: RunConfig; }>`

- `suggestions` `?: readonly ThreadSuggestion[]`

- `state` `?: ReadonlyJSONValue`

- `extras` `?: unknown`

- `setMessages` `?: ((messages: readonly T[]) => void)`

- `onImport` `?: ((messages: readonly ThreadMessage[]) => void)`

- `onExportExternalState` `?: (() => any)`

- `onLoadExternalState` `?: ((state: any) => void)`

- `onNew` `: (message: AppendMessage) => Promise<void>`

- `onEdit` `?: ((message: AppendMessage) => Promise<void>)`

- `onReload` `?: ((parentId: string | null, config: StartRunConfig) => Promise<void>)`

- `onResume` `?: ((config: ResumeRunConfig) => Promise<void>)`

- `onCancel` `?: (() => Promise<void>)`

- `onAddToolResult` `?: ((options: AddToolResultOptions) => Promise<void> | void)`

- `onResumeToolCall` `?: ((options: { toolCallId: string; payload: unknown }) => void)`

- `convertMessage` `?: ExternalStoreMessageConverter<T>`

- `adapters` `?: ExternalStoreAdapter["adapters"]`

  - `attachments` `?: AttachmentAdapter`

    - `accept` `: string`
    - `add` `: (state: { file: File; }) => Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void>`
    - `remove` `: (attachment: Attachment) => Promise<void>`
    - `send` `: (attachment: PendingAttachment) => Promise<CompleteAttachment>`

  - `speech` `?: SpeechSynthesisAdapter`

    - `speak` `: (text: string) => SpeechSynthesisAdapter.Utterance`

  - `dictation` `?: DictationAdapter`

    - `listen` `: () => DictationAdapter.Session`
    - `disableInputDuringDictation` `?: boolean`

  - `voice` `?: RealtimeVoiceAdapter`

    - `connect` `: (options: { abortSignal?: AbortSignal; }) => RealtimeVoiceAdapter.Session`

  - `feedback` `?: FeedbackAdapter`

    - `submit` `: (feedback: FeedbackAdapterFeedback) => void`

  - `threadList`

    - variant

      deprecated

    `?: ExternalStoreThreadListAdapter`

    Deprecated: This API is still under active development and might change without notice.

    - `threadId`

      - variant

        deprecated

      `?: string`

      Deprecated: This API is still under active development and might change without notice.

    - `isLoading` `?: boolean`

    - `threads` `?: readonly ExternalStoreThreadData<"regular">[]`

    - `archivedThreads` `?: readonly ExternalStoreThreadData<"archived">[]`

    - `onSwitchToNewThread`

      - variant

        deprecated

      `?: (() => Promise<void> | void)`

      Deprecated: This API is still under active development and might change without notice.

    - `onSwitchToThread`

      - variant

        deprecated

      `?: ((threadId: string) => Promise<void> | void)`

      Deprecated: This API is still under active development and might change without notice.

    - `onRename` `?: ( threadId: string, newTitle: string, ) => (Promise<void> | void)`

    - `onArchive` `?: ((threadId: string) => Promise<void> | void)`

    - `onUnarchive` `?: ((threadId: string) => Promise<void> | void)`

    - `onDelete` `?: ((threadId: string) => Promise<void> | void)`

- `unstable_capabilities`

  - variant

    unstable

  `?: ExternalStoreAdapter["unstable_capabilities"]`

  - `copy` `?: boolean`

### [ExternalThread](#externalthread)

`ExternalThread props`

- `messages` `: readonly ExternalThreadMessage[]`

- `isRunning` `?: boolean`

- `isSendDisabled` `?: boolean`

  Whether sending new messages is currently disabled. When \`true\`, the thread composer's input remains usable but \`send()\` is a no-op and \`composer.canSend\` is \`false\`. Edit composers (saving message edits) intentionally ignore this flag.

- `onNew` `?: (message: AppendMessage) => void`

  Callback for new messages (non-queue runtimes).

- `onEdit` `?: (message: AppendMessage) => void`

- `onReload` `?: (parentId: string | null) => void`

- `onStartRun` `?: () => void`

- `onCancel` `?: () => void`

- `queue` `?: ExternalThreadQueueAdapter`

  Queue adapter for runtimes that support message queuing and steering.

  - `items` `: readonly QueueItemState[]`

    The current queue items.

  - `enqueue` `: (message: AppendMessage, opts: { steer: boolean }) => void`

    Called when a message is submitted via the composer. Receives the steer preference.

  - `steer` `: (queueItemId: string) => void`

    Called to promote an existing queue item (cancel current run, run this immediately).

  - `remove` `: (queueItemId: string) => void`

    Called to remove an item from the queue.

  - `clear` `: (reason: "edit" | "reload" | "cancel-run") => void`

    Called to clear all pending queue items, with the reason for clearing.

### [ExternalThreadProps](#externalthreadprops)

`ExternalThreadProps`

- `messages` `: readonly ExternalThreadMessage[]`

- `isRunning` `?: boolean`

- `isSendDisabled` `?: boolean`

  Whether sending new messages is currently disabled. When \`true\`, the thread composer's input remains usable but \`send()\` is a no-op and \`composer.canSend\` is \`false\`. Edit composers (saving message edits) intentionally ignore this flag.

- `onNew` `?: (message: AppendMessage) => void`

  Callback for new messages (non-queue runtimes).

- `onEdit` `?: (message: AppendMessage) => void`

- `onReload` `?: (parentId: string | null) => void`

- `onStartRun` `?: () => void`

- `onCancel` `?: () => void`

- `queue` `?: ExternalThreadQueueAdapter`

  Queue adapter for runtimes that support message queuing and steering.

  - `items` `: readonly QueueItemState[]`

    The current queue items.

  - `enqueue` `: (message: AppendMessage, opts: { steer: boolean }) => void`

    Called when a message is submitted via the composer. Receives the steer preference.

  - `steer` `: (queueItemId: string) => void`

    Called to promote an existing queue item (cancel current run, run this immediately).

  - `remove` `: (queueItemId: string) => void`

    Called to remove an item from the queue.

  - `clear` `: (reason: "edit" | "reload" | "cancel-run") => void`

    Called to clear all pending queue items, with the reason for clearing.

### [ExternalThreadQueueAdapter](#externalthreadqueueadapter)

`ExternalThreadQueueAdapter`

- `items` `: readonly QueueItemState[]`

  The current queue items.

- `enqueue` `: (message: AppendMessage, opts: { steer: boolean }) => void`

  Called when a message is submitted via the composer. Receives the steer preference.

- `steer` `: (queueItemId: string) => void`

  Called to promote an existing queue item (cancel current run, run this immediately).

- `remove` `: (queueItemId: string) => void`

  Called to remove an item from the queue.

- `clear` `: (reason: "edit" | "reload" | "cancel-run") => void`

  Called to clear all pending queue items, with the reason for clearing.

### [useExternalStoreRuntime](#useexternalstoreruntime)

`useExternalStoreRuntime`

- `store` `: ExternalStoreAdapter<T>`

  - `isDisabled` `?: boolean`

    Whether the entire thread is disabled. When \`true\`, the composer's input is also disabled (the user cannot type, attach files, or submit). For a narrower gate that keeps the input usable but blocks only sending, use \`isSendDisabled\`.

  - `isSendDisabled` `?: boolean`

    Whether sending new messages is currently disabled. When \`true\`, the thread composer's input remains usable but \`send()\` becomes a no-op and the thread composer's \`canSend\` is \`false\`. Use this to gate sending on external React state (e.g. while tool config is loading) without disabling the input itself the way \`isDisabled\` does. Edit composers (saving message edits) intentionally ignore this flag.

  - `isRunning` `?: boolean`

    Whether the thread is running. When provided, this value flows directly to \`thread.isRunning\`, letting the application keep the thread in a running state even after the last assistant message has completed (for example while non-message stream chunks like suggestions or metadata updates are still arriving). When omitted, \`thread.isRunning\` falls back to the last-message-status heuristic.

  - `isLoading` `?: boolean`

  - `messages` `?: readonly T[]`

  - `messageRepository` `?: ExportedMessageRepository`

    - `headId` `?: string | null`
    - `messages` `: Array<{ message: ThreadMessage; parentId: string | null; runConfig?: RunConfig; }>`

  - `suggestions` `?: readonly ThreadSuggestion[]`

  - `state` `?: ReadonlyJSONValue`

  - `extras` `?: unknown`

  - `setMessages` `?: ((messages: readonly T[]) => void)`

  - `onImport` `?: ((messages: readonly ThreadMessage[]) => void)`

  - `onExportExternalState` `?: (() => any)`

  - `onLoadExternalState` `?: ((state: any) => void)`

  - `onNew` `: (message: AppendMessage) => Promise<void>`

  - `onEdit` `?: ((message: AppendMessage) => Promise<void>)`

  - `onReload` `?: ((parentId: string | null, config: StartRunConfig) => Promise<void>)`

  - `onResume` `?: ((config: ResumeRunConfig) => Promise<void>)`

  - `onCancel` `?: (() => Promise<void>)`

  - `onAddToolResult` `?: ((options: AddToolResultOptions) => Promise<void> | void)`

  - `onResumeToolCall` `?: ((options: { toolCallId: string; payload: unknown }) => void)`

  - `convertMessage` `?: ExternalStoreMessageConverter<T>`

  - `adapters` `?: ExternalStoreAdapter["adapters"]`

    - `attachments` `?: AttachmentAdapter`

      - `accept` `: string`
      - `add` `: (state: { file: File; }) => Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void>`
      - `remove` `: (attachment: Attachment) => Promise<void>`
      - `send` `: (attachment: PendingAttachment) => Promise<CompleteAttachment>`

    - `speech` `?: SpeechSynthesisAdapter`

      - `speak` `: (text: string) => SpeechSynthesisAdapter.Utterance`

    - `dictation` `?: DictationAdapter`

      - `listen` `: () => DictationAdapter.Session`
      - `disableInputDuringDictation` `?: boolean`

    - `voice` `?: RealtimeVoiceAdapter`

      - `connect` `: (options: { abortSignal?: AbortSignal; }) => RealtimeVoiceAdapter.Session`

    - `feedback` `?: FeedbackAdapter`

      - `submit` `: (feedback: FeedbackAdapterFeedback) => void`

    - `threadList`

      - variant

        deprecated

      `?: ExternalStoreThreadListAdapter`

      Deprecated: This API is still under active development and might change without notice.

      - `threadId`

        - variant

          deprecated

        `?: string`

        Deprecated: This API is still under active development and might change without notice.

      - `isLoading` `?: boolean`

      - `threads` `?: readonly ExternalStoreThreadData<"regular">[]`

      - `archivedThreads` `?: readonly ExternalStoreThreadData<"archived">[]`

      - `onSwitchToNewThread`

        - variant

          deprecated

        `?: (() => Promise<void> | void)`

        Deprecated: This API is still under active development and might change without notice.

      - `onSwitchToThread`

        - variant

          deprecated

        `?: ((threadId: string) => Promise<void> | void)`

        Deprecated: This API is still under active development and might change without notice.

      - `onRename` `?: ( threadId: string, newTitle: string, ) => (Promise<void> | void)`

      - `onArchive` `?: ((threadId: string) => Promise<void> | void)`

      - `onUnarchive` `?: ((threadId: string) => Promise<void> | void)`

      - `onDelete` `?: ((threadId: string) => Promise<void> | void)`

  - `unstable_capabilities`

    - variant

      unstable

    `?: ExternalStoreAdapter["unstable_capabilities"]`

    - `copy` `?: boolean`