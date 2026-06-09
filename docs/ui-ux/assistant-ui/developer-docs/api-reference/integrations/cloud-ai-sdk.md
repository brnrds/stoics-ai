# @assistant-ui/cloud-ai-sdk
URL: /docs/api-reference/integrations/cloud-ai-sdk

Assistant Cloud AI SDK hooks for connecting cloud-backed threads, persistence, and chat state to assistant-ui React runtimes.

## [API Reference](#api-reference)

### [useCloudChat](#usecloudchat)

`useCloudChat`

- `options` `?: UseCloudChatOptions`

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

  - `threads` `?: UseThreadsResult`

    - `cloud` `: AssistantCloud`

      - `threads` `: AssistantCloudThreads`
      - `auth` `: { tokens: AssistantCloudAuthTokens; }`
      - `runs` `: AssistantCloudRuns`
      - `files` `: AssistantCloudFiles`
      - `telemetry` `: AssistantCloudTelemetryConfig`

    - `threads` `: CloudThread[]`

    - `isLoading` `: boolean`

    - `error` `: Error | null`

      - `name` `: string`
      - `message` `: string`
      - `stack` `?: string`
      - `cause` `?: unknown`

    - `refresh` `: () => Promise<boolean>`

    - `get` `: (id: string) => Promise<CloudThread | null>`

    - `create` `: (options?: { externalId?: string }) => Promise<CloudThread | null>`

    - `delete` `: (id: string) => Promise<boolean>`

    - `rename` `: (id: string, title: string) => Promise<boolean>`

    - `archive` `: (id: string) => Promise<boolean>`

    - `unarchive` `: (id: string) => Promise<boolean>`

    - `threadId` `: string | null`

    - `selectThread` `: (id: string | null) => void`

    - `generateTitle` `: (threadId: string) => Promise<string | null>`

  - `cloud` `?: AssistantCloud`

    - `threads` `: AssistantCloudThreads`

      - `cloud` `: any`
      - `messages` `: AssistantCloudThreadMessages`
      - `list` `: (query?: AssistantCloudThreadsListQuery) => Promise<AssistantCloudThreadsListResponse>`
      - `get` `: (threadId: string) => Promise<CloudThread>`
      - `create` `: (body: AssistantCloudThreadsCreateBody) => Promise<AssistantCloudThreadsCreateResponse>`
      - `update` `: (threadId: string, body: AssistantCloudThreadsUpdateBody) => Promise<void>`
      - `delete` `: (threadId: string) => Promise<void>`

    - `auth` `: AssistantCloud["auth"]`

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

  - `onSyncError` `?: (error: Error) => void`

### [useThreads](#usethreads)

`useThreads`

- `options` `: UseThreadsOptions`

  - `cloud` `: AssistantCloud`

    - `threads` `: AssistantCloudThreads`

      - `cloud` `: any`
      - `messages` `: AssistantCloudThreadMessages`
      - `list` `: (query?: AssistantCloudThreadsListQuery) => Promise<AssistantCloudThreadsListResponse>`
      - `get` `: (threadId: string) => Promise<CloudThread>`
      - `create` `: (body: AssistantCloudThreadsCreateBody) => Promise<AssistantCloudThreadsCreateResponse>`
      - `update` `: (threadId: string, body: AssistantCloudThreadsUpdateBody) => Promise<void>`
      - `delete` `: (threadId: string) => Promise<void>`

    - `auth` `: AssistantCloud["auth"]`

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

  - `includeArchived` `?: boolean`

  - `enabled` `?: boolean`