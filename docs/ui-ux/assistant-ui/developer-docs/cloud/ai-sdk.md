# AI SDK
URL: /docs/cloud/ai-sdk

Add cloud persistence to your existing AI SDK app with a single hook.

## [Overview](#overview)

The `@assistant-ui/cloud-ai-sdk` package provides a single hook that adds full message and thread persistence to any

- href

  https\://sdk.vercel.ai/

AI SDK

application:

- **`useCloudChat`** — wraps `useChat` with automatic cloud persistence and built-in thread management

This hook works with any React UI. You keep full control of your components.

See

- href

  /docs/cloud/ai-sdk-assistant-ui

AI SDK + assistant-ui

for the full integration with assistant-ui's primitives and runtime.

## [Prerequisites](#prerequisites)

You need an assistant-cloud account to follow this guide.

- href

  https\://cloud.assistant-ui.com/

Sign up here

to get started.

## [Setup](#setup)

### [Create a Cloud Project](#create-a-cloud-project)

Create a new project in the

- href

  https\://cloud.assistant-ui.com/

assistant-cloud dashboard

and from the settings page, copy your **Frontend API URL** (`https://proj-[ID].assistant-api.com`).

### [Configure Environment Variables](#configure-environment-variables)

- value

  React

* title

  .env.local

`NEXT_PUBLIC_ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com`

- value

  React Native

* title

  .env

`EXPO_PUBLIC_ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com`

- value

  React Ink

* title

  .env

`ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com`

### [Install Dependencies](#install-dependencies)

- value

  React

* packages

  - @assistant-ui/cloud-ai-sdk
  - @ai-sdk/react
  - ai

- value

  React Native

* packages

  - @assistant-ui/cloud-ai-sdk
  - @ai-sdk/react
  - ai
  - assistant-cloud

- value

  React Ink

* packages

  - @assistant-ui/cloud-ai-sdk
  - @ai-sdk/react
  - ai
  - assistant-cloud
  - ink
  - react

### [Integrate](#integrate)

- value

  React

* title

  app/page.tsx

`"use client"; import { useState } from "react"; import { useCloudChat } from "@assistant-ui/cloud-ai-sdk"; export default function Chat() { // Zero-config: auto-initializes anonymous cloud from env var with built-in threads. // For custom config, pass: { cloud, threads: useThreads(...), onSyncError } const { messages, sendMessage, threads } = useCloudChat(); const [input, setInput] = useState(""); const handleSubmit = () => { if (!input.trim()) return; sendMessage({ text: input }); setInput(""); }; return ( <div> {/* Thread list */} <ul> {threads.threads.map((t) => ( <li key={t.id} onClick={() => threads.selectThread(t.id)}> {t.title || "New conversation"} </li> ))} <li onClick={() => threads.selectThread(null)}>New chat</li> </ul> {/* Chat messages */} <div> {messages.map((m) => ( <div key={m.id}> {m.parts.map((p) => p.type === "text" && p.text)} </div> ))} </div> {/* Composer */} <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}> <input value={input} onChange={(e) => setInput(e.target.value)} /> <button type="submit">Send</button> </form> </div> ); }`

- value

  React Native

* title

  app/index.tsx

`import { useMemo, useState } from "react"; import { Pressable, Text, TextInput, View } from "react-native"; import { AssistantCloud } from "assistant-cloud"; import { useCloudChat } from "@assistant-ui/cloud-ai-sdk"; async function getAssistantToken() { // Return a user token from your auth provider. return "..."; } export default function Chat() { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.EXPO_PUBLIC_ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), [], ); const { messages, sendMessage, threads } = useCloudChat({ cloud }); const [input, setInput] = useState(""); const handleSubmit = () => { if (!input.trim()) return; sendMessage({ text: input }); setInput(""); }; return ( <View> <View> {threads.threads.map((t) => ( <Pressable key={t.id} onPress={() => threads.selectThread(t.id)}> <Text>{t.title || "New conversation"}</Text> </Pressable> ))} <Pressable onPress={() => threads.selectThread(null)}> <Text>New chat</Text> </Pressable> </View> <View> {messages.map((m) => ( <Text key={m.id}> {m.parts.map((p) => p.type === "text" && p.text)} </Text> ))} </View> <TextInput value={input} onChangeText={setInput} /> <Pressable onPress={handleSubmit}> <Text>Send</Text> </Pressable> </View> ); }`

- value

  React Ink

* title

  app.tsx

`import { useMemo, useState } from "react"; import { Box, Text, useInput } from "ink"; import { AssistantCloud } from "assistant-cloud"; import { useCloudChat } from "@assistant-ui/cloud-ai-sdk"; async function getAssistantToken() { // Return a user token from your auth provider. return "..."; } export function Chat() { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), [], ); const { messages, sendMessage, threads } = useCloudChat({ cloud }); const [input, setInput] = useState(""); const handleSubmit = () => { if (!input.trim()) return; sendMessage({ text: input }); setInput(""); }; useInput((value, key) => { if (key.return) handleSubmit(); else if (key.tab) threads.selectThread(null); else if (key.backspace || key.delete) setInput((text) => text.slice(0, -1)); else if (value) setInput((text) => text + value); }); return ( <Box flexDirection="column"> <Text bold>Threads</Text> {threads.threads.map((t) => ( <Text key={t.id}>{t.title || "New conversation"}</Text> ))} <Text dimColor>Press tab for a new chat.</Text> {messages.map((m) => ( <Text key={m.id}> {m.parts.map((p) => p.type === "text" && p.text)} </Text> ))} <Text>{"> "}{input}</Text> <Text dimColor>Press enter to send.</Text> </Box> ); }`

That's it. Messages persist automatically as they complete, and switching threads loads the full history.

## [API Reference](#api-reference)

### [`useCloudChat(options?)`](#usecloudchatoptions)

Wraps AI SDK's `useChat` with automatic cloud persistence and built-in thread management. Messages are persisted as they finish streaming. Thread creation is automatic on the first message — the hook will auto-create the thread, select it, refresh the thread list, and generate a title after the first response.

#### [Configuration Modes](#configuration-modes)

**1. Zero-config** — Set `NEXT_PUBLIC_ASSISTANT_BASE_URL` env var, call with no args:

`const chat = useCloudChat();`

**2. Custom cloud instance** — For authenticated users or custom configuration:

`const cloud = new AssistantCloud({ baseUrl, authToken }); const chat = useCloudChat({ cloud });`

**3. External thread management** — When threads need to be accessed from a separate component or you need custom thread options like `includeArchived`:

`// In a context provider or parent component const myThreads = useThreads({ cloud, includeArchived: true }); // Pass to useCloudChat - it will use your thread state const chat = useCloudChat({ threads: myThreads });`

#### [Parameters](#parameters)

| Parameter             | Type                     | Description                                                                                                                                                 |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options.cloud`       | `AssistantCloud`         | Cloud instance (optional — auto-creates anonymous instance from `NEXT_PUBLIC_ASSISTANT_BASE_URL` env var if not provided)                                   |
| `options.threads`     | `UseThreadsResult`       | External thread management from `useThreads()`. Use when you need thread operations in a separate component or custom thread options like `includeArchived` |
| `options.onSyncError` | `(error: Error) => void` | Callback invoked when a sync error occurs                                                                                                                   |

A subset of

- href

  https\://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat

AI SDK `useChat` options

are also accepted (those defined on `ChatInit`). Some options available on `useChat` such as `experimental_throttle` and `resume` are not supported.

**Returns:** `UseCloudChatResult`

| Value         | Type                                   | Description                                                        |
| ------------- | -------------------------------------- | ------------------------------------------------------------------ |
| `messages`    | `UIMessage[]`                          | Chat messages (from AI SDK)                                        |
| `status`      | `string`                               | Chat status: `"ready"`, `"submitted"`, `"streaming"`, or `"error"` |
| `sendMessage` | `(message, options?) => Promise<void>` | Send a message (auto-creates thread if needed)                     |
| `stop`        | `() => void`                           | Stop the current stream                                            |
| `threads`     | `UseThreadsResult`                     | Thread management (see below)                                      |

Plus all other properties from AI SDK's

- href

  https\://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat

`UseChatHelpers`

.

**Thread management (`threads`):**

| Value                   | Type                                                                    | Description                                       |
| ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| `threads.cloud`         | `AssistantCloud`                                                        | The cloud instance used for thread operations     |
| `threads.threads`       | `CloudThread[]`                                                         | Active threads sorted by recency                  |
| `threads.threadId`      | `string \| null`                                                        | Current thread ID (`null` for a new unsaved chat) |
| `threads.selectThread`  | `(id: string \| null) => void`                                          | Switch threads or pass `null` for a new chat      |
| `threads.isLoading`     | `boolean`                                                               | `true` during initial load or refresh             |
| `threads.error`         | `Error \| null`                                                         | Last error, if any                                |
| `threads.refresh`       | `() => Promise<boolean>`                                                | Re-fetch the thread list                          |
| `threads.get`           | `(id: string) => Promise<CloudThread \| null>`                          | Fetch a single thread by ID                       |
| `threads.create`        | `(options?: \{ externalId?: string \}) => Promise<CloudThread \| null>` | Create a new thread                               |
| `threads.delete`        | `(id: string) => Promise<boolean>`                                      | Delete a thread                                   |
| `threads.rename`        | `(id: string, title: string) => Promise<boolean>`                       | Rename a thread                                   |
| `threads.archive`       | `(id: string) => Promise<boolean>`                                      | Archive a thread                                  |
| `threads.unarchive`     | `(id: string) => Promise<boolean>`                                      | Unarchive a thread                                |
| `threads.generateTitle` | `(threadId: string) => Promise<string \| null>`                         | Generate a title using AI                         |

### [`useThreads(options)`](#usethreadsoptions)

Thread list management for use with `useCloudChat`. Call this explicitly and pass to `useCloudChat({ threads })` when you need access to thread operations outside the chat context (e.g., in a separate sidebar component).

`const myThreads = useThreads({ cloud: myCloud }); const { messages, sendMessage } = useCloudChat({ threads: myThreads });`

**Parameters:**

| Parameter                 | Type             | Description                                 |
| ------------------------- | ---------------- | ------------------------------------------- |
| `options.cloud`           | `AssistantCloud` | Cloud client instance                       |
| `options.includeArchived` | `boolean`        | Include archived threads (default: `false`) |
| `options.enabled`         | `boolean`        | Enable thread fetching (default: `true`)    |

**Returns:** `UseThreadsResult` — same shape as `threads` from `useCloudChat()`.

## [Telemetry](#telemetry)

The `useCloudChat` hook automatically reports run telemetry to Assistant Cloud after each assistant response. This includes:

**Automatically captured:**

- `status` — `"completed"` or `"incomplete"` based on response content
- `tool_calls` — Tool invocations with name, arguments, and results. MCP tool calls are explicitly tagged with `tool_source: "mcp"`
- `total_steps` — Number of reasoning/tool steps in the response
- `output_text` — Full response text (truncated at 50K characters)

**Requires route configuration:**

- `model_id` — The model used for the response
- `input_tokens` / `output_tokens` — Token usage statistics
- `reasoning_tokens` — Tokens used for chain-of-thought reasoning (e.g. GPT-5.4 Mini or GPT-5.5 models)
- `cached_input_tokens` — Input tokens served from the provider's prompt cache

To capture model and usage data, configure the `messageMetadata` callback in your AI SDK route:

- title

  app/api/chat/route.ts

`import { streamText } from "ai"; import { openai } from "@ai-sdk/openai"; export async function POST(req: Request) { const { messages } = await req.json(); const result = streamText({ model: openai("gpt-5.4-mini"), messages, }); return result.toUIMessageStreamResponse({ messageMetadata: ({ part }) => { if (part.type === "finish") { return { usage: part.totalUsage, }; } if (part.type === "finish-step") { return { modelId: part.response.modelId, }; } return undefined; }, }); }`

The standalone hook captures message metadata when it is JSON-serializable, but it does not capture `duration_ms`, per-step breakdowns (`steps`), or `"error"` status. Those require the full runtime integration available via

- href

  /docs/cloud/ai-sdk-assistant-ui

`useChatRuntime`

.

### [Customizing Reports](#customizing-reports)

Use the `beforeReport` hook to enrich or filter telemetry:

`const cloud = new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, anonymous: true, telemetry: { beforeReport: (report) => ({ ...report, metadata: { environment: "production", version: "1.0.0" }, }), }, });`

Return `null` from `beforeReport` to skip reporting a specific run. To disable telemetry entirely, pass `telemetry: false`.

### [Sub-Agent Model Tracking](#sub-agent-model-tracking)

In multi-agent setups where tool calls delegate to a different model (e.g., the main run uses GPT but a tool invokes Gemini), you can track the delegated model's usage by passing sampling call data through `messageMetadata`.

**Step 1: Collect sampling data on the server**

Use `createSamplingCollector` and `wrapSamplingHandler` from `assistant-cloud` to capture LLM calls made during tool execution:

- title

  app/api/chat/route.ts

`import { streamText } from "ai"; import { openai } from "@ai-sdk/openai"; import { createSamplingCollector, wrapSamplingHandler, } from "assistant-cloud"; export async function POST(req: Request) { const { messages } = await req.json(); // Collect sub-agent sampling calls per tool call const samplingCalls: Record<string, SamplingCallData[]> = {}; const result = streamText({ model: openai("gpt-5.4-mini"), messages, tools: { delegate_to_gemini: tool({ parameters: z.object({ task: z.string() }), execute: async ({ task }, { toolCallId }) => { const collector = createSamplingCollector(); // Your sub-agent logic that calls another model const result = await runSubAgent(task, { onSamplingCall: collector.collect, }); samplingCalls[toolCallId] = collector.getCalls(); return result; }, }), }, }); return result.toUIMessageStreamResponse({ messageMetadata: ({ part }) => { if (part.type === "finish") { return { usage: part.totalUsage, samplingCalls, // attach collected sampling data }; } if (part.type === "finish-step") { return { modelId: part.response.modelId }; } return undefined; }, }); }`

**Step 2: That's it.** The telemetry reporter automatically reads `samplingCalls` from message metadata and attaches the data to matching tool calls in the report. The Cloud dashboard will show each delegated model in the model distribution chart with its own token and cost breakdown.

For MCP tools that use the sampling protocol, `wrapSamplingHandler` can wrap the MCP client's sampling handler directly to capture all nested LLM calls transparently.

**On older versions** that don't yet read `samplingCalls` from metadata, use `beforeReport` to inject the data manually:

`telemetry: { beforeReport: (report) => ({ ...report, tool_calls: report.tool_calls?.map((tc) => ({ ...tc, sampling_calls: samplingCalls[tc.tool_call_id], })), }), }`

## [Authentication](#authentication)

The React example above uses anonymous mode for quick demos. For production apps with user accounts, pass an explicit cloud instance with a token from your auth provider:

- value

  React

`import { useMemo } from "react"; import { useAuth } from "@clerk/nextjs"; import { AssistantCloud } from "assistant-cloud"; import { useCloudChat } from "@assistant-ui/cloud-ai-sdk"; function Chat() { const { getToken } = useAuth(); const cloud = useMemo(() => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: async () => getToken({ template: "assistant-ui" }), }), [getToken]); const { messages, sendMessage, threads } = useCloudChat({ cloud }); // ... }`

- value

  React Native

`import { useMemo } from "react"; import { AssistantCloud } from "assistant-cloud"; import { useCloudChat } from "@assistant-ui/cloud-ai-sdk"; async function getAssistantToken() { // Return a user token from your native auth provider. return "..."; } function Chat() { const cloud = useMemo(() => new AssistantCloud({ baseUrl: process.env.EXPO_PUBLIC_ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), []); const { messages, sendMessage, threads } = useCloudChat({ cloud }); // ... }`

- value

  React Ink

`import { useMemo } from "react"; import { AssistantCloud } from "assistant-cloud"; import { useCloudChat } from "@assistant-ui/cloud-ai-sdk"; async function getAssistantToken() { // Return a user token from your CLI auth flow. return "..."; } function Chat() { const cloud = useMemo(() => new AssistantCloud({ baseUrl: process.env.ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), []); const { messages, sendMessage, threads } = useCloudChat({ cloud }); // ... }`

See the

- href

  /docs/cloud/authorization

Cloud Authorization

guide for other auth providers.

## [Next Steps](#next-steps)

- If you want pre-built UI components, see

  - href

    /docs/cloud/ai-sdk-assistant-ui

  AI SDK + assistant-ui

  for the full integration

- Learn about

  - href

    /docs/cloud/authorization

  user authentication

  for multi-user applications

- Check out the

  - href

    https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-cloud-standalone

  complete example

  on GitHub