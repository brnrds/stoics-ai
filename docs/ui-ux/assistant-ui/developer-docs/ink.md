# Terminal AI Chat with Ink
URL: /docs/ink

Build AI chat interfaces for the terminal in TypeScript with @assistant-ui/react-ink — streaming, tool calls, and keyboard navigation in CLI apps.

## [Quick Start](#quick-start)

The fastest way to get started with assistant-ui for the terminal.

### [Create a new project](#create-a-new-project)

`npx assistant-ui@latest create --ink my-chat-app cd my-chat-app`

### [Install dependencies](#install-dependencies)

`pnpm install`

### [Start the app](#start-the-app)

`pnpm dev`

## [Manual Setup](#manual-setup)

If you prefer to add assistant-ui to an existing Node.js project, follow these steps.

### [Install dependencies](#install-dependencies-1)

- packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-ink-markdown
  - ink
  - react

### [Create a chat model adapter](#create-a-chat-model-adapter)

Define how your app communicates with your AI backend. This example uses a simple streaming adapter:

- title

  adapters/my-chat-adapter.ts

`import type { ChatModelAdapter } from "@assistant-ui/react-ink"; export const myChatAdapter: ChatModelAdapter = { async *run({ messages, abortSignal }) { const response = await fetch("http://localhost:3000/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }), signal: abortSignal, }); const reader = response.body?.getReader(); if (!reader) throw new Error("No response body"); const decoder = new TextDecoder(); let fullText = ""; while (true) { const { done, value } = await reader.read(); if (done) break; const chunk = decoder.decode(value, { stream: true }); fullText += chunk; yield { content: [{ type: "text", text: fullText }] }; } }, };`

This is the same `ChatModelAdapter` interface used in `@assistant-ui/react` and `@assistant-ui/react-native`. If you already have an adapter, you can reuse it as-is.

### [Set up the runtime](#set-up-the-runtime)

- title

  app.tsx

`import { Box, Text } from "ink"; import { AssistantRuntimeProvider, useLocalRuntime, } from "@assistant-ui/react-ink"; import { myChatAdapter } from "./adapters/my-chat-adapter.js"; export function App() { const runtime = useLocalRuntime(myChatAdapter); return ( <AssistantRuntimeProvider runtime={runtime}> <Box flexDirection="column" padding={1}> <Text bold color="cyan">My Terminal Chat</Text> {/* your chat UI */} </Box> </AssistantRuntimeProvider> ); }`

### [Build your chat UI](#build-your-chat-ui)

Use primitives to compose your terminal chat interface:

- title

  components/thread.tsx

`import { Box, Text } from "ink"; import { ThreadPrimitive, ComposerPrimitive, useAuiState, } from "@assistant-ui/react-ink"; import { MarkdownText } from "@assistant-ui/react-ink-markdown"; const Message = () => { const message = useAuiState((s) => s.message); const isUser = message.role === "user"; const text = message.content .filter((p) => p.type === "text") .map((p) => ("text" in p ? p.text : "")) .join(""); if (isUser) { return ( <Box marginBottom={1}> <Text bold color="green">You: </Text> <Text wrap="wrap">{text}</Text> </Box> ); } return ( <Box flexDirection="column" marginBottom={1}> <Text bold color="blue">AI:</Text> <MarkdownText text={text} /> </Box> ); }; const StatusIndicator = () => { const isRunning = useAuiState((s) => s.thread.isRunning); if (!isRunning) return null; return ( <Box marginBottom={1}> <Text color="yellow">Thinking...</Text> </Box> ); }; export const Thread = () => { return ( <ThreadPrimitive.Root> <ThreadPrimitive.Empty> <Box marginBottom={1}> <Text dimColor>No messages yet. Start typing below!</Text> </Box> </ThreadPrimitive.Empty> <ThreadPrimitive.Messages> {() => <Message />} </ThreadPrimitive.Messages> <StatusIndicator /> <Box borderStyle="round" borderColor="gray" paddingX={1}> <Text color="gray">{"> "}</Text> <ComposerPrimitive.Input submitOnEnter placeholder="Type a message..." autoFocus /> </Box> </ThreadPrimitive.Root> ); };`

### [Render with Ink](#render-with-ink)

- title

  index.tsx

`import { render } from "ink"; import { App } from "./app.js"; render(<App />);`

## [What's Next?](#whats-next)

- href

  /docs/ink/migration

Migration from WebAlready using assistant-ui? Migrate your web app to the terminal.

- href

  /docs/ink/custom-backend

Custom BackendConnect to your own backend API or manage threads server-side.

- href

  /docs/ink/primitives

PrimitivesComposable terminal UI components for building chat interfaces.

- href

  https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-react-ink

Example AppFull terminal chat example with markdown rendering and streaming.