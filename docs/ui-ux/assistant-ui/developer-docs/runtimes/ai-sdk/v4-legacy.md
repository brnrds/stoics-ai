# AI SDK v4 (legacy)
URL: /docs/runtimes/ai-sdk/v4-legacy

Reference for projects still on AI SDK v4. New projects should use v6.

AI SDK v4 is a legacy version. New projects should use

- href

  /docs/runtimes/ai-sdk/v6

AI SDK v6

. v4 integrations use the older `@assistant-ui/react-data-stream` package, not `@assistant-ui/react-ai-sdk`.

## [Why legacy](#why-legacy)

Vercel ships AI SDK majors roughly yearly; v4 is two majors behind v6. The current `@assistant-ui/react-ai-sdk` package targets v6+ exclusively, so v4 users plug into

- href

  /docs/runtimes/custom/data-stream

`@assistant-ui/react-data-stream`

instead — the same data stream protocol that v4's `toDataStreamResponse()` emits.

This page is reference for existing v4 projects. Plan to migrate to v6 when feasible.

## [Setup](#setup)

### [Install](#install)

- packages

  - @assistant-ui/react
  - @assistant-ui/react-data-stream
  - ai@^4

### [Backend route](#backend-route)

- title

  @/app/api/chat/route.ts

`import { streamText } from "ai"; import { openai } from "@ai-sdk/openai"; export async function POST(req: Request) { const { messages } = await req.json(); const result = streamText({ model: openai("gpt-5.4-nano"), messages }); return result.toDataStreamResponse(); }`

### [Frontend](#frontend)

- title

  @/app/page.tsx

`"use client"; import { AssistantRuntimeProvider } from "@assistant-ui/react"; import { useDataStreamRuntime } from "@assistant-ui/react-data-stream"; import { Thread } from "@/components/assistant-ui/thread"; export default function Home() { const runtime = useDataStreamRuntime({ api: "/api/chat" }); return ( <AssistantRuntimeProvider runtime={runtime}> <div className="h-full"> <Thread /> </div> </AssistantRuntimeProvider> ); }`

`useDataStreamRuntime` accepts `api`, `initialMessages`, `onFinish`, `onError`, `headers`, `body`, and the standard `LocalRuntimeOptions`. For the full reference, see

- href

  /docs/runtimes/custom/data-stream

Data Stream Protocol

.

## [Differences from v6](#differences-from-v6)

| Feature         | v4                                | v6                                        |
| --------------- | --------------------------------- | ----------------------------------------- |
| `ai` package    | `ai@^4`                           | `ai@^6`                                   |
| Runtime package | `@assistant-ui/react-data-stream` | `@assistant-ui/react-ai-sdk`              |
| Runtime hook    | `useDataStreamRuntime`            | `useChatRuntime`                          |
| Response        | `toDataStreamResponse()`          | `toUIMessageStreamResponse()`             |
| Tool schema     | `parameters: z.object({...})`     | `inputSchema: zodSchema(z.object({...}))` |
| Message type    | (untyped)                         | `UIMessage`                               |

## [Migration to v6](#migration-to-v6)

When you are ready to upgrade:

1. Swap `@assistant-ui/react-data-stream` for `@assistant-ui/react-ai-sdk`.

2. Update your backend to AI SDK v6's `streamText` (see

   - href

     /docs/runtimes/ai-sdk/v6

   v6 docs

   ).

3. Switch the runtime hook from `useDataStreamRuntime` to `useChatRuntime`.

AI SDK provides codemods at

- href

  https\://ai-sdk.dev/docs/migration-guides

ai-sdk.dev/docs/migration-guides

that handle the package-side rewrites.

## [Alternative: react-ai-sdk@0.1.10](#alternative-react-ai-sdk0110)

An older release line of `@assistant-ui/react-ai-sdk` (0.1.10) supported AI SDK v4 directly. It is no longer maintained and has no upgrade path; if you are starting a new v4 project, use `@assistant-ui/react-data-stream` instead.

## [Related](#related)

- href

  /docs/runtimes/ai-sdk/v6

AI SDK v6Current integration; what new projects should target.

- href

  /docs/runtimes/custom/data-stream

Data Stream ProtocolThe runtime v4 integrations are built on.

- href

  /docs/runtimes/ai-sdk/v5-legacy

AI SDK v5 (legacy)The intermediate legacy version.