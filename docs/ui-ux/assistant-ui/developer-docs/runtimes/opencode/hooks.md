# Hooks
URL: /docs/runtimes/opencode/hooks

Permissions, questions, session state, runtime extras.

OpenCode-specific React hooks for interacting with the running session. All hooks must be used inside the runtime context (a tree wrapped in `AssistantRuntimeProvider` from a `useOpenCodeRuntime` setup).

## [Permissions](#permissions)

OpenCode pauses tool execution to ask the user for permission (e.g. running shell commands, writing files). `useOpenCodePermissions` returns the pending permission requests and a reply function:

`import { useOpenCodePermissions } from "@assistant-ui/react-opencode"; function PermissionPrompt() { const { pending, reply } = useOpenCodePermissions(); return pending.map((req) => ( <div key={req.id}> <p> Allow <code>{req.toolName}</code>: {req.title ?? req.permission}? </p> <button onClick={() => reply(req.id, "once")}>Allow once</button> <button onClick={() => reply(req.id, "always")}>Always allow</button> <button onClick={() => reply(req.id, "reject")}>Reject</button> </div> )); }`

Return shape:

| Field     | Type                              | Description                              |
| --------- | --------------------------------- | ---------------------------------------- |
| `pending` | `OpenCodePermissionRequest[]`     | Permission requests waiting for a reply. |
| `reply`   | `(id, response) => Promise<void>` | Send a reply for a pending permission.   |

Reply values:

| Reply      | Meaning                                          |
| ---------- | ------------------------------------------------ |
| `"once"`   | Approve this single permission request.          |
| `"always"` | Approve this permission and remember the choice. |
| `"reject"` | Deny the permission; the tool call is cancelled. |

## [Questions](#questions)

OpenCode can ask interactive questions during a run. `useOpenCodeQuestions` returns the pending questions as an array:

`import { useOpenCodeQuestions, useOpenCodeRuntimeExtras, } from "@assistant-ui/react-opencode"; function QuestionPrompt() { const questions = useOpenCodeQuestions(); const { replyToQuestion, rejectQuestion } = useOpenCodeRuntimeExtras(); return questions.map((req) => ( <div key={req.id}> <p>{req.text}</p> <button onClick={() => replyToQuestion(req.id, [ /* QuestionAnswer[] from @opencode-ai/sdk */ ]) } > Answer </button> <button onClick={() => rejectQuestion(req.id)}>Skip</button> </div> )); }`

To reply, use `replyToQuestion(id, answers)` or `rejectQuestion(id)` from

- href

  \#runtime-extras

`useOpenCodeRuntimeExtras`

.

## [Session](#session)

`useOpenCodeSession` returns the current OpenCode `Session` object (server-side session metadata):

`import { useOpenCodeSession } from "@assistant-ui/react-opencode"; function SessionInfo() { const session = useOpenCodeSession(); if (!session) return null; return <div>Session: {session.id}</div>; }`

## [Thread state](#thread-state)

`useOpenCodeThreadState` returns the full projected thread state (messages, run state, interactions, sync metadata). Use it for advanced custom views; most apps don't need it.

`import { useOpenCodeThreadState } from "@assistant-ui/react-opencode"; function RunStatus() { const state = useOpenCodeThreadState(); return <div>Run: {state.runState.type}</div>; }`

The returned `OpenCodeThreadState` includes:

- `sessionId`, `session`, `sessionStatus`, `loadState`, `runState`
- `messageOrder`, `messagesById`, `pendingUserMessages`
- `interactions.permissions` (pending + resolved), `interactions.questions` (pending + answered + rejected)
- `unhandledEvents`, `sync` timestamps

You can also pass a selector to read a specific slice:

`const isStreaming = useOpenCodeThreadState((s) => s.runState.type === "streaming");`

## [Runtime extras](#runtime-extras)

`useOpenCodeRuntimeExtras` exposes session-level imperative actions:

`import { useOpenCodeRuntimeExtras } from "@assistant-ui/react-opencode"; function SessionActions() { const { fork, revert, unrevert, cancel, refresh, replyToPermission, replyToQuestion, rejectQuestion, } = useOpenCodeRuntimeExtras(); // ... }`

| Action                            | Description                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `fork(messageId)`                 | Create a new session forked from the given message; returns the new session id. |
| `revert(messageId)`               | Revert the session to the state at the given message.                           |
| `unrevert()`                      | Undo the last revert.                                                           |
| `cancel()`                        | Cancel an in-flight run.                                                        |
| `refresh()`                       | Force re-fetch of session messages.                                             |
| `replyToPermission(id, response)` | Reply to a permission request (`"once"`, `"always"`, `"reject"`).               |
| `replyToQuestion(id, answers)`    | Answer a pending question.                                                      |
| `rejectQuestion(id)`              | Reject a pending question.                                                      |

`useOpenCodePermissions` and `useOpenCodeQuestions` are sugar over `replyToPermission` / `replyToQuestion` / `rejectQuestion` plus the `pending` slices of state.

## [Lower-level building blocks](#lower-level-building-blocks)

For custom integrations that bypass `useOpenCodeRuntime`:

| Export                                                       | Purpose                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `OpenCodeEventSource`                                        | Wraps the OpenCode server's event stream into a typed subscription.  |
| `OpenCodeThreadController`                                   | Per-session controller managing message state.                       |
| `createOpenCodeThreadState`, `reduceOpenCodeThreadState`     | Pure state reducers if you want to drive the state machine yourself. |
| `projectOpenCodeThreadMessages`                              | Project raw OpenCode messages into assistant-ui thread messages.     |
| `createOpencodeClient` (re-exported from `@opencode-ai/sdk`) | Build a client with custom config.                                   |

These are only needed for advanced cases; most apps should use `useOpenCodeRuntime` directly.

## [Related](#related)

- href

  /docs/runtimes/opencode

OpenCode overviewWhat OpenCode is and when to pick it.

- href

  /docs/runtimes/opencode/quickstart

QuickstartMinimal runtime + Thread setup.

- href

  https\://opencode.ai/

OpenCode docsThe OpenCode server itself.