# Model Context
URL: /docs/api-reference/model-context/context

Provide model instructions, contextual state, and inline renderers to assistant-ui runtimes.

## [API Reference](#api-reference)

### [mergeModelContexts](#mergemodelcontexts)

`const mergeModelContexts: (configSet: Set<ModelContextProvider>) => ModelContext;`

### [ModelContextClient](#modelcontextclient)

`const ModelContextClient: () => ResourceElement<ClientOutput<"modelContext">, undefined>;`

### [ModelContextProvider](#modelcontextprovider)

`ModelContextProvider`

- `getModelContext` `: () => ModelContext`
- `subscribe` `?: (callback: () => void) => Unsubscribe`

### [useAssistantContext](#useassistantcontext)

`useAssistantContext`

- `config` `: AssistantContextConfig`

  - `getContext` `: () => string`
  - `disabled` `?: boolean`

### [useAssistantInstructions](#useassistantinstructions)

`useAssistantInstructions`

- `config` `: string | AssistantInstructionsConfig`

### [useInlineRender](#useinlinerender)

`useInlineRender`

- `toolUI` `: FC<ToolCallMessagePart<ReadonlyJSONObject, unknown> & { readonly status: MessagePartStatus | ToolCallMessagePartStatus; } & ToolCallMessagePart<TArgs, TResult> & { addResult: (result: TResult | ToolResponse<TResult>) => void; resume: (payload: unknown) => void; }>`

### [useThreadModelContext](#usethreadmodelcontext)

**Deprecated.** Use

- href

  /docs/api-reference/hooks/state#useauistate

useAuiState

: `useAuiState((s) => s.thread.modelContext)`. See the

- href

  https\://assistant-ui.com/docs/migrations/v0-12

migration guide

.

`useThreadModelContext`

- `options` `?: { optional?: false | undefined; }`

  - `optional` `?: false`