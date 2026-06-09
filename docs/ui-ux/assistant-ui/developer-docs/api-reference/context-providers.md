# Context Providers API Reference
URL: /docs/api-reference/context-providers

React context providers including AssistantRuntimeProvider that scope assistant-ui runtime, thread, message part, and attachment state for primitives, hooks, and custom chat components.

Context providers define where assistant-ui primitives and hooks read their state. Most apps only need `AssistantRuntimeProvider`, while scoped providers support custom renderers, isolated message parts, and advanced composition.

## [Pages](#pages)

- href

  /docs/api-reference/context-providers/assistant-runtime-provider

AssistantRuntimeProviderRoot React provider that connects an assistant-ui runtime to primitives, hooks, threads, and composer state.

- href

  /docs/api-reference/context-providers/scoped-providers

Scoped ProvidersLower-level assistant-ui providers for custom renderers, scoped message parts, attachments, and advanced composition.