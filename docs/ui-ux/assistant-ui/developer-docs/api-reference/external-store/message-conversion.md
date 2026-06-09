# Message Conversion
URL: /docs/api-reference/external-store/message-conversion

Convert external message formats into assistant-ui's message and thread state for the external store runtime.

## [API Reference](#api-reference)

### [getExternalStoreMessages](#getexternalstoremessages)

`const getExternalStoreMessages: <T>(input: { messages: readonly ThreadMessage[]; } | ThreadMessage | ThreadMessage["content"][number]) => T[];`

### [useExternalMessageConverter](#useexternalmessageconverter)

`useExternalMessageConverter`

- `options` `: { callback: useExternalMessageConverter.Callback<T>; messages: T[]; isRunning: boolean; joinStrategy?: "concat-content" | "none" | undefined; metadata?: useExternalMessageConverter.Metadata | undefined; }`

  - `callback` `: useExternalMessageConverter.Callback<T>`

  - `messages` `: T[]`

  - `isRunning` `: boolean`

  - `joinStrategy` `?: "concat-content" | "none"`

  - `metadata` `?: useExternalMessageConverter.Metadata`

    - `toolStatuses` `?: Record<string, ToolExecutionStatus>`
    - `error` `?: ReadonlyJSONValue`
    - `messageTiming` `?: Record<string, MessageTiming>`

### [unstable\_convertExternalMessages](#unstable_convertexternalmessages)

`const unstable_convertExternalMessages: <T extends WeakKey>(messages: T[], callback: useExternalMessageConverter.Callback<T>, isRunning: boolean, metadata: useExternalMessageConverter.Metadata) => ThreadMessage[];`

### [unstable\_createMessageConverter](#unstable_createmessageconverter)

`const unstable_createMessageConverter: <T extends object>(callback: useExternalMessageConverter.Callback<T>) => { useThreadMessages: ({ messages, isRunning, joinStrategy, metadata, }: { messages: T[]; isRunning: boolean; joinStrategy?: "concat-content" | "none" | undefined; metadata?: useExternalMessageConverter.Metadata; }) => ThreadMessage[]; toThreadMessages: (messages: T[], isRunning?: boolean, metadata?: useExternalMessageConverter.Metadata) => ThreadMessage[]; toOriginalMessages: (input: ThreadState | ThreadMessage | ThreadMessage["content"][number]) => unknown[]; toOriginalMessage: (input: ThreadState | ThreadMessage | ThreadMessage["content"][number]) => {}; useOriginalMessage: () => {}; useOriginalMessages: () => unknown[]; };`

### [bindExternalStoreMessage](#bindexternalstoremessage)

**Deprecated.** This API is experimental and may change without notice.

Attach the original external store message(s) to a ThreadMessage or message part. This is a no-op if the target already has a bound message. Use `getExternalStoreMessages` to retrieve the bound messages later.

`const bindExternalStoreMessage: <T>(target: object, message: T | T[]) => void;`