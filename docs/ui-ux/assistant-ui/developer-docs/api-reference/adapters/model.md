# Model Adapters
URL: /docs/api-reference/adapters/model

Adapter interfaces for connecting chat models, streaming responses, and model execution to assistant-ui runtimes.

## [API Reference](#api-reference)

### [ChatModelAdapter](#chatmodeladapter)

`ChatModelAdapter`

- `run` `: (options: ChatModelRunOptions) => Promise<ChatModelRunResult> | AsyncGenerator<ChatModelRunResult, void>`

### [ChatModelRunOptions](#chatmodelrunoptions)

`ChatModelRunOptions`

- `messages` `: readonly ThreadMessage[]`

- `runConfig` `: RunConfig`

  - `custom` `?: Record<string, unknown>`

- `abortSignal` `: AbortSignal`

  - `aborted` `: boolean`

  - `onabort` `: ((this:AbortSignal,ev:Event)=>any)|null`

  - `reason` `: any`

  - `throwIfAborted` `: () => void`

  - `addEventListener` `: { <K>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void; (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void; }`

  - `removeEventListener` `: { <K>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | EventListenerOptions): void; (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void; }`

  - `dispatchEvent` `: (event: Event) => boolean`

    The \*\*\`dispatchEvent()\`\*\* method of the EventTarget sends an Event to the object, (synchronously) invoking the affected event listeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) also apply to events dispatched manually with dispatchEvent(). [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

- `context` `: ModelContext`

  - `priority` `?: number`

  - `system` `?: string`

  - `tools` `?: Record<string, Tool<any, any>>`

  - `callSettings` `?: LanguageModelV1CallSettings`

    - `maxTokens` `?: number`
    - `temperature` `?: number`
    - `topP` `?: number`
    - `presencePenalty` `?: number`
    - `frequencyPenalty` `?: number`
    - `seed` `?: number`
    - `headers` `?: Record<string, string | undefined>`

  - `config` `?: LanguageModelConfig`

    - `apiKey` `?: string`
    - `baseUrl` `?: string`
    - `modelName` `?: string`

- `unstable_assistantMessageId`

  - variant

    unstable

  `?: string`

- `unstable_threadId`

  - variant

    unstable

  `?: string`

- `unstable_parentId`

  - variant

    unstable

  `?: string | null`

- `unstable_getMessage`

  - variant

    unstable

  `: () => ThreadMessage`

### [ChatModelRunResult](#chatmodelrunresult)

`ChatModelRunResult`

- `content` `?: readonly ThreadAssistantMessagePart[]`

- `status` `?: MessageStatus`

- `metadata` `?: ChatModelRunResult["metadata"]`

  - `unstable_state`

    - variant

      unstable

    `?: ReadonlyJSONValue`

  - `unstable_annotations`

    - variant

      unstable

    `?: readonly ReadonlyJSONValue[]`

  - `unstable_data`

    - variant

      unstable

    `?: readonly ReadonlyJSONValue[]`

  - `steps` `?: readonly ThreadStep[]`

  - `timing` `?: MessageTiming`

    - `streamStartTime` `: number`
    - `firstTokenTime` `?: number`
    - `totalStreamTime` `?: number`
    - `tokenCount` `?: number`
    - `tokensPerSecond` `?: number`
    - `totalChunks` `: number`
    - `toolCallCount` `: number`

  - `custom` `?: Record<string, unknown>`

### [ChatModelRunUpdate](#chatmodelrunupdate)

`ChatModelRunUpdate`

- `content` `: readonly ThreadAssistantMessagePart[]`
- `metadata` `?: Record<string, unknown>`

### [CreateResumeRunConfig](#createresumerunconfig)

`CreateResumeRunConfig`

- `parentId` `: string | null`

- `sourceId` `?: string | null`

- `runConfig` `?: RunConfig`

  - `custom` `?: Record<string, unknown>`

- `stream` `?: ( options: ChatModelRunOptions, ) => AsyncGenerator<ChatModelRunResult, void, unknown>`

### [CreateStartRunConfig](#createstartrunconfig)

`CreateStartRunConfig`

- `parentId` `: string | null`

- `sourceId` `?: string | null`

- `runConfig` `?: RunConfig`

  - `custom` `?: Record<string, unknown>`

### [LanguageModelConfig](#languagemodelconfig)

`LanguageModelConfig`

- `apiKey` `?: string`
- `baseUrl` `?: string`
- `modelName` `?: string`