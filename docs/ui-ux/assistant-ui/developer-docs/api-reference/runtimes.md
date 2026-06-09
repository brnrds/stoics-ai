# Runtime State API Reference
URL: /docs/api-reference/runtimes

Runtime state and actions exposed through useAui and useAuiState, covering AssistantRuntime, ThreadRuntime, ThreadListRuntime, ComposerRuntime, MessageRuntime, and attachment APIs for controlling assistant-ui chat.

Runtime state is the typed control surface behind assistant-ui. These pages document the actions and state objects available through `useAui`, `useAuiState`, and scoped runtimes.

## [Pages](#pages)

- href

  /docs/api-reference/runtimes/assistant-runtime

AssistantRuntimeTop-level assistant-ui runtime actions and state for tools, threads, composers, messages, and assistant behavior.

- href

  /docs/api-reference/runtimes/attachment-runtime

AttachmentRuntimeAttachmentRuntime state and actions for reading attachment data and controlling files inside assistant-ui messages and composers.

- href

  /docs/api-reference/runtimes/composer-runtime

ComposerRuntimeComposerRuntime state and actions for controlling assistant-ui composer text, attachments, submission, cancellation, and pending input.

- href

  /docs/api-reference/runtimes/message-part-runtime

MessagePartRuntimeMessagePartRuntime state and helpers for inspecting assistant-ui text, tool calls, data parts, reasoning, and custom message content.

- href

  /docs/api-reference/runtimes/message-runtime

MessageRuntimeMessageRuntime state and actions for editing, reloading, copying, rating, speaking, and branching assistant-ui messages.

- href

  /docs/api-reference/runtimes/queue-state

QueueItemStateState shape for queued assistant-ui thread operations and pending runtime work.

- href

  /docs/api-reference/runtimes/thread-list-item-runtime

ThreadListItemRuntimeThreadListItemRuntime state and actions for selecting, archiving, unarchiving, deleting, and renaming assistant-ui conversations.

- href

  /docs/api-reference/runtimes/thread-list-runtime

ThreadListRuntimeThreadListRuntime state and actions for managing remote assistant-ui conversations, active thread selection, and new thread creation.

- href

  /docs/api-reference/runtimes/thread-runtime

ThreadRuntimeThreadRuntime state and actions for controlling assistant-ui messages, composers, suggestions, model context, and the full thread lifecycle.