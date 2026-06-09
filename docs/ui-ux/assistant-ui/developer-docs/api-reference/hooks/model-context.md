# Model Context Hooks
URL: /docs/api-reference/hooks/model-context

React hooks for registering assistant-ui tools, data renderers, instructions, and model context providers.

## [API Reference](#api-reference)

### [useAssistantInteractable](#useassistantinteractable)

Registers an interactable with the AI assistant.

This hook handles registration only. To read and write the interactable's state, use

- href

  /docs/api-reference/hooks/model-context#useinteractablestate

useInteractableState

with the returned id.

`useAssistantInteractable`

- `name` `: string`

- `config` `: AssistantInteractableProps`

  - `description` `: string`
  - `stateSchema` `: InteractableStateSchema`
  - `initialState` `: unknown`
  - `id` `?: string`
  - `selected` `?: boolean`

### [useInteractableState](#useinteractablestate)

Reads and writes the state of a registered interactable.

Pair with

- href

  /docs/api-reference/hooks/model-context#useassistantinteractable

useAssistantInteractable

which handles registration.

`useInteractableState`

- `id` `: string`
- `fallback` `: TState`