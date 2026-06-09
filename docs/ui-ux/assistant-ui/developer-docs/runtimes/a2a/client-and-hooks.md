# Client and hooks
URL: /docs/runtimes/a2a/client-and-hooks

A2AClient, useA2ARuntime options, hooks, task states, artifacts, errors.

Deep dive on the runtime's API surface. Start with

- href

  /docs/runtimes/a2a

overview

and

- href

  /docs/runtimes/a2a/quickstart

quickstart

if you have not already.

## [A2AClient](#a2aclient)

The built-in `A2AClient` handles all communication with the A2A server: JSON serialization, SSE streaming, ProtoJSON enum normalization, and structured error handling.

`import { A2AClient } from "@assistant-ui/react-a2a"; const client = new A2AClient({ baseUrl: "https://my-agent.example.com", headers: { Authorization: "Bearer <token>" }, tenant: "my-org", extensions: ["urn:a2a:ext:my-extension"], });`

Pass a pre-built client to `useA2ARuntime`:

`const runtime = useA2ARuntime({ client });`

### [Client options](#client-options)

| Option       | Type                                                       | Description                                                                                  |
| ------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `baseUrl`    | `string`                                                   | Base URL of the A2A server.                                                                  |
| `basePath`   | `string`                                                   | Optional path prefix for API endpoints (e.g. `"/v1"`). Does not affect agent card discovery. |
| `headers`    | `Record<string, string>` or `() => Record<string, string>` | Static or dynamic headers (e.g. for auth tokens).                                            |
| `tenant`     | `string`                                                   | Tenant ID for multi-tenant servers (prepended to URL paths).                                 |
| `extensions` | `string[]`                                                 | Extension URIs to negotiate via `A2A-Extensions` header.                                     |

### [Client methods](#client-methods)

| Method                                               | Description                                               |
| ---------------------------------------------------- | --------------------------------------------------------- |
| `sendMessage(message, configuration?, metadata?)`    | Send a message (non-streaming).                           |
| `streamMessage(message, configuration?, metadata?)`  | Send a message with SSE streaming.                        |
| `getTask(taskId, historyLength?)`                    | Get a task by ID.                                         |
| `listTasks(request?)`                                | List tasks with filtering and pagination.                 |
| `cancelTask(taskId, metadata?)`                      | Cancel an in-progress task.                               |
| `subscribeToTask(taskId)`                            | Subscribe to SSE updates for a task.                      |
| `getAgentCard()`                                     | Fetch the agent card from `/.well-known/agent-card.json`. |
| `getExtendedAgentCard()`                             | Fetch the extended (authenticated) agent card.            |
| `createTaskPushNotificationConfig(config)`           | Create a push notification config.                        |
| `getTaskPushNotificationConfig(taskId, configId)`    | Get a push notification config.                           |
| `listTaskPushNotificationConfigs(taskId)`            | List push notification configs.                           |
| `deleteTaskPushNotificationConfig(taskId, configId)` | Delete a push notification config.                        |

## [useA2ARuntime options](#usea2aruntime-options)

Pass either a pre-built `client` or a `baseUrl` (the runtime creates a client for you). Other options layer on top.

| Option                 | Type                                                       | Description                                                                                           |
| ---------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `client`               | `A2AClient`                                                | Pre-built A2A client instance (provide this OR `baseUrl`).                                            |
| `baseUrl`              | `string`                                                   | A2A server URL (creates a client automatically).                                                      |
| `basePath`             | `string`                                                   | Path prefix for API endpoints. Only used with `baseUrl`.                                              |
| `tenant`               | `string`                                                   | Tenant ID for multi-tenant servers. Only used with `baseUrl`.                                         |
| `headers`              | `Record<string, string>` or `() => Record<string, string>` | Headers for the auto-created client.                                                                  |
| `extensions`           | `string[]`                                                 | Extension URIs to negotiate. Only used with `baseUrl`.                                                |
| `contextId`            | `string`                                                   | Initial context ID for the conversation.                                                              |
| `configuration`        | `A2ASendMessageConfiguration`                              | Default send message configuration.                                                                   |
| `onError`              | `(error: Error) => void`                                   | Error callback.                                                                                       |
| `onCancel`             | `() => void`                                               | Cancellation callback.                                                                                |
| `onArtifactComplete`   | `(artifact: A2AArtifact) => void`                          | Fired when an incremental artifact finishes.                                                          |
| `adapters.attachments` | `AttachmentAdapter`                                        | Custom attachment handling. See* href

  /docs/runtimes/concepts/adapters#attachment-adapteradapters. |
| `adapters.speech`      | `SpeechSynthesisAdapter`                                   | Text-to-speech. See* href

  /docs/runtimes/concepts/adapters#speech-adapteradapters.                 |
| `adapters.feedback`    | `FeedbackAdapter`                                          | Feedback collection. See* href

  /docs/runtimes/concepts/adapters#feedback-adapteradapters.          |
| `adapters.history`     | `ThreadHistoryAdapter`                                     | Message persistence. See* href

  /docs/runtimes/concepts/adapters#history-adapteradapters.           |
| `adapters.threadList`  | `UseA2AThreadListAdapter`                                  | Thread switching. See* href

  /docs/runtimes/concepts/threadsthreads.                                |

## [Hooks](#hooks)

### [Task state](#task-state)

`useA2ATask` returns the current A2A task object, including task state and status message.

- value

  React

`import { useA2ATask } from "@assistant-ui/react-a2a"; function TaskStatus() { const task = useA2ATask(); if (!task) return null; return ( <div> Task {task.id}: {task.status.state} </div> ); }`

- value

  React Native

`import { useA2ATask } from "@assistant-ui/react-a2a"; import { Text, View } from "react-native"; function TaskStatus() { const task = useA2ATask(); if (!task) return null; return ( <View> <Text> Task {task.id}: {task.status.state} </Text> </View> ); }`

- value

  React Ink

`import { useA2ATask } from "@assistant-ui/react-a2a"; import { Text } from "ink"; function TaskStatus() { const task = useA2ATask(); if (!task) return null; return ( <Text> Task {task.id}: {task.status.state} </Text> ); }`

### [Artifacts list](#artifacts-list)

`useA2AArtifacts` returns the artifacts generated by the current task.

- value

  React

`import { useA2AArtifacts } from "@assistant-ui/react-a2a"; function ArtifactList() { const artifacts = useA2AArtifacts(); return ( <ul> {artifacts.map((artifact) => ( <li key={artifact.artifactId}> {artifact.name}: {artifact.parts.length} parts </li> ))} </ul> ); }`

- value

  React Native

`import { useA2AArtifacts } from "@assistant-ui/react-a2a"; import { Text, View } from "react-native"; function ArtifactList() { const artifacts = useA2AArtifacts(); return ( <View> {artifacts.map((artifact) => ( <Text key={artifact.artifactId}> {artifact.name}: {artifact.parts.length} parts </Text> ))} </View> ); }`

- value

  React Ink

`import { useA2AArtifacts } from "@assistant-ui/react-a2a"; import { Box, Text } from "ink"; function ArtifactList() { const artifacts = useA2AArtifacts(); return ( <Box flexDirection="column"> {artifacts.map((artifact) => ( <Text key={artifact.artifactId}> {artifact.name}: {artifact.parts.length} parts </Text> ))} </Box> ); }`

### [Agent card](#agent-card)

`useA2AAgentCard` returns the agent card fetched from the server on initialization.

- value

  React

`import { useA2AAgentCard } from "@assistant-ui/react-a2a"; function AgentInfo() { const card = useA2AAgentCard(); if (!card) return null; return ( <div> <h3>{card.name}</h3> <p>{card.description}</p> <div>Skills: {card.skills.map((s) => s.name).join(", ")}</div> </div> ); }`

- value

  React Native

`import { useA2AAgentCard } from "@assistant-ui/react-a2a"; import { Text, View } from "react-native"; function AgentInfo() { const card = useA2AAgentCard(); if (!card) return null; return ( <View> <Text>{card.name}</Text> <Text>{card.description}</Text> <Text>Skills: {card.skills.map((s) => s.name).join(", ")}</Text> </View> ); }`

- value

  React Ink

`import { useA2AAgentCard } from "@assistant-ui/react-a2a"; import { Box, Text } from "ink"; function AgentInfo() { const card = useA2AAgentCard(); if (!card) return null; return ( <Box flexDirection="column"> <Text bold>{card.name}</Text> <Text>{card.description}</Text> <Text>Skills: {card.skills.map((s) => s.name).join(", ")}</Text> </Box> ); }`

## [Task states](#task-states)

The A2A protocol defines 9 task states. The runtime maps them to assistant-ui message statuses:

| A2A task state   | Description               | Message status           |
| ---------------- | ------------------------- | ------------------------ |
| `unspecified`    | Unknown or default state. | `running`                |
| `submitted`      | Task acknowledged.        | `running`                |
| `working`        | Task in progress.         | `running`                |
| `completed`      | Task finished.            | `complete`               |
| `failed`         | Task errored.             | `incomplete (error)`     |
| `canceled`       | Task cancelled.           | `incomplete (cancelled)` |
| `rejected`       | Agent declined task.      | `incomplete (error)`     |
| `input_required` | Agent needs user input.   | `requires-action`        |
| `auth_required`  | Authentication needed.    | `requires-action`        |

When a task enters `input_required`, the user can continue the conversation normally. The runtime sends the next message with the same `taskId` to resume the task.

## [Artifacts](#artifacts)

A2A agents can produce artifacts (files, code, data) alongside their responses. Artifacts are accumulated during streaming and accessible via `useA2AArtifacts`.

The runtime supports:

- **Incremental artifact streaming** via `append` mode.
- **Artifact completion notification** via the `onArtifactComplete` callback.
- **Automatic reset** of artifacts on each new run.

`const runtime = useA2ARuntime({ baseUrl: "http://localhost:9999", onArtifactComplete: (artifact) => { console.log("Artifact ready:", artifact.name); }, });`

## [Streaming vs non-streaming](#streaming-vs-non-streaming)

The runtime automatically selects the communication mode based on the agent's capabilities:

- If the agent card indicates `capabilities.streaming: true` (or the field is unset), the runtime uses `POST /message:stream` with SSE.
- If `capabilities.streaming: false`, the runtime falls back to `POST /message:send`.

## [Error handling](#error-handling)

The client throws `A2AError` instances with structured error information following the `google.rpc.Status` format:

`import { A2AError } from "@assistant-ui/react-a2a"; const runtime = useA2ARuntime({ baseUrl: "http://localhost:9999", onError: (error) => { if (error instanceof A2AError) { console.log(error.code); // HTTP status code console.log(error.status); // e.g. "NOT_FOUND" console.log(error.details); // google.rpc.ErrorInfo details } }, });`

## [Multi-tenancy](#multi-tenancy)

For multi-tenant A2A servers, pass a `tenant` option:

`const client = new A2AClient({ baseUrl: "https://agent.example.com", tenant: "my-org", });`

This prepends `/{tenant}` to all API paths (e.g. `/my-org/message:send`).

## [Feature support](#feature-support)

| Feature                      | Supported                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Streaming (SSE)              | Yes                                                                          |
| Non-streaming fallback       | Yes                                                                          |
| All 9 task states            | Yes                                                                          |
| Artifacts (text, data, file) | Yes                                                                          |
| Agent card discovery         | Yes                                                                          |
| Multi-tenancy                | Yes                                                                          |
| Structured errors            | Yes                                                                          |
| Push notifications CRUD      | Yes                                                                          |
| Extension negotiation        | Yes                                                                          |
| Task cancellation            | Yes                                                                          |
| Message editing              | Yes                                                                          |
| Message reload               | Yes                                                                          |
| History persistence          | Via* href

  /docs/runtimes/concepts/adapters#history-adapterhistory adapter |
| Thread list management       | Via* href

  /docs/runtimes/concepts/threadsthread list adapter              |

## [Related](#related)

- href

  /docs/runtimes/a2a

A2A overviewWhat A2A is and when to pick it.

- href

  /docs/runtimes/a2a/quickstart

QuickstartMinimal runtime + Thread setup.

- href

  /docs/runtimes/concepts/adapters

AdaptersAttachments, speech, feedback, history, threads.