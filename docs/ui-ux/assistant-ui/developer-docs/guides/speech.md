# Text-to-Speech for Chat
URL: /docs/guides/speech

Read AI chat messages aloud with the Web Speech API or a custom TTS adapter. Speech synthesis for React chat UIs, integrated with assistant-ui.

assistant-ui supports text-to-speech via the `SpeechSynthesisAdapter` interface. When a speech adapter is configured, users can trigger playback for any assistant message.

## [SpeechSynthesisAdapter](#speechsynthesisadapter)

The `SpeechSynthesisAdapter` interface has a single method:

`import type { SpeechSynthesisAdapter } from "@assistant-ui/react"; type SpeechSynthesisAdapter = { speak: (text: string) => SpeechSynthesisAdapter.Utterance; };`

`speak` is called with the plain text of an assistant message and must return an `Utterance` object:

`type Utterance = { status: SpeechSynthesisAdapter.Status; cancel: () => void; subscribe: (callback: () => void) => Unsubscribe; }; type Status = | { type: "starting" | "running" } | { type: "ended"; reason: "finished" | "cancelled" | "error"; error?: unknown };`

Currently the following built-in adapter is available:

- `WebSpeechSynthesisAdapter`: uses the browser's `Web Speech API` (`SpeechSynthesis`)

## [WebSpeechSynthesisAdapter](#webspeechsynthesisadapter)

`import { WebSpeechSynthesisAdapter } from "@assistant-ui/react"; const runtime = useChatRuntime({ adapters: { speech: new WebSpeechSynthesisAdapter(), }, });`

## [UI](#ui)

The default action bar does not include a speech button. Add `ActionBarPrimitive.Speak` and `ActionBarPrimitive.StopSpeaking` to your assistant message action bar:

`import { ActionBarPrimitive, useMessageTTS } from "@assistant-ui/react"; import { AudioLinesIcon, StopCircleIcon } from "lucide-react"; const AssistantActionBar = () => { const isSpeaking = useMessageTTS(); return ( <ActionBarPrimitive.Root> {!isSpeaking && ( <ActionBarPrimitive.Speak> <AudioLinesIcon /> </ActionBarPrimitive.Speak> )} {isSpeaking && ( <ActionBarPrimitive.StopSpeaking> <StopCircleIcon /> </ActionBarPrimitive.StopSpeaking> )} <ActionBarPrimitive.Copy /> </ActionBarPrimitive.Root> ); };`

`ActionBarPrimitive.Speak` is automatically disabled when no speech adapter is configured.

## [Custom Adapters](#custom-adapters)

Implement `SpeechSynthesisAdapter` to call any external TTS API:

- title

  lib/custom-tts-adapter.ts

`import type { SpeechSynthesisAdapter } from "@assistant-ui/react"; export class CustomTTSAdapter implements SpeechSynthesisAdapter { private apiUrl: string; constructor(options: { apiUrl: string }) { this.apiUrl = options.apiUrl; } speak(text: string): SpeechSynthesisAdapter.Utterance { const subscribers = new Set<() => void>(); let status: SpeechSynthesisAdapter.Status = { type: "starting" }; let audio: HTMLAudioElement | null = null; const notify = () => { for (const cb of subscribers) cb(); }; const finish = (reason: "finished" | "cancelled" | "error", error?: unknown) => { if (status.type === "ended") return; status = { type: "ended", reason, error }; notify(); }; fetch(this.apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }), }) .then((res) => res.blob()) .then((blob) => { audio = new Audio(URL.createObjectURL(blob)); status = { type: "running" }; notify(); audio.onended = () => finish("finished"); audio.onerror = (e) => finish("error", e); audio.play(); }) .catch((err) => finish("error", err)); return { get status() { return status; }, cancel: () => { audio?.pause(); finish("cancelled"); }, subscribe: (cb) => { subscribers.add(cb); return () => subscribers.delete(cb); }, }; } }`

Wire it up the same way as the built-in adapter:

`import { CustomTTSAdapter } from "@/lib/custom-tts-adapter"; const runtime = useChatRuntime({ adapters: { speech: new CustomTTSAdapter({ apiUrl: "/api/tts" }), }, });`