# Cloud Persistence
URL: /docs/cloud

Add managed thread persistence and chat history to your AI app in minutes — assistant-ui Cloud handles thread sync, search, and multi-tenant storage.

Assistant Cloud is a hosted service that adds thread management, message persistence, and user authorization to AI chat applications. It works with any React UI—whether you use assistant-ui components or your own.

## [What You Get](#what-you-get)

- **Thread Persistence** — Messages automatically save as conversations progress. Users can resume chats at any time, even across sessions.
- **Thread List** — Built-in UI components (or hooks) for browsing, switching, and managing conversations.
- **Auto-Generated Titles** — Conversations get meaningful titles based on the initial messages.
- **User Authorization** — Integrates with your auth provider to scope threads per user or workspace.

## [Supported Backends](#supported-backends)

| Backend   | Standalone Mode                            | With assistant-ui                                         |
| --------- | ------------------------------------------ | --------------------------------------------------------- |
| AI SDK    | - href

  /docs/cloud/ai-sdk`useCloudChat` | * href

  /docs/cloud/ai-sdk-assistant-ui`useChatRuntime` |
| LangGraph | —                                          | - href

  /docs/cloud/langgraph`useLangGraphRuntime`      |
| Custom    | —                                          | Local Runtime                                             |

## [Getting Started](#getting-started)

You'll need an Assistant Cloud account.

- href

  https\://cloud.assistant-ui.com/

Sign up here

to create a project.

From your project settings, copy the **Frontend API URL** (`https://proj-[ID].assistant-api.com`)—you'll need it for the guides below.

### [Choose Your Integration Path](#choose-your-integration-path)

**Using AI SDK with your own UI?**\
→ Follow the

- href

  /docs/cloud/ai-sdk

AI SDK guide

for the `useCloudChat` hook. One hook, minimal changes to your existing code.

**Want pre-built components like `<Thread />` and `<ThreadList />`?**\
→ Follow the

- href

  /docs/cloud/ai-sdk-assistant-ui

AI SDK + assistant-ui guide

for full UI components with cloud persistence.

**Using LangGraph?**\
→ Follow the

- href

  /docs/cloud/langgraph

LangGraph guide

for cloud-backed LangGraph Cloud integration.

## [Example Repositories](#example-repositories)

- - href

    https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-cloud-standalone

  AI SDK (standalone)

  — Minimal `useCloudChat` setup

- - href

    https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-cloud

  AI SDK + assistant-ui

  — Full component integration

- - href

    https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-langgraph

  LangGraph + assistant-ui

  — LangGraph Cloud with persistence