# Hooks
URL: /docs/runtimes/google-adk/hooks

Tool confirmations, auth, input requests, artifacts, escalation, metadata, structured events.

Reference for the runtime's React hooks. These expose ADK-specific state and HITL primitives. Start with

- href

  /docs/runtimes/google-adk/quickstart

quickstart

if you have not wired up a basic runtime yet.

## [Agent and session state](#agent-and-session-state)

`import { useAdkAgentInfo, useAdkSessionState, useAdkSend, } from "@assistant-ui/react-google-adk"; function MyComponent() { // Current active agent name and branch path (multi-agent) const agentInfo = useAdkAgentInfo(); // agentInfo?.name = "search_agent" // agentInfo?.branch = "root.search_agent" // Accumulated session state delta const state = useAdkSessionState(); // Send raw ADK messages programmatically const send = useAdkSend(); }`

## [Tool confirmations](#tool-confirmations)

When ADK's `SecurityPlugin` or tool callbacks request user confirmation before executing a tool, use `useAdkToolConfirmations` to read pending requests and `useAdkConfirmTool` to respond:

- value

  React

`import { useAdkToolConfirmations, useAdkConfirmTool, } from "@assistant-ui/react-google-adk"; function ToolConfirmationUI() { const confirmations = useAdkToolConfirmations(); const confirmTool = useAdkConfirmTool(); if (confirmations.length === 0) return null; return confirmations.map((conf) => ( <div key={conf.toolCallId}> <p> Tool "{conf.toolName}" wants to run. {conf.hint} </p> <button onClick={() => confirmTool(conf.toolCallId, true)}>Approve</button> <button onClick={() => confirmTool(conf.toolCallId, false)}>Deny</button> </div> )); }`

- value

  React Native

`import { useAdkToolConfirmations, useAdkConfirmTool, } from "@assistant-ui/react-google-adk"; import { Pressable, Text, View } from "react-native"; function ToolConfirmationUI() { const confirmations = useAdkToolConfirmations(); const confirmTool = useAdkConfirmTool(); if (confirmations.length === 0) return null; return ( <View> {confirmations.map((conf) => ( <View key={conf.toolCallId}> <Text> Tool "{conf.toolName}" wants to run. {conf.hint} </Text> <Pressable onPress={() => confirmTool(conf.toolCallId, true)}> <Text>Approve</Text> </Pressable> <Pressable onPress={() => confirmTool(conf.toolCallId, false)}> <Text>Deny</Text> </Pressable> </View> ))} </View> ); }`

- value

  React Ink

`import { useAdkToolConfirmations, useAdkConfirmTool, } from "@assistant-ui/react-google-adk"; import { Box, Text, useInput } from "ink"; function ToolConfirmationUI() { const confirmations = useAdkToolConfirmations(); const confirmTool = useAdkConfirmTool(); const active = confirmations[0]; useInput((input) => { if (!active) return; if (input === "y") confirmTool(active.toolCallId, true); if (input === "n") confirmTool(active.toolCallId, false); }); if (!active) return null; return ( <Box flexDirection="column"> <Text> Tool "{active.toolName}" wants to run. {active.hint} </Text> <Text>Press y to approve, n to deny.</Text> </Box> ); }`

## [Auth requests](#auth-requests)

When a tool requires OAuth or other authentication, use `useAdkAuthRequests` to read pending requests and `useAdkSubmitAuth` to submit credentials:

- value

  React

`import { useAdkAuthRequests, useAdkSubmitAuth, type AdkAuthCredential, } from "@assistant-ui/react-google-adk"; function AuthUI() { const authRequests = useAdkAuthRequests(); const submitAuth = useAdkSubmitAuth(); if (authRequests.length === 0) return null; return authRequests.map((req) => ( <div key={req.toolCallId}> <button onClick={() => { const credential: AdkAuthCredential = { authType: "oauth2", oauth2: { accessToken: "..." }, }; submitAuth(req.toolCallId, credential); }} > Authenticate </button> </div> )); }`

- value

  React Native

`import { useAdkAuthRequests, useAdkSubmitAuth, type AdkAuthCredential, } from "@assistant-ui/react-google-adk"; import { Pressable, Text, View } from "react-native"; function AuthUI() { const authRequests = useAdkAuthRequests(); const submitAuth = useAdkSubmitAuth(); if (authRequests.length === 0) return null; return ( <View> {authRequests.map((req) => ( <Pressable key={req.toolCallId} onPress={() => { const credential: AdkAuthCredential = { authType: "oauth2", oauth2: { accessToken: "..." }, }; submitAuth(req.toolCallId, credential); }} > <Text>Authenticate</Text> </Pressable> ))} </View> ); }`

- value

  React Ink

`import { useAdkAuthRequests, useAdkSubmitAuth, type AdkAuthCredential, } from "@assistant-ui/react-google-adk"; import { Box, Text, useInput } from "ink"; function AuthUI() { const authRequests = useAdkAuthRequests(); const submitAuth = useAdkSubmitAuth(); const active = authRequests[0]; useInput((input) => { if (!active || input !== "a") return; const credential: AdkAuthCredential = { authType: "oauth2", oauth2: { accessToken: "..." }, }; submitAuth(active.toolCallId, credential); }); if (!active) return null; return ( <Box flexDirection="column"> <Text>Authentication required for a tool call.</Text> <Text>Press a after completing your auth flow.</Text> </Box> ); }`

`AdkAuthCredential` supports all ADK auth types: `apiKey`, `http`, `oauth2`, `openIdConnect`, `serviceAccount`.

## [Input requests](#input-requests)

When an ADK Python 2.0+ Workflow's `RequestInput` node pauses execution to ask the user a question, ADK emits an `adk_request_input` function call marked as long-running. Respond with `useAdkSubmitInput` inside a tool UI; the helper wraps the answer as `{ result }` to match ADK's `unwrap_response` contract, so the Workflow node resumes with the unwrapped value:

- value

  React

`import { makeAssistantToolUI } from "@assistant-ui/react"; import { useAdkSubmitInput } from "@assistant-ui/react-google-adk"; type RequestInputArgs = { interrupt_id?: string; message?: string; payload?: unknown; response_schema?: unknown; }; export const RequestInputToolUI = makeAssistantToolUI< RequestInputArgs, unknown >({ toolName: "adk_request_input", render: function RequestInputUI({ toolCallId, args, result }) { const submitInput = useAdkSubmitInput(); if (result !== undefined) { return <p>Answered: {String(result)}</p>; } return ( <form onSubmit={(e) => { e.preventDefault(); const value = ( e.currentTarget.elements.namedItem("answer") as HTMLInputElement ).value; submitInput(toolCallId, value); }} > <p>{args.message ?? "Please provide input:"}</p> <input name="answer" autoFocus /> <button type="submit">Submit</button> </form> ); }, });`

- value

  React Native

`import { makeAssistantToolUI } from "@assistant-ui/react-native"; import { useAdkSubmitInput } from "@assistant-ui/react-google-adk"; import { useState } from "react"; import { Pressable, Text, TextInput, View } from "react-native"; type RequestInputArgs = { interrupt_id?: string; message?: string; payload?: unknown; response_schema?: unknown; }; export const RequestInputToolUI = makeAssistantToolUI< RequestInputArgs, unknown >({ toolName: "adk_request_input", render: function RequestInputUI({ toolCallId, args, result }) { const submitInput = useAdkSubmitInput(); const [value, setValue] = useState(""); if (result !== undefined) { return <Text>Answered: {String(result)}</Text>; } return ( <View> <Text>{args.message ?? "Please provide input:"}</Text> <TextInput value={value} onChangeText={setValue} autoFocus /> <Pressable onPress={() => submitInput(toolCallId, value)}> <Text>Submit</Text> </Pressable> </View> ); }, });`

- value

  React Ink

`import { makeAssistantToolUI } from "@assistant-ui/react-ink"; import { useAdkSubmitInput } from "@assistant-ui/react-google-adk"; import { useState } from "react"; import { Box, Text, useInput } from "ink"; type RequestInputArgs = { interrupt_id?: string; message?: string; payload?: unknown; response_schema?: unknown; }; export const RequestInputToolUI = makeAssistantToolUI< RequestInputArgs, unknown >({ toolName: "adk_request_input", render: function RequestInputUI({ toolCallId, args, result }) { const submitInput = useAdkSubmitInput(); const [value, setValue] = useState(""); useInput((input, key) => { if (result !== undefined) return; if (key.return) submitInput(toolCallId, value); else if (key.backspace || key.delete) setValue((text) => text.slice(0, -1)); else if (input) setValue((text) => text + input); }); if (result !== undefined) { return <Text>Answered: {String(result)}</Text>; } return ( <Box flexDirection="column"> <Text>{args.message ?? "Please provide input:"}</Text> <Text>{value}</Text> <Text dimColor>Press enter to submit.</Text> </Box> ); }, });`

Register the tool UI inside `AssistantRuntimeProvider`:

- value

  React

`<AssistantRuntimeProvider runtime={runtime}> <RequestInputToolUI /> <Thread /> </AssistantRuntimeProvider>`

- value

  React Native

`import { View } from "react-native"; import { Thread } from "@/components/assistant-ui/thread"; <AssistantRuntimeProvider runtime={runtime}> <RequestInputToolUI /> <View style={{ flex: 1 }}> <Thread /> </View> </AssistantRuntimeProvider>;`

- value

  React Ink

`import { Box } from "ink"; import { Thread } from "./components/thread.js"; <AssistantRuntimeProvider runtime={runtime}> <RequestInputToolUI /> <Box flexDirection="column"> <Thread /> </Box> </AssistantRuntimeProvider>;`

`adk_request_input` is emitted only by ADK Python 2.0+ Workflow `RequestInput` nodes; ADK JS has no equivalent. Always respond via a tool UI with `useAdkSubmitInput`. HITL interrupts are automatically exempt from `autoCancelPendingToolCalls`, so typing a normal message in the composer will not overwrite the pending interrupt.

`useAdkSubmitInput` is sugar over the generic `addResult`. If you prefer, call `addResult({ result: value })` from inside the render function directly. The `{ result }` wrapper is required either way: the adapter JSON-stringifies the value before sending, and ADK's `unwrap_response` unwraps it on the backend before the Workflow node resumes.

## [Artifacts](#artifacts)

Track file artifacts created or modified by the agent:

`import { useAdkArtifacts } from "@assistant-ui/react-google-adk"; function ArtifactList() { const artifacts = useAdkArtifacts(); // Record<string, number> — filename to version number }`

### [Artifact fetching](#artifact-fetching)

When using `createAdkSessionAdapter` (see

- href

  /docs/runtimes/google-adk/api#direct-adk-server-connection

api reference

), the returned `artifacts` object provides functions to fetch artifact content from the ADK server:`const { artifacts } = createAdkSessionAdapter({ apiUrl, appName, userId }); // List all artifact filenames in a session const filenames = await artifacts.list(sessionId); // Load artifact content (latest version) const data = await artifacts.load(sessionId, "document.pdf"); // data.inlineData?.data — base64 content // data.inlineData?.mimeType — MIME type // data.text — text content (if text artifact) // Load a specific version const v1 = await artifacts.load(sessionId, "document.pdf", 1); // List all versions const versions = await artifacts.listVersions(sessionId, "document.pdf"); // Delete an artifact await artifacts.delete(sessionId, "document.pdf");`

## [Escalation](#escalation)

Detect when an agent requests escalation to a human operator:

- value

  React

`import { useAdkEscalation } from "@assistant-ui/react-google-adk"; function EscalationBanner() { const escalated = useAdkEscalation(); if (!escalated) return null; return <div>Agent has requested human assistance.</div>; }`

- value

  React Native

`import { useAdkEscalation } from "@assistant-ui/react-google-adk"; import { Text } from "react-native"; function EscalationBanner() { const escalated = useAdkEscalation(); if (!escalated) return null; return <Text>Agent has requested human assistance.</Text>; }`

- value

  React Ink

`import { useAdkEscalation } from "@assistant-ui/react-google-adk"; import { Text } from "ink"; function EscalationBanner() { const escalated = useAdkEscalation(); if (!escalated) return null; return <Text>Agent has requested human assistance.</Text>; }`

## [Long-running tools](#long-running-tools)

Track tools that are executing asynchronously and awaiting external input:

- value

  React

`import { useAdkLongRunningToolIds } from "@assistant-ui/react-google-adk"; function PendingToolsIndicator() { const pendingToolIds = useAdkLongRunningToolIds(); if (pendingToolIds.length === 0) return null; return <div>{pendingToolIds.length} tool(s) awaiting input</div>; }`

- value

  React Native

`import { useAdkLongRunningToolIds } from "@assistant-ui/react-google-adk"; import { Text } from "react-native"; function PendingToolsIndicator() { const pendingToolIds = useAdkLongRunningToolIds(); if (pendingToolIds.length === 0) return null; return <Text>{pendingToolIds.length} tool(s) awaiting input</Text>; }`

- value

  React Ink

`import { useAdkLongRunningToolIds } from "@assistant-ui/react-google-adk"; import { Text } from "ink"; function PendingToolsIndicator() { const pendingToolIds = useAdkLongRunningToolIds(); if (pendingToolIds.length === 0) return null; return <Text>{pendingToolIds.length} tool(s) awaiting input</Text>; }`

This hook reports every tool call ADK marked via `long_running_tool_ids`, including HITL interrupts. To respond to a specific HITL type, see

- href

  \#tool-confirmations

tool confirmations

,

- href

  \#auth-requests

auth requests

, or

- href

  \#input-requests

input requests

.

## [Per-message metadata](#per-message-metadata)

Access grounding, citation, and token usage metadata per message:

`import { useAdkMessageMetadata } from "@assistant-ui/react-google-adk"; function MessageMetadata({ messageId }: { messageId: string }) { const metadataMap = useAdkMessageMetadata(); const meta = metadataMap.get(messageId); // meta?.groundingMetadata — Google Search grounding sources // meta?.citationMetadata — citation references // meta?.usageMetadata — token counts }`

## [Session state by scope](#session-state-by-scope)

ADK uses key prefixes to scope state. These helpers filter and strip the prefix:

`import { useAdkAppState, useAdkUserState, useAdkTempState, } from "@assistant-ui/react-google-adk"; function StateDebug() { const appState = useAdkAppState(); // app:* keys (app-level, shared) const userState = useAdkUserState(); // user:* keys (user-level) const tempState = useAdkTempState(); // temp:* keys (not persisted) }`

Use `useAdkSessionState()` for the full unfiltered state delta.

## [Structured events](#structured-events)

Convert raw ADK events into typed, structured events for custom renderers:

`import { toAdkStructuredEvents, AdkEventType, type AdkStructuredEvent, } from "@assistant-ui/react-google-adk"; const structured = toAdkStructuredEvents(event); for (const e of structured) { switch (e.type) { case AdkEventType.CONTENT: console.log("Text:", e.content); break; case AdkEventType.THOUGHT: console.log("Reasoning:", e.content); break; case AdkEventType.TOOL_CALL: console.log("Tool:", e.call.name, e.call.args); break; case AdkEventType.ERROR: console.error(e.errorMessage); break; } }`

## [Hooks reference](#hooks-reference)

| Hook                         | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `useAdkAgentInfo()`          | Current agent name and branch path.                                        |
| `useAdkSessionState()`       | Full accumulated session state delta.                                      |
| `useAdkAppState()`           | App-level state (`app:*` prefix, stripped).                                |
| `useAdkUserState()`          | User-level state (`user:*` prefix, stripped).                              |
| `useAdkTempState()`          | Temp state (`temp:*` prefix, stripped, not persisted).                     |
| `useAdkSend()`               | Send raw ADK messages.                                                     |
| `useAdkConfirmTool()`        | Confirm or deny a pending tool confirmation.                               |
| `useAdkSubmitAuth()`         | Submit auth credentials for a pending auth request.                        |
| `useAdkSubmitInput()`        | Submit the user's answer for a pending `adk_request_input` HITL interrupt. |
| `useAdkToolConfirmations()`  | Pending tool confirmation requests.                                        |
| `useAdkAuthRequests()`       | Pending auth credential requests.                                          |
| `useAdkLongRunningToolIds()` | IDs of long-running tools awaiting input.                                  |
| `useAdkArtifacts()`          | Artifact delta (filename → version).                                       |
| `useAdkEscalation()`         | Whether escalation was requested.                                          |
| `useAdkMessageMetadata()`    | Per-message grounding, citation, and usage metadata.                       |

## [Feature support](#feature-support)

| Feature                                                        | Status    |
| -------------------------------------------------------------- | --------- |
| Streaming text (SSE)                                           | Supported |
| Tool calls and results                                         | Supported |
| Tool confirmations (`useAdkConfirmTool`)                       | Supported |
| Auth credential flow (`useAdkSubmitAuth`)                      | Supported |
| Workflow input requests (`useAdkSubmitInput`, ADK Python 2.0+) | Supported |
| Multi-agent (author and branch tracking)                       | Supported |
| Agent transfer events                                          | Supported |
| Escalation detection                                           | Supported |
| Chain-of-thought / reasoning                                   | Supported |
| Code execution (executableCode + result)                       | Supported |
| Inline images and file data                                    | Supported |
| Session state delta + scoped state                             | Supported |
| Artifact delta tracking + fetching                             | Supported |
| Long-running tools (HITL)                                      | Supported |
| Grounding / citation / usage metadata                          | Supported |
| Structured events (`toAdkStructuredEvents`)                    | Supported |
| Typed `AdkRunConfig`                                           | Supported |
| Client → server `stateDelta`                                   | Supported |
| `finishReason` mapping (17 values)                             | Supported |
| `interrupted` event handling                                   | Supported |
| Snake\_case events (Python ADK)                                | Supported |
| Cloud thread persistence                                       | Supported |
| ADK session-backed thread persistence                          | Supported |
| Direct ADK server connection (no proxy)                        | Supported |
| One-liner API route (`createAdkApiRoute`)                      | Supported |
| Message editing and regeneration                               | Supported |
| Automatic tool invocations                                     | Supported |

## [Related](#related)

- href

  /docs/runtimes/google-adk/api

API referencecreateAdkStream, server helpers, session adapter, threads.

- href

  /docs/runtimes/google-adk/quickstart

QuickstartMinimal API route + client setup.

- href

  /docs/runtimes/concepts/adapters

AdaptersAttachments, speech, feedback, history, threads.