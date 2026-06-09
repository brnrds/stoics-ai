# AG-UI Agent Runtime
URL: /docs/runtimes/ag-ui/overview

Wire AG-UI (Agent-User Interaction) protocol agents into a React chat UI with assistant-ui — bidirectional events, generative UI, and human-in-the-loop.

`@assistant-ui/react-ag-ui` is a runtime adapter for the

- href

  https\://github.com/ag-ui-protocol/ag-ui

AG-UI (Agent-User Interaction) protocol

. It lets your assistant-ui frontend speak to any AG-UI-compliant agent server, including CopilotKit-based backends.

## [When to use it](#when-to-use-it)

Pick the AG-UI runtime when:

- Your backend implements the AG-UI protocol (e.g. CopilotKit agents, custom AG-UI servers).
- You want streaming text, thinking events, reasoning events, tool calls, and state snapshots in one protocol.
- You need agent-side state synchronization via `STATE_SNAPSHOT` and `STATE_DELTA` events.

If your backend is not AG-UI-compliant, see

- href

  /docs/runtimes/pick-a-runtime

picking a runtime

for alternatives.

## [Architecture](#architecture)

`@assistant-ui/react-ag-ui` is layered on `ExternalStoreRuntime` (see

- href

  /docs/runtimes/concepts/architecture

architecture

). The runtime owns AG-UI event parsing and message reconstruction; you provide an `HttpAgent` from `@ag-ui/client` and the adapter handles the wire protocol.

Shared adapters (attachments, speech, dictation, feedback, history) work the same way described in

- href

  /docs/runtimes/concepts/adapters

adapters

.

## [Requirements](#requirements)

- An AG-UI-compatible agent server.
- React 18 or 19.

## [Install](#install)

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-ag-ui
  - @ag-ui/client

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-ag-ui
  - @ag-ui/client

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-ag-ui
  - @ag-ui/client
  - ink
  - react

## [Example](#example)

- href

  https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-ag-ui

`examples/with-ag-ui`

shows a complete reference implementation. Or scaffold one directly:`npx assistant-ui@latest create my-app -e with-ag-ui`

## [Next](#next)

- href

  /docs/runtimes/ag-ui/quickstart

QuickstartMinimal HttpAgent + useAgUiRuntime setup.

- href

  /docs/runtimes/ag-ui/runtime-options

Runtime optionsuseAgUiRuntime options, adapters, events, thread list.