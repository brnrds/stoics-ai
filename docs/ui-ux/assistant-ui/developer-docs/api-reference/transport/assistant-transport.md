# Assistant Transport
URL: /docs/api-reference/transport/assistant-transport

Command, protocol, and transport types for connecting assistant-ui runtimes across execution boundaries.

## [API Reference](#api-reference)

### [AssistantTransportCommand](#assistanttransportcommand)

`AssistantTransportCommand`

- `type` `: "add-message"`

### [AssistantTransportConnectionMetadata](#assistanttransportconnectionmetadata)

`AssistantTransportConnectionMetadata`

- `pendingCommands` `: AssistantTransportCommand[]`
- `isSending` `: boolean`
- `toolStatuses` `: Record<string, ToolExecutionStatus>`

### [AssistantTransportProtocol](#assistanttransportprotocol)

`AssistantTransportProtocol`

- `toString` `: () => string`
- `charAt` `: (pos: number) => string`
- `charCodeAt` `: (index: number) => number`
- `concat` `: (...strings: string[]) => string`
- `indexOf` `: (searchString: string, position?: number) => number`
- `lastIndexOf` `: (searchString: string, position?: number) => number`
- `localeCompare` `: { (that: string): number; (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number; (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number; }`
- `match` `: { (regexp: string | RegExp): RegExpMatchArray | null; (matcher: { [Symbol.match](string: string): RegExpMatchArray | null; }): RegExpMatchArray | null; }`
- `replace` `: { (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; (searchValue: { [Symbol.replace](string: string, replaceValue: string): string; }, replaceValue: string): string; (searchValue: { [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string; }, replacer: (substring: string, ...args: any[]) => string): string; }`
- `search` `: { (regexp: string | RegExp): number; (searcher: { [Symbol.search](string: string): number; }): number; }`
- `slice` `: (start?: number, end?: number) => string`
- `split` `: { (separator: string | RegExp, limit?: number): string[]; (splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[]; }`
- `substring` `: (start: number, end?: number) => string`
- `toLowerCase` `: () => string`
- `toLocaleLowerCase` `: { (locales?: string | string[]): string; (locales?: Intl.LocalesArgument): string; }`
- `toUpperCase` `: () => string`
- `toLocaleUpperCase` `: { (locales?: string | string[]): string; (locales?: Intl.LocalesArgument): string; }`
- `trim` `: () => string`
- `length` `: number`
- `substr` `: (from: number, length?: number) => string`
- `valueOf` `: () => string`
- `codePointAt` `: (pos: number) => number`
- `includes` `: (searchString: string, position?: number) => boolean`
- `endsWith` `: (searchString: string, endPosition?: number) => boolean`
- `normalize` `: { (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string; (form?: string): string; }`
- `repeat` `: (count: number) => string`
- `startsWith` `: (searchString: string, position?: number) => boolean`
- `anchor` `: (name: string) => string`
- `big` `: () => string`
- `blink` `: () => string`
- `bold` `: () => string`
- `fixed` `: () => string`
- `fontcolor` `: (color: string) => string`
- `fontsize` `: { (size: number): string; (size: string): string; }`
- `italics` `: () => string`
- `link` `: (url: string) => string`
- `small` `: () => string`
- `strike` `: () => string`
- `sub` `: () => string`
- `sup` `: () => string`
- `padStart` `: (maxLength: number, fillString?: string) => string`
- `padEnd` `: (maxLength: number, fillString?: string) => string`
- `trimEnd` `: () => string`
- `trimStart` `: () => string`
- `trimLeft` `: () => string`
- `trimRight` `: () => string`
- `matchAll` `: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>`
- `replaceAll` `: { (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; }`
- `at` `: (index: number) => string`

### [SendCommandsRequestBody](#sendcommandsrequestbody)

`SendCommandsRequestBody`

- `commands` `: QueuedCommand[]`

- `state` `: unknown`

- `system` `?: string`

- `tools` `?: Record<string, unknown>`

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

- `threadId` `: string | null`

- `parentId` `?: string | null`

### [useAssistantTransportRuntime](#useassistanttransportruntime)

`useAssistantTransportRuntime`

- `options` `: AssistantTransportOptions<T>`

  - `initialState` `: T`

  - `api` `: string`

  - `resumeApi` `?: string`

  - `protocol` `?: AssistantTransportProtocol`

  - `converter` `: AssistantTransportStateConverter<T>`

  - `headers` `: HeadersValue | (() => Promise<HeadersValue>)`

    - `append` `: (name: string, value: string) => void`

      The \*\*\`append()\`\*\* method of the Headers interface appends a new value onto an existing header inside a Headers object, or adds the header if it does not already exist. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Headers/append)

    - `delete` `: (name: string) => void`

      The \*\*\`delete()\`\*\* method of the Headers interface deletes a header from the current Headers object. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Headers/delete)

    - `get` `: (name: string) => string | null`

      The \*\*\`get()\`\*\* method of the Headers interface returns a byte string of all the values of a header within a Headers object with a given name. If the requested header doesn't exist in the Headers object, it returns null. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Headers/get)

    - `getSetCookie` `: () => string[]`

      The \*\*\`getSetCookie()\`\*\* method of the Headers interface returns an array containing the values of all Set-Cookie headers associated with a response. This allows Headers objects to handle having multiple Set-Cookie headers, which wasn't possible prior to its implementation. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Headers/getSetCookie)

    - `has` `: (name: string) => boolean`

      The \*\*\`has()\`\*\* method of the Headers interface returns a boolean stating whether a Headers object contains a certain header. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Headers/has)

    - `set` `: (name: string, value: string) => void`

      The \*\*\`set()\`\*\* method of the Headers interface sets a new value for an existing header inside a Headers object, or adds the header if it does not already exist. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Headers/set)

    - `forEach` `: (callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any) => void`

    - `entries` `: () => HeadersIterator<[string, string]>`

      Returns an iterator allowing to go through all key/value pairs contained in this object.

    - `keys` `: () => HeadersIterator<string>`

      Returns an iterator allowing to go through all keys of the key/value pairs contained in this object.

    - `values` `: () => HeadersIterator<string>`

      Returns an iterator allowing to go through all values of the key/value pairs contained in this object.

  - `body` `?: object | (() => Promise<object | undefined>)`

  - `prepareSendCommandsRequest` `?: ( body: SendCommandsRequestBody, ) => Record<string, unknown> | Promise<Record<string, unknown>>`

    Transform the request body before it is sent to the API. Receives the fully assembled body and returns the (potentially transformed) body.

  - `onResponse` `?: (response: Response) => void`

  - `onFinish` `?: () => void`

  - `onError` `?: ( error: Error, params: { commands: AssistantTransportCommand[]; updateState: (updater: (state: T) => T) => void; }, ) => void | Promise<void>`

  - `onCancel` `?: (params: { commands: AssistantTransportCommand[]; updateState: (updater: (state: T) => T) => void; error?: Error; }) => void`

    Called when commands are cancelled. When an error occurs, queued commands are automatically cancelled after \`onError\` settles. In this case, the \`error\` parameter contains the error that caused the cancellation.

  - `capabilities` `?: AssistantTransportOptions["capabilities"]`

    - `edit` `?: boolean`

  - `adapters` `?: AssistantTransportOptions["adapters"]`

    - `attachments` `?: AttachmentAdapter`

      - `accept` `: string`
      - `add` `: (state: { file: File; }) => Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void>`
      - `remove` `: (attachment: Attachment) => Promise<void>`
      - `send` `: (attachment: PendingAttachment) => Promise<CompleteAttachment>`

    - `history` `?: ThreadHistoryAdapter`

      - `load` `: () => Promise<ExportedMessageRepository & { unstable_resume?: boolean; }>`

      - `resume` `?: (options: ChatModelRunOptions) => AsyncGenerator<ChatModelRunResult, void, unknown>`

      - `append` `: (item: ExportedMessageRepositoryItem) => Promise<void>`

      - `withFormat` `?: <TMessage, TStorageFormat extends Record<string, unknown>>(formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>) => GenericThreadHistoryAdapter<TMessage>`

        Required when used with \`useAISDKRuntime\` / \`useChatRuntime\`.

### [useAssistantTransportSendCommand](#useassistanttransportsendcommand)

`const useAssistantTransportSendCommand: () => (command: AssistantTransportCommand) => void;`

### [useAssistantTransportState](#useassistanttransportstate)

`function useAssistantTransportState(): UserExternalState;`