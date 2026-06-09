# State Hooks
URL: /docs/api-reference/hooks/state

State selector and action hooks for reading assistant-ui runtime state and controlling threads, composers, messages, and attachments.

## [API Reference](#api-reference)

### [useAui](#useaui)

Returns the current `AssistantClient` from context.

Read the client supplied by the nearest

- href

  /docs/api-reference/context-providers/assistant-runtime-provider#auiprovider

AuiProvider

or

- href

  /docs/api-reference/context-providers/assistant-runtime-provider#assistantruntimeprovider

AssistantRuntimeProvider

, then access a scope on it — `aui.thread()`, `aui.composer()`, `aui.message()`, and so on. Pair with

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

to read reactive state and

- href

  /docs/api-reference/hooks/state#useauievent

useAuiEvent

to subscribe to events. The returned client also exposes lower-level methods such as `aui.on(...)` and `aui.subscribe(...)`; prefer `useAuiEvent` for React event subscriptions.

Rendered outside a provider, the returned client's scope accessors throw a descriptive error whenever they are called.

`import { useAui } from "@assistant-ui/react"; const aui = useAui(); aui.composer().setText("Hello"); aui.composer().send(); aui.thread().cancelRun();` `function useAui(): AssistantClient;`

### [useAuiEvent](#useauievent)

Subscribes to an assistant event for the lifetime of the component.

The subscription is established on mount and re-established whenever the scope or event name changes. The `callback` is wrapped in an effect-event shim, so the latest closure is invoked on each emission — you do not need to memoize it.

`import { useAuiEvent } from "@assistant-ui/react"; useAuiEvent("thread.modelContextUpdate", ({ threadId }) => { console.log("Model context updated", threadId); });`

`useAuiEvent`

- `selector` `: AssistantEventSelector<TEvent>`

  - `toString` `: (() => string) | (() => string)`
  - `valueOf` `: (() => string) | (() => Object)`

- `callback` `: AssistantEventCallback<TEvent>`

### [useAuiState](#useauistate)

Subscribes to a slice of

- href

  /docs/api-reference/primitives/assistant-if#assistantstate

AssistantState

and re-renders the component whenever that slice changes.

The `selector` is called on every store update; its return value is compared by `Object.is`, and the component re-renders only when the selected slice changes. Returning the entire state object is not supported and throws at runtime — select a specific field instead, or compose multiple `useAuiState` calls. Returning a new object or array literal, including spreading `s.thread` into a new object, causes a re-render on every store update; either select primitives or return a memoized reference.

`import { useAuiState } from "@assistant-ui/react"; const messages = useAuiState((s) => s.thread.messages); const isRunning = useAuiState((s) => s.thread.isRunning); const composerText = useAuiState((s) => s.composer.text);`

`useAuiState`

- `selector` `: (state: AssistantState) => T`