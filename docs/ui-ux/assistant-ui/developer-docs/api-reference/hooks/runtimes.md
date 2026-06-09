# Runtime Hooks
URL: /docs/api-reference/hooks/runtimes

Runtime creation hooks for local, remote, cloud, external-store, and AI SDK powered assistant-ui chat experiences.

## [API Reference](#api-reference)

### [useCloudThreadListRuntime](#usecloudthreadlistruntime)

`useCloudThreadListRuntime`

- `options` `: CloudThreadListAdapter`

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

  - `runtimeHook` `: () => AssistantRuntime`

  - `create` `?: () => Promise<ThreadData>`

  - `delete` `?: (threadId: string) => Promise<void>`

### [useLocalRuntime](#uselocalruntime)

`useLocalRuntime`

- `chatModel` `: ChatModelAdapter`

  - `run` `: (options: ChatModelRunOptions) => Promise<ChatModelRunResult> | AsyncGenerator<ChatModelRunResult, void>`

- `options` `?: LocalRuntimeOptions`

  - `maxSteps` `?: number`

  - `unstable_humanToolNames`

    - variant

      unstable

    `?: string[]`

    Names of tools that are allowed to interrupt the run in order to wait for human/external approval.

  - `cloud` `?: AssistantCloud`

    - `threads` `: AssistantCloudThreads`

      - `cloud` `: any`
      - `messages` `: AssistantCloudThreadMessages`
      - `list` `: (query?: AssistantCloudThreadsListQuery) => Promise<AssistantCloudThreadsListResponse>`
      - `get` `: (threadId: string) => Promise<CloudThread>`
      - `create` `: (body: AssistantCloudThreadsCreateBody) => Promise<AssistantCloudThreadsCreateResponse>`
      - `update` `: (threadId: string, body: AssistantCloudThreadsUpdateBody) => Promise<void>`
      - `delete` `: (threadId: string) => Promise<void>`

    - `auth` `: LocalRuntimeOptions["cloud"]["auth"]`

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

  - `initialMessages` `?: readonly ThreadMessageLike[]`

  - `adapters` `?: Omit<LocalRuntimeOptionsBase["adapters"], "chatModel">`

    - `suggestion` `?: SuggestionAdapter`

      - `generate` `: ( options: SuggestionAdapterGenerateOptions, ) => | Promise<readonly ThreadSuggestion[]> | AsyncGenerator<readonly ThreadSuggestion[], void>`

    - `attachments` `?: AttachmentAdapter`

      - `accept` `: string`
      - `add` `: (state: { file: File; }) => Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void>`
      - `remove` `: (attachment: Attachment) => Promise<void>`
      - `send` `: (attachment: PendingAttachment) => Promise<CompleteAttachment>`

    - `dictation` `?: DictationAdapter`

      - `listen` `: () => DictationAdapter.Session`
      - `disableInputDuringDictation` `?: boolean`

    - `speech` `?: SpeechSynthesisAdapter`

      - `speak` `: (text: string) => SpeechSynthesisAdapter.Utterance`

    - `voice` `?: RealtimeVoiceAdapter`

      - `connect` `: (options: { abortSignal?: AbortSignal; }) => RealtimeVoiceAdapter.Session`

    - `feedback` `?: FeedbackAdapter`

      - `submit` `: (feedback: FeedbackAdapterFeedback) => void`

    - `history` `?: ThreadHistoryAdapter`

      - `load` `: () => Promise<ExportedMessageRepository & { unstable_resume?: boolean; }>`

      - `resume` `?: (options: ChatModelRunOptions) => AsyncGenerator<ChatModelRunResult, void, unknown>`

      - `append` `: (item: ExportedMessageRepositoryItem) => Promise<void>`

      - `withFormat` `?: <TMessage, TStorageFormat extends Record<string, unknown>>(formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>) => GenericThreadHistoryAdapter<TMessage>`

        Required when used with \`useAISDKRuntime\` / \`useChatRuntime\`.

### [useRemoteThreadListRuntime](#useremotethreadlistruntime)

`useRemoteThreadListRuntime`

- `options` `: RemoteThreadListOptions`

  - `runtimeHook` `: () => AssistantRuntime`

  - `adapter` `: RemoteThreadListAdapter`

    - `list` `: (params?: RemoteThreadListPageOptions) => Promise<RemoteThreadListResponse>`

    - `rename` `: (remoteId: string, newTitle: string) => Promise<void>`

    - `archive` `: (remoteId: string) => Promise<void>`

    - `unarchive` `: (remoteId: string) => Promise<void>`

    - `delete` `: (remoteId: string) => Promise<void>`

    - `initialize` `: (threadId: string) => Promise<RemoteThreadInitializeResponse>`

    - `generateTitle` `: (remoteId: string, unstable_messages: readonly ThreadMessage[]) => Promise<AssistantStream>`

    - `fetch` `: (threadId: string) => Promise<RemoteThreadMetadata>`

    - `unstable_Provider`

      - variant

        unstable

      `?: ComponentType<PropsWithChildren>`

      Optional React component wrapped around each active thread. Use it to inject per-thread context such as a history or attachments adapter (see \`useCloudThreadListAdapter\` for the canonical shape). The Provider must render \`children\` on its first commit; deferring them behind a loading state, a Suspense boundary, or a \`useEffect\`-gated render is unsupported and leaves thread context unavailable to downstream consumers. Load data inside an always-mounted child instead.

  - `initialThreadId`

    - variant

      deprecated

    `?: string`

    When provided, the runtime starts on this thread instead of creating a new empty thread. Useful for URL-based routing (e.g. \`/chat/\[threadId]\`) where the initial thread is known at mount time.

    Deprecated: Use \`threadId\` instead, which also reacts to subsequent changes.

  - `threadId` `?: string`

    The current thread ID to display. When this value changes, the runtime automatically switches to the specified thread. Set to \`undefined\` to switch to a new thread.

  - `allowNesting` `?: boolean`

    When true, if this runtime is used inside another RemoteThreadListRuntime, it becomes a no-op and simply calls the runtimeHook directly. This allows wrapping runtimes that internally use RemoteThreadListRuntime.