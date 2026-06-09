# Persistence Adapters
URL: /docs/api-reference/adapters/persistence

Persistence adapters for saving assistant-ui message history, remote thread lists, and long-running chat sessions across browser reloads.

## [API Reference](#api-reference)

### [GenericThreadHistoryAdapter](#genericthreadhistoryadapter)

`GenericThreadHistoryAdapter`

- `load` `: () => Promise<MessageFormatRepository<TMessage>>`
- `append` `: (item: MessageFormatItem<TMessage>) => Promise<void>`
- `update` `?: (item: MessageFormatItem<TMessage>, localMessageId: string) => Promise<void>`
- `reportTelemetry` `?: (items: MessageFormatItem<TMessage>[], options?: { durationMs?: number; stepTimestamps?: { start_ms: number; end_ms: number; }[]; }) => void`

### [InMemoryThreadListAdapter](#inmemorythreadlistadapter)

`InMemoryThreadListAdapter`

- `list` `?: () => Promise<RemoteThreadListResponse>`
- `rename` `?: () => Promise<void>`
- `archive` `?: () => Promise<void>`
- `unarchive` `?: () => Promise<void>`
- `delete` `?: () => Promise<void>`
- `initialize` `?: (threadId: string) => Promise<RemoteThreadInitializeResponse>`
- `generateTitle` `?: () => Promise<AssistantStream>`
- `fetch` `?: (_threadId: string) => Promise<RemoteThreadMetadata>`

### [MessageFormatAdapter](#messageformatadapter)

`MessageFormatAdapter`

- `format` `: string`
- `encode` `: (item: MessageFormatItem<TMessage>) => TStorageFormat`
- `decode` `: (stored: MessageStorageEntry<TStorageFormat>) => MessageFormatItem<TMessage>`
- `getId` `: (message: TMessage) => string`

### [RemoteThreadListAdapter](#remotethreadlistadapter)

`const runtime = useRemoteThreadListRuntime({ adapter: myRemoteThreadListAdapter, runtimeHook: () => useLocalRuntime(chatModelAdapter), });`

`RemoteThreadListAdapter`

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

### [ThreadHistoryAdapter](#threadhistoryadapter)

`const runtime = useLocalRuntime(chatModelAdapter, { adapters: { history: myHistoryAdapter, }, });`

`ThreadHistoryAdapter`

- `load` `: () => Promise<ExportedMessageRepository & { unstable_resume?: boolean; }>`

- `resume` `?: (options: ChatModelRunOptions) => AsyncGenerator<ChatModelRunResult, void, unknown>`

- `append` `: (item: ExportedMessageRepositoryItem) => Promise<void>`

- `withFormat` `?: <TMessage, TStorageFormat extends Record<string, unknown>>(formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>) => GenericThreadHistoryAdapter<TMessage>`

  Required when used with \`useAISDKRuntime\` / \`useChatRuntime\`.