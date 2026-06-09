# A2A Agent Runtime
URL: /docs/runtimes/a2a/overview

Connect any A2A v1.0 protocol-compliant agent server to a React chat UI with assistant-ui — full streaming, tool calls, and message metadata supported.

`@assistant-ui/react-a2a` is a runtime adapter for the

- href

  https\://github.com/a2aproject/A2A

A2A (Agent-to-Agent) v1.0 protocol

. Use it when your backend speaks A2A; the adapter handles the wire protocol so you can focus on the UI.

## [When to use it](#when-to-use-it)

Pick the A2A runtime when:

- You have an A2A v1.0 compatible agent server, or you are building one and want a reference client.
- You want streaming task state, artifacts, and the protocol's full state machine surfaced in the UI.
- You need multi-tenant or extension-aware A2A clients.

If your backend is not A2A-compliant, see

- href

  /docs/runtimes/pick-a-runtime

picking a runtime

for alternatives.

## [Architecture](#architecture)

`@assistant-ui/react-a2a` is layered on `ExternalStoreRuntime` (see

- href

  /docs/runtimes/concepts/architecture

architecture

). Features that ship as runtime adapters (attachments, speech, feedback, history, threads) work the same way they do everywhere else; see

- href

  /docs/runtimes/concepts/adapters

adapters

.

## [Requirements](#requirements)

- An A2A v1.0 compatible agent server.
- React 18 or 19.

## [Install](#install)

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-a2a

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-a2a

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-a2a
  - ink
  - react

## [Next](#next)

- href

  /docs/runtimes/a2a/quickstart

QuickstartMinimal runtime setup with a Thread component.

- href

  /docs/runtimes/a2a/client-and-hooks

Client and hooksA2AClient, useA2ARuntime options, hooks reference, task states, artifacts.