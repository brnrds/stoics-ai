# Suggestion Adapters
URL: /docs/api-reference/adapters/suggestions

Suggestion adapters for providing starter prompts, contextual actions, and guided composer options to assistant-ui runtimes.

## [API Reference](#api-reference)

### [SuggestionAdapter](#suggestionadapter)

`SuggestionAdapter`

- `generate` `: ( options: SuggestionAdapterGenerateOptions, ) => | Promise<readonly ThreadSuggestion[]> | AsyncGenerator<readonly ThreadSuggestion[], void>`