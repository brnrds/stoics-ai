# Adapters
URL: /docs/runtimes/concepts/adapters

Reusable extension points for attachments, speech, feedback, history, and suggestions.

Adapters are how assistant-ui adds capabilities like file uploads or message persistence to a runtime without coupling the runtime to a specific backend. You implement a small interface, plug it into the runtime's `adapters` option, and the matching UI surfaces (paperclip button, audio button, history reload) light up.

Every adapter on this page works the same way regardless of which runtime you use. When an adapter is supported by a runtime, you provide it via that runtime's `adapters` option:

`const runtime = useLocalRuntime(modelAdapter, { adapters: { attachments, history, speech, feedback, suggestion }, });`

Framework adapters take the same shape:

`const runtime = useChatRuntime({ adapters: { attachments, history } });`

## [Support matrix](#support-matrix)

| Adapter     | LocalRuntime                    | ExternalStoreRuntime                   | DataStream                      | AssistantTransport     | react-ai-sdk | react-langgraph    | react-langchain    | react-google-adk | react-a2a | react-ag-ui        | react-opencode      |
| ----------- | ------------------------------- | -------------------------------------- | ------------------------------- | ---------------------- | ------------ | ------------------ | ------------------ | ---------------- | --------- | ------------------ | ------------------- |
| Attachments | Yes                             | Yes                                    | Yes                             | Yes                    | Yes          | (via thread state) | (via thread state) | Yes              | Yes       | Yes                | (no)                |
| Speech      | Yes                             | Yes                                    | Yes                             | (no)                   | Yes          | Yes                | Yes                | Yes              | Yes       | Yes                | (no)                |
| Dictation   | Yes                             | Yes                                    | Yes                             | (no)                   | Yes          | Yes                | (no)               | Yes              | (no)      | Yes                | (no)                |
| Feedback    | Yes                             | Yes                                    | Yes                             | (no)                   | Yes          | Yes                | Yes                | Yes              | Yes       | Yes                | (no)                |
| History     | Yes                             | (use your store)                       | Yes                             | (use thread converter) | Yes          | (via load)         | (via load)         | Yes              | Yes       | Yes                | (server-managed)    |
| Suggestion  | Yes                             | (no)                                   | Yes                             | (no)                   | (no)         | (no)               | (no)               | (no)             | (no)      | (no)               | (no)                |
| threadList  | Yes (`RemoteThreadListAdapter`) | Yes (`ExternalStoreThreadListAdapter`) | Yes (`RemoteThreadListAdapter`) | Yes                    | Yes          | Yes                | Yes                | Yes              | Yes       | Yes (experimental) | Built-in (sessions) |

`(no)` means the adapter slot is not exposed by that runtime today. You would need to drop down a layer to use it.

## [Attachment adapter](#attachment-adapter)

Handles file and image uploads. When present, the composer renders a paperclip button.

`type AttachmentAdapter = { accept: string; add: (input: { file: File }) => Promise<PendingAttachment>; send: (attachment: PendingAttachment) => Promise<CompleteAttachment>; remove?: (attachment: Attachment) => Promise<void>; };`

Three lifecycle methods:

- `add` runs when the user picks a file. Upload it, return a record with status `requires-action` so the composer holds the file before sending.
- `send` runs when the user submits the message. Finalize the upload, attach a `content` payload, and mark status `complete`.
- `remove` is optional and runs when the user removes the attachment before sending.

Minimal upload-and-send example:

``const attachmentAdapter: AttachmentAdapter = { accept: "image/*,application/pdf", async add({ file }) { const form = new FormData(); form.append("file", file); const { id, url } = await fetch("/api/upload", { method: "POST", body: form, }).then((r) => r.json()); return { id, type: file.type.startsWith("image/") ? "image" : "document", name: file.name, contentType: file.type, file, url, status: { type: "requires-action", reason: "composer-send" }, }; }, async send(attachment) { return { ...attachment, status: { type: "complete" }, content: [ attachment.type === "image" ? { type: "image", image: attachment.url! } : { type: "text", text: `[${attachment.name}](${attachment.url})` }, ], }; }, };``

For multiple file types use `CompositeAttachmentAdapter`:

`import { CompositeAttachmentAdapter, SimpleImageAttachmentAdapter, SimpleTextAttachmentAdapter, } from "@assistant-ui/react"; const attachmentAdapter = new CompositeAttachmentAdapter([ new SimpleImageAttachmentAdapter(), new SimpleTextAttachmentAdapter(), ]);`

## [Speech adapter](#speech-adapter)

Text-to-speech for assistant messages. When present, message bubbles render an audio button.

`type SpeechSynthesisAdapter = { speak: (text: string) => Utterance; };`

`speak` returns an `Utterance` with `cancel()`, a `status` field, and `subscribe(callback)`. Browser-native example:

`const speechAdapter: SpeechSynthesisAdapter = { speak(text) { const utterance = new SpeechSynthesisUtterance(text); const subscribers = new Set<() => void>(); const result: SpeechSynthesisAdapter.Utterance = { status: { type: "running" }, cancel: () => { speechSynthesis.cancel(); result.status = { type: "ended", reason: "cancelled" }; subscribers.forEach((cb) => cb()); }, subscribe(cb) { subscribers.add(cb); return () => subscribers.delete(cb); }, }; utterance.addEventListener("end", () => { result.status = { type: "ended", reason: "finished" }; subscribers.forEach((cb) => cb()); }); speechSynthesis.speak(utterance); return result; }, };`

## [Dictation adapter](#dictation-adapter)

Speech-to-text input for the composer. When present, the composer renders a microphone button. The contract is parallel to the speech adapter.

## [Feedback adapter](#feedback-adapter)

Thumbs up / thumbs down on assistant messages. When present, message bubbles render feedback buttons.

`type FeedbackAdapter = { submit: (feedback: { type: "positive" | "negative"; message: ThreadMessage; }) => Promise<void>; };` `const feedbackAdapter: FeedbackAdapter = { async submit({ type, message }) { await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageId: message.id, rating: type }), }); }, };`

## [History adapter](#history-adapter)

Per-thread message persistence. Used by `LocalRuntime` and adapters built on it (`react-ai-sdk`, `react-google-adk`, `react-a2a`, `useDataStreamRuntime`).

`ExternalStoreRuntime` does not use a history adapter directly, since you already own the message array. Persist via your store instead. `react-langgraph` and `react-langchain` source persistence from server-side thread state, exposed through their `load` callbacks.

`type ThreadHistoryAdapter = { load: () => Promise<{ messages: { parentId: string | null; message: ThreadMessage }[]; }>; append: (item: { parentId: string | null; message: ThreadMessage; }) => Promise<void>; resume?: (input: { messages: ThreadMessage[]; }) => Promise<ReadableStream | undefined>; withFormat?: <Fmt>(fmt: Fmt) => ThreadHistoryAdapter; };`

`load` runs when a thread opens. `append` runs after each message completes.

`react-ai-sdk` requires `withFormat` so messages round-trip as AI SDK `UIMessage` objects. An adapter without `withFormat` throws at runtime in the AI SDK path. See the

- href

  /docs/runtimes/ai-sdk/v6

AI SDK history docs

for the full pattern.

## [Suggestion adapter](#suggestion-adapter)

Proposes follow-up prompts after each assistant message. When present, suggestion chips render under the latest assistant message.

`type SuggestionAdapter = { generate: (input: { messages: readonly ThreadMessage[]; }) => AsyncGenerator<{ prompt: string }[]>; };` `const suggestionAdapter: SuggestionAdapter = { async *generate({ messages }) { const last = messages.at(-1); if (!last) return; const response = await fetch("/api/suggestions", { method: "POST", body: JSON.stringify(last), }); yield (await response.json()).suggestions; }, };`

## [Thread list adapter](#thread-list-adapter)

Multi-thread support is documented separately, since the contract differs by runtime. See

- href

  /docs/runtimes/concepts/threads

threads

.

## [Composing adapters](#composing-adapters)

Adapters compose freely. Provide as many or as few as you need; UI surfaces enable based on which slots are filled.

`const runtime = useLocalRuntime(modelAdapter, { adapters: { attachments: myAttachmentAdapter, history: myHistoryAdapter, speech: mySpeechAdapter, feedback: myFeedbackAdapter, }, });`

## [Related](#related)

- href

  /docs/runtimes/concepts/threads

ThreadsMulti-thread support: cloud, custom database, ExternalStore.

- href

  /docs/runtimes/concepts/architecture

ArchitectureThe three-layer runtime model and how adapters fit in.

- href

  /docs/runtimes/pick-a-runtime

Pick a runtimeChoose the right runtime for your backend.