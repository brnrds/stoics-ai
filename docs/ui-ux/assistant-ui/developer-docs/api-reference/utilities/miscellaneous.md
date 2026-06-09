# Utilities
URL: /docs/api-reference/utilities/miscellaneous

Miscellaneous @assistant-ui/react utilities for custom rendering, composition, and advanced assistant UI behavior.

## [API Reference](#api-reference)

### [AssistantCloud](#assistantcloud)

`AssistantCloud`

- `constructor` `?: (config: AssistantCloudConfig) => AssistantCloud`
- `threads` `?: AssistantCloudThreads`
- `auth` `?: { tokens: AssistantCloudAuthTokens; }`
- `runs` `?: AssistantCloudRuns`
- `files` `?: AssistantCloudFiles`
- `telemetry` `?: AssistantCloudTelemetryConfig`

### [ChainOfThoughtClient](#chainofthoughtclient)

`ChainOfThoughtClient props`

- `parts` `: readonly ChainOfThoughtPart[]`
- `getMessagePart` `: (selector: { index: number }) => PartMethods`

### [DevToolsHooks](#devtoolshooks)

`DevToolsHooks`

- `static subscribe` `?: (listener: () => void) => Unsubscribe`
- `static clearEventLogs` `?: (apiId: number) => void`
- `static getApis` `?: () => Map<number, DevToolsApiEntry>`

### [ExportedMessageRepository](#exportedmessagerepository)

`ExportedMessageRepository`

- `headId` `?: string | null`
- `messages` `: Array<{ message: ThreadMessage; parentId: string | null; runConfig?: RunConfig; }>`

### [getMcpAppFromToolPart](#getmcpappfromtoolpart)

Returns MCP app metadata for a tool-call part that points at a `ui://` resource.

Returns `undefined` when the part has no MCP app metadata or the metadata does not reference an assistant-ui MCP app resource.

`getMcpAppFromToolPart`

- `part` `: ToolPartLike`

  - `mcp` `?: ToolCallMessagePartMcpMetadata`

    MCP app metadata associated with this tool call, when present.

    - `app` `?: McpAppMetadata`

      - `resourceUri` `: string`
      - `mimeType` `?: string`
      - `visibility` `?: readonly ("model" | "app")[]`

### [InMemoryThreadList](#inmemorythreadlist)

`InMemoryThreadList props`

- `thread` `: (threadId: string) => ResourceElement<ClientOutput<"thread">>`
- `onSwitchToThread` `?: (threadId: string) => void`
- `onSwitchToNewThread` `?: () => void`

### [Interactables](#interactables)

`const Interactables: () => ResourceElement<ClientOutput<"interactables">, undefined>;`

### [makeAssistantVisible](#makeassistantvisible)

`const makeAssistantVisible: <T extends ComponentType<any>>(Component: T, config?: { clickable?: boolean | undefined; editable?: boolean | undefined; }) => T;`

### [McpAppRenderer](#mcpapprenderer)

Creates a tool-call renderer for MCP Apps embedded in assistant messages.

Compose this into the `Tools` resource through its `mcpApp` option. When a tool-call part carries `mcp.app` metadata for a `ui://` resource, the renderer loads that resource from the configured host and displays it in a sandboxed frame.

`McpAppRenderer props`

- `host` `: ResourceElement<McpAppsHost>`

  Provides the data-plane operations the widget can request (\`loadResource\`, \`callTool\`, \`readResource\`, \`listResources\`). Use \`McpAppsRemoteHost({ url })\` for the default HTTP-route convention.

  - `type` `: Resource<R, P> & { [fnSymbol]: (props: P) => R }`
  - `props` `: P`
  - `key` `?: string | number`

- `sandbox` `?: McpAppSandboxConfig`

  Sandbox + container styling. Passes through to SafeContentFrame.

  - `sandbox` `?: SandboxOption[]`
  - `useShadowDom` `?: boolean`
  - `enableBrowserCaching` `?: boolean`
  - `salt` `?: string`
  - `product` `?: string`
  - `className` `?: string`
  - `style` `?: CSSProperties`
  - `unsafeDocumentWrite` `?: boolean`

- `maxHeight` `?: number`

  Upper bound (in pixels) applied to the widget-driven auto-resize height. Defaults to 800.

- `hostInfo` `?: McpAppHostInfo`

  Identifies the host to the widget in the \`ui/initialize\` response.

  - `name` `: string`
  - `version` `: string`

- `hostContext` `?: McpAppHostContext`

  Delivered to the widget on initialize and pushed via \`notifications/host\_context/changed\` on change.

  - `theme` `?: "light" | "dark"`
  - `displayMode` `?: McpAppDisplayMode`
  - `availableDisplayModes` `?: McpAppDisplayMode[]`

- `fallback` `?: ReactNode`

  Rendered when no MCP app is on the part, or while load is in flight / failed (unless overridden).

- `loadingFallback` `?: ReactNode`

  Rendered while the resource is loading. Defaults to \`fallback\`.

- `errorFallback` `?: ReactNode | ((error: Error) => ReactNode)`

  Rendered when the resource load rejects. Defaults to \`fallback\`.

### [McpAppsRemoteHost](#mcpappsremotehost)

Creates the default HTTP host for MCP App widgets.

The host POSTs widget requests to the configured route as `{ method, params }`, using the method names expected by the assistant-ui MCP Apps guide.

`McpAppsRemoteHost props`

- `url` `: string`
- `fetch` `?: typeof fetch`
- `headers` `?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>)`

### [SingleThreadList](#singlethreadlist)

A minimal threads scope that wraps a single thread. Automatically provided by ExternalThread when no threads scope exists. Mounts the provided thread resource element.

`SingleThreadList props`

- `thread` `: ClientElement<"thread">`

  - `type` `: Resource<R, P> & { [fnSymbol]: (props: P) => R }`
  - `props` `: P`
  - `key` `?: string | number`

### [Suggestions](#suggestions)

`const Suggestions: { (): ResourceElement< ClientOutput<"suggestions">, undefined >; ( suggestions: SuggestionConfig[], ): ResourceElement< ClientOutput<"suggestions">, SuggestionConfig[] >; };`