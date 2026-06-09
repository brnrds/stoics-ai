# Message Timing
URL: /docs/ui/message-timing

Display streaming performance stats — TTFT, total time, tok/s, and chunk count — as a badge with hover popover.

This component is experimental. The API and displayed metrics may change in future versions. When used with the Vercel AI SDK, token counts and tok/s are **estimated** client-side and may be inaccurate — see

- href

  \#accuracy

Accuracy

below.

## [Getting Started](#getting-started)

### [Add `message-timing`](#add-message-timing)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/message-timing.json

#### Main Component

- packages

  - @assistant-ui/react

* code

  "use client"; import { useMessageTiming } from "@assistant-ui/react"; import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"; import { cn } from "@/lib/utils"; import type { FC } from "react"; const formatTimingMs = (ms: number | undefined): string => { if (ms === undefined) return "—"; if (ms < 1000) return \`${Math.round(ms)}ms\`; return \`${(ms / 1000).toFixed(2)}s\`; }; /\*\* \* Shows streaming stats (TTFT, total time, tok/s, chunks) as a badge with a \* hover/focus tooltip. Renders nothing until the stream completes. \* \* Place it inside \`ActionBarPrimitive.Root\` in your \`thread.tsx\` so it \* inherits the action bar's autohide behaviour: \* \* \`\`\`tsx \* import { MessageTiming } from "@/components/assistant-ui/message-timing"; \* \* \<ActionBarPrimitive.Root > \* \<ActionBarPrimitive.Copy /> \* \<ActionBarPrimitive.Reload /> \* \<MessageTiming /> // <-- add this \* \</ActionBarPrimitive.Root> \* \`\`\` \* \* @param side - Side of the tooltip relative to the badge trigger. \* @default "right" \*/ export const MessageTiming: FC<{ className?: string; side?: "top" | "right" | "bottom" | "left"; }> = ({ className, side = "right" }) => { const timing = useMessageTiming(); if (timing?.totalStreamTime === undefined) return null; return ( \<Tooltip> \<TooltipTrigger asChild> \<button type="button" data-slot="message-timing-trigger" aria-label="Message timing" className={cn( "flex items-center rounded-md p-1 font-mono text-muted-foreground text-xs tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground", className, )} > {formatTimingMs(timing.totalStreamTime)} \</button> \</TooltipTrigger> \<TooltipContent side={side} sideOffset={8} data-slot="message-timing-popover" className="\[&\_span>svg]:hidden! rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md" > \<div className="grid min-w-35 gap-1.5 text-xs"> {timing.firstTokenTime !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">First token\</span> \<span className="font-mono tabular-nums"> {formatTimingMs(timing.firstTokenTime)} \</span> \</div> )} \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Total\</span> \<span className="font-mono tabular-nums"> {formatTimingMs(timing.totalStreamTime)} \</span> \</div> {timing.tokensPerSecond !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Speed\</span> \<span className="font-mono tabular-nums"> {timing.tokensPerSecond.toFixed(1)} tok/s \</span> \</div> )} \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Chunks\</span> \<span className="font-mono tabular-nums">{timing.totalChunks}\</span> \</div> \</div> \</TooltipContent> \</Tooltip> ); };

- lang

  tsx

- code

  "use client"; import { useMessageTiming } from "@assistant-ui/react"; import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"; import { cn } from "@/lib/utils"; import type { FC } from "react"; const formatTimingMs = (ms: number | undefined): string => { if (ms === undefined) return "—"; if (ms < 1000) return \`${Math.round(ms)}ms\`; return \`${(ms / 1000).toFixed(2)}s\`; }; /\*\* \* Shows streaming stats (TTFT, total time, tok/s, chunks) as a badge with a \* hover/focus tooltip. Renders nothing until the stream completes. \* \* Place it inside \`ActionBarPrimitive.Root\` in your \`thread.tsx\` so it \* inherits the action bar's autohide behaviour: \* \* \`\`\`tsx \* import { MessageTiming } from "@/components/assistant-ui/message-timing"; \* \* \<ActionBarPrimitive.Root > \* \<ActionBarPrimitive.Copy /> \* \<ActionBarPrimitive.Reload /> \* \<MessageTiming /> // <-- add this \* \</ActionBarPrimitive.Root> \* \`\`\` \* \* @param side - Side of the tooltip relative to the badge trigger. \* @default "right" \*/ export const MessageTiming: FC<{ className?: string; side?: "top" | "right" | "bottom" | "left"; }> = ({ className, side = "right" }) => { const timing = useMessageTiming(); if (timing?.totalStreamTime === undefined) return null; return ( \<Tooltip> \<TooltipTrigger asChild> \<button type="button" data-slot="message-timing-trigger" aria-label="Message timing" className={cn( "flex items-center rounded-md p-1 font-mono text-muted-foreground text-xs tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground", className, )} > {formatTimingMs(timing.totalStreamTime)} \</button> \</TooltipTrigger> \<TooltipContent side={side} sideOffset={8} data-slot="message-timing-popover" className="\[&\_span>svg]:hidden! rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md" > \<div className="grid min-w-35 gap-1.5 text-xs"> {timing.firstTokenTime !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">First token\</span> \<span className="font-mono tabular-nums"> {formatTimingMs(timing.firstTokenTime)} \</span> \</div> )} \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Total\</span> \<span className="font-mono tabular-nums"> {formatTimingMs(timing.totalStreamTime)} \</span> \</div> {timing.tokensPerSecond !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Speed\</span> \<span className="font-mono tabular-nums"> {timing.tokensPerSecond.toFixed(1)} tok/s \</span> \</div> )} \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Chunks\</span> \<span className="font-mono tabular-nums">{timing.totalChunks}\</span> \</div> \</div> \</TooltipContent> \</Tooltip> ); };

This adds a `/components/assistant-ui/message-timing.tsx` file to your project.

### [Use in your application](#use-in-your-application)

Place `MessageTiming` inside `ActionBarPrimitive.Root` in your `thread.tsx`. It will inherit the action bar's auto-hide behaviour and only renders after the stream completes.

- title

  /components/assistant-ui/thread.tsx

`import { ActionBarPrimitive } from "@assistant-ui/react"; import { MessageTiming } from "@/components/assistant-ui/message-timing"; const AssistantActionBar: FC = () => { return ( <ActionBarPrimitive.Root hideWhenRunning autohide="not-last" > <ActionBarPrimitive.Copy /> <ActionBarPrimitive.Reload /> <MessageTiming /> </ActionBarPrimitive.Root> ); };`

## [What It Shows](#what-it-shows)

The badge displays `totalStreamTime` inline and reveals a popover on hover with the full breakdown:

| Metric          | Description                                               |
| --------------- | --------------------------------------------------------- |
| **First token** | Time from request start to first text chunk (TTFT)        |
| **Total**       | Total wall-clock time from start to stream end            |
| **Speed**       | Output tokens per second (hidden for very short messages) |
| **Chunks**      | Number of stream chunks received                          |

## [Accuracy](#accuracy)

Timing accuracy depends on how your backend is connected.

### [Data Stream (accurate)](#data-stream-accurate)

When using the

- href

  /docs/runtimes/custom/data-stream

Data Stream

protocol on the backend (via `assistant-stream`), token counts come directly from the model's usage data sent in `step-finish` chunks. The `tokensPerSecond` metric is exact whenever your backend reports `outputTokens`.

### [Vercel AI SDK (estimated)](#vercel-ai-sdk-estimated)

When using the AI SDK integration (`useChatRuntime`), token counts are **estimated** client-side using a 4 characters per token approximation. This can overcount significantly for short messages.

## [API Reference](#api-reference)

### [`MessageTiming` component](#messagetiming-component)

| Prop        | Type                                     | Default   | Description                                |
| ----------- | ---------------------------------------- | --------- | ------------------------------------------ |
| `className` | `string`                                 | —         | Additional class names on the root element |
| `side`      | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | Side of the tooltip relative to the badge  |

Renders `null` until `totalStreamTime` is available (i.e., while streaming or for user messages).

For the underlying `useMessageTiming()` hook, field definitions, and runtime-specific setup (LocalRuntime, ExternalStore, etc.), see the

- href

  /docs/guides/message-timing

Message Timing guide

.

## [Related](#related)

- - href

    /docs/guides/message-timing

  Message Timing guide

  — `useMessageTiming()` hook, runtime support table, and custom timing UI

- - href

    /docs/ui/thread

  Thread

  — The action bar context that `MessageTiming` is typically placed inside