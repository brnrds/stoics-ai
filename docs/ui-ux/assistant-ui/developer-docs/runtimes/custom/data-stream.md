# Data Stream Protocol
URL: /docs/runtimes/custom/data-stream

Standard message-streaming protocol on top of LocalRuntime.

`@assistant-ui/react-data-stream` consumes the data stream protocol, a standardized format for streaming AI responses. It is layered on `LocalRuntime` (see

- href

  /docs/runtimes/concepts/architecture

architecture

), so all `LocalRuntime` features apply.

The protocol supports streaming text, tool calls, conversation context, error handling, cancellation, and attachments.

## [When to use it](#when-to-use-it)

Pick this runtime when:

- Your backend already speaks the data stream protocol (or you can make it do so).

- You want a thin message-stream contract without writing a `ChatModelAdapter`.

- You are migrating from AI SDK v4 and want the v4 pattern preserved (see

  - href

    /docs/runtimes/ai-sdk/v4-legacy

  v4 docs

  ).

If your backend exposes a richer state surface, consider

- href

  /docs/runtimes/custom/assistant-transport

`AssistantTransport`

instead.

## [Install](#install)

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-data-stream

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-data-stream

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-data-stream
  - ink
  - react

## [Quickstart](#quickstart)

### [Set up the runtime](#set-up-the-runtime)

- value

  React

* title

  app/page.tsx

`"use client"; import { useDataStreamRuntime } from "@assistant-ui/react-data-stream"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { Thread } from "@/components/assistant-ui/thread"; export default function ChatPage() { const runtime = useDataStreamRuntime({ api: "/api/chat" }); return ( <AssistantRuntimeProvider runtime={runtime}> <Thread /> </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  app/index.tsx

``import { useDataStreamRuntime } from "@assistant-ui/react-data-stream"; import { AssistantRuntimeProvider } from "@assistant-ui/react-native"; import { View } from "react-native"; import { Thread } from "@/components/assistant-ui/thread"; const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"; export default function ChatPage() { const runtime = useDataStreamRuntime({ api: `${API_URL}/api/chat` }); return ( <AssistantRuntimeProvider runtime={runtime}> <View style={{ flex: 1 }}> <Thread /> </View> </AssistantRuntimeProvider> ); }``

- value

  React Ink

* title

  app.tsx

`import { useDataStreamRuntime } from "@assistant-ui/react-data-stream"; import { AssistantRuntimeProvider } from "@assistant-ui/react-ink"; import { Box } from "ink"; import { Thread } from "./components/thread.js"; export function App() { const runtime = useDataStreamRuntime({ api: "http://localhost:3000/api/chat", }); return ( <AssistantRuntimeProvider runtime={runtime}> <Box flexDirection="column"> <Thread /> </Box> </AssistantRuntimeProvider> ); }`

### [Create the backend endpoint](#create-the-backend-endpoint)

Your backend should accept POST requests and return data stream responses: For React Native and Ink, host this endpoint in a separate backend project and point the client runtime at its absolute URL.

- title

  app/api/chat/route.ts

`import { createAssistantStreamResponse } from "assistant-stream"; export async function POST(request: Request) { const { messages, tools, system, threadId } = await request.json(); return createAssistantStreamResponse(async (controller) => { const stream = await processWithAI({ messages, tools, system }); for await (const chunk of stream) { controller.appendText(chunk.text); } }); }`

The request body includes `messages`, `tools`, `system` (if configured), and `threadId`.

## [Headers and authentication](#headers-and-authentication)

``const runtime = useDataStreamRuntime({ api: "/api/chat", headers: { Authorization: `Bearer ${token}`, "X-Custom-Header": "value" }, credentials: "include", });``

Evaluate per-request:

``const runtime = useDataStreamRuntime({ api: "/api/chat", headers: async () => ({ Authorization: `Bearer ${await getAuthToken()}`, }), body: async () => ({ requestId: crypto.randomUUID(), timestamp: Date.now(), signature: await computeSignature(), }), });``

## [Event callbacks](#event-callbacks)

`const runtime = useDataStreamRuntime({ api: "/api/chat", onResponse: (response) => console.log("status:", response.status), onFinish: (message) => console.log("done:", message), onError: (error) => console.error(error), onCancel: () => console.log("cancelled"), });`

## [Tool integration](#tool-integration)

Human-in-the-loop tools (`unstable_humanToolNames`, `human()` interrupts) are not supported in the data stream runtime. Use

- href

  /docs/runtimes/custom/local-runtime

`LocalRuntime`

directly if you need approval flows.

### [Frontend tools](#frontend-tools)

Serialize client-side tools with `toToolsJSONSchema`:

``import { tool } from "@assistant-ui/react"; import { toToolsJSONSchema } from "assistant-stream"; const myTools = { get_weather: tool({ description: "Get current weather", parameters: z.object({ location: z.string() }), execute: async ({ location }) => { const weather = await fetchWeather(location); return `Weather in ${location}: ${weather}`; }, }), }; const runtime = useDataStreamRuntime({ api: "/api/chat", body: { tools: toToolsJSONSchema(myTools) }, });``

### [Backend tool processing](#backend-tool-processing)

- title

  Backend tool handling

`const { tools } = await request.json(); const response = await ai.generateText({ messages, tools });`

Tool results stream back automatically.

## [Message conversion](#message-conversion)

### [Generic (recommended)](#generic-recommended)

`import { toGenericMessages, toToolsJSONSchema } from "assistant-stream"; const genericMessages = toGenericMessages(messages); const toolSchemas = toToolsJSONSchema(tools);`

`GenericMessage` is a union of `system`, `user` (with text and file parts), `assistant` (with text and tool-call parts), and `tool` (with tool-result parts). It is easy to convert to any LLM provider format.

### [AI SDK specific](#ai-sdk-specific)

`import { toLanguageModelMessages } from "@assistant-ui/react-data-stream"; const languageModelMessages = toLanguageModelMessages(messages, { unstable_includeId: true, });`

`toLanguageModelMessages` internally uses `toGenericMessages` with AI-SDK-specific transformations. For new integrations prefer `toGenericMessages` directly.

## [Assistant Cloud integration](#assistant-cloud-integration)

`import { useCloudRuntime } from "@assistant-ui/react-data-stream"; const runtime = useCloudRuntime({ cloud: assistantCloud, assistantId: "my-assistant-id", });`

`useCloudRuntime` is currently under active development and not yet ready for production.

## [LocalRuntimeOptions](#localruntimeoptions)

`useDataStreamRuntime` accepts every `LocalRuntimeOptions` option in addition to its own. The `chatModel` adapter slot is handled internally and cannot be overridden.

`const runtime = useDataStreamRuntime({ api: "/api/chat", initialMessages: [ { role: "user", content: [{ type: "text", text: "Hello" }] }, { role: "assistant", content: [{ type: "text", text: "Hi!" }] }, ], maxSteps: 5, cloud, // see "AssistantCloud" in /docs/runtimes/concepts/threads adapters: { attachments: myAttachmentAdapter, history: myHistoryAdapter, speech: mySpeechAdapter, feedback: myFeedbackAdapter, suggestion: mySuggestionAdapter, }, });`

See

- href

  /docs/runtimes/concepts/adapters

adapters

for adapter contracts and

- href

  /docs/runtimes/custom/local-runtime

LocalRuntime

for inherited options.

## [Error handling](#error-handling)

The runtime handles common error scenarios automatically:

- Network errors: retried with exponential backoff.
- Stream interruptions: gracefully handled with partial content preserved.
- Tool execution errors: displayed in the UI with error states.
- Cancellation: clean abort signal handling.

## [Examples](#examples)

- href

  https\://github.com/assistant-ui/assistant-ui/tree/main/examples

`examples/`

contains reference implementations.

## [API reference](#api-reference)

For the full hook reference, see

- href

  /docs/api-reference/integrations/react-data-stream

`@assistant-ui/react-data-stream` API

.

## [Related](#related)

- href

  /docs/runtimes/custom/local-runtime

LocalRuntimeThe core runtime data-stream is built on.

- href

  /docs/runtimes/custom/assistant-transport

Assistant TransportState-streaming protocol alternative.

- href

  /docs/runtimes/concepts/adapters

AdaptersAttachments, speech, feedback, history, suggestions.