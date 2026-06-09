# Adapters
URL: /docs/ink/adapters

Title generation adapters for React Ink.

Adapters customize runtime behavior. They can be passed as options to `useLocalRuntime` or `useRemoteThreadListRuntime`.

## [RemoteThreadListAdapter](#remotethreadlistadapter)

Title generation is configured via the `generateTitle` method on `RemoteThreadListAdapter`. See the

- href

  /docs/ink/custom-backend

Custom Backend

page for a full example.``import type { RemoteThreadListAdapter } from "@assistant-ui/react-ink"; import { createAssistantStream } from "assistant-stream"; const myAdapter: RemoteThreadListAdapter = { // ... other methods ... async generateTitle(remoteId, unstable_messages) { return createAssistantStream(async (controller) => { const res = await fetch(`/api/threads/${remoteId}/title`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: unstable_messages }), }); const { title } = await res.json(); controller.appendText(title); }); }, };``

## [Which option to choose?](#which-option-to-choose)

|                               | ChatModelAdapter + `useLocalRuntime` | RemoteThreadListAdapter + `useRemoteThreadListRuntime` |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------ |
| **Thread storage**            | In-memory                            | Your backend                                           |
| **Message storage**           | In-memory                            | In-memory (can add history adapter for server-side)    |
| **Cross-session persistence** | No                                   | Yes                                                    |
| **Setup complexity**          | Minimal                              | Moderate                                               |
| **Best for**                  | CLI tools, demos, prototypes         | Production apps with persistence                       |