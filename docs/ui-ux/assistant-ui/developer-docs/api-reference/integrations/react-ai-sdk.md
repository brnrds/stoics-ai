# @assistant-ui/react-ai-sdk
URL: /docs/api-reference/integrations/react-ai-sdk

Vercel AI SDK runtime hooks, chat transports, and message conversion utilities for assistant-ui React applications.

## [API Reference](#api-reference)

### [AssistantChatTransport](#assistantchattransport)

`AssistantChatTransport`

- `constructor` `?: (initOptions?: AssistantChatTransportInitOptions<UI_MESSAGE>) => AssistantChatTransport`
- `setRuntime` `?: (runtime: AssistantRuntime) => void`
- `getResumableAdapter` `?: () => AssistantChatResumableOptions`
- `__internal_setGetThreadListItem` `?: (getter: () => InitializableThreadListItem) => void`

### [createResumableSessionStorage](#createresumablesessionstorage)

`sessionStorage`-backed storage for the pending resumable stream id.

`createResumableSessionStorage`

- `options` `?: { key?: string; }`

  - `key` `?: string`

### [frontendTools](#frontendtools)

`const frontendTools: (tools: Record<string, { description?: string; parameters: JSONSchema7; }>) => ToolSet;`

### [getThreadMessageTokenUsage](#getthreadmessagetokenusage)

`getThreadMessageTokenUsage`

- `message` `: TokenUsageExtractableMessage`

  - `role` `?: string`
  - `metadata` `?: unknown`

### [injectQuoteContext](#injectquotecontext)

Injects quote context into messages as markdown blockquotes.

Use this in your route handler before `convertToModelMessages` so the LLM sees the quoted text that the user is referring to.

`injectQuoteContext`

- `messages` `: UIMessage<unknown, UIDataTypes, UITools>[]`

### [RESUMABLE\_STREAM\_ID\_HEADER](#resumable_stream_id_header)

`const RESUMABLE_STREAM_ID_HEADER: "x-resumable-stream-id";`

### [useAISDKRuntime](#useaisdkruntime)

`useAISDKRuntime`

- `chatHelpers` `: UseChatHelpers<UI_MESSAGE>`

  - `id` `: string`

    The id of the chat.

  - `setMessages` `: (messages: UI_MESSAGE[] | ((messages: UI_MESSAGE[]) => UI_MESSAGE[])) => void`

    Update the \`messages\` state locally. This is useful when you want to edit the messages on the client, and then trigger the \`reload\` method manually to regenerate the AI response.

  - `error` `?: Error`

    - `name` `: string`
    - `message` `: string`
    - `stack` `?: string`
    - `cause` `?: unknown`

  - `status` `: ChatStatus`

    Hook status: - \`submitted\`: The message has been sent to the API and we're awaiting the start of the response stream. - \`streaming\`: The response is actively streaming in from the API, receiving chunks of data. - \`ready\`: The full response has been received and processed; a new user message can be submitted. - \`error\`: An error occurred during the API request, preventing successful completion.

  - `messages` `: UI_MESSAGE[]`

  - `addToolResult`

    - variant

      deprecated

    `: ChatAddToolOutputFunction<UI_MESSAGE>`

    Deprecated: Use addToolOutput

  - `stop` `: () => Promise<void>`

    Abort the current request immediately, keep the generated tokens if any.

  - `sendMessage` `: (message?: (CreateUIMessage<UI_MESSAGE> & { text?: never; files?: never; messageId?: string; }) | { text: string; files?: FileList | FileUIPart[]; metadata?: InferUIMessageMetadata<UI_MESSAGE>; parts?: never; messageId?: string; } | { files: FileList | FileUIPart[]; metadata?: InferUIMessageMetadata<UI_MESSAGE>; parts?: never; messageId?: string; }, options?: ChatRequestOptions) => Promise<void>`

    Appends or replaces a user message to the chat list. This triggers the API call to fetch the assistant's response. If a messageId is provided, the message will be replaced.

  - `regenerate` `: ({ messageId, ...options }?: { messageId?: string; } & ChatRequestOptions) => Promise<void>`

    Regenerate the assistant message with the provided message id. If no message id is provided, the last assistant message will be regenerated.

  - `resumeStream` `: (options?: ChatRequestOptions) => Promise<void>`

    Attempt to resume an ongoing streaming response.

  - `addToolOutput` `: ChatAddToolOutputFunction<UI_MESSAGE>`

  - `addToolApprovalResponse` `: ChatAddToolApproveResponseFunction`

  - `clearError` `: () => void`

    Clear the error state and set the status to ready if the chat is in an error state.

- `options` `?: AISDKRuntimeAdapter`

  - `adapters` `?: (NonNullable<ExternalStoreAdapter["adapters"]> & { history?: ThreadHistoryAdapter | undefined; })`

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

    - `history` `?: ThreadHistoryAdapter`

      - `load` `: () => Promise<ExportedMessageRepository & { unstable_resume?: boolean; }>`

      - `resume` `?: (options: ChatModelRunOptions) => AsyncGenerator<ChatModelRunResult, void, unknown>`

      - `append` `: (item: ExportedMessageRepositoryItem) => Promise<void>`

      - `withFormat` `?: <TMessage, TStorageFormat extends Record<string, unknown>>(formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>) => GenericThreadHistoryAdapter<TMessage>`

        Required when used with \`useAISDKRuntime\` / \`useChatRuntime\`.

  - `toCreateMessage` `?: CustomToCreateMessageFunction`

  - `cancelPendingToolCallsOnSend` `: boolean` = true

    Whether to automatically cancel pending interactive tool calls when the user sends a new message. When enabled (default), the pending tool calls will be marked as failed with an error message indicating the user cancelled the tool call by sending a new message.

  - `onResume` `?: ExternalStoreAdapter["onResume"]`

    Called when \`runtime.thread.resumeRun(config)\` is invoked. When omitted, \`resumeRun\` throws \`"Runtime does not support resuming runs."\`. Provide this to bridge resume invocations into a custom replay channel (for example, an SSE reconnect endpoint keyed by turn id).

  - `suggestions` `?: readonly ThreadSuggestion[]`

    Follow up suggestions to surface on the thread. Use this to drive dynamic suggestions from application state, tool results, or backend responses; flows into \`thread.suggestions\` and is rendered by components that read it (such as the shadcn \`ThreadFollowupSuggestions\`).

### [useChatRuntime](#usechatruntime)

`useChatRuntime`

- `options` `?: UseChatRuntimeOptions<UI_MESSAGE>`

  - `id` `?: string`

    A unique identifier for the chat. If not provided, a random one will be generated.

  - `messageMetadataSchema` `?: FlexibleSchema<InferUIMessageMetadata<UI_MESSAGE>>`

  - `dataPartSchemas` `?: UIDataTypesToSchemas<InferUIMessageData<UI_MESSAGE>>`

  - `messages` `?: UI_MESSAGE[]`

  - `generateId` `?: IdGenerator`

    A way to provide a function that is going to be used for ids for messages and the chat. If not provided the default AI SDK \`generateId\` is used.

  - `transport` `?: ChatTransport<UI_MESSAGE>`

    - `sendMessages` `: (options: { /** The type of message submission - either new message or regeneration */ trigger: 'submit-message' | 'regenerate-message'; /** Unique identifier for the chat session */ chatId: string; /** ID of the message to regenerate, or undefined for new messages */ messageId: string | undefined; /** Array of UI messages representing the conversation history */ messages: UI_MESSAGE[]; /** Signal to abort the request if needed */ abortSignal: AbortSignal | undefined; } & ChatRequestOptions) => Promise<ReadableStream<UIMessageChunk>>`

      Sends messages to the chat API endpoint and returns a streaming response. This method handles both new message submission and message regeneration. It supports real-time streaming of responses through UIMessageChunk events.

    - `reconnectToStream` `: (options: { /** Unique identifier for the chat session to reconnect to */ chatId: string; } & ChatRequestOptions) => Promise<ReadableStream<UIMessageChunk> | null>`

      Reconnects to an existing streaming response for the specified chat session. This method is used to resume streaming when a connection is interrupted or when resuming a chat session. It's particularly useful for maintaining continuity in long-running conversations or recovering from network issues.

  - `onError` `?: ChatOnErrorCallback`

    Callback function to be called when an error is encountered.

  - `onToolCall` `?: ChatOnToolCallCallback<UI_MESSAGE>`

    Optional callback function that is invoked when a tool call is received. Intended for automatic client-side tool execution. You can optionally return a result for the tool call, either synchronously or asynchronously.

  - `onFinish` `?: ChatOnFinishCallback<UI_MESSAGE>`

    Function that is called when the assistant response has finished streaming.

  - `onData` `?: ChatOnDataCallback<UI_MESSAGE>`

    Optional callback function that is called when a data part is received.

  - `sendAutomaticallyWhen` `?: (options: { messages: UI_MESSAGE[]; }) => boolean | PromiseLike<boolean>`

    When provided, this function will be called when the stream is finished or a tool call is added to determine if the current messages should be resubmitted.

  - `cloud` `?: AssistantCloud`

    - `threads` `: AssistantCloudThreads`

      - `cloud` `: any`
      - `messages` `: AssistantCloudThreadMessages`
      - `list` `: (query?: AssistantCloudThreadsListQuery) => Promise<AssistantCloudThreadsListResponse>`
      - `get` `: (threadId: string) => Promise<CloudThread>`
      - `create` `: (body: AssistantCloudThreadsCreateBody) => Promise<AssistantCloudThreadsCreateResponse>`
      - `update` `: (threadId: string, body: AssistantCloudThreadsUpdateBody) => Promise<void>`
      - `delete` `: (threadId: string) => Promise<void>`

    - `auth` `: UseChatRuntimeOptions["cloud"]["auth"]`

      - `tokens` `: AssistantCloudAuthTokens`

    - `runs` `: AssistantCloudRuns`

      - `cloud` `: any`
      - `stream` `: (body: AssistantCloudRunsStreamBody) => Promise<AssistantStream>`
      - `report` `: (body: AssistantCloudRunReport) => Promise<{ run_id: string; }>`

    - `files` `: AssistantCloudFiles`

      - `cloud` `: any`
      - `pdfToImages` `: (body: PdfToImagesRequestBody) => Promise<PdfToImagesResponse>`
      - `generatePresignedUploadUrl` `: (body: GeneratePresignedUploadUrlRequestBody) => Promise<GeneratePresignedUploadUrlResponse>`

    - `telemetry` `: AssistantCloudTelemetryConfig`

      - `enabled` `?: boolean`

      - `beforeReport` `?: (report: AssistantCloudRunReport) => AssistantCloudRunReport | null`

        Called before each telemetry report is sent. Return a modified report to enrich it (e.g. add \`model\_id\`), or return \`null\` to skip the report.

  - `adapters` `?: AISDKRuntimeAdapter["adapters"]`

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

    - `history` `?: ThreadHistoryAdapter`

      - `load` `: () => Promise<ExportedMessageRepository & { unstable_resume?: boolean; }>`

      - `resume` `?: (options: ChatModelRunOptions) => AsyncGenerator<ChatModelRunResult, void, unknown>`

      - `append` `: (item: ExportedMessageRepositoryItem) => Promise<void>`

      - `withFormat` `?: <TMessage, TStorageFormat extends Record<string, unknown>>(formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>) => GenericThreadHistoryAdapter<TMessage>`

        Required when used with \`useAISDKRuntime\` / \`useChatRuntime\`.

  - `toCreateMessage` `?: CustomToCreateMessageFunction`

  - `onResume` `?: AISDKRuntimeAdapter["onResume"]`

  - `suggestions` `?: AISDKRuntimeAdapter["suggestions"]`

### [useThreadTokenUsage](#usethreadtokenusage)

`function useThreadTokenUsage(): ThreadTokenUsage;`