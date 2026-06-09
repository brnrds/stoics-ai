# Threads
URL: /docs/runtimes/concepts/threads

Single-thread, cloud, and custom-database thread management.

Every assistant-ui runtime starts with a single in-memory thread. Multi-thread support is added through one of three mechanisms depending on which runtime you are using and where you want threads to live.

## [Single thread (default)](#single-thread-default)

With no thread configuration, the runtime renders one thread that resets when the page reloads. Fine for prototypes, demos, and stateless interactions.

If you only want session persistence (single thread, durable across reloads), provide a

- href

  /docs/runtimes/concepts/adapters#history-adapter

history adapter

instead of going to multi-thread.

## [Multi-thread paths](#multi-thread-paths)

Three options. Choose based on what you want to own.

| Path                           | Runtime                               | Who owns thread metadata | Best for                                             |
| ------------------------------ | ------------------------------------- | ------------------------ | ---------------------------------------------------- |
| AssistantCloud                 | LocalRuntime and adapters built on it | assistant-cloud          | You want it managed; auth, sync, persistence handled |
| RemoteThreadListRuntime        | LocalRuntime and adapters built on it | Your database            | You have your own backend and want full control      |
| ExternalStoreThreadListAdapter | ExternalStoreRuntime only             | Your store               | You keep state in redux, zustand, etc.               |

## [AssistantCloud](#assistantcloud)

`AssistantCloud` is the managed multi-thread service. Pass an instance to `useLocalRuntime` (or any adapter built on it) and threads, persistence, sync, and titles are handled for you.

`import { useLocalRuntime } from "@assistant-ui/react"; import { AssistantCloud } from "assistant-cloud"; const cloud = new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL, anonymous: true, }); const runtime = useLocalRuntime(modelAdapter, { cloud });`

Framework adapters take `cloud` directly:

`const runtime = useChatRuntime({ cloud }); const runtime = useLangGraphRuntime({ cloud /* stream, load, ... */ }); const runtime = useAdkRuntime({ cloud, stream });`

See the

- href

  /docs/cloud

cloud documentation

for setup, auth, and self-host options.

## [RemoteThreadListRuntime (custom database)](#remotethreadlistruntime-custom-database)

`useRemoteThreadListRuntime` lets you back the thread list with any database while keeping the per-thread runtime simple. You provide a `RemoteThreadListAdapter` describing how to list, create, rename, archive, and delete threads.

Works with any `LocalRuntime`-based runtime, including framework adapters that build on it (`react-ai-sdk`, `react-google-adk`, `react-a2a`, `useDataStreamRuntime`).

- title

  app/MyProvider.tsx

``"use client"; import { AssistantRuntimeProvider, useLocalRuntime, useRemoteThreadListRuntime, type RemoteThreadListAdapter, } from "@assistant-ui/react"; import { createAssistantStream } from "assistant-stream"; import { modelAdapter } from "./model-adapter"; const adapter: RemoteThreadListAdapter = { async list() { const threads = await fetch("/api/threads").then((r) => r.json()); return { threads: threads.map((t: any) => ({ status: t.archived ? "archived" : "regular", remoteId: t.id, title: t.title, })), }; }, async initialize(localId) { const t = await fetch("/api/threads", { method: "POST", body: JSON.stringify({ localId }), }).then((r) => r.json()); return { remoteId: t.id }; }, async rename(remoteId, title) { await fetch(`/api/threads/${remoteId}`, { method: "PATCH", body: JSON.stringify({ title }), }); }, async archive(remoteId) { await fetch(`/api/threads/${remoteId}/archive`, { method: "POST" }); }, async unarchive(remoteId) { await fetch(`/api/threads/${remoteId}/unarchive`, { method: "POST" }); }, async delete(remoteId) { await fetch(`/api/threads/${remoteId}`, { method: "DELETE" }); }, async fetch(remoteId) { const t = await fetch(`/api/threads/${remoteId}`).then((r) => r.json()); return { status: t.archived ? "archived" : "regular", remoteId: t.id, title: t.title, }; }, async generateTitle(remoteId, messages) { return createAssistantStream(async (controller) => { const { title } = await fetch(`/api/threads/${remoteId}/title`, { method: "POST", body: JSON.stringify({ messages }), }).then((r) => r.json()); controller.appendText(title); }); }, }; export function MyProvider({ children }: { children: React.ReactNode }) { const runtime = useRemoteThreadListRuntime({ runtimeHook: () => useLocalRuntime(modelAdapter), adapter, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }``

### [Persisting messages with `unstable_Provider`](#persisting-messages-with-unstable_provider)

`RemoteThreadListAdapter` only manages thread metadata. To persist messages within each thread, expose a thread-scoped history adapter via the optional `unstable_Provider`:

``import { RuntimeAdapterProvider, useAui, type ThreadHistoryAdapter, } from "@assistant-ui/react"; import { useMemo } from "react"; const adapterWithHistory: RemoteThreadListAdapter = { // ...metadata methods above... unstable_Provider({ children }) { const aui = useAui(); const history = useMemo<ThreadHistoryAdapter>( () => ({ async load() { const { remoteId } = aui.threadListItem().getState(); if (!remoteId) return { messages: [] }; const rows = await fetch( `/api/threads/${remoteId}/messages`, ).then((r) => r.json()); return { messages: rows.map(toThreadMessage) }; }, async append({ message, parentId }) { const { remoteId } = await aui.threadListItem().initialize(); await fetch(`/api/threads/${remoteId}/messages`, { method: "POST", body: JSON.stringify({ message, parentId }), }); }, }), [aui], ); return ( <RuntimeAdapterProvider adapters={{ history }}> {children} </RuntimeAdapterProvider> ); }, };``

`unstable_Provider` must render `children` synchronously on first commit. Do not gate `children` behind a loading state, suspense, or `useEffect`. If you need to load data before the thread is usable, do it inside an always-rendered child (for example via the history adapter), not by withholding `children`.

### [Avoiding the first-message race](#avoiding-the-first-message-race)

`append` may be called before the thread record exists in your backend. Always await `aui.threadListItem().initialize()` before writing:

`async append({ message, parentId }) { const { remoteId } = await aui.threadListItem().initialize(); await saveMessage(remoteId, parentId, message); }`

`initialize()` is safe to call multiple times. It always resolves to the same `remoteId` for the active thread.

### [Reloading after async authentication](#reloading-after-async-authentication)

If your adapter depends on a user that resolves asynchronously (oidc, `next-auth`, `better-auth`), the initial `list()` may run before the user is available. Call `aui.threads().reload()` after auth completes:

`function ReloadOnAuth() { const aui = useAui(); const { isLoading, user } = useAuth(); useEffect(() => { if (!isLoading && user) aui.threads().reload(); }, [isLoading, user?.id]); return null; }`

`reload()` discards in-flight responses from superseded calls, so it is safe to invoke on every auth transition.

### [Paginating the thread list](#paginating-the-thread-list)

If your backend returns thread pages, return a `nextCursor` from `list()` and consume `aui.threads().hasMore` plus `aui.threads().loadMore()` in the UI. The runtime threads `params.after` back through `list()` on every `loadMore()`; the initial call passes no `params`, so treat a missing `after` as "first page". `reload()` resets the cursor so the next load starts from page 1 again.

- title

  threadListAdapter.ts (excerpt)

`async list({ after } = {}) { const url = new URL("/api/threads", location.origin); if (after) url.searchParams.set("after", after); const response = await fetch(url); const { threads, next_cursor } = await response.json(); return { threads: threads.map((thread) => ({ remoteId: thread.id, status: thread.is_archived ? "archived" : "regular", title: thread.title ?? undefined, })), nextCursor: next_cursor ?? undefined, }; },`

For a button-driven UI, drop `<ThreadListPrimitive.LoadMore>` at the bottom of your list. It ships disabled while the runtime is loading or when no `nextCursor` is available. To trigger it on scroll instead, wrap the same primitive in an `IntersectionObserver` at the application layer; assistant-ui leaves visibility-driven loading to userland by design.

- title

  ThreadList.tsx

`import { ThreadListPrimitive, ThreadListItemPrimitive, } from "@assistant-ui/react"; export function ThreadList() { return ( <ThreadListPrimitive.Root> <ThreadListPrimitive.Items> {() => ( <ThreadListItemPrimitive.Root> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title /> </ThreadListItemPrimitive.Trigger> </ThreadListItemPrimitive.Root> )} </ThreadListPrimitive.Items> <ThreadListPrimitive.LoadMore>Load more</ThreadListPrimitive.LoadMore> </ThreadListPrimitive.Root> ); }`

A few invariants worth knowing when wiring a custom UI on top of `loadMore()`:

- **Empty-string cursors collapse to "no more pages".** `nextCursor: ""` is treated the same as `nextCursor: undefined`, so an off-by-one in your backend that returns an empty cursor will not loop forever.
- **Concurrent `loadMore()` calls are deduped.** The runtime keeps a single in-flight promise per page, so calling `loadMore()` from a sentinel and a button at the same time issues only one network request.
- **Page errors are swallowed.** If `list({ after })` rejects, the cursor is preserved and the next `loadMore()` retries with the same `after` value. The promise returned to the caller resolves regardless. Surface adapter errors yourself if you need user-visible feedback.

### [Adapter contract](#adapter-contract)

`RemoteThreadListAdapter`

- `list` `: (params?: { after?: string }) => Promise<{ threads: RemoteThreadMetadata[]; nextCursor?: string }>`

  Hydrate threads on mount. Each thread must include status and remoteId; title, externalId, and custom are optional. Return a \`nextCursor\` to enable \`aui.threads().loadMore()\`; the runtime will pass it back as \`params.after\` on the next call.

- `initialize` `: (localId: string) => Promise<{ remoteId: string; externalId?: string }>`

  Create a new remote record when the user starts a conversation. Return the canonical ids.

- `rename` `: (remoteId: string, title: string) => Promise<void>`

  Persist title changes from the UI.

- `archive` `: (remoteId: string) => Promise<void>`

  Mark thread archived.

- `unarchive` `: (remoteId: string) => Promise<void>`

  Restore an archived thread.

- `delete` `: (remoteId: string) => Promise<void>`

  Permanently remove the thread.

- `fetch` `: (threadId: string) => Promise<RemoteThreadMetadata>`

  Fetch metadata for a single thread when switching.

- `generateTitle` `: (remoteId: string, messages: readonly ThreadMessage[]) => Promise<AssistantStream>`

  Stream a title back. Use createAssistantStream and controller.appendText.

- `unstable_Provider`

  - variant

    unstable

  `?: ComponentType<PropsWithChildren>`

  Optional wrapper rendered around each active thread. Inject thread-scoped adapters (history, attachments) here.

### [Custom metadata](#custom-metadata)

`RemoteThreadMetadata` includes an optional `custom?: Record<string, unknown>` slot for backend-specific fields (timestamps, owner ids, workspace ids, tags, model name). Whatever you return from `list()` and `fetch()` flows through to the thread list item state and is reachable from any UI primitive via `useAuiState`.

`type MyThreadMetadata = RemoteThreadMetadata & { readonly custom: { readonly createdAt: string; readonly ownerId: string; }; };` `import { useAuiState } from "@assistant-ui/react"; function ThreadListItemMeta() { const custom = useAuiState( (s) => s.threadListItem.custom as MyThreadMetadata["custom"] | undefined, ); return ( <span> {custom?.ownerId} · {custom?.createdAt} </span> ); }`

`custom` is preserved across `rename`, `archive`, `unarchive`, and `generateTitle`. To mutate it, return updated values from a subsequent `fetch()` or call `runtime.threads.reload()`.

## [ExternalStoreThreadListAdapter](#externalstorethreadlistadapter)

For `ExternalStoreRuntime` users only. Wires multi-thread support into an external state store.

`const threadListAdapter: ExternalStoreThreadListAdapter = { threadId: currentThreadId, threads: threadList.filter((t) => t.status === "regular"), archivedThreads: threadList.filter((t) => t.status === "archived"), onSwitchToNewThread: () => { /* create + switch */ }, onSwitchToThread: (id) => setCurrentThreadId(id), onRename: (id, title) => { /* update */ }, onArchive: (id) => { /* archive */ }, onUnarchive: (id) => { /* unarchive */ }, onDelete: (id) => { /* delete */ }, }; const runtime = useExternalStoreRuntime({ messages: threads.get(currentThreadId) ?? [], setMessages: (messages) => setThreads((m) => new Map(m).set(currentThreadId, messages)), onNew, adapters: { threadList: threadListAdapter }, });`

Unlike `RemoteThreadListAdapter`, this adapter is synchronous and inline. You keep thread metadata and messages in your own store; the runtime just renders what you provide.

The runtime's `currentThreadId` and your store's selected thread must stay in sync. Mismatched thread ids cause messages to appear in the wrong thread or vanish entirely. Centralize thread id state in a context, never in component-local state.

## [Choosing](#choosing)

Ask three questions in order:

1. **Do you want it managed?** Use `AssistantCloud`. You do not write database code.
2. **Do you have your own backend?** Use `RemoteThreadListRuntime` if you are on `LocalRuntime` (or any adapter built on it). You implement the adapter, you own the data.
3. **Are you on `ExternalStoreRuntime`?** Use `ExternalStoreThreadListAdapter`. Threads live in your store next to messages.

## [Related](#related)

- href

  /docs/runtimes/concepts/adapters

AdaptersThe shared adapter contracts (attachments, history, speech, feedback).

- href

  /docs/runtimes/concepts/architecture

ArchitectureThe three-layer runtime model and how threads flow through it.

- href

  /docs/cloud

AssistantCloudThe managed multi-thread service.