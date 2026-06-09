# Context Display
URL: /docs/ui/context-display

Visualize token usage relative to a model's context window — ring, bar, or text — with a detailed hover popover.

This component requires server-side setup to

- href

  \#forward-token-usage-from-your-route-handler

forward token usage metadata

. Without it, ContextDisplay will show 0 usage and no breakdown data.

## [Getting Started](#getting-started)

### [Add `context-display`](#add-context-display)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/context-display.json

#### Main Component

- packages

  - @assistant-ui/react
  - @assistant-ui/react-ai-sdk

* code

  "use client"; import { useAuiState } from "@assistant-ui/react"; import { useThreadTokenUsage } from "@assistant-ui/react-ai-sdk"; import type { ThreadTokenUsage } from "@assistant-ui/react-ai-sdk"; import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"; import { cn } from "@/lib/utils"; import { createContext, useContext, useEffect, useState, type FC, type ReactNode, } from "react"; const formatTokenCount = (tokens: number): string => { if (tokens >= 1\_000\_000) return \`${(tokens / 1\_000\_000).toFixed(1)}M\`; if (tokens >= 1\_000) return \`${(tokens / 1\_000).toFixed(1)}k\`; return \`${tokens}\`; }; const getUsagePercent = ( totalTokens: number | undefined, modelContextWindow: number, ): number => { if (!totalTokens) return 0; return Math.min((totalTokens / modelContextWindow) \* 100, 100); }; type UsageSeverity = "normal" | "warning" | "critical"; const getUsageSeverity = (percent: number): UsageSeverity => { if (percent > 85) return "critical"; if (percent >= 65) return "warning"; return "normal"; }; const getStrokeColor = (percent: number): string => { const severity = getUsageSeverity(percent); if (severity === "critical") return "stroke-red-500"; if (severity === "warning") return "stroke-amber-500"; return "stroke-emerald-500"; }; const getBarColor = (percent: number): string => { const severity = getUsageSeverity(percent); if (severity === "critical") return "bg-red-500"; if (severity === "warning") return "bg-amber-500"; return "bg-emerald-500"; }; type ContextDisplayContextValue = { usage: ThreadTokenUsage | undefined; totalTokens: number; percent: number; modelContextWindow: number; }; const ContextDisplayContext = createContext\<ContextDisplayContextValue | null>( null, ); function useContextDisplay(): ContextDisplayContextValue { const ctx = useContext(ContextDisplayContext); if (!ctx) { throw new Error("ContextDisplay.\* must be used within ContextDisplay.Root"); } return ctx; } type PresetProps = { modelContextWindow: number; className?: string; side?: "top" | "bottom" | "left" | "right"; usage?: ThreadTokenUsage | undefined; }; type ContextDisplayRootProps = { modelContextWindow: number; children: ReactNode; usage?: ThreadTokenUsage | undefined; }; function ContextDisplayRootBase({ modelContextWindow, children, usage, }: { modelContextWindow: number; children: ReactNode; usage: ThreadTokenUsage | undefined; }) { const threadId = useAuiState((s) => s.threadListItem.id); const rawTokens = usage?.totalTokens ?? 0; const \[tokenState, setTokenState] = useState({ threadId, totalTokens: rawTokens > 0 ? rawTokens : 0, usage, }); useEffect(() => { setTokenState((prev) => { if (prev.threadId !== threadId) { return { threadId, totalTokens: rawTokens > 0 ? rawTokens : 0, usage, }; } if (rawTokens > 0 && rawTokens !== prev.totalTokens) { return { ...prev, totalTokens: rawTokens, usage }; } if (usage !== prev.usage) { return { ...prev, usage }; } return prev; }); }, \[threadId, rawTokens, usage]); const totalTokens = tokenState.totalTokens; const percent = getUsagePercent(totalTokens, modelContextWindow); return ( \<ContextDisplayContext.Provider value={{ usage: tokenState.usage, totalTokens, percent, modelContextWindow, }} > \<Tooltip>{children}\</Tooltip> \</ContextDisplayContext.Provider> ); } function ContextDisplayRootInternal({ modelContextWindow, children, }: { modelContextWindow: number; children: ReactNode; }) { const usage = useThreadTokenUsage(); return ( \<ContextDisplayRootBase modelContextWindow={modelContextWindow} usage={usage} > {children} \</ContextDisplayRootBase> ); } function ContextDisplayRoot(props: ContextDisplayRootProps) { if (props.usage !== undefined) { return ( \<ContextDisplayRootBase modelContextWindow={props.modelContextWindow} usage={props.usage} > {props.children} \</ContextDisplayRootBase> ); } return ( \<ContextDisplayRootInternal modelContextWindow={props.modelContextWindow}> {props.children} \</ContextDisplayRootInternal> ); } function ContextDisplayTrigger({ className, children, ...props }: React.ComponentProps<"button">) { return ( \<TooltipTrigger asChild> \<button type="button" data-slot="context-display-trigger" className={cn( "inline-flex items-center rounded-md transition-colors", className, )} {...props} > {children} \</button> \</TooltipTrigger> ); } function ContextDisplayContent({ side = "top", className, }: { side?: "top" | "bottom" | "left" | "right" | undefined; className?: string; }) { const { usage, totalTokens, percent, modelContextWindow } = useContextDisplay(); return ( \<TooltipContent side={side} sideOffset={8} data-slot="context-display-popover" className={cn( "\[&\_span>svg]:hidden! rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md", className, )} > \<div className="grid min-w-40 gap-1.5 text-xs"> \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Usage\</span> \<span className="font-mono tabular-nums">{Math.round(percent)}%\</span> \</div> {usage?.inputTokens !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Input\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.inputTokens)} \</span> \</div> )} {usage?.cachedInputTokens !== undefined && usage.cachedInputTokens > 0 && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Cached\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.cachedInputTokens)} \</span> \</div> )} {usage?.outputTokens !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Output\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.outputTokens)} \</span> \</div> )} {usage?.reasoningTokens !== undefined && usage.reasoningTokens > 0 && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Reasoning\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.reasoningTokens)} \</span> \</div> )} \<div className="mt-0.5 border-t pt-1.5"> \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Total\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(totalTokens)} /{" "} {formatTokenCount(modelContextWindow)} \</span> \</div> \</div> \</div> \</TooltipContent> ); } const RING\_SIZE = 24; const RING\_STROKE = 3; const RING\_RADIUS = (RING\_SIZE - RING\_STROKE) / 2; const RING\_CIRCUMFERENCE = 2 \* Math.PI \* RING\_RADIUS; function RingVisual() { const { percent } = useContextDisplay(); return ( \<svg aria-hidden="true" width={RING\_SIZE} height={RING\_SIZE} viewBox={\`0 0 ${RING\_SIZE} ${RING\_SIZE}\`} className="-rotate-90" > \<circle cx={RING\_SIZE / 2} cy={RING\_SIZE / 2} r={RING\_RADIUS} fill="none" strokeWidth={RING\_STROKE} className="stroke-muted" /> \<circle cx={RING\_SIZE / 2} cy={RING\_SIZE / 2} r={RING\_RADIUS} fill="none" strokeWidth={RING\_STROKE} strokeLinecap="round" strokeDasharray={RING\_CIRCUMFERENCE} strokeDashoffset={ RING\_CIRCUMFERENCE - (percent / 100) \* RING\_CIRCUMFERENCE } className={cn( "transition-\[stroke-dashoffset,stroke] duration-300", getStrokeColor(percent), )} /> \</svg> ); } const ContextDisplayRing: FC\<PresetProps> = ({ modelContextWindow, className, side, usage, }) => ( \<ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}> \<ContextDisplayTrigger className={cn("p-1", className)} aria-label="Context usage" > \<RingVisual /> \</ContextDisplayTrigger> \<ContextDisplayContent side={side} /> \</ContextDisplayRoot> ); function BarVisual() { const { percent, totalTokens } = useContextDisplay(); return ( \<div className="flex items-center gap-2"> \<div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"> \<div className={cn( "h-full rounded-full transition-all duration-300", getBarColor(percent), )} style={{ width: \`${percent}%\` }} /> \</div> \<span className="text-\[10px] text-muted-foreground tabular-nums"> {formatTokenCount(totalTokens)} ({Math.round(percent)}%) \</span> \</div> ); } const ContextDisplayBar: FC\<PresetProps> = ({ modelContextWindow, className, side, usage, }) => ( \<ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}> \<ContextDisplayTrigger className={cn("px-2 py-1", className)} aria-label="Context usage" > \<BarVisual /> \</ContextDisplayTrigger> \<ContextDisplayContent side={side} /> \</ContextDisplayRoot> ); function TextVisual() { const { totalTokens, modelContextWindow } = useContextDisplay(); return ( <> {formatTokenCount(totalTokens)} / {formatTokenCount(modelContextWindow)} \</> ); } const ContextDisplayText: FC\<PresetProps> = ({ modelContextWindow, className, side, usage, }) => ( \<ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}> \<ContextDisplayTrigger aria-label="Context usage" className={cn( "px-2 py-1 font-mono text-muted-foreground text-xs tabular-nums hover:bg-accent hover:text-accent-foreground", className, )} > \<TextVisual /> \</ContextDisplayTrigger> \<ContextDisplayContent side={side} /> \</ContextDisplayRoot> ); const ContextDisplay = {} as { Root: typeof ContextDisplayRoot; Trigger: typeof ContextDisplayTrigger; Content: typeof ContextDisplayContent; Ring: typeof ContextDisplayRing; Bar: typeof ContextDisplayBar; Text: typeof ContextDisplayText; }; ContextDisplay.Root = ContextDisplayRoot; ContextDisplay.Trigger = ContextDisplayTrigger; ContextDisplay.Content = ContextDisplayContent; ContextDisplay.Ring = ContextDisplayRing; ContextDisplay.Bar = ContextDisplayBar; ContextDisplay.Text = ContextDisplayText; export { ContextDisplay, ContextDisplayRoot, ContextDisplayTrigger, ContextDisplayContent, ContextDisplayRing, ContextDisplayBar, ContextDisplayText, };

- lang

  tsx

- code

  "use client"; import { useAuiState } from "@assistant-ui/react"; import { useThreadTokenUsage } from "@assistant-ui/react-ai-sdk"; import type { ThreadTokenUsage } from "@assistant-ui/react-ai-sdk"; import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"; import { cn } from "@/lib/utils"; import { createContext, useContext, useEffect, useState, type FC, type ReactNode, } from "react"; const formatTokenCount = (tokens: number): string => { if (tokens >= 1\_000\_000) return \`${(tokens / 1\_000\_000).toFixed(1)}M\`; if (tokens >= 1\_000) return \`${(tokens / 1\_000).toFixed(1)}k\`; return \`${tokens}\`; }; const getUsagePercent = ( totalTokens: number | undefined, modelContextWindow: number, ): number => { if (!totalTokens) return 0; return Math.min((totalTokens / modelContextWindow) \* 100, 100); }; type UsageSeverity = "normal" | "warning" | "critical"; const getUsageSeverity = (percent: number): UsageSeverity => { if (percent > 85) return "critical"; if (percent >= 65) return "warning"; return "normal"; }; const getStrokeColor = (percent: number): string => { const severity = getUsageSeverity(percent); if (severity === "critical") return "stroke-red-500"; if (severity === "warning") return "stroke-amber-500"; return "stroke-emerald-500"; }; const getBarColor = (percent: number): string => { const severity = getUsageSeverity(percent); if (severity === "critical") return "bg-red-500"; if (severity === "warning") return "bg-amber-500"; return "bg-emerald-500"; }; type ContextDisplayContextValue = { usage: ThreadTokenUsage | undefined; totalTokens: number; percent: number; modelContextWindow: number; }; const ContextDisplayContext = createContext\<ContextDisplayContextValue | null>( null, ); function useContextDisplay(): ContextDisplayContextValue { const ctx = useContext(ContextDisplayContext); if (!ctx) { throw new Error("ContextDisplay.\* must be used within ContextDisplay.Root"); } return ctx; } type PresetProps = { modelContextWindow: number; className?: string; side?: "top" | "bottom" | "left" | "right"; usage?: ThreadTokenUsage | undefined; }; type ContextDisplayRootProps = { modelContextWindow: number; children: ReactNode; usage?: ThreadTokenUsage | undefined; }; function ContextDisplayRootBase({ modelContextWindow, children, usage, }: { modelContextWindow: number; children: ReactNode; usage: ThreadTokenUsage | undefined; }) { const threadId = useAuiState((s) => s.threadListItem.id); const rawTokens = usage?.totalTokens ?? 0; const \[tokenState, setTokenState] = useState({ threadId, totalTokens: rawTokens > 0 ? rawTokens : 0, usage, }); useEffect(() => { setTokenState((prev) => { if (prev.threadId !== threadId) { return { threadId, totalTokens: rawTokens > 0 ? rawTokens : 0, usage, }; } if (rawTokens > 0 && rawTokens !== prev.totalTokens) { return { ...prev, totalTokens: rawTokens, usage }; } if (usage !== prev.usage) { return { ...prev, usage }; } return prev; }); }, \[threadId, rawTokens, usage]); const totalTokens = tokenState.totalTokens; const percent = getUsagePercent(totalTokens, modelContextWindow); return ( \<ContextDisplayContext.Provider value={{ usage: tokenState.usage, totalTokens, percent, modelContextWindow, }} > \<Tooltip>{children}\</Tooltip> \</ContextDisplayContext.Provider> ); } function ContextDisplayRootInternal({ modelContextWindow, children, }: { modelContextWindow: number; children: ReactNode; }) { const usage = useThreadTokenUsage(); return ( \<ContextDisplayRootBase modelContextWindow={modelContextWindow} usage={usage} > {children} \</ContextDisplayRootBase> ); } function ContextDisplayRoot(props: ContextDisplayRootProps) { if (props.usage !== undefined) { return ( \<ContextDisplayRootBase modelContextWindow={props.modelContextWindow} usage={props.usage} > {props.children} \</ContextDisplayRootBase> ); } return ( \<ContextDisplayRootInternal modelContextWindow={props.modelContextWindow}> {props.children} \</ContextDisplayRootInternal> ); } function ContextDisplayTrigger({ className, children, ...props }: React.ComponentProps<"button">) { return ( \<TooltipTrigger asChild> \<button type="button" data-slot="context-display-trigger" className={cn( "inline-flex items-center rounded-md transition-colors", className, )} {...props} > {children} \</button> \</TooltipTrigger> ); } function ContextDisplayContent({ side = "top", className, }: { side?: "top" | "bottom" | "left" | "right" | undefined; className?: string; }) { const { usage, totalTokens, percent, modelContextWindow } = useContextDisplay(); return ( \<TooltipContent side={side} sideOffset={8} data-slot="context-display-popover" className={cn( "\[&\_span>svg]:hidden! rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md", className, )} > \<div className="grid min-w-40 gap-1.5 text-xs"> \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Usage\</span> \<span className="font-mono tabular-nums">{Math.round(percent)}%\</span> \</div> {usage?.inputTokens !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Input\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.inputTokens)} \</span> \</div> )} {usage?.cachedInputTokens !== undefined && usage.cachedInputTokens > 0 && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Cached\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.cachedInputTokens)} \</span> \</div> )} {usage?.outputTokens !== undefined && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Output\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.outputTokens)} \</span> \</div> )} {usage?.reasoningTokens !== undefined && usage.reasoningTokens > 0 && ( \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Reasoning\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(usage.reasoningTokens)} \</span> \</div> )} \<div className="mt-0.5 border-t pt-1.5"> \<div className="flex items-center justify-between gap-4"> \<span className="text-muted-foreground">Total\</span> \<span className="font-mono tabular-nums"> {formatTokenCount(totalTokens)} /{" "} {formatTokenCount(modelContextWindow)} \</span> \</div> \</div> \</div> \</TooltipContent> ); } const RING\_SIZE = 24; const RING\_STROKE = 3; const RING\_RADIUS = (RING\_SIZE - RING\_STROKE) / 2; const RING\_CIRCUMFERENCE = 2 \* Math.PI \* RING\_RADIUS; function RingVisual() { const { percent } = useContextDisplay(); return ( \<svg aria-hidden="true" width={RING\_SIZE} height={RING\_SIZE} viewBox={\`0 0 ${RING\_SIZE} ${RING\_SIZE}\`} className="-rotate-90" > \<circle cx={RING\_SIZE / 2} cy={RING\_SIZE / 2} r={RING\_RADIUS} fill="none" strokeWidth={RING\_STROKE} className="stroke-muted" /> \<circle cx={RING\_SIZE / 2} cy={RING\_SIZE / 2} r={RING\_RADIUS} fill="none" strokeWidth={RING\_STROKE} strokeLinecap="round" strokeDasharray={RING\_CIRCUMFERENCE} strokeDashoffset={ RING\_CIRCUMFERENCE - (percent / 100) \* RING\_CIRCUMFERENCE } className={cn( "transition-\[stroke-dashoffset,stroke] duration-300", getStrokeColor(percent), )} /> \</svg> ); } const ContextDisplayRing: FC\<PresetProps> = ({ modelContextWindow, className, side, usage, }) => ( \<ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}> \<ContextDisplayTrigger className={cn("p-1", className)} aria-label="Context usage" > \<RingVisual /> \</ContextDisplayTrigger> \<ContextDisplayContent side={side} /> \</ContextDisplayRoot> ); function BarVisual() { const { percent, totalTokens } = useContextDisplay(); return ( \<div className="flex items-center gap-2"> \<div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"> \<div className={cn( "h-full rounded-full transition-all duration-300", getBarColor(percent), )} style={{ width: \`${percent}%\` }} /> \</div> \<span className="text-\[10px] text-muted-foreground tabular-nums"> {formatTokenCount(totalTokens)} ({Math.round(percent)}%) \</span> \</div> ); } const ContextDisplayBar: FC\<PresetProps> = ({ modelContextWindow, className, side, usage, }) => ( \<ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}> \<ContextDisplayTrigger className={cn("px-2 py-1", className)} aria-label="Context usage" > \<BarVisual /> \</ContextDisplayTrigger> \<ContextDisplayContent side={side} /> \</ContextDisplayRoot> ); function TextVisual() { const { totalTokens, modelContextWindow } = useContextDisplay(); return ( <> {formatTokenCount(totalTokens)} / {formatTokenCount(modelContextWindow)} \</> ); } const ContextDisplayText: FC\<PresetProps> = ({ modelContextWindow, className, side, usage, }) => ( \<ContextDisplayRoot modelContextWindow={modelContextWindow} usage={usage}> \<ContextDisplayTrigger aria-label="Context usage" className={cn( "px-2 py-1 font-mono text-muted-foreground text-xs tabular-nums hover:bg-accent hover:text-accent-foreground", className, )} > \<TextVisual /> \</ContextDisplayTrigger> \<ContextDisplayContent side={side} /> \</ContextDisplayRoot> ); const ContextDisplay = {} as { Root: typeof ContextDisplayRoot; Trigger: typeof ContextDisplayTrigger; Content: typeof ContextDisplayContent; Ring: typeof ContextDisplayRing; Bar: typeof ContextDisplayBar; Text: typeof ContextDisplayText; }; ContextDisplay.Root = ContextDisplayRoot; ContextDisplay.Trigger = ContextDisplayTrigger; ContextDisplay.Content = ContextDisplayContent; ContextDisplay.Ring = ContextDisplayRing; ContextDisplay.Bar = ContextDisplayBar; ContextDisplay.Text = ContextDisplayText; export { ContextDisplay, ContextDisplayRoot, ContextDisplayTrigger, ContextDisplayContent, ContextDisplayRing, ContextDisplayBar, ContextDisplayText, };

This adds a `/components/assistant-ui/context-display.tsx` file to your project.

### [Forward token usage from your route handler](#forward-token-usage-from-your-route-handler)

Use `messageMetadata` in your Next.js route to attach `usage` from `finish` and `modelId` from `finish-step`:

- title

  app/api/chat/route.ts

`import { streamText, convertToModelMessages } from "ai"; export async function POST(req: Request) { const { messages, config } = await req.json(); const result = streamText({ model: getModel(config?.modelName), messages: await convertToModelMessages(messages), }); return result.toUIMessageStreamResponse({ messageMetadata: ({ part }) => { if (part.type === "finish") { return { usage: part.totalUsage, }; } if (part.type === "finish-step") { return { modelId: part.response.modelId, }; } return undefined; }, }); }`

### [Use in your application](#use-in-your-application)

Pick a variant and place it in your thread footer, composer, or sidebar. Pass `modelContextWindow` with your model's token limit.

- title

  /components/assistant-ui/thread.tsx

`import { ContextDisplay } from "@/components/assistant-ui/context-display"; const ThreadFooter: FC = () => { return ( <div className="flex items-center justify-end px-3 py-1.5"> <ContextDisplay.Bar modelContextWindow={128000} /> </div> ); };`

## [Variants](#variants)

Three preset variants are available, each wrapping the shared tooltip popover:

`// SVG donut ring (default, compact) <ContextDisplay.Ring modelContextWindow={128000} /> // Horizontal progress bar with label <ContextDisplay.Bar modelContextWindow={128000} /> // Minimal monospace text <ContextDisplay.Text modelContextWindow={128000} />`

All presets accept `className` for styling overrides and `side` to control tooltip placement (`"top"`, `"bottom"`, `"left"`, `"right"`).

## [Composable API](#composable-api)

For custom visualizations, use the building blocks directly:

`import { ContextDisplay } from "@/components/assistant-ui/context-display"; <ContextDisplay.Root modelContextWindow={128000}> <ContextDisplay.Trigger aria-label="Context usage"> <MyCustomGauge /> </ContextDisplay.Trigger> <ContextDisplay.Content side="top" /> </ContextDisplay.Root>`

| Component | Description                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Root`    | Uses provided `usage` when supplied, otherwise fetches token usage internally; provides shared context and wraps children in a tooltip |
| `Trigger` | Button that opens the tooltip on hover                                                                                                 |
| `Content` | Tooltip popover with the token breakdown (Usage %, Input, Cached, Output, Reasoning, Total)                                            |

## [API Reference](#api-reference)

### [Preset Props](#preset-props)

All preset variants (`Ring`, `Bar`, `Text`) share the same props:

| Prop                 | Type                                     | Default | Description                                                                        |
| -------------------- | ---------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `modelContextWindow` | `number`                                 | —       | Maximum token limit of the current model (required)                                |
| `className`          | `string`                                 | —       | Additional class names on the trigger button                                       |
| `side`               | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Tooltip placement                                                                  |
| `usage`              | `ThreadTokenUsage`                       | —       | Optional externally-provided usage data (skips internal usage fetch when provided) |

### [Color Thresholds](#color-thresholds)

Ring and Bar share the same severity colors:

| Level    | Threshold   | Ring                 | Bar              |
| -------- | ----------- | -------------------- | ---------------- |
| Low      | `< 65%`     | `stroke-emerald-500` | `bg-emerald-500` |
| Warning  | `65% – 85%` | `stroke-amber-500`   | `bg-amber-500`   |
| Critical | `> 85%`     | `stroke-red-500`     | `bg-red-500`     |

Text displays numeric values only — no severity color.

## [Related](#related)

- - href

    /docs/ui/message-timing

  Message Timing

  — Streaming performance stats (TTFT, tok/s)

- - href

    /docs/ui/thread

  Thread

  — The thread component where ContextDisplay is typically placed