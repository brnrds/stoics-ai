# Primitive Hooks
URL: /docs/api-reference/hooks/primitives

Primitive hooks for reading scoped assistant-ui runtime state, viewport behavior, timing, and message part data inside React components.

## [API Reference](#api-reference)

### [useCloudThreadListAdapter](#usecloudthreadlistadapter)

`useCloudThreadListAdapter`

- `adapter` `: CloudThreadListAdapterOptions`

  - `cloud` `?: AssistantCloud`

    - `threads` `: AssistantCloudThreads`

      - `cloud` `: any`
      - `messages` `: AssistantCloudThreadMessages`
      - `list` `: (query?: AssistantCloudThreadsListQuery) => Promise<AssistantCloudThreadsListResponse>`
      - `get` `: (threadId: string) => Promise<CloudThread>`
      - `create` `: (body: AssistantCloudThreadsCreateBody) => Promise<AssistantCloudThreadsCreateResponse>`
      - `update` `: (threadId: string, body: AssistantCloudThreadsUpdateBody) => Promise<void>`
      - `delete` `: (threadId: string) => Promise<void>`

    - `auth` `: CloudThreadListAdapterOptions["cloud"]["auth"]`

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

  - `create` `?: (() => Promise<ThreadData>)`

  - `delete` `?: ((threadId: string) => Promise<void>)`

### [useEditComposerAttachment](#useeditcomposerattachment)

`const useEditComposerAttachment: { (): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }); <TSelected>(selector: (state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; })) => TSelected): TSelected; <TSelected>(selector: ((state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; })) => TSelected) | undefined): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | TSelected; (options: { optional?: false | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }); (options: { optional?: boolean | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | null; <TSelected>(options: { optional?: false | undefined; selector: (state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; })) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; })) => TSelected) | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; })) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; })) => TSelected) | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "edit-composer"; } & { source: "edit-composer"; }) | TSelected | null; };`

### [useEditComposerAttachmentRuntime](#useeditcomposerattachmentruntime)

`useEditComposerAttachmentRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useMessageAttachment](#usemessageattachment)

`const useMessageAttachment: { (): { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }; <TSelected>(selector: (state: { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) => TSelected): TSelected; <TSelected>(selector: ((state: { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) => TSelected) | undefined): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) | TSelected; (options: { optional?: false | undefined; }): { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }; (options: { optional?: boolean | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) | null; <TSelected>(options: { optional?: false | undefined; selector: (state: { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) => TSelected) | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: { id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) => TSelected) | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "message"; } & { source: "message"; }) | TSelected | null; };`

### [useMessageAttachmentRuntime](#usemessageattachmentruntime)

`useMessageAttachmentRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useMessageQuote](#usemessagequote)

Hook that returns the quote info for the current message, if any.

Reads from `message.metadata.custom.quote`.

`const useMessageQuote: () => QuoteInfo;`

### [useMessageTiming](#usemessagetiming)

Hook that returns timing information for the current assistant message.

Reads from `message.metadata.timing`.

`const useMessageTiming: () => MessageTiming;`

### [useRuntimeAdapters](#useruntimeadapters)

`type RuntimeAdapters = { modelContext?: ModelContextProvider | undefined; history?: ThreadHistoryAdapter | undefined; attachments?: AttachmentAdapter | undefined; }; const useRuntimeAdapters: () => RuntimeAdapters | null;`

### [useScrollLock](#usescrolllock)

Locks scroll position during collapsible/height animations and hides scrollbar.

This utility prevents page jumps when content height changes during animations, providing a smooth user experience. It finds the nearest scrollable ancestor and temporarily locks its scroll position while the animation completes.

- Prevents forced reflows: no layout reads, mutations scoped to scrollable parent only
- Reactive: only intercepts scroll events when browser actually adjusts
- Cleans up automatically after animation duration

`useScrollLock`

- `animatedElementRef` `: RefObject<T | null>`
- `animationDuration` `: number`

### [useThreadComposerAttachment](#usethreadcomposerattachment)

`const useThreadComposerAttachment: { (): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }); <TSelected>(selector: (state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; })) => TSelected): TSelected; <TSelected>(selector: ((state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; })) => TSelected) | undefined): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | TSelected; (options: { optional?: false | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }); (options: { optional?: boolean | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | null; <TSelected>(options: { optional?: false | undefined; selector: (state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; })) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; })) => TSelected) | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; })) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; })) => TSelected) | undefined; }): ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: PendingAttachmentStatus; file: File; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | ({ id: string; type: "image" | "document" | "file" | (string & {}); name: string; contentType?: string | undefined; file?: File; content?: ThreadUserMessagePart[]; } & { status: CompleteAttachmentStatus; content: ThreadUserMessagePart[]; } & { readonly source: "thread-composer"; } & { source: "thread-composer"; }) | TSelected | null; };`

### [useThreadComposerAttachmentRuntime](#usethreadcomposerattachmentruntime)

`useThreadComposerAttachmentRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useThreadViewport](#usethreadviewport)

`const useThreadViewport: { (): ThreadViewportState; <TSelected>(selector: (state: ThreadViewportState) => TSelected): TSelected; (options: { optional: true; }): ThreadViewportState | null; <TSelected>(options: { optional: true; selector?: (state: ThreadViewportState) => TSelected; }): TSelected | null; };`

### [useThreadViewportAutoScroll](#usethreadviewportautoscroll)

`useThreadViewportAutoScroll`

- `options` `: useThreadViewportAutoScroll.Options`

  - `autoScroll` `?: boolean`

    Whether to automatically scroll to the bottom when new messages are added. When enabled, the viewport will automatically scroll to show the latest content. Default false if \`turnAnchor\` is "top", otherwise defaults to true.

  - `scrollToBottomOnRunStart` `?: boolean`

    Whether to scroll to bottom when a new run starts. Defaults to true.

  - `scrollToBottomOnInitialize` `?: boolean`

    Whether to scroll to bottom when thread history is first loaded. Defaults to true.

  - `scrollToBottomOnThreadSwitch` `?: boolean`

    Whether to scroll to bottom when switching to a different thread. Defaults to true.

### [useThreadViewportStore](#usethreadviewportstore)

`const useThreadViewportStore: { (): ReadonlyStore<ThreadViewportState>; (options: { optional: true; }): ReadonlyStore<ThreadViewportState> | null; };`

### [useAssistantRuntime](#useassistantruntime)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useaui

useAui

instead. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

Hook to access the AssistantRuntime from the current context.

The AssistantRuntime provides access to the top-level assistant state and actions, including thread management, tool registration, and configuration.

`useAssistantRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useAttachment](#useattachment)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.attachment)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`const useAttachment: { (): AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }; <TSelected>(selector: (state: AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) => TSelected): TSelected; <TSelected>(selector: ((state: AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) => TSelected) | undefined): (AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) | TSelected; (options: { optional?: false | undefined; }): AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }; (options: { optional?: boolean | undefined; }): (AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) | null; <TSelected>(options: { optional?: false | undefined; selector: (state: AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) => TSelected) | undefined; }): (AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) => TSelected) | undefined; }): (AttachmentState & { source: "message" | "thread-composer" | "edit-composer"; }) | TSelected | null; };`

### [useAttachmentRuntime](#useattachmentruntime)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useaui

useAui

with `aui.attachment()` instead. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`useAttachmentRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useComposer](#usecomposer)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.composer)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

Hook to access the current composer state.

This hook provides reactive access to the composer's state, including text content, attachments, editing status, and send/cancel capabilities.

`const useComposer: { (): ComposerState; <TSelected>(selector: (state: ComposerState) => TSelected): TSelected; <TSelected>(selector: ((state: ComposerState) => TSelected) | undefined): ComposerState | TSelected; (options: { optional?: false | undefined; }): ComposerState; (options: { optional?: boolean | undefined; }): ComposerState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: ComposerState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: ComposerState) => TSelected) | undefined; }): ComposerState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: ComposerState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: ComposerState) => TSelected) | undefined; }): ComposerState | TSelected | null; };`

### [useComposerRuntime](#usecomposerruntime)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useaui

useAui

with `aui.composer()` instead. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

Hook to access the ComposerRuntime from the current context.

The ComposerRuntime provides access to composer state and actions for message composition, including text input, attachments, and sending functionality. This hook automatically resolves to either the message's edit composer or the thread's main composer depending on the context.

`useComposerRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useEditComposer](#useeditcomposer)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.message.composer)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`const useEditComposer: { (): EditComposerState; <TSelected>(selector: (state: EditComposerState) => TSelected): TSelected; <TSelected>(selector: ((state: EditComposerState) => TSelected) | undefined): EditComposerState | TSelected; (options: { optional?: false | undefined; }): EditComposerState; (options: { optional?: boolean | undefined; }): EditComposerState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: EditComposerState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: EditComposerState) => TSelected) | undefined; }): EditComposerState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: EditComposerState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: EditComposerState) => TSelected) | undefined; }): EditComposerState | TSelected | null; };`

### [useMessage](#usemessage)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.message)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

Hook to access the current message state.

This hook provides reactive access to the message's state, including content, role, status, and other message-level properties.

`const useMessage: { (): MessageState; <TSelected>(selector: (state: MessageState) => TSelected): TSelected; <TSelected>(selector: ((state: MessageState) => TSelected) | undefined): MessageState | TSelected; (options: { optional?: false | undefined; }): MessageState; (options: { optional?: boolean | undefined; }): MessageState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: MessageState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: MessageState) => TSelected) | undefined; }): MessageState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: MessageState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: MessageState) => TSelected) | undefined; }): MessageState | TSelected | null; };`

### [useMessagePart](#usemessagepart)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.part)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`const useMessagePart: { (): MessagePartState; <TSelected>(selector: (state: MessagePartState) => TSelected): TSelected; <TSelected>(selector: ((state: MessagePartState) => TSelected) | undefined): MessagePartState | TSelected; (options: { optional?: false | undefined; }): MessagePartState; (options: { optional?: boolean | undefined; }): MessagePartState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: MessagePartState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: MessagePartState) => TSelected) | undefined; }): MessagePartState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: MessagePartState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: MessagePartState) => TSelected) | undefined; }): MessagePartState | TSelected | null; };`

### [useMessagePartData](#usemessagepartdata)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

to select and narrow `s.part`. Return `null` for optional rendering, or throw inside the selector to preserve the old hook's strict behavior.

`useMessagePartData`

- `name` `?: string`

### [useMessagePartFile](#usemessagepartfile)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

to select and narrow `s.part`. Return `null` for optional rendering, or throw inside the selector to preserve the old hook's strict behavior.

`const useMessagePartFile: () => FileMessagePart & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; };`

### [useMessagePartImage](#usemessagepartimage)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

to select and narrow `s.part`. Return `null` for optional rendering, or throw inside the selector to preserve the old hook's strict behavior.

`const useMessagePartImage: () => ImageMessagePart & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; };`

### [useMessagePartReasoning](#usemessagepartreasoning)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

to select and narrow `s.part`. Return `null` for optional rendering, or throw inside the selector to preserve the old hook's strict behavior.

`const useMessagePartReasoning: () => ReasoningMessagePart & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; };`

### [useMessagePartRuntime](#usemessagepartruntime)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useaui

useAui

with `aui.part()` instead. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`useMessagePartRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useMessagePartSource](#usemessagepartsource)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

to select and narrow `s.part`. Return `null` for optional rendering, or throw inside the selector to preserve the old hook's strict behavior.

`const useMessagePartSource: () => ({ readonly type: "source"; readonly sourceType: "url"; readonly id: string; readonly url: string; readonly title?: string; readonly providerMetadata?: SourceProviderMetadata; readonly parentId?: string; } & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; }) | ({ readonly type: "source"; readonly sourceType: "document"; readonly id: string; readonly url?: undefined; readonly title: string; readonly mediaType: string; readonly filename?: string; readonly providerMetadata?: SourceProviderMetadata; readonly parentId?: string; } & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; });`

### [useMessagePartText](#usemessageparttext)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

to select and narrow `s.part`. Return `null` for optional rendering, or throw inside the selector to preserve the old hook's strict behavior.

`const useMessagePartText: () => (TextMessagePart & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; }) | (ReasoningMessagePart & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; });`

### [useMessageRuntime](#usemessageruntime)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useaui

useAui

with `aui.message()` instead. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

Hook to access the MessageRuntime from the current context.

The MessageRuntime provides access to message-level state and actions, including message content, status, editing capabilities, and branching.

`useMessageRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useThread](#usethread)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.thread)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

Hook to access the current thread state.

This hook provides reactive access to the thread's state, including messages, running status, capabilities, and other thread-level properties.

`const useThread: { (): ThreadState; <TSelected>(selector: (state: ThreadState) => TSelected): TSelected; <TSelected>(selector: ((state: ThreadState) => TSelected) | undefined): ThreadState | TSelected; (options: { optional?: false | undefined; }): ThreadState; (options: { optional?: boolean | undefined; }): ThreadState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: ThreadState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: ThreadState) => TSelected) | undefined; }): ThreadState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: ThreadState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: ThreadState) => TSelected) | undefined; }): ThreadState | TSelected | null; };`

### [useThreadComposer](#usethreadcomposer)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.thread.composer)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`const useThreadComposer: { (): ThreadComposerState; <TSelected>(selector: (state: ThreadComposerState) => TSelected): TSelected; <TSelected>(selector: ((state: ThreadComposerState) => TSelected) | undefined): ThreadComposerState | TSelected; (options: { optional?: false | undefined; }): ThreadComposerState; (options: { optional?: boolean | undefined; }): ThreadComposerState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: ThreadComposerState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: ThreadComposerState) => TSelected) | undefined; }): ThreadComposerState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: ThreadComposerState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: ThreadComposerState) => TSelected) | undefined; }): ThreadComposerState | TSelected | null; };`

### [useThreadList](#usethreadlist)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.threads)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`const useThreadList: { (): ThreadListState; <TSelected>(selector: (state: ThreadListState) => TSelected): TSelected; <TSelected>(selector: ((state: ThreadListState) => TSelected) | undefined): ThreadListState | TSelected; (options: { optional?: false | undefined; }): ThreadListState; (options: { optional?: boolean | undefined; }): ThreadListState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: ThreadListState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: ThreadListState) => TSelected) | undefined; }): ThreadListState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: ThreadListState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: ThreadListState) => TSelected) | undefined; }): ThreadListState | TSelected | null; };`

### [useThreadListItem](#usethreadlistitem)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.threadListItem)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`const useThreadListItem: { (): ThreadListItemState; <TSelected>(selector: (state: ThreadListItemState) => TSelected): TSelected; <TSelected>(selector: ((state: ThreadListItemState) => TSelected) | undefined): ThreadListItemState | TSelected; (options: { optional?: false | undefined; }): ThreadListItemState; (options: { optional?: boolean | undefined; }): ThreadListItemState | null; <TSelected>(options: { optional?: false | undefined; selector: (state: ThreadListItemState) => TSelected; }): TSelected; <TSelected>(options: { optional?: false | undefined; selector: ((state: ThreadListItemState) => TSelected) | undefined; }): ThreadListItemState | TSelected; <TSelected>(options: { optional?: boolean | undefined; selector: (state: ThreadListItemState) => TSelected; }): TSelected | null; <TSelected>(options: { optional?: boolean | undefined; selector: ((state: ThreadListItemState) => TSelected) | undefined; }): ThreadListItemState | TSelected | null; };`

### [useThreadListItemRuntime](#usethreadlistitemruntime)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useaui

useAui

with `aui.threadListItem()` instead. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`useThreadListItemRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`

### [useThreadRuntime](#usethreadruntime)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useaui

useAui

with `aui.thread()` instead. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

Hook to access the ThreadRuntime from the current context.

The ThreadRuntime provides access to thread-level state and actions, including message management, thread state, and composer functionality.

`useThreadRuntime`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`