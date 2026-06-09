# Message Timing & Token Stats
URL: /docs/guides/message-timing

Display stream metadata in AI chat — generation duration, tokens per second, and time to first token, rendered via assistant-ui's React components.

Display stream performance metrics — duration, tokens per second, TTFT — on assistant messages.

This feature is experimental. The `useMessageTiming()` API and the set of tracked fields may change in future versions.

The

- href

  /docs/ui/message-timing

`MessageTiming`

registry component provides a ready-made badge + popover UI. This guide covers the underlying `useMessageTiming()` hook for custom implementations and runtime-specific setup.

## [Reading Timing Data](#reading-timing-data)

Use `useMessageTiming()` inside a message component to access timing data:

``import type { FC } from "react"; import { useMessageTiming } from "@assistant-ui/react"; const MessageTimingDisplay: FC = () => { const timing = useMessageTiming(); if (!timing?.totalStreamTime) return null; const formatMs = (ms: number) => ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`; return ( <span className="text-xs text-muted-foreground"> {formatMs(timing.totalStreamTime)} {timing.tokensPerSecond !== undefined && ` · ${timing.tokensPerSecond.toFixed(1)} tok/s`} </span> ); };``

Place it inside `MessagePrimitive.Root`, typically near the action bar:

`const AssistantMessage: FC = () => { return ( <MessagePrimitive.Root> <MessagePrimitive.Parts>{...}</MessagePrimitive.Parts> <ActionBarPrimitive.Root> <ActionBarPrimitive.Copy /> <ActionBarPrimitive.Reload /> <MessageTimingDisplay /> </ActionBarPrimitive.Root> </MessagePrimitive.Root> ); };`

### [`useMessageTiming()` Return Fields](#usemessagetiming-return-fields)

| Field             | Type      | Description                                            |
| ----------------- | --------- | ------------------------------------------------------ |
| `streamStartTime` | `number`  | Unix timestamp when stream started                     |
| `firstTokenTime`  | `number?` | Time to first text token (ms)                          |
| `totalStreamTime` | `number?` | Total stream duration (ms)                             |
| `tokenCount`      | `number?` | Output token count from message metadata usage         |
| `tokensPerSecond` | `number?` | Throughput (tokens/sec), when token usage is available |
| `totalChunks`     | `number`  | Total stream chunks received                           |
| `toolCallCount`   | `number`  | Number of tool calls                                   |

## [Runtime Support](#runtime-support)

| Runtime                                                | Supported | Notes                                        |
| ------------------------------------------------------ | --------- | -------------------------------------------- |
| - href

  /docs/runtimes/custom/data-streamData Stream | Yes       | Automatic via `AssistantMessageAccumulator`  |
| AI SDK (`useChatRuntime`)                              | Yes       | Automatic via client-side tracking           |
| Local (`useLocalRuntime`)                              | Yes       | Pass timing in `ChatModelRunResult.metadata` |
| ExternalStore                                          | Yes       | Pass timing in `ThreadMessageLike.metadata`  |
| LangGraph                                              | No        | Not yet implemented                          |
| AG-UI                                                  | No        | Not yet implemented                          |
| OpenCode                                               | No        | Not yet implemented                          |

### [Data Stream](#data-stream)

Timing is tracked automatically inside `AssistantMessageAccumulator`. No setup required.

`import { useDataStreamRuntime } from "@assistant-ui/react-data-stream"; const runtime = useDataStreamRuntime({ api: "/api/chat" }); // useMessageTiming() works out of the box`

### [AI SDK (`useChatRuntime`)](#ai-sdk-usechatruntime)

Timing is tracked automatically on the client side by observing streaming state transitions and content changes. Timing is finalized when each stream completes.

`tokenCount` and `tokensPerSecond` require usage metadata from `finish` or `finish-step` in your AI SDK route. If usage metadata is not emitted, duration and TTFT metrics still work, but token-based metrics are omitted.

`import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; const runtime = useChatRuntime(); // useMessageTiming() works out of the box`

### [Local (`useLocalRuntime`)](#local-uselocalruntime)

Pass timing in the `metadata` field of your `ChatModelRunResult`:

`import type { ChatModelAdapter } from "@assistant-ui/react"; const myAdapter: ChatModelAdapter = { async run({ messages, abortSignal }) { const startTime = Date.now(); const result = await callMyAPI(messages, abortSignal); const totalStreamTime = Date.now() - startTime; return { content: [{ type: "text", text: result.text }], metadata: { timing: { streamStartTime: startTime, totalStreamTime, tokenCount: result.usage?.completionTokens, tokensPerSecond: result.usage?.completionTokens ? result.usage.completionTokens / (totalStreamTime / 1000) : undefined, totalChunks: 1, toolCallCount: 0, }, }, }; }, };`

### [ExternalStore (`useExternalStoreRuntime`)](#externalstore-useexternalstoreruntime)

Pass timing in the `metadata.timing` field of your `ThreadMessageLike` messages:

`import type { ThreadMessageLike } from "@assistant-ui/react"; const message: ThreadMessageLike = { role: "assistant", content: [{ type: "text", text: fullText }], metadata: { timing: { streamStartTime: startTime, firstTokenTime, totalStreamTime, tokenCount, tokensPerSecond, totalChunks: chunks, toolCallCount: 0, }, }, };`

## [API Reference](#api-reference)

### [`useMessageTiming()`](#usemessagetiming)

`const timing: MessageTiming | undefined = useMessageTiming();`

Returns timing metadata for the current assistant message, or `undefined` for non-assistant messages or when no timing data is available.

Must be used inside a `MessagePrimitive.Root` context.