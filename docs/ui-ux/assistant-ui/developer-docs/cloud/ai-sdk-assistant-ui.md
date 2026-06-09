# AI SDK + assistant-ui
URL: /docs/cloud/ai-sdk-assistant-ui

Integrate cloud persistence using assistant-ui runtime and pre-built components.

## [Overview](#overview)

This guide shows how to integrate Assistant Cloud with the

- href

  https\://sdk.vercel.ai/

AI SDK

using assistant-ui's runtime system and pre-built UI components.

## [What You Get](#what-you-get)

This integration provides:

- **`<Thread />`** — A complete chat interface with messages, composer, and status indicators
- **`<ThreadList />`** — A sidebar showing all conversations with auto-generated titles, plus new/delete/manage actions
- **Automatic Persistence** — Messages save as they stream. Threads are created automatically on first message.
- **Runtime Integration** — The assistant-ui runtime handles all cloud synchronization behind the scenes.

## [How It Works](#how-it-works)

The `useChatRuntime` hook from `@assistant-ui/react-ai-sdk` wraps AI SDK's `useChat` and adds cloud persistence via the `cloud` parameter. The runtime automatically:

1. Creates a cloud thread on the first user message
2. Persists messages as they complete streaming
3. Generates a conversation title after the assistant's first response
4. Loads historical messages when switching threads via `<ThreadList />`

You provide the cloud configuration—everything else is handled. The default `AssistantChatTransport` automatically sends requests to `/api/chat`.

## [Prerequisites](#prerequisites)

You need an assistant-cloud account to follow this guide.

- href

  https\://cloud.assistant-ui.com/

Sign up here

to get started.

## [Setup Guide](#setup-guide)

### [Create a Cloud Project](#create-a-cloud-project)

Create a new project in the

- href

  https\://cloud.assistant-ui.com/

assistant-cloud dashboard

and from the settings page, copy:

- **Frontend API URL**: `https://proj-[ID].assistant-api.com`
- **Assistant Cloud API Key**: `sk_aui_proj_*`

### [Configure Environment Variables](#configure-environment-variables)

Add the following environment variables to your project:

- value

  React

* title

  .env.local

`# Frontend API URL from your cloud project settings NEXT_PUBLIC_ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com # API key for server-side operations ASSISTANT_API_KEY=your-api-key-here`

- value

  React Native

* title

  .env

`# Client API URL from your cloud project settings EXPO_PUBLIC_ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com # API key for server-side operations; do not ship this in your app bundle ASSISTANT_API_KEY=your-api-key-here`

- value

  React Ink

* title

  .env

`# Client API URL from your cloud project settings ASSISTANT_BASE_URL=https://proj-[YOUR-ID].assistant-api.com # API key for server-side operations; do not ship this in your CLI bundle ASSISTANT_API_KEY=your-api-key-here`

### [Install Dependencies](#install-dependencies)

Install the required packages:

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-ai-sdk

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-ai-sdk
  - assistant-cloud

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-ai-sdk
  - assistant-cloud
  - ink
  - react

### [Set Up the Cloud Runtime](#set-up-the-cloud-runtime)

Create a client-side AssistantCloud instance and integrate it with your AI SDK runtime:

- value

  React

* title

  app/chat/page.tsx

`"use client"; import { useMemo } from "react"; import { AssistantCloud, AssistantRuntimeProvider } from "@assistant-ui/react"; import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; import { ThreadList } from "@/components/assistant-ui/thread-list"; import { Thread } from "@/components/assistant-ui/thread"; export default function ChatPage() { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, anonymous: true, // Creates browser-session based user ID }), [], ); const runtime = useChatRuntime({ cloud, }); return ( <AssistantRuntimeProvider runtime={runtime}> <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4"> <ThreadList /> <Thread /> </div> </AssistantRuntimeProvider> ); }`

- value

  React Native

* title

  app/chat.tsx

`import { useMemo } from "react"; import { Text, View } from "react-native"; import { AssistantRuntimeProvider, ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react-native"; import { AssistantCloud } from "assistant-cloud"; import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; import { Thread } from "@/components/assistant-ui/thread"; async function getAssistantToken() { // Return a user token from your auth provider. return "..."; } function ThreadList() { return ( <ThreadListPrimitive.Root> <ThreadListPrimitive.New> <Text>New chat</Text> </ThreadListPrimitive.New> <ThreadListPrimitive.Items renderItem={({ threadId }) => ( <ThreadListItemPrimitive.Root key={threadId}> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title fallback="New conversation" /> </ThreadListItemPrimitive.Trigger> </ThreadListItemPrimitive.Root> )} /> </ThreadListPrimitive.Root> ); } export default function ChatScreen() { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.EXPO_PUBLIC_ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), [], ); const runtime = useChatRuntime({ cloud }); return ( <AssistantRuntimeProvider runtime={runtime}> <View style={{ flex: 1 }}> <ThreadList /> <Thread /> </View> </AssistantRuntimeProvider> ); }`

- value

  React Ink

* title

  chat.tsx

`import { useMemo } from "react"; import { Box, Text } from "ink"; import { AssistantRuntimeProvider, ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react-ink"; import { AssistantCloud } from "assistant-cloud"; import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; import { Thread } from "./components/thread.js"; async function getAssistantToken() { // Return a user token from your auth provider. return "..."; } function ThreadList() { return ( <ThreadListPrimitive.Root> <ThreadListPrimitive.New> <Text color="green">[New chat]</Text> </ThreadListPrimitive.New> <ThreadListPrimitive.Items renderItem={({ threadId }) => ( <ThreadListItemPrimitive.Root key={threadId}> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title fallback="New conversation" /> </ThreadListItemPrimitive.Trigger> </ThreadListItemPrimitive.Root> )} /> </ThreadListPrimitive.Root> ); } export function Chat() { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), [], ); const runtime = useChatRuntime({ cloud }); return ( <AssistantRuntimeProvider runtime={runtime}> <Box flexDirection="column"> <ThreadList /> <Thread /> </Box> </AssistantRuntimeProvider> ); }`

## [`useChatRuntime` Options](#usechatruntime-options)

- `cloud` `?: AssistantCloud`

  Optional AssistantCloud instance for chat persistence and thread management.

- `adapters` `?: RuntimeAdapters`

  Optional runtime adapters to extend or override built-in functionality.

  - `attachments` `?: AttachmentAdapter`

    Custom attachment adapter for file uploads. Defaults to the Vercel AI SDK attachment adapter.

  - `speech` `?: SpeechSynthesisAdapter`

    Adapter for text-to-speech functionality.

  - `dictation` `?: DictationAdapter`

    Adapter for speech-to-text dictation input.

  - `feedback` `?: FeedbackAdapter`

    Adapter for collecting user feedback on messages.

  - `history` `?: ThreadHistoryAdapter`

    Adapter for loading and saving thread history. Used to restore previous messages when switching threads. The adapter must implement \`withFormat\` when used with AI SDK — see

    - href

      /docs/runtimes/ai-sdk/v6#persisting-chat-history

    Persisting Chat History

    .

- `toCreateMessage` `?: (message: AppendMessage) => CreateUIMessage`

  Optional custom function to convert an assistant-ui AppendMessage into an AI SDK CreateUIMessage before sending. Use this to customize how outgoing messages are formatted, for example to add custom metadata or transform content parts.

- `transport` `?: ChatTransport`

  Custom transport implementation. Defaults to AssistantChatTransport which sends requests to '/api/chat'.

## [Telemetry](#telemetry)

The `useChatRuntime` hook captures full run telemetry including timing data. This integrates with the assistant-ui runtime to provide:

**Automatically captured:**

- `status` — `"completed"`, `"incomplete"`, or `"error"`
- `duration_ms` — Total run duration (measured client-side)
- `steps` — Per-step breakdowns with timing, usage, and tool calls
- `tool_calls` — Tool invocations with name, arguments, results, and source
- `total_steps` — Number of reasoning/tool steps
- `output_text` — Full response text (truncated at 50K characters)

**Requires route configuration:**

- `model_id` — The model used
- `input_tokens` / `output_tokens` — Token usage statistics

To capture model and usage data, add the `messageMetadata` callback to your AI SDK route:

- title

  app/api/chat/route.ts

`import { streamText } from "ai"; import { openai } from "@ai-sdk/openai"; export async function POST(req: Request) { const { messages } = await req.json(); const result = streamText({ model: openai("gpt-5.4-mini"), messages, }); return result.toUIMessageStreamResponse({ messageMetadata: ({ part }) => { if (part.type === "finish") { return { usage: part.totalUsage, }; } if (part.type === "finish-step") { return { modelId: part.response.modelId, }; } return undefined; }, }); }`

Without this configuration, model and token data will be omitted from telemetry reports.

### [Customizing Reports](#customizing-reports)

Use the `beforeReport` hook to add custom metadata or filter reports:

`const cloud = new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, anonymous: true, telemetry: { beforeReport: (report) => ({ ...report, metadata: { userTier: "pro", region: "us-east" }, }), }, });`

Return `null` from `beforeReport` to skip reporting a specific run. To disable telemetry entirely, pass `telemetry: false`.

### [Sub-Agent Model Tracking](#sub-agent-model-tracking)

When tool calls delegate to a different model (e.g., the main run uses GPT but a tool invokes Gemini), you can track the delegated model's usage. Pass sampling call data through `messageMetadata.samplingCalls` in your API route, and the telemetry reporter will automatically include it in the report.

See the

- href

  /docs/cloud/ai-sdk#sub-agent-model-tracking

AI SDK Telemetry guide

for the full setup with `createSamplingCollector` and `wrapSamplingHandler`.

## [Authentication](#authentication)

The React example above uses anonymous mode for quick demos. For production apps with user accounts, pass an explicit cloud instance with a token from your auth provider:

- value

  React

`import { useMemo } from "react"; import { useAuth } from "@clerk/nextjs"; import { AssistantCloud } from "@assistant-ui/react"; import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; function Chat() { const { getToken } = useAuth(); const cloud = useMemo(() => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: async () => getToken({ template: "assistant-ui" }), }), [getToken]); const runtime = useChatRuntime({ cloud }); // ... }`

- value

  React Native

`import { useMemo } from "react"; import { AssistantCloud } from "assistant-cloud"; import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; async function getAssistantToken() { // Return a user token from your native auth provider. return "..."; } function Chat() { const cloud = useMemo(() => new AssistantCloud({ baseUrl: process.env.EXPO_PUBLIC_ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), []); const runtime = useChatRuntime({ cloud }); // ... }`

- value

  React Ink

`import { useMemo } from "react"; import { AssistantCloud } from "assistant-cloud"; import { useChatRuntime } from "@assistant-ui/react-ai-sdk"; async function getAssistantToken() { // Return a user token from your CLI auth flow. return "..."; } function Chat() { const cloud = useMemo(() => new AssistantCloud({ baseUrl: process.env.ASSISTANT_BASE_URL!, authToken: getAssistantToken, }), []); const runtime = useChatRuntime({ cloud }); // ... }`

See the

- href

  /docs/cloud/authorization

Cloud Authorization

guide for other auth providers.

## [Complete Example](#complete-example)

Check out the

- href

  https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-cloud

with-cloud example

on GitHub for a fully working implementation.