# Custom Runtime
URL: /docs/runtimes/custom/overview

Build a React chat UI for any AI backend with assistant-ui — four runtime patterns covering local state, REST, custom protocols, and external runtimes.

If no

- href

  /docs/runtimes/pick-a-runtime

framework adapter

fits your backend, this section gives you four building blocks. All four are built on one of the two core runtimes; understanding the layering (see

- href

  /docs/runtimes/concepts/architecture

architecture

) makes the choice clear.

## [The four paths](#the-four-paths)

| Path                                                                    | Layered on                      | Wire shape                                  | Choose when                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| - href

  /docs/runtimes/custom/local-runtime`LocalRuntime`             | Core                            | You write a `ChatModelAdapter.run` function | The simplest case: you have a `fetch` call to make, want assistant-ui to handle state                     |
| * href

  /docs/runtimes/custom/external-store`ExternalStoreRuntime`    | Core                            | You provide messages + callbacks            | You already have state in redux, zustand, tanstack-query, or anywhere                                     |
| - href

  /docs/runtimes/custom/data-stream`DataStream`                 | LocalRuntime + protocol         | Your backend emits the data stream protocol | You want a thin message-stream contract, or you are migrating from AI SDK v4                              |
| * href

  /docs/runtimes/custom/assistant-transport`AssistantTransport` | ExternalStoreRuntime + protocol | Your backend streams agent state snapshots  | Your agent has rich internal state and you want it surfaced in the UI; or you need bidirectional commands |

## [Decision tree](#decision-tree)

`do you have an AI SDK / LangGraph / Google ADK / A2A backend? └── yes → use that framework adapter; you do not need this section └── no → continue │ do you already have message state in redux / zustand / tanstack-query? └── yes → ExternalStoreRuntime └── no → continue │ do you control the backend wire format? └── yes, and i want simple fetch calls → LocalRuntime └── yes, and i want to stream a structured agent state → AssistantTransport └── no, the backend already speaks data stream protocol → DataStream`

## [What each path gives you](#what-each-path-gives-you)

**`LocalRuntime`** is the lowest-friction path. You implement one method (`run` or `async *run`). Branching, editing, regeneration, multi-thread, and adapter slots all work without extra code.

**`ExternalStoreRuntime`** is the inverse: you own the message array and provide callbacks for each interaction. UI features turn on based on which callbacks you provide. Ideal when chat state is a first-class entity in your existing store.

**`DataStream`** is `LocalRuntime` plus a wire protocol. You do not write a `ChatModelAdapter`; your backend emits a standardized stream of message parts and the runtime consumes it directly.

**`AssistantTransport`** is `ExternalStoreRuntime` plus a state-streaming protocol. Instead of sending message parts, your backend sends snapshots of its full agent state. The UI is a stateless view on top of that state. Supports custom commands beyond the built-in `add-message` and `add-tool-result`.

## [Common building blocks](#common-building-blocks)

Regardless of which path you pick, the

- href

  /docs/runtimes/concepts/adapters

adapter

and

- href

  /docs/runtimes/concepts/threads

thread

interfaces work the same way. Wire attachments, history, speech, feedback, suggestions, and multi-thread support through those shared contracts.

## [Next](#next)

- href

  /docs/runtimes/custom/local-runtime

LocalRuntimeWrite a single ChatModelAdapter.run function.

- href

  /docs/runtimes/custom/external-store

ExternalStoreRuntimeBring redux, zustand, tanstack-query, or your own state.

- href

  /docs/runtimes/custom/data-stream

Data StreamStandard message-stream protocol on top of LocalRuntime.

- href

  /docs/runtimes/custom/assistant-transport

Assistant TransportStream full agent state snapshots and bidirectional commands.