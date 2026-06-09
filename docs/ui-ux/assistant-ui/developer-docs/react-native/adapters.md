# Adapters
URL: /docs/react-native/adapters

Persistence and title generation adapters for React Native.

Adapters customize runtime behavior. They can be passed as options to `useLocalRuntime` or `useRemoteThreadListRuntime`.

## [Persistence](#persistence)

By default, `useLocalRuntime` stores threads and messages in memory only -- they are lost when the app restarts. To persist data, use one of these approaches:

### [Assistant Cloud](#assistant-cloud)

The simplest way to add persistence. Pass a `cloud` option to `useLocalRuntime`:

`import { useLocalRuntime } from "@assistant-ui/react-native"; import { AssistantCloud } from "@assistant-ui/cloud"; const cloud = new AssistantCloud({ baseUrl: "https://backend.assistant-ui.com", authToken: () => fetchTokenFromYourBackend(), }); const runtime = useLocalRuntime(chatModel, { cloud });`

This gives you multi-thread support with server-side persistence, cross-device sync, and automatic title generation.

### [History adapter](#history-adapter)

For custom persistence (e.g. saving message history to your own backend), pass a `ThreadHistoryAdapter` via `adapters.history`:

`import { useLocalRuntime } from "@assistant-ui/react-native"; import type { ThreadHistoryAdapter } from "@assistant-ui/react-native"; const myHistoryAdapter: ThreadHistoryAdapter = { async load() { // Load saved messages from your storage const data = await fetchMessagesFromBackend(); return data; // { headId, messages } }, async append(item) { // Persist a new message await saveMessageToBackend(item); }, }; const runtime = useLocalRuntime(chatModel, { adapters: { history: myHistoryAdapter, }, });`

### [RemoteThreadListAdapter](#remotethreadlistadapter)

For full backend thread management (thread list, archiving, cross-device sync), use `useRemoteThreadListRuntime`. See the

- href

  /docs/react-native/custom-backend

Custom Backend

page for a full example.

## [RemoteThreadListAdapter](#remotethreadlistadapter-1)

Title generation is configured via the `generateTitle` method on `RemoteThreadListAdapter`. See the

- href

  /docs/react-native/custom-backend

Custom Backend

page for a full example.``import type { RemoteThreadListAdapter } from "@assistant-ui/react-native"; import { createAssistantStream } from "assistant-stream"; const myAdapter: RemoteThreadListAdapter = { // ... other methods ... async generateTitle(remoteId, unstable_messages) { return createAssistantStream(async (controller) => { const res = await fetch(`/api/threads/${remoteId}/title`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: unstable_messages }), }); const { title } = await res.json(); controller.appendText(title); }); }, };``

## [Which option to choose?](#which-option-to-choose)

|                       | ChatModelAdapter + `useLocalRuntime` | RemoteThreadListAdapter + `useRemoteThreadListRuntime` |
| --------------------- | ------------------------------------ | ------------------------------------------------------ |
| **Thread storage**    | In-memory (or cloud)                 | Your backend                                           |
| **Message storage**   | In-memory (can add history adapter)  | In-memory (can add history adapter for server-side)    |
| **Cross-device sync** | Only with cloud                      | Yes                                                    |
| **Setup complexity**  | Minimal                              | Moderate                                               |
| **Best for**          | Single-device apps, prototypes       | Production apps with user accounts                     |