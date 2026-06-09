# Model Context Registry
URL: /docs/api-reference/model-context/registry

Register and manage assistant-ui model context providers that contribute instructions and app state.

## [API Reference](#api-reference)

### [ModelContextRegistry](#modelcontextregistry)

`ModelContextRegistry`

- `getModelContext` `?: () => ModelContext`
- `subscribe` `?: (callback: () => void) => Unsubscribe`
- `addTool` `?: (tool: AssistantToolProps<TArgs, TResult>) => ModelContextRegistryToolHandle<TArgs, TResult>`
- `addInstruction` `?: (config: string | AssistantInstructionsConfig) => ModelContextRegistryInstructionHandle`
- `addProvider` `?: (provider: ModelContextProvider) => ModelContextRegistryProviderHandle`