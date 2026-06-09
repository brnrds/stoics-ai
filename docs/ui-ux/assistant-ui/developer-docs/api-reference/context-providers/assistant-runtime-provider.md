# AssistantRuntimeProvider
URL: /docs/api-reference/context-providers/assistant-runtime-provider

Root React provider that connects an assistant-ui runtime to primitives, hooks, threads, and composer state.

## [API Reference](#api-reference)

### [AssistantRuntimeProvider](#assistantruntimeprovider)

`import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"; const MyApp = () => { const runtime = useChatRuntime({ transport: new AssistantChatTransport({ api: "/api/chat", }), }); return ( <AssistantRuntimeProvider runtime={runtime}> {/* your app */} </AssistantRuntimeProvider> ); };`

`AssistantRuntimeProvider`

- `runtime` `: AssistantRuntime`

  The assistant runtime to expose to descendants. Build one with \`useLocalRuntime\`, \`useExternalStoreRuntime\`, or \`useAssistantTransportRuntime\`.

  - `threads` `: ThreadListRuntime`

    The threads in this assistant.

    - `getState` `: () => ThreadListState`

    - `subscribe` `: (callback: () => void) => Unsubscribe`

    - `main` `: ThreadRuntime`

      - `path` `: ThreadRuntimePath`

        The selector for the thread runtime.

      - `composer` `: ThreadComposerRuntime`

        The thread composer runtime.

      - `getState` `: () => ThreadState`

        Gets a snapshot of the thread state.

      - `append` `: (message: CreateAppendMessage) => void`

        Append a new message to the thread.

      - `startRun` `: (config: CreateStartRunConfig) => void`

        Start a new run with the given configuration.

      - `resumeRun` `: (config: CreateResumeRunConfig) => void`

        Resume a run with the given configuration.

      - `exportExternalState` `: () => any`

        Export the thread state in the external store format. For AI SDK runtimes, this returns the AI SDK message format. For other runtimes, this may return different formats or throw an error.

      - `importExternalState` `: (state: any) => void`

        Import thread state from the external store format. For AI SDK runtimes, this accepts AI SDK messages. For other runtimes, this may accept different formats or throw an error.

      - `subscribe` `: (callback: () => void) => Unsubscribe`

      - `cancelRun` `: () => void`

      - `getModelContext` `: () => ModelContext`

      - `export` `: () => ExportedMessageRepository`

      - `import` `: (repository: ExportedMessageRepository) => void`

      - `reset` `: (initialMessages?: readonly ThreadMessageLike[]) => void`

        Reset the thread with optional initial messages.

      - `getMessageByIndex` `: (idx: number) => MessageRuntime`

      - `getMessageById` `: (messageId: string) => MessageRuntime`

      - `stopSpeaking`

        - variant

          deprecated

        `: () => void`

        Deprecated: This API is still under active development and might change without notice.

      - `connectVoice` `: () => void`

      - `disconnectVoice` `: () => void`

      - `getVoiceVolume` `: () => number`

      - `subscribeVoiceVolume` `: (callback: () => void) => Unsubscribe`

      - `muteVoice` `: () => void`

      - `unmuteVoice` `: () => void`

      - `unstable_on`

        - variant

          unstable

        `: <E extends ThreadRuntimeEventType>(event: E, callback: ThreadRuntimeEventCallback<E>) => Unsubscribe`

    - `getById` `: (threadId: string) => ThreadRuntime`

    - `mainItem` `: ThreadListItemRuntime`

      - `path` `: ThreadListItemRuntimePath`

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

    - `getItemById` `: (threadId: string) => ThreadListItemRuntime`

    - `getItemByIndex` `: (idx: number) => ThreadListItemRuntime`

    - `getArchivedItemByIndex` `: (idx: number) => ThreadListItemRuntime`

    - `switchToThread` `: (threadId: string) => Promise<void>`

    - `switchToNewThread` `: () => Promise<void>`

    - `getLoadThreadsPromise` `: () => Promise<void>`

    - `reload` `: () => Promise<void>`

    - `loadMore` `: () => Promise<void>`

  - `thread` `: ThreadRuntime`

    The currently selected main thread. Equivalent to \`threads.main\`.

    - `path` `: ThreadRuntimePath`

      The selector for the thread runtime.

      - `ref` `: string`
      - `threadSelector` `: { readonly type: "main" } | { readonly type: "threadId"; readonly threadId: string; }`

    - `composer` `: ThreadComposerRuntime`

      The thread composer runtime.

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

      - `unstable_on`

        - variant

          deprecated

        * variant

          unstable

        `: <E extends ComposerRuntimeEventType>(event: E, callback: ComposerRuntimeEventCallback<E>) => Unsubscribe`

        Deprecated: This API is still under active development and might change without notice.

      - `getState` `: () => ThreadComposerState`

      - `getAttachmentByIndex` `: (idx: number) => AttachmentRuntime & { source: "thread-composer"; }`

    - `getState` `: () => ThreadState`

      Gets a snapshot of the thread state.

    - `append` `: (message: CreateAppendMessage) => void`

      Append a new message to the thread.

    - `startRun` `: (config: CreateStartRunConfig) => void`

      Start a new run with the given configuration.

    - `resumeRun` `: (config: CreateResumeRunConfig) => void`

      Resume a run with the given configuration.

    - `exportExternalState` `: () => any`

      Export the thread state in the external store format. For AI SDK runtimes, this returns the AI SDK message format. For other runtimes, this may return different formats or throw an error.

    - `importExternalState` `: (state: any) => void`

      Import thread state from the external store format. For AI SDK runtimes, this accepts AI SDK messages. For other runtimes, this may accept different formats or throw an error.

    - `subscribe` `: (callback: () => void) => Unsubscribe`

    - `cancelRun` `: () => void`

    - `getModelContext` `: () => ModelContext`

    - `export` `: () => ExportedMessageRepository`

    - `import` `: (repository: ExportedMessageRepository) => void`

    - `reset` `: (initialMessages?: readonly ThreadMessageLike[]) => void`

      Reset the thread with optional initial messages.

    - `getMessageByIndex` `: (idx: number) => MessageRuntime`

    - `getMessageById` `: (messageId: string) => MessageRuntime`

    - `stopSpeaking`

      - variant

        deprecated

      `: () => void`

      Deprecated: This API is still under active development and might change without notice.

    - `connectVoice` `: () => void`

    - `disconnectVoice` `: () => void`

    - `getVoiceVolume` `: () => number`

    - `subscribeVoiceVolume` `: (callback: () => void) => Unsubscribe`

    - `muteVoice` `: () => void`

    - `unmuteVoice` `: () => void`

    - `unstable_on`

      - variant

        unstable

      `: <E extends ThreadRuntimeEventType>(event: E, callback: ThreadRuntimeEventCallback<E>) => Unsubscribe`

  - `registerModelContextProvider` `: (provider: ModelContextProvider) => Unsubscribe`

    Register a model context provider. Model context providers are configuration such as system message, temperature, etc. that are set in the frontend.

- `aui` `?: AssistantClient`

  Optional parent \`AssistantClient\` whose scopes are inherited by the client created for this runtime. Use this when nesting an \`AssistantRuntimeProvider\` inside another assistant context. Omit this prop when there is no parent client.

  - `threads` `: AssistantClientAccessor<"threads">`
  - `threadListItem` `: AssistantClientAccessor<"threadListItem">`
  - `thread` `: AssistantClientAccessor<"thread">`
  - `message` `: AssistantClientAccessor<"message">`
  - `part` `: AssistantClientAccessor<"part">`
  - `composer` `: AssistantClientAccessor<"composer">`
  - `attachment` `: AssistantClientAccessor<"attachment">`
  - `modelContext` `: AssistantClientAccessor<"modelContext">`
  - `suggestions` `: AssistantClientAccessor<"suggestions">`
  - `suggestion` `: AssistantClientAccessor<"suggestion">`
  - `chainOfThought` `: AssistantClientAccessor<"chainOfThought">`
  - `queueItem` `: AssistantClientAccessor<"queueItem">`
  - `tools` `: AssistantClientAccessor<"tools">`
  - `dataRenderers` `: AssistantClientAccessor<"dataRenderers">`
  - `interactables` `: AssistantClientAccessor<"interactables">`
  - `subscribe` `: (listener: () => void) => Unsubscribe`
  - `on` `: <TEvent extends AssistantEventName>(selector: AssistantEventSelector<TEvent>, callback: AssistantEventCallback<TEvent>) => Unsubscribe`

### [AuiProvider](#auiprovider)

Supplies an `AssistantClient` to the React tree.

Place near the root of any subtree that uses

- href

  /docs/api-reference/hooks/state#useaui

useAui

or the primitives built on it. Components rendered outside an `AuiProvider` receive a default client whose scope accessors throw on use, so missing-provider mistakes surface at the point of use.

When mounting a runtime built with one of the runtime hooks, use

- href

  /docs/api-reference/context-providers/assistant-runtime-provider#assistantruntimeprovider

AssistantRuntimeProvider

— it installs an `AuiProvider` internally — rather than wiring `AuiProvider` yourself.

`AuiProvider props`

- `value` `: AssistantClient`

  Assistant client to expose to descendants.

  - `threads` `: AssistantClientAccessor<"threads">`
  - `threadListItem` `: AssistantClientAccessor<"threadListItem">`
  - `thread` `: AssistantClientAccessor<"thread">`
  - `message` `: AssistantClientAccessor<"message">`
  - `part` `: AssistantClientAccessor<"part">`
  - `composer` `: AssistantClientAccessor<"composer">`
  - `attachment` `: AssistantClientAccessor<"attachment">`
  - `modelContext` `: AssistantClientAccessor<"modelContext">`
  - `suggestions` `: AssistantClientAccessor<"suggestions">`
  - `suggestion` `: AssistantClientAccessor<"suggestion">`
  - `chainOfThought` `: AssistantClientAccessor<"chainOfThought">`
  - `queueItem` `: AssistantClientAccessor<"queueItem">`
  - `tools` `: AssistantClientAccessor<"tools">`
  - `dataRenderers` `: AssistantClientAccessor<"dataRenderers">`
  - `interactables` `: AssistantClientAccessor<"interactables">`
  - `subscribe` `: (listener: () => void) => Unsubscribe`
  - `on` `: <TEvent extends AssistantEventName>(selector: AssistantEventSelector<TEvent>, callback: AssistantEventCallback<TEvent>) => Unsubscribe`

- `children` `?: React.ReactNode`

  Subtree that may read from the client.