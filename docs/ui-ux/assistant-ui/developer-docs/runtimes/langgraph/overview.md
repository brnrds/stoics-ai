# LangGraph UI Runtime
URL: /docs/runtimes/langgraph/overview

Build a chat UI for LangGraph agents in React with assistant-ui — streaming, subgraph events, UI messages, interrupts, and end-to-end cancellation supported.

`@assistant-ui/react-langgraph` integrates with

- href

  https\://docs.langchain.com/oss/javascript/langgraph-sdk

`@langchain/langgraph-sdk`

directly, exposing the full LangGraph Cloud feature set in assistant-ui: streaming, subgraph events, UI messages, message metadata, interrupts, and end-to-end cancellation.

**Migrating from LangServe?** LangChain has deprecated `RemoteRunnable` upstream and consolidated the chain and agent execution stories under LangGraph. Rebuild your chain as a LangGraph graph (LangChain's

- href

  https\://github.com/langchain-ai/langserve/blob/main/MIGRATION.md

LangServe → LangGraph migration guide

covers the shape change), deploy via LangGraph Cloud or self-host LangGraph Studio, and use this runtime on the frontend. The runtime ships streaming, interrupts, generative UI, message metadata, and end-to-end cancellation out of the box.

## [When to use it](#when-to-use-it)

Pick the LangGraph runtime when:

- You have (or want) a LangGraph Cloud server, locally via

  - href

    https\://github.com/langchain-ai/langgraph-studio

  LangGraph Studio

  or hosted via

  - href

    https\://www\.langchain.com/langsmith

  LangSmith

  .

- Your graph state has a `messages` key with LangChain-alike messages.

- You want generative UI (`ui_message`), per-message metadata, subgraph events, or checkpoint-based message editing.

If you are already using `@langchain/react`'s `useStream` hook, the alternative

- href

  /docs/runtimes/langchain

`@assistant-ui/react-langchain`

adapter may fit better. It delegates the stream plumbing to the upstream hook; the feature surface differs, see

- href

  /docs/runtimes/langchain

LangChain useStream

for the comparison table.

## [Architecture](#architecture)

`@assistant-ui/react-langgraph` is layered on `ExternalStoreRuntime` (see

- href

  /docs/runtimes/concepts/architecture

architecture

). Graph state is the source of truth; the runtime renders messages from `state.values.messages` and submits user input back to the graph.

Shared adapters (attachments, speech, feedback, history) work the same way described in

- href

  /docs/runtimes/concepts/adapters

adapters

.

## [Requirements](#requirements)

- A LangGraph Cloud API server.
- React 18 or 19.
- The graph state must include a `messages` key with LangChain-alike messages.

## [Install](#install)

- value

  React

* packages

  - @assistant-ui/react
  - @assistant-ui/react-langgraph
  - @langchain/langgraph-sdk

- value

  React Native

* packages

  - @assistant-ui/react-native
  - @assistant-ui/react-langgraph
  - @langchain/langgraph-sdk

- value

  React Ink

* packages

  - @assistant-ui/react-ink
  - @assistant-ui/react-langgraph
  - @langchain/langgraph-sdk
  - ink
  - react

## [Next](#next)

- href

  /docs/runtimes/langgraph/quickstart

QuickstartFrom-template and manual setup paths to a working LangGraph chat.

- href

  /docs/runtimes/langgraph/streaming

StreamingEvent handlers, message metadata, generative UI.

- href

  /docs/runtimes/langgraph/interrupts

InterruptsInterrupt persistence and checkpoint-based message editing.

- href

  /docs/runtimes/langgraph/threads

ThreadsBasic thread support, AssistantCloud, custom thread list adapter.

- href

  /docs/runtimes/langgraph/tutorial/introduction

Tutorial: StockbrokerEnd-to-end stockbroker assistant with generative UI and approval flows.