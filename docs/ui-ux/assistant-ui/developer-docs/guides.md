# Guides
URL: /docs/guides

Practical recipes for building AI chat features in React with assistant-ui — attachments, branching, multi-agent, voice, slash commands, generative UI, and more.

Guides are task-oriented walkthroughs for building specific features on top of assistant-ui. They sit between the

- href

  /docs/primitives

Primitives

(low-level building blocks) and

- href

  /docs/ui/thread

Components

(pre-styled installs) — pick a guide when you know what you want to build and need the recommended pattern.

## [Composer](#composer)

Extend the message input with file attachments, mentions, slash commands, voice, and quoting.

- href

  /docs/guides/attachments

Attachments

Let users attach files, images, and documents to messages. Covers upload adapters, validation, and the typed `attachmentAddError` event.

- href

  /docs/guides/mentions

Mentions

`@`-style triggers that insert directives into the composer. Sync and async search patterns.

- href

  /docs/guides/slash-commands

Slash Commands

`/`-style commands with arguments, async loading, and combining with mentions.

- href

  /docs/guides/quoting

Quoting

Selection toolbar, programmatic `setQuote`, and forwarding quote context to the LLM.

- href

  /docs/guides/dictation

Dictation

Speech-to-text into the composer using `DictationAdapter` and `ComposerPrimitive.Dictate`.

## [Messages](#messages)

Customize how messages render, are edited, branched, and suggested.

- href

  /docs/guides/suggestions

Suggestions

Welcome-screen prompts, dynamic suggestions, and the `AuiIf` empty-thread pattern.

- href

  /docs/guides/editing

Editing

Edit user messages with `UserEditComposer`, `beginEdit()`, and edit-during-streaming behavior.

- href

  /docs/guides/branching

Branching

Navigate alternative message versions with `BranchPickerPrimitive`, reload, and direct branch-id navigation.

- href

  /docs/guides/message-timing

Message Timing

Display response duration and stream timing with `useMessageTiming` (experimental).

## [Tools & Generative UI](#tools--generative-ui)

Connect tools to the LLM and render their outputs as interactive UI.

- href

  /docs/guides/tools

Tools

Define tools with the Toolkit API, stream args, handle cancellation, and integrate with AI SDK / LangGraph / LangChain.

- href

  /docs/guides/tool-ui

Tool UI

Render tool calls and `DataMessagePart` into custom components, with fallback handling.

- href

  /docs/guides/interactables

Interactables

Persisted, schema-validated interactive UI driven by AI state.

- href

  /docs/guides/multi-agent

Multi-Agent

Sub-agent message attribution via `ToolCallMessagePart.messages` and LangGraph subgraph events.

## [Display](#display)

Render specialized message content.

- href

  /docs/guides/chain-of-thought

Chain of Thought

Display the assistant's reasoning steps in a collapsible accordion.

- href

  /docs/guides/latex

LaTeX

Render math via React Markdown or Streamdown, with streaming-safe escape rules.

## [Audio](#audio)

Voice input and output.

- href

  /docs/guides/voice

Voice

Realtime bidirectional audio with `RealtimeVoiceAdapter` and `createVoiceSession`.

- href

  /docs/guides/speech

Speech

Text-to-speech for assistant messages via `SpeechSynthesisAdapter`.

## [Programmatic](#programmatic)

Read and drive runtime state from your own code.

- href

  /docs/guides/context-api

Context API

Access threads, messages, composer, and tool state via `useAui` and the runtime scope tree.