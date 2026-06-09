# LocalRuntime
URL: /docs/runtimes/custom/local-runtime

Quickest path to a working chat. Handles state while you handle the API.

`LocalRuntime` is the simplest way to connect a custom backend. You implement a single `ChatModelAdapter` (one `run` function) and the runtime handles everything else: messages, threads, branching, editing, regeneration, cancellation.

State lives inside the runtime by default. Multi-thread persistence and shared adapters are added via the standard interfaces, see

- href

  /docs/runtimes/concepts/adapters

adapters

and

- href

  /docs/runtimes/concepts/threads

threads

.

## [When to use it](#when-to-use-it)

Pick `LocalRuntime` when:

- You want assistant-ui to manage chat state for you.
- Your backend exposes a function-call shaped API (REST, OpenAI SDK, your own model client).
- Branching, editing, and regeneration should work without you writing extra code.
- You want to compose adapters (attachments, speech, feedback, history, suggestions).

If you already keep messages in redux, zustand, tanstack-query, or another store, use

- href

  /docs/runtimes/custom/external-store

`ExternalStoreRuntime`

instead.

## [Quickstart](#quickstart)

### [Create a project](#create-a-project)

- value

  React

`npx create-next-app@latest my-app cd my-app`

- value

  React Native

`npx create-expo-app@latest my-app cd my-app`

- value

  React Ink

`mkdir my-app cd my-app npm init -y`

### [Install dependencies](#install-dependencies)

- value

  React

* packages

  - @assistant-ui/react

- value

  React Native

* packages

  - @assistant-ui/react-native

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - ink
  - react

### [Add the Thread component](#add-the-thread-component)

- value

  React

`npx assistant-ui@latest add thread`

- value

  React Native

Use your React Native thread component from the

- href

  /docs/react-native

React Native setup

.

- value

  React Ink

Use your terminal thread component from the

- href

  /docs/ink

Ink setup

.

### [Define a `MyRuntimeProvider`](#define-a-myruntimeprovider)

Replace the `MyModelAdapter` body with your backend call.

- value

  React

* title

  app/MyRuntimeProvider.tsx

`"use client"; import type { ReactNode } from "react"; import { AssistantRuntimeProvider, useLocalRuntime, type ChatModelAdapter, } from "@assistant-ui/react"; const MyModelAdapter: ChatModelAdapter = { async run({ messages, abortSignal }) { const result = await fetch("<YOUR_API_ENDPOINT>", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }), signal: abortSignal, }); const data = await result.json(); return { content: [{ type: "text", text: data.text }], }; }, }; export function MyRuntimeProvider({ children, }: Readonly<{ children: ReactNode }>) { const runtime = useLocalRuntime(MyModelAdapter); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  runtime/MyRuntimeProvider.tsx

`import type { ReactNode } from "react"; import { AssistantRuntimeProvider, useLocalRuntime, type ChatModelAdapter, } from "@assistant-ui/react-native"; const MyModelAdapter: ChatModelAdapter = { async run({ messages, abortSignal }) { const result = await fetch("<YOUR_API_ENDPOINT>", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }), signal: abortSignal, }); const data = await result.json(); return { content: [{ type: "text", text: data.text }], }; }, }; export function MyRuntimeProvider({ children, }: Readonly<{ children: ReactNode }>) { const runtime = useLocalRuntime(MyModelAdapter); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

- value

  React Ink

* title

  runtime/MyRuntimeProvider.tsx

`import type { ReactNode } from "react"; import { AssistantRuntimeProvider, useLocalRuntime, type ChatModelAdapter, } from "@assistant-ui/react-ink"; const MyModelAdapter: ChatModelAdapter = { async run({ messages, abortSignal }) { const result = await fetch("<YOUR_API_ENDPOINT>", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }), signal: abortSignal, }); const data = await result.json(); return { content: [{ type: "text", text: data.text }], }; }, }; export function MyRuntimeProvider({ children, }: Readonly<{ children: ReactNode }>) { const runtime = useLocalRuntime(MyModelAdapter); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

### [Wrap your app](#wrap-your-app)

- value

  React

* title

  app/layout.tsx

`import type { ReactNode } from "react"; import { MyRuntimeProvider } from "@/app/MyRuntimeProvider"; export default function RootLayout({ children }: { children: ReactNode }) { return ( <MyRuntimeProvider> <html lang="en"> <body>{children}</body> </html> </MyRuntimeProvider> ); }`

- value

  React Native

* title

  app/\_layout.tsx

`import { Stack } from "expo-router"; import { MyRuntimeProvider } from "@/runtime/MyRuntimeProvider"; export default function RootLayout() { return ( <MyRuntimeProvider> <Stack /> </MyRuntimeProvider> ); }`

- value

  React Ink

* title

  app.tsx

`import { Box } from "ink"; import { Thread } from "./components/thread.js"; import { MyRuntimeProvider } from "./runtime/MyRuntimeProvider.js"; export function App() { return ( <MyRuntimeProvider> <Box flexDirection="column"> <Thread /> </Box> </MyRuntimeProvider> ); }`

### [Render the Thread](#render-the-thread)

- value

  React

* title

  app/page.tsx

`import { Thread } from "@/components/assistant-ui/thread"; export default function Page() { return <Thread />; }`

- value

  React Native

* title

  app/index.tsx

`import { View } from "react-native"; import { Thread } from "@/components/assistant-ui/thread"; export default function Page() { return ( <View style={{ flex: 1 }}> <Thread /> </View> ); }`

- value

  React Ink

* title

  index.tsx

`import { render } from "ink"; import { App } from "./app.js"; render(<App />);`

## [Streaming responses](#streaming-responses)

Declare `run` as an `async *` generator and yield the full cumulative content on each iteration:

`import { ChatModelAdapter, ThreadMessage, type ModelContext, } from "@assistant-ui/react"; import { OpenAI } from "openai"; const openai = new OpenAI(); const MyModelAdapter: ChatModelAdapter = { async *run({ messages, abortSignal, context }) { const stream = await openai.chat.completions.create({ model: "gpt-5.4-mini", messages: convertToOpenAIMessages(messages), stream: true, signal: abortSignal, }); let text = ""; for await (const part of stream) { text += part.choices[0]?.delta?.content || ""; yield { content: [{ type: "text", text }], }; } }, };`

Each yield replaces the previous content. Yield the full state every time, not deltas.

### [Streaming with tool calls](#streaming-with-tool-calls)

Accumulate tool calls in a `Map` outside the streaming loop so they persist across chunks:

`async *run({ messages, abortSignal, context }) { const stream = await openai.chat.completions.create({ model: "gpt-5.4-mini", messages: convertToOpenAIMessages(messages), tools: context.tools, stream: true, signal: abortSignal, }); let text = ""; const toolCallsMap = new Map(); for await (const chunk of stream) { text += chunk.choices[0]?.delta?.content ?? ""; for (const toolCall of chunk.choices[0]?.delta?.tool_calls ?? []) { toolCallsMap.set(toolCall.id, { type: "tool-call", toolName: toolCall.function?.name, toolCallId: toolCall.id, args: JSON.parse(toolCall.function?.arguments ?? "{}"), }); } yield { content: [ ...(text ? [{ type: "text" as const, text }] : []), ...Array.from(toolCallsMap.values()), ], }; } }`

If you build the `content` array fresh from the current chunk each iteration, tool calls from earlier chunks will disappear when a later chunk carries only text. The Map outside the loop is the fix.

## [Tool calling](#tool-calling)

`LocalRuntime` supports OpenAI-compatible function calling. Register tools through `useAui` so the runtime exposes them to your adapter via `context.tools`:

`import { useAui, Tools, type Toolkit } from "@assistant-ui/react"; import { z } from "zod"; const myToolkit: Toolkit = { getWeather: { description: "Get the current weather in a location", parameters: z.object({ location: z.string(), unit: z.enum(["celsius", "fahrenheit"]).default("celsius"), }), execute: async ({ location, unit }) => fetchWeather(location, unit), }, }; function MyRuntimeProvider({ children }: { children: React.ReactNode }) { const runtime = useLocalRuntime(MyModelAdapter); const aui = useAui({ tools: Tools({ toolkit: myToolkit }) }); return ( <AssistantRuntimeProvider aui={aui} runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

See the

- href

  /docs/guides/tools

tools guide

for advanced patterns.

### [Human-in-the-loop approval](#human-in-the-loop-approval)

Require user confirmation before specific tools execute:

`const runtime = useLocalRuntime(MyModelAdapter, { unstable_humanToolNames: ["delete_file", "send_email"], });`

`unstable_humanToolNames` is unstable; see

- href

  /docs/runtimes/concepts/stability

stability

.

## [Resuming a run](#resuming-a-run)

`resumeRun` reconnects to an in-progress assistant run. Useful for page refresh, network reconnect, tab backgrounding, or thread switching when the backend is still generating.

Unlike `startRun` (which uses the `ChatModelAdapter`), `resumeRun` requires a `stream` parameter; you provide the async generator that produces the response.

`import { useAui } from "@assistant-ui/react"; import type { ChatModelRunResult } from "@assistant-ui/core"; const aui = useAui(); async function* createCustomStream(): AsyncGenerator<ChatModelRunResult> { yield { content: [{ type: "text", text: "Initial response" }] }; await new Promise((r) => setTimeout(r, 500)); yield { content: [ { type: "text", text: "Initial response. And here's more content..." }, ], }; } aui.thread().resumeRun({ parentId: "message-id", stream: createCustomStream, });`

A common pattern is to check whether the backend is still running on mount, then reconnect:

``function useStreamReconnect(threadId: string) { const aui = useAui(); const checkedRef = useRef(false); useEffect(() => { if (checkedRef.current) return; checkedRef.current = true; (async () => { const status = await fetch(`/api/status/${threadId}`).then((r) => r.json(), ); if (status.isRunning) { const parentId = aui.thread().getState().messages.at(-1)?.id ?? null; aui.thread().resumeRun({ parentId }); } })(); }, [aui, threadId]); }``

## [Adapters](#adapters)

Attachments, speech, feedback, history, and suggestions are wired through the standard adapter contracts, see

- href

  /docs/runtimes/concepts/adapters

adapters

:`const runtime = useLocalRuntime(MyModelAdapter, { adapters: { attachments: myAttachmentAdapter, speech: mySpeechAdapter, feedback: myFeedbackAdapter, history: myHistoryAdapter, suggestion: mySuggestionAdapter, }, });`

## [Multi-thread](#multi-thread)

`LocalRuntime` supports multi-thread either via

- href

  /docs/cloud

AssistantCloud

or via a custom `RemoteThreadListAdapter`. See

- href

  /docs/runtimes/concepts/threads

threads

for the contract and full examples.`// managed (see "AssistantCloud" in /docs/runtimes/concepts/threads for cloud setup) const runtime = useLocalRuntime(MyModelAdapter, { cloud });`

## [Integration examples](#integration-examples)

### [OpenAI](#openai)

`import { OpenAI } from "openai"; const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); const OpenAIAdapter: ChatModelAdapter = { async *run({ messages, abortSignal, context }) { const stream = await openai.chat.completions.create({ model: "gpt-5.4-mini", messages: messages.map((m) => ({ role: m.role, content: m.content .filter((c) => c.type === "text") .map((c) => c.text) .join("\n"), })), stream: true, signal: abortSignal, }); let fullText = ""; for await (const chunk of stream) { const content = chunk.choices[0]?.delta?.content; if (content) { fullText += content; yield { content: [{ type: "text", text: fullText }] }; } } }, };`

### [Custom REST API](#custom-rest-api)

``const CustomAPIAdapter: ChatModelAdapter = { async run({ messages, abortSignal, unstable_threadId }) { const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: messages.map((m) => ({ role: m.role, content: m.content, })), threadId: unstable_threadId, }), signal: abortSignal, }); if (!response.ok) throw new Error(`API error: ${response.statusText}`); const data = await response.json(); return { content: [{ type: "text", text: data.message }] }; }, };``

## [Best practices](#best-practices)

1. **Always pass `abortSignal`** to `fetch` and SDK calls so cancel works: `fetch(url, { signal: abortSignal });`
2. **Handle errors gracefully.** Swallow `AbortError` (it is the user cancelling); rethrow others to surface in the UI.
3. **Yield cumulative state, not deltas.** Each yield replaces the previous content; if you yield deltas the UI flickers.
4. **Accumulate tool calls outside the streaming loop**, otherwise they vanish on the first text-only chunk.

## [Troubleshooting](#troubleshooting)

**Messages not appearing.** Ensure your adapter returns the correct shape: `{ content: [{ type: "text", text: "..." }] }`.

**Streaming not working.** Use `async *run` (with the asterisk). A plain `async run` cannot yield.

**Tool UI flickers and disappears.** state is being reset between chunks. Accumulate tool calls in a `Map` declared outside the `for await` loop.

## [API reference](#api-reference)

### [`ChatModelAdapter`](#chatmodeladapter)

`ChatModelAdapter`

- `run` `: ChatModelRunOptions => ChatModelRunResult | AsyncGenerator<ChatModelRunResult>`

  Function that sends messages to your API and returns the response.

### [`ChatModelRunOptions`](#chatmodelrunoptions)

`ChatModelRunOptions`

- `messages` `: readonly ThreadMessage[]`

  The conversation history to send to your API.

- `runConfig` `: RunConfig`

  Run configuration with optional custom metadata. RunConfig is { readonly custom?: Record\<string, unknown> }.

- `abortSignal` `: AbortSignal`

  Signal to cancel the request if user interrupts.

- `context` `: ModelContext`

  Additional context including configuration and tools.

- `unstable_assistantMessageId`

  - variant

    unstable

  `?: string | Undefined`

  ID of the assistant message being generated. Useful for tracking or updating specific messages.

- `unstable_threadId`

  - variant

    unstable

  `?: string | Undefined`

  Current thread/conversation identifier. Useful for passing to your backend API.

- `unstable_parentId`

  - variant

    unstable

  `?: string | Null | Undefined`

  ID of the parent message this response is replying to. null if this is the first message.

- `unstable_getMessage`

  - variant

    unstable

  `?: () => ThreadMessage`

  Returns the current assistant message being generated. Useful during streaming.

### [`LocalRuntimeOptions`](#localruntimeoptions)

`LocalRuntimeOptions`

- `initialMessages` `?: readonly ThreadMessageLike[]`

  Pre-populate the thread with messages.

- `maxSteps` `: number` = 2

  Maximum number of sequential tool calls before requiring user input.

- `cloud` `?: AssistantCloud`

  Enable Assistant Cloud integration for multi-thread support and persistence.

- `adapters` `?: LocalRuntimeAdapters`

  Capability adapters. UI features automatically enable based on which adapters are provided. See /docs/runtimes/concepts/adapters.

- `unstable_humanToolNames`

  - variant

    unstable

  `?: string[]`

  Tool names that require human approval before execution (unstable).

## [Related](#related)

- href

  /docs/runtimes/custom/external-store

ExternalStoreRuntimeBring your own state store.

- href

  /docs/runtimes/concepts/adapters

AdaptersAttachments, speech, feedback, history, suggestions.

- href

  /docs/runtimes/concepts/threads

ThreadsCloud, custom database, ExternalStore-based.