# Speech and Dictation
URL: /docs/api-reference/voice/speech-dictation

Connect speech synthesis and dictation adapters to assistant-ui voice and composer workflows.

## [API Reference](#api-reference)

### [DictationAdapter](#dictationadapter)

`DictationAdapter`

- `listen` `: () => DictationAdapter.Session`
- `disableInputDuringDictation` `?: boolean`

### [DictationState](#dictationstate)

`DictationState`

- `status` `: DictationAdapter.Status`

  - `type` `: "starting" | "running"`

- `transcript` `?: string`

- `inputDisabled` `?: boolean`

### [SpeechSynthesisAdapter](#speechsynthesisadapter)

`SpeechSynthesisAdapter`

- `speak` `: (text: string) => SpeechSynthesisAdapter.Utterance`

### [WebSpeechDictationAdapter](#webspeechdictationadapter)

`WebSpeechDictationAdapter`

- `constructor` `?: (options: { language?: string; continuous?: boolean; interimResults?: boolean; } = {}) => WebSpeechDictationAdapter`
- `static isSupported` `?: () => boolean`
- `listen` `?: () => DictationAdapter.Session`

### [WebSpeechSynthesisAdapter](#webspeechsynthesisadapter)

`WebSpeechSynthesisAdapter`

- `speak` `?: (text: string) => SpeechSynthesisAdapter.Utterance`