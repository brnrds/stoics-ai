# OpenCode Runtime
URL: /docs/runtimes/opencode/overview

Build a React chat UI for OpenCode coding agents with assistant-ui — streaming, tool calls, file edits, and terminal output rendered in chat.

`@assistant-ui/react-opencode` is a runtime adapter for

- href

  https\://opencode.ai/

OpenCode

, an open-source AI coding agent. It wires the OpenCode server's session and event APIs into an assistant-ui thread, including tool permissions, interactive questions, and session state.

This adapter is at v0.0.3 and is experimental. The runtime API and exported hooks may change without notice.

## [When to use it](#when-to-use-it)

Pick the OpenCode runtime when:

- You are building a UI on top of an OpenCode agent server.
- You need first-class support for OpenCode's permission and question flows.
- You want session-aware features: fork, revert, unrevert, refresh.

If your backend is not OpenCode-based, see

- href

  /docs/runtimes/pick-a-runtime

picking a runtime

for alternatives.

## [Architecture](#architecture)

`@assistant-ui/react-opencode` is layered on `ExternalStoreRuntime` plus a `RemoteThreadList` for session-backed thread management (see

- href

  /docs/runtimes/concepts/architecture

architecture

). OpenCode sessions map to assistant-ui threads; the runtime subscribes to a server-sent event stream and projects messages into the thread.

## [Requirements](#requirements)

- A running

  - href

    https\://opencode.ai/

  OpenCode

  server (defaults to `http://localhost:4096`).

- React 18 or 19.

## [Install](#install)

- packages

  - @assistant-ui/react
  - @assistant-ui/react-opencode
  - @opencode-ai/sdk

## [Next](#next)

- href

  /docs/runtimes/opencode/quickstart

QuickstartMinimal useOpenCodeRuntime setup against a local OpenCode server.

- href

  /docs/runtimes/opencode/hooks

HooksPermissions, questions, session state, runtime extras.