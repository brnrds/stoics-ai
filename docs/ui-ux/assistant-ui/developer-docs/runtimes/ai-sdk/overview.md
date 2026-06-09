# Vercel AI SDK Runtime
URL: /docs/runtimes/ai-sdk/overview

Connect the Vercel AI SDK to a React chat UI via assistant-ui — useChat hooks, custom transports, frontend tools, attachments, multi-step agents, and token usage.

`@assistant-ui/react-ai-sdk` integrates assistant-ui with the

- href

  https\://ai-sdk.dev/

Vercel AI SDK

. It covers `useChat` flows, custom transports, frontend tools, attachments, quote context, multi-step agents, token usage, and cloud persistence.

## [Pick a version](#pick-a-version)

| AI SDK                       | Runtime package                       | Docs                                                 |
| ---------------------------- | ------------------------------------- | ---------------------------------------------------- |
| `ai@^6` + `@ai-sdk/react@^3` | `@assistant-ui/react-ai-sdk` (latest) | - href

  /docs/runtimes/ai-sdk/v6v6 (current)       |
| `ai@^5` + `@ai-sdk/react@^2` | `@assistant-ui/react-ai-sdk@0.x`      | * href

  /docs/runtimes/ai-sdk/v5-legacyv5 (legacy) |
| `ai@^4`                      | `@assistant-ui/react-data-stream`     | - href

  /docs/runtimes/ai-sdk/v4-legacyv4 (legacy) |

New projects should target v6. v5 and v4 are documented for projects that have not migrated yet; both have known compatibility gaps and receive no new features.

## [Architecture](#architecture)

`@assistant-ui/react-ai-sdk` is layered on `ExternalStoreRuntime` (see

- href

  /docs/runtimes/concepts/architecture

architecture

). Features that ship as runtime adapters work the same way they do everywhere else; see

- href

  /docs/runtimes/concepts/adapters

adapters

.

## [Choosing useChatRuntime vs useAISDKRuntime](#choosing-usechatruntime-vs-useaisdkruntime)

Both ship in the same package.

- **`useChatRuntime`** (recommended) wraps the AI SDK's `useChat` hook and adds cloud thread support, the standard adapter slots, and `AssistantChatTransport` (which forwards system messages and frontend tools by default). Use this unless you have a reason not to.
- **`useAISDKRuntime`** is a lower-level hook that takes an existing `useChat` instance you control directly. Use it when you need to share the chat instance with non-assistant-ui code or wire in a custom transport that does not inherit from `AssistantChatTransport`.

## [Next](#next)

- href

  /docs/runtimes/ai-sdk/v6

v6 (current)Quickstart, frontend tools, attachments, quotes, history, multi-step, useAISDKRuntime.

- href

  /docs/runtimes/ai-sdk/v5-legacy

v5 (legacy)Reference for projects still on AI SDK v5.

- href

  /docs/runtimes/ai-sdk/v4-legacy

v4 (legacy)Reference for projects still on AI SDK v4.