# Adapters API Reference
URL: /docs/api-reference/adapters

Adapter interfaces for connecting chat models, persistence, file attachments, feedback, and suggestions to assistant-ui React runtimes.

Adapters define the boundaries between assistant-ui and the systems around it. Use them when you need custom model execution, attachment handling, persistence, feedback collection, or prompt suggestions.

## [Pages](#pages)

- href

  /docs/api-reference/adapters/attachments

Attachment AdaptersAttachment adapters for uploading files, handling lifecycle events, and bringing app-owned content into assistant-ui composers and messages.

- href

  /docs/api-reference/adapters/feedback

Feedback AdapterCapture and respond to message feedback submitted through action primitives or runtime actions.

- href

  /docs/api-reference/adapters/model

Model AdaptersAdapter interfaces for connecting chat models, streaming responses, and model execution to assistant-ui runtimes.

- href

  /docs/api-reference/adapters/persistence

Persistence AdaptersPersistence adapters for saving assistant-ui message history, remote thread lists, and long-running chat sessions across browser reloads.

- href

  /docs/api-reference/adapters/runtime

Runtime Adapter ContextProvide assistant-ui runtime adapters through React context for model, attachment, speech, and feedback behavior.

- href

  /docs/api-reference/adapters/suggestions

Suggestion AdaptersSuggestion adapters for providing starter prompts, contextual actions, and guided composer options to assistant-ui runtimes.