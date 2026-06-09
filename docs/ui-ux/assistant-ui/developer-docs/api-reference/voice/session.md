# Voice Sessions
URL: /docs/api-reference/voice/session

Create and control realtime assistant-ui voice sessions, state, controls, and helpers.

## [API Reference](#api-reference)

### [createVoiceSession](#createvoicesession)

`createVoiceSession`

- `options` `: { abortSignal?: AbortSignal; }`

  - `abortSignal` `?: AbortSignal`

    - `aborted` `: boolean`

    - `onabort` `: ((this:AbortSignal,ev:Event)=>any)|null`

    - `reason` `: any`

    - `throwIfAborted` `: () => void`

    - `addEventListener` `: { <K>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void; (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void; }`

    - `removeEventListener` `: { <K>(type: K, listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any, options?: boolean | EventListenerOptions): void; (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void; }`

    - `dispatchEvent` `: (event: Event) => boolean`

      The \*\*\`dispatchEvent()\`\*\* method of the EventTarget sends an Event to the object, (synchronously) invoking the affected event listeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) also apply to events dispatched manually with dispatchEvent(). [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

- `setup` `: (helpers: VoiceSessionHelpers) => Promise<VoiceSessionControls>`

### [RealtimeVoiceAdapter](#realtimevoiceadapter)

`RealtimeVoiceAdapter`

- `connect` `: (options: { abortSignal?: AbortSignal; }) => RealtimeVoiceAdapter.Session`

### [useVoiceControls](#usevoicecontrols)

`const useVoiceControls: () => { connect: () => void; disconnect: () => void; mute: () => void; unmute: () => void; };`

### [useVoiceState](#usevoicestate)

`const useVoiceState: () => VoiceSessionState;`

### [useVoiceVolume](#usevoicevolume)

`const useVoiceVolume: () => number;`

### [VoiceSessionControls](#voicesessioncontrols)

`VoiceSessionControls`

- `disconnect` `: () => void`
- `mute` `: () => void`
- `unmute` `: () => void`

### [VoiceSessionHelpers](#voicesessionhelpers)

`VoiceSessionHelpers`

- `setStatus` `: (status: RealtimeVoiceAdapter.Status) => void`
- `end` `: (reason: "finished" | "cancelled" | "error", error?: unknown) => void`
- `emitTranscript` `: (item: RealtimeVoiceAdapter.TranscriptItem) => void`
- `emitMode` `: (mode: RealtimeVoiceAdapter.Mode) => void`
- `emitVolume` `: (volume: number) => void`
- `isDisposed` `: () => boolean`

### [VoiceSessionState](#voicesessionstate)

`VoiceSessionState`

- `status` `: RealtimeVoiceAdapter.Status`

  - `type` `: "starting" | "running"`

- `isMuted` `: boolean`

- `mode` `: RealtimeVoiceAdapter.Mode`