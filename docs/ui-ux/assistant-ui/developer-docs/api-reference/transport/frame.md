# Assistant Frame
URL: /docs/api-reference/transport/frame

Frame bridge APIs and serialized message types for embedding assistant-ui runtimes in external contexts.

## [API Reference](#api-reference)

### [AssistantFrameHost](#assistantframehost)

`AssistantFrameHost`

- `constructor` `?: (iframeWindow: Window, targetOrigin: string = "*") => AssistantFrameHost`
- `getModelContext` `?: () => ModelContext`
- `subscribe` `?: (callback: () => void) => Unsubscribe`
- `dispose` `?: () => void`

### [AssistantFrameProvider](#assistantframeprovider)

`AssistantFrameProvider`

- `static addModelContextProvider` `?: (provider: ModelContextProvider, targetOrigin?: string) => Unsubscribe`
- `static dispose` `?: () => void`

### [FRAME\_MESSAGE\_CHANNEL](#frame_message_channel)

`const FRAME_MESSAGE_CHANNEL: "assistant-ui-frame";`

### [FrameMessage](#framemessage)

`FrameMessage`

- `type` `: "model-context-request"`

### [SerializedModelContext](#serializedmodelcontext)

`SerializedModelContext`

- `system` `?: string`
- `tools` `?: Record<string, SerializedTool>`

### [SerializedTool](#serializedtool)

`SerializedTool`

- `description` `?: string`
- `parameters` `: any`
- `disabled` `?: boolean`
- `type` `?: string`

### [useAssistantFrameHost](#useassistantframehost)

React hook that manages the lifecycle of an AssistantFrameHost and its binding to the current AssistantRuntime.

Usage example:

`function MyComponent() { const iframeRef = useRef<HTMLIFrameElement>(null); useAssistantFrameHost({ iframeRef, targetOrigin: "https://trusted-domain.com", // optional }); return <iframe ref={iframeRef} src="..." />; }`

`useAssistantFrameHost`

- `options` `: UseAssistantFrameHostOptions`

  - `iframeRef` `: Readonly<RefObject<HTMLIFrameElement | null | undefined>>`
  - `targetOrigin` `?: string`
  - `register` `: (frameHost: AssistantFrameHost) => Unsubscribe`