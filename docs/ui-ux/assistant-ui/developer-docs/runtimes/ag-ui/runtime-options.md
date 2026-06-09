# Runtime options
URL: /docs/runtimes/ag-ui/runtime-options

useAgUiRuntime options, adapters, supported events, thread list.

Reference for the runtime's API surface. Start with

- href

  /docs/runtimes/ag-ui/quickstart

quickstart

if you have not already.

## [useAgUiRuntime options](#useaguiruntime-options)

| Option         | Type                     | Description                                                                                       |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| `agent`        | `HttpAgent`              | An AG-UI client agent (from `@ag-ui/client`). Required.                                           |
| `logger`       | `Partial<Logger>`        | Optional logger overrides. The runtime logs event-parser warnings and run lifecycle events.       |
| `showThinking` | `boolean`                | Whether to render `THINKING_*` and `REASONING_*` events as visible reasoning. Defaults to `true`. |
| `onError`      | `(e: Error) => void`     | Error callback fired on `RUN_ERROR` events and protocol errors.                                   |
| `onCancel`     | `() => void`             | Cancellation callback fired when the user cancels a run.                                          |
| `adapters`     | `UseAgUiRuntimeAdapters` | Standard adapter slots (see below).                                                               |

## [Adapter slots](#adapter-slots)

| Adapter     | Slot                   | Notes                                                                                             |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| Attachments | `adapters.attachments` | See* href

  /docs/runtimes/concepts/adapters#attachment-adapterattachment adapter.               |
| Speech      | `adapters.speech`      | Text-to-speech. See* href

  /docs/runtimes/concepts/adapters#speech-adapterspeech adapter.       |
| Dictation   | `adapters.dictation`   | Speech-to-text input.                                                                             |
| Feedback    | `adapters.feedback`    | Thumbs up / down. See* href

  /docs/runtimes/concepts/adapters#feedback-adapterfeedback adapter. |
| History     | `adapters.history`     | Per-thread message persistence.                                                                   |
| Thread list | `adapters.threadList`  | Multi-thread switching (experimental, see below).                                                 |

## [Thread list (experimental)](#thread-list-experimental)

The thread list adapter is currently experimental and may change without notice.

`UseAgUiThreadListAdapter` lets you back the thread list with your own state.

| Option                | Type                                                  | Description                                                                                       |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `threadId`            | `string`                                              | The currently active thread ID.                                                                   |
| `onSwitchToNewThread` | `() => Promise<void>`                                 | Called when the user creates a new thread. Reset your thread state here.                          |
| `onSwitchToThread`    | `(threadId: string) => Promise<{ messages, state? }>` | Called when the user switches threads. Return the persisted messages (and optional opaque state). |

`const runtime = useAgUiRuntime({ agent, adapters: { threadList: { threadId: currentThreadId, onSwitchToNewThread: async () => { setCurrentThreadId(await createThread()); }, onSwitchToThread: async (id) => { const { messages, state } = await loadThread(id); setCurrentThreadId(id); return { messages, state }; }, }, }, });`

## [Interrupts (experimental)](#interrupts-experimental)

The interrupt API is experimental and may change without notice.

When the agent emits `RUN_FINISHED` with `outcome = { type: "interrupt", interrupts: [...] }`, the active assistant message is marked `requires-action` with `reason: "interrupt"` and the `Interrupt[]` payload is written to `metadata.custom.agui.interrupts`. Render an approval / input UI from there.

`useAgUiRuntime` returns an `AgUiAssistantRuntime` with two extra methods:

| Method                                                                       | Description                                                           |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `unstable_getPendingInterrupts(): readonly AgUiInterrupt[]`                  | Snapshot of the open interrupts on the most recent assistant message. |
| `unstable_submitInterruptResponses(responses: ResumeEntry[]): Promise<void>` | Submits one `ResumeEntry` per open interrupt and resumes the run.     |

`responses` must address every open interrupt; missing entries, unknown ids, or expired interrupts (`expiresAt`) reject before any network call. Each entry is `{ interruptId, status: "resolved" | "cancelled", payload? }`. The next `RunAgentInput` carries `resume: ResumeEntry[]`.

`const runtime = useAgUiRuntime({ agent }); const pending = runtime.unstable_getPendingInterrupts(); await runtime.unstable_submitInterruptResponses( pending.map((i) => ({ interruptId: i.id, status: "resolved", payload: { approved: true }, })), );`

## [Supported events](#supported-events)

The runtime parses the AG-UI event stream and maps each event type to assistant-ui state.

| Event                                      | Effect                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| `RUN_STARTED` / `RUN_FINISHED`             | Toggles thread `isRunning`. `RUN_FINISHED.outcome` is honored (success / interrupt). |
| `RUN_CANCELLED`                            | Marks the in-flight assistant message as cancelled.                                  |
| `RUN_ERROR`                                | Marks the message as errored; fires `onError`.                                       |
| `TEXT_MESSAGE_START` / `_CONTENT` / `_END` | Streams text content into an assistant message.                                      |
| `TEXT_MESSAGE_CHUNK`                       | Appends a delta without explicit lifecycle.                                          |
| `THINKING_START` / `_END`                  | Wraps reasoning blocks (when `showThinking` is on).                                  |
| `THINKING_TEXT_MESSAGE_*`                  | Streams thinking text deltas.                                                        |
| `REASONING_START` / `_MESSAGE_*` / `_END`  | Streams structured reasoning per message.                                            |
| `TOOL_CALL_START` / `_ARGS` / `_END`       | Streams tool calls into the current assistant message.                               |
| `TOOL_CALL_CHUNK`                          | Streams tool deltas without explicit lifecycle.                                      |
| `TOOL_CALL_RESULT`                         | Attaches a tool result to a tool call.                                               |
| `STATE_SNAPSHOT`                           | Replaces the agent's external state.                                                 |
| `STATE_DELTA`                              | Applies a JSON-patch-style delta to the agent's state.                               |
| `MESSAGES_SNAPSHOT`                        | Replaces the full message list (used for thread restore).                            |
| `CUSTOM`                                   | Forwarded to your custom event handling.                                             |
| `RAW`                                      | Untyped passthrough for unrecognized events.                                         |

## [Feature support](#feature-support)

| Feature                                     | Supported                                                                        |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| Streaming text                              | Yes                                                                              |
| Thinking / reasoning blocks                 | Yes                                                                              |
| Tool calls and results                      | Yes                                                                              |
| Tool result handoff (client-side execution) | Yes                                                                              |
| State snapshots and deltas                  | Yes                                                                              |
| Cancellation                                | Yes                                                                              |
| Message editing                             | Yes                                                                              |
| Message reload                              | Yes                                                                              |
| Run resumption                              | Yes                                                                              |
| Interrupts (human-in-the-loop)              | Experimental (`unstable_*` API, see* href

  #interrupts-experimentalInterrupts) |
| Multi-thread                                | Experimental (`adapters.threadList`)                                             |
| History persistence                         | Via* href

  /docs/runtimes/concepts/adapters#history-adapterhistory adapter     |

## [Related](#related)

- href

  /docs/runtimes/ag-ui

AG-UI overviewWhat AG-UI is and when to pick it.

- href

  /docs/runtimes/ag-ui/quickstart

QuickstartMinimal runtime + Thread setup.

- href

  /docs/runtimes/concepts/adapters

AdaptersAttachments, speech, feedback, history, thread list.