# ToolGroup
URL: /docs/ui/tool-group

Wrapper for consecutive tool calls with collapsible and styled options.

A wrapper component that groups consecutive tool calls together, displaying them in a collapsible container with auto-expand behavior during streaming.

## [Getting Started](#getting-started)

### [Add `tool-group` and `tool-fallback`](#add-tool-group-and-tool-fallback)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/tool-group.json
  - https\://r.assistant-ui.com/tool-fallback.json

#### Main Component

- packages

  - @assistant-ui/react
  - class-variance-authority

* code

  "use client"; import { memo, useCallback, useRef, useState, type FC, type PropsWithChildren, } from "react"; import { ChevronDownIcon, LoaderIcon } from "lucide-react"; import { cva, type VariantProps } from "class-variance-authority"; import { useScrollLock } from "@assistant-ui/react"; import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"; import { cn } from "@/lib/utils"; const ANIMATION\_DURATION = 200; const toolGroupVariants = cva("aui-tool-group-root group/tool-group w-full", { variants: { variant: { outline: "rounded-lg border py-3", ghost: "", muted: "rounded-lg border border-muted-foreground/30 bg-muted/30 py-3", }, }, defaultVariants: { variant: "outline" }, }); export type ToolGroupRootProps = Omit< React.ComponentProps\<typeof Collapsible>, "open" | "onOpenChange" > & VariantProps\<typeof toolGroupVariants> & { open?: boolean; onOpenChange?: (open: boolean) => void; defaultOpen?: boolean; }; function ToolGroupRoot({ className, variant, open: controlledOpen, onOpenChange: controlledOnOpenChange, defaultOpen = false, children, ...props }: ToolGroupRootProps) { const collapsibleRef = useRef\<HTMLDivElement>(null); const \[uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen); const lockScroll = useScrollLock(collapsibleRef, ANIMATION\_DURATION); const isControlled = controlledOpen !== undefined; const isOpen = isControlled ? controlledOpen : uncontrolledOpen; const handleOpenChange = useCallback( (open: boolean) => { if (!open) { lockScroll(); } if (!isControlled) { setUncontrolledOpen(open); } controlledOnOpenChange?.(open); }, \[lockScroll, isControlled, controlledOnOpenChange], ); return ( \<Collapsible ref={collapsibleRef} data-slot="tool-group-root" data-variant={variant ?? "outline"} open={isOpen} onOpenChange={handleOpenChange} className={cn( toolGroupVariants({ variant }), "group/tool-group-root", className, )} style={ { "--animation-duration": \`${ANIMATION\_DURATION}ms\`, } as React.CSSProperties } {...props} > {children} \</Collapsible> ); } function ToolGroupTrigger({ count, active = false, className, ...props }: React.ComponentProps\<typeof CollapsibleTrigger> & { count: number; active?: boolean; }) { const label = \`${count} tool ${count === 1 ? "call" : "calls"}\`; return ( \<CollapsibleTrigger data-slot="tool-group-trigger" className={cn( "aui-tool-group-trigger group/trigger flex items-center gap-2 text-sm transition-colors", "group-data-\[variant=outline]/tool-group-root:w-full group-data-\[variant=outline]/tool-group-root:px-4", "group-data-\[variant=muted]/tool-group-root:w-full group-data-\[variant=muted]/tool-group-root:px-4", className, )} {...props} > {active && ( \<LoaderIcon data-slot="tool-group-trigger-loader" className="aui-tool-group-trigger-loader size-4 shrink-0 animate-spin" /> )} \<span data-slot="tool-group-trigger-label" className={cn( "aui-tool-group-trigger-label-wrapper relative inline-block text-start font-medium leading-none", "group-data-\[variant=outline]/tool-group-root:grow", "group-data-\[variant=muted]/tool-group-root:grow", )} > \<span>{label}\</span> {active && ( \<span aria-hidden data-slot="tool-group-trigger-shimmer" className="aui-tool-group-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none" > {label} \</span> )} \</span> \<ChevronDownIcon data-slot="tool-group-trigger-chevron" className={cn( "aui-tool-group-trigger-chevron size-4 shrink-0", "transition-transform duration-(--animation-duration) ease-out", "group-data-\[state=closed]/trigger:-rotate-90", "group-data-\[state=open]/trigger:rotate-0", )} /> \</CollapsibleTrigger> ); } function ToolGroupContent({ className, children, ...props }: React.ComponentProps\<typeof CollapsibleContent>) { return ( \<CollapsibleContent data-slot="tool-group-content" className={cn( "aui-tool-group-content relative overflow-hidden text-sm outline-none", "group/collapsible-content ease-out", "data-\[state=closed]:animate-collapsible-up", "data-\[state=open]:animate-collapsible-down", "data-\[state=closed]:fill-mode-forwards", "data-\[state=closed]:pointer-events-none", "data-\[state=open]:duration-(--animation-duration)", "data-\[state=closed]:duration-(--animation-duration)", className, )} {...props} > \<div className={cn( "mt-2 flex flex-col gap-2", "group-data-\[variant=outline]/tool-group-root:mt-3 group-data-\[variant=outline]/tool-group-root:border-t group-data-\[variant=outline]/tool-group-root:px-4 group-data-\[variant=outline]/tool-group-root:pt-3", "group-data-\[variant=muted]/tool-group-root:mt-3 group-data-\[variant=muted]/tool-group-root:border-t group-data-\[variant=muted]/tool-group-root:px-4 group-data-\[variant=muted]/tool-group-root:pt-3", )} > {children} \</div> \</CollapsibleContent> ); } type ToolGroupComponent = FC< PropsWithChildren<{ startIndex: number; endIndex: number }> > & { Root: typeof ToolGroupRoot; Trigger: typeof ToolGroupTrigger; Content: typeof ToolGroupContent; }; const ToolGroupImpl: FC< PropsWithChildren<{ startIndex: number; endIndex: number }> > = ({ children, startIndex, endIndex }) => { const toolCount = endIndex - startIndex + 1; return ( \<ToolGroupRoot> \<ToolGroupTrigger count={toolCount} /> \<ToolGroupContent>{children}\</ToolGroupContent> \</ToolGroupRoot> ); }; /\*\* \* @deprecated This wrapper targets the legacy \`components.ToolGroup\` prop \* on \`\<MessagePrimitive.Parts>\`. Use \`\<MessagePrimitive.GroupedParts>\` with \* a \`groupBy\` returning \`"group-tool"\` and compose \`ToolGroupRoot\` / \* \`ToolGroupTrigger\` / \`ToolGroupContent\` directly. See \`thread.tsx\`. \*/ const ToolGroup = memo(ToolGroupImpl) as unknown as ToolGroupComponent; ToolGroup.displayName = "ToolGroup"; ToolGroup.Root = ToolGroupRoot; ToolGroup.Trigger = ToolGroupTrigger; ToolGroup.Content = ToolGroupContent; export { ToolGroup, ToolGroupRoot, ToolGroupTrigger, ToolGroupContent, toolGroupVariants, };

- lang

  tsx

- code

  "use client"; import { memo, useCallback, useRef, useState, type FC, type PropsWithChildren, } from "react"; import { ChevronDownIcon, LoaderIcon } from "lucide-react"; import { cva, type VariantProps } from "class-variance-authority"; import { useScrollLock } from "@assistant-ui/react"; import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"; import { cn } from "@/lib/utils"; const ANIMATION\_DURATION = 200; const toolGroupVariants = cva("aui-tool-group-root group/tool-group w-full", { variants: { variant: { outline: "rounded-lg border py-3", ghost: "", muted: "rounded-lg border border-muted-foreground/30 bg-muted/30 py-3", }, }, defaultVariants: { variant: "outline" }, }); export type ToolGroupRootProps = Omit< React.ComponentProps\<typeof Collapsible>, "open" | "onOpenChange" > & VariantProps\<typeof toolGroupVariants> & { open?: boolean; onOpenChange?: (open: boolean) => void; defaultOpen?: boolean; }; function ToolGroupRoot({ className, variant, open: controlledOpen, onOpenChange: controlledOnOpenChange, defaultOpen = false, children, ...props }: ToolGroupRootProps) { const collapsibleRef = useRef\<HTMLDivElement>(null); const \[uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen); const lockScroll = useScrollLock(collapsibleRef, ANIMATION\_DURATION); const isControlled = controlledOpen !== undefined; const isOpen = isControlled ? controlledOpen : uncontrolledOpen; const handleOpenChange = useCallback( (open: boolean) => { if (!open) { lockScroll(); } if (!isControlled) { setUncontrolledOpen(open); } controlledOnOpenChange?.(open); }, \[lockScroll, isControlled, controlledOnOpenChange], ); return ( \<Collapsible ref={collapsibleRef} data-slot="tool-group-root" data-variant={variant ?? "outline"} open={isOpen} onOpenChange={handleOpenChange} className={cn( toolGroupVariants({ variant }), "group/tool-group-root", className, )} style={ { "--animation-duration": \`${ANIMATION\_DURATION}ms\`, } as React.CSSProperties } {...props} > {children} \</Collapsible> ); } function ToolGroupTrigger({ count, active = false, className, ...props }: React.ComponentProps\<typeof CollapsibleTrigger> & { count: number; active?: boolean; }) { const label = \`${count} tool ${count === 1 ? "call" : "calls"}\`; return ( \<CollapsibleTrigger data-slot="tool-group-trigger" className={cn( "aui-tool-group-trigger group/trigger flex items-center gap-2 text-sm transition-colors", "group-data-\[variant=outline]/tool-group-root:w-full group-data-\[variant=outline]/tool-group-root:px-4", "group-data-\[variant=muted]/tool-group-root:w-full group-data-\[variant=muted]/tool-group-root:px-4", className, )} {...props} > {active && ( \<LoaderIcon data-slot="tool-group-trigger-loader" className="aui-tool-group-trigger-loader size-4 shrink-0 animate-spin" /> )} \<span data-slot="tool-group-trigger-label" className={cn( "aui-tool-group-trigger-label-wrapper relative inline-block text-start font-medium leading-none", "group-data-\[variant=outline]/tool-group-root:grow", "group-data-\[variant=muted]/tool-group-root:grow", )} > \<span>{label}\</span> {active && ( \<span aria-hidden data-slot="tool-group-trigger-shimmer" className="aui-tool-group-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none" > {label} \</span> )} \</span> \<ChevronDownIcon data-slot="tool-group-trigger-chevron" className={cn( "aui-tool-group-trigger-chevron size-4 shrink-0", "transition-transform duration-(--animation-duration) ease-out", "group-data-\[state=closed]/trigger:-rotate-90", "group-data-\[state=open]/trigger:rotate-0", )} /> \</CollapsibleTrigger> ); } function ToolGroupContent({ className, children, ...props }: React.ComponentProps\<typeof CollapsibleContent>) { return ( \<CollapsibleContent data-slot="tool-group-content" className={cn( "aui-tool-group-content relative overflow-hidden text-sm outline-none", "group/collapsible-content ease-out", "data-\[state=closed]:animate-collapsible-up", "data-\[state=open]:animate-collapsible-down", "data-\[state=closed]:fill-mode-forwards", "data-\[state=closed]:pointer-events-none", "data-\[state=open]:duration-(--animation-duration)", "data-\[state=closed]:duration-(--animation-duration)", className, )} {...props} > \<div className={cn( "mt-2 flex flex-col gap-2", "group-data-\[variant=outline]/tool-group-root:mt-3 group-data-\[variant=outline]/tool-group-root:border-t group-data-\[variant=outline]/tool-group-root:px-4 group-data-\[variant=outline]/tool-group-root:pt-3", "group-data-\[variant=muted]/tool-group-root:mt-3 group-data-\[variant=muted]/tool-group-root:border-t group-data-\[variant=muted]/tool-group-root:px-4 group-data-\[variant=muted]/tool-group-root:pt-3", )} > {children} \</div> \</CollapsibleContent> ); } type ToolGroupComponent = FC< PropsWithChildren<{ startIndex: number; endIndex: number }> > & { Root: typeof ToolGroupRoot; Trigger: typeof ToolGroupTrigger; Content: typeof ToolGroupContent; }; const ToolGroupImpl: FC< PropsWithChildren<{ startIndex: number; endIndex: number }> > = ({ children, startIndex, endIndex }) => { const toolCount = endIndex - startIndex + 1; return ( \<ToolGroupRoot> \<ToolGroupTrigger count={toolCount} /> \<ToolGroupContent>{children}\</ToolGroupContent> \</ToolGroupRoot> ); }; /\*\* \* @deprecated This wrapper targets the legacy \`components.ToolGroup\` prop \* on \`\<MessagePrimitive.Parts>\`. Use \`\<MessagePrimitive.GroupedParts>\` with \* a \`groupBy\` returning \`"group-tool"\` and compose \`ToolGroupRoot\` / \* \`ToolGroupTrigger\` / \`ToolGroupContent\` directly. See \`thread.tsx\`. \*/ const ToolGroup = memo(ToolGroupImpl) as unknown as ToolGroupComponent; ToolGroup.displayName = "ToolGroup"; ToolGroup.Root = ToolGroupRoot; ToolGroup.Trigger = ToolGroupTrigger; ToolGroup.Content = ToolGroupContent; export { ToolGroup, ToolGroupRoot, ToolGroupTrigger, ToolGroupContent, toolGroupVariants, };

* code

  "use client"; import { memo, useCallback, useRef, useState } from "react"; import { AlertCircleIcon, CheckIcon, ChevronDownIcon, LoaderIcon, XCircleIcon, } from "lucide-react"; import { useScrollLock, type ToolCallMessagePartStatus, type ToolCallMessagePartComponent, } from "@assistant-ui/react"; import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"; import { cn } from "@/lib/utils"; const ANIMATION\_DURATION = 200; export type ToolFallbackRootProps = Omit< React.ComponentProps\<typeof Collapsible>, "open" | "onOpenChange" > & { open?: boolean; onOpenChange?: (open: boolean) => void; defaultOpen?: boolean; }; function ToolFallbackRoot({ className, open: controlledOpen, onOpenChange: controlledOnOpenChange, defaultOpen = false, children, ...props }: ToolFallbackRootProps) { const collapsibleRef = useRef\<HTMLDivElement>(null); const \[uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen); const lockScroll = useScrollLock(collapsibleRef, ANIMATION\_DURATION); const isControlled = controlledOpen !== undefined; const isOpen = isControlled ? controlledOpen : uncontrolledOpen; const handleOpenChange = useCallback( (open: boolean) => { if (!open) { lockScroll(); } if (!isControlled) { setUncontrolledOpen(open); } controlledOnOpenChange?.(open); }, \[lockScroll, isControlled, controlledOnOpenChange], ); return ( \<Collapsible ref={collapsibleRef} data-slot="tool-fallback-root" open={isOpen} onOpenChange={handleOpenChange} className={cn( "aui-tool-fallback-root group/tool-fallback-root w-full rounded-lg border py-3", className, )} style={ { "--animation-duration": \`${ANIMATION\_DURATION}ms\`, } as React.CSSProperties } {...props} > {children} \</Collapsible> ); } type ToolStatus = ToolCallMessagePartStatus\["type"]; const statusIconMap: Record\<ToolStatus, React.ElementType> = { running: LoaderIcon, complete: CheckIcon, incomplete: XCircleIcon, "requires-action": AlertCircleIcon, }; function ToolFallbackTrigger({ toolName, status, className, ...props }: React.ComponentProps\<typeof CollapsibleTrigger> & { toolName: string; status?: ToolCallMessagePartStatus; }) { const statusType = status?.type ?? "complete"; const isRunning = statusType === "running"; const isCancelled = status?.type === "incomplete" && status.reason === "cancelled"; const Icon = statusIconMap\[statusType]; const label = isCancelled ? "Cancelled tool" : "Used tool"; return ( \<CollapsibleTrigger data-slot="tool-fallback-trigger" className={cn( "aui-tool-fallback-trigger group/trigger flex w-full items-center gap-2 px-4 text-sm transition-colors", className, )} {...props} > \<Icon data-slot="tool-fallback-trigger-icon" className={cn( "aui-tool-fallback-trigger-icon size-4 shrink-0", isCancelled && "text-muted-foreground", isRunning && "animate-spin", )} /> \<span data-slot="tool-fallback-trigger-label" className={cn( "aui-tool-fallback-trigger-label-wrapper relative inline-block grow text-start leading-none", isCancelled && "text-muted-foreground line-through", )} > \<span> {label}: \<b>{toolName}\</b> \</span> {isRunning && ( \<span aria-hidden data-slot="tool-fallback-trigger-shimmer" className="aui-tool-fallback-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none" > {label}: \<b>{toolName}\</b> \</span> )} \</span> \<ChevronDownIcon data-slot="tool-fallback-trigger-chevron" className={cn( "aui-tool-fallback-trigger-chevron size-4 shrink-0", "transition-transform duration-(--animation-duration) ease-out", "group-data-\[state=closed]/trigger:-rotate-90", "group-data-\[state=open]/trigger:rotate-0", )} /> \</CollapsibleTrigger> ); } function ToolFallbackContent({ className, children, ...props }: React.ComponentProps\<typeof CollapsibleContent>) { return ( \<CollapsibleContent data-slot="tool-fallback-content" className={cn( "aui-tool-fallback-content relative overflow-hidden text-sm outline-none", "group/collapsible-content ease-out", "data-\[state=closed]:animate-collapsible-up", "data-\[state=open]:animate-collapsible-down", "data-\[state=closed]:fill-mode-forwards", "data-\[state=closed]:pointer-events-none", "data-\[state=open]:duration-(--animation-duration)", "data-\[state=closed]:duration-(--animation-duration)", className, )} {...props} > \<div className="mt-3 flex flex-col gap-2 border-t pt-2">{children}\</div> \</CollapsibleContent> ); } function ToolFallbackArgs({ argsText, className, ...props }: React.ComponentProps<"div"> & { argsText?: string; }) { if (!argsText) return null; return ( \<div data-slot="tool-fallback-args" className={cn("aui-tool-fallback-args px-4", className)} {...props} > \<pre className="aui-tool-fallback-args-value whitespace-pre-wrap"> {argsText} \</pre> \</div> ); } function ToolFallbackResult({ result, className, ...props }: React.ComponentProps<"div"> & { result?: unknown; }) { if (result === undefined) return null; return ( \<div data-slot="tool-fallback-result" className={cn( "aui-tool-fallback-result border-t border-dashed px-4 pt-2", className, )} {...props} > \<p className="aui-tool-fallback-result-header font-semibold">Result:\</p> \<pre className="aui-tool-fallback-result-content whitespace-pre-wrap"> {typeof result === "string" ? result : JSON.stringify(result, null, 2)} \</pre> \</div> ); } function ToolFallbackError({ status, className, ...props }: React.ComponentProps<"div"> & { status?: ToolCallMessagePartStatus; }) { if (status?.type !== "incomplete") return null; const error = status.error; const errorText = error ? typeof error === "string" ? error : JSON.stringify(error) : null; if (!errorText) return null; const isCancelled = status.reason === "cancelled"; const headerText = isCancelled ? "Cancelled reason:" : "Error:"; return ( \<div data-slot="tool-fallback-error" className={cn("aui-tool-fallback-error px-4", className)} {...props} > \<p className="aui-tool-fallback-error-header font-semibold text-muted-foreground"> {headerText} \</p> \<p className="aui-tool-fallback-error-reason text-muted-foreground"> {errorText} \</p> \</div> ); } const ToolFallbackImpl: ToolCallMessagePartComponent = ({ toolName, argsText, result, status, }) => { const isCancelled = status?.type === "incomplete" && status.reason === "cancelled"; return ( \<ToolFallbackRoot className={cn(isCancelled && "border-muted-foreground/30 bg-muted/30")} > \<ToolFallbackTrigger toolName={toolName} status={status} /> \<ToolFallbackContent> \<ToolFallbackError status={status} /> \<ToolFallbackArgs argsText={argsText} className={cn(isCancelled && "opacity-60")} /> {!isCancelled && \<ToolFallbackResult result={result} />} \</ToolFallbackContent> \</ToolFallbackRoot> ); }; const ToolFallback = memo( ToolFallbackImpl, ) as unknown as ToolCallMessagePartComponent & { Root: typeof ToolFallbackRoot; Trigger: typeof ToolFallbackTrigger; Content: typeof ToolFallbackContent; Args: typeof ToolFallbackArgs; Result: typeof ToolFallbackResult; Error: typeof ToolFallbackError; }; ToolFallback.displayName = "ToolFallback"; ToolFallback.Root = ToolFallbackRoot; ToolFallback.Trigger = ToolFallbackTrigger; ToolFallback.Content = ToolFallbackContent; ToolFallback.Args = ToolFallbackArgs; ToolFallback.Result = ToolFallbackResult; ToolFallback.Error = ToolFallbackError; export { ToolFallback, ToolFallbackRoot, ToolFallbackTrigger, ToolFallbackContent, ToolFallbackArgs, ToolFallbackResult, ToolFallbackError, };

- lang

  tsx

- code

  "use client"; import { memo, useCallback, useRef, useState } from "react"; import { AlertCircleIcon, CheckIcon, ChevronDownIcon, LoaderIcon, XCircleIcon, } from "lucide-react"; import { useScrollLock, type ToolCallMessagePartStatus, type ToolCallMessagePartComponent, } from "@assistant-ui/react"; import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"; import { cn } from "@/lib/utils"; const ANIMATION\_DURATION = 200; export type ToolFallbackRootProps = Omit< React.ComponentProps\<typeof Collapsible>, "open" | "onOpenChange" > & { open?: boolean; onOpenChange?: (open: boolean) => void; defaultOpen?: boolean; }; function ToolFallbackRoot({ className, open: controlledOpen, onOpenChange: controlledOnOpenChange, defaultOpen = false, children, ...props }: ToolFallbackRootProps) { const collapsibleRef = useRef\<HTMLDivElement>(null); const \[uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen); const lockScroll = useScrollLock(collapsibleRef, ANIMATION\_DURATION); const isControlled = controlledOpen !== undefined; const isOpen = isControlled ? controlledOpen : uncontrolledOpen; const handleOpenChange = useCallback( (open: boolean) => { if (!open) { lockScroll(); } if (!isControlled) { setUncontrolledOpen(open); } controlledOnOpenChange?.(open); }, \[lockScroll, isControlled, controlledOnOpenChange], ); return ( \<Collapsible ref={collapsibleRef} data-slot="tool-fallback-root" open={isOpen} onOpenChange={handleOpenChange} className={cn( "aui-tool-fallback-root group/tool-fallback-root w-full rounded-lg border py-3", className, )} style={ { "--animation-duration": \`${ANIMATION\_DURATION}ms\`, } as React.CSSProperties } {...props} > {children} \</Collapsible> ); } type ToolStatus = ToolCallMessagePartStatus\["type"]; const statusIconMap: Record\<ToolStatus, React.ElementType> = { running: LoaderIcon, complete: CheckIcon, incomplete: XCircleIcon, "requires-action": AlertCircleIcon, }; function ToolFallbackTrigger({ toolName, status, className, ...props }: React.ComponentProps\<typeof CollapsibleTrigger> & { toolName: string; status?: ToolCallMessagePartStatus; }) { const statusType = status?.type ?? "complete"; const isRunning = statusType === "running"; const isCancelled = status?.type === "incomplete" && status.reason === "cancelled"; const Icon = statusIconMap\[statusType]; const label = isCancelled ? "Cancelled tool" : "Used tool"; return ( \<CollapsibleTrigger data-slot="tool-fallback-trigger" className={cn( "aui-tool-fallback-trigger group/trigger flex w-full items-center gap-2 px-4 text-sm transition-colors", className, )} {...props} > \<Icon data-slot="tool-fallback-trigger-icon" className={cn( "aui-tool-fallback-trigger-icon size-4 shrink-0", isCancelled && "text-muted-foreground", isRunning && "animate-spin", )} /> \<span data-slot="tool-fallback-trigger-label" className={cn( "aui-tool-fallback-trigger-label-wrapper relative inline-block grow text-start leading-none", isCancelled && "text-muted-foreground line-through", )} > \<span> {label}: \<b>{toolName}\</b> \</span> {isRunning && ( \<span aria-hidden data-slot="tool-fallback-trigger-shimmer" className="aui-tool-fallback-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none" > {label}: \<b>{toolName}\</b> \</span> )} \</span> \<ChevronDownIcon data-slot="tool-fallback-trigger-chevron" className={cn( "aui-tool-fallback-trigger-chevron size-4 shrink-0", "transition-transform duration-(--animation-duration) ease-out", "group-data-\[state=closed]/trigger:-rotate-90", "group-data-\[state=open]/trigger:rotate-0", )} /> \</CollapsibleTrigger> ); } function ToolFallbackContent({ className, children, ...props }: React.ComponentProps\<typeof CollapsibleContent>) { return ( \<CollapsibleContent data-slot="tool-fallback-content" className={cn( "aui-tool-fallback-content relative overflow-hidden text-sm outline-none", "group/collapsible-content ease-out", "data-\[state=closed]:animate-collapsible-up", "data-\[state=open]:animate-collapsible-down", "data-\[state=closed]:fill-mode-forwards", "data-\[state=closed]:pointer-events-none", "data-\[state=open]:duration-(--animation-duration)", "data-\[state=closed]:duration-(--animation-duration)", className, )} {...props} > \<div className="mt-3 flex flex-col gap-2 border-t pt-2">{children}\</div> \</CollapsibleContent> ); } function ToolFallbackArgs({ argsText, className, ...props }: React.ComponentProps<"div"> & { argsText?: string; }) { if (!argsText) return null; return ( \<div data-slot="tool-fallback-args" className={cn("aui-tool-fallback-args px-4", className)} {...props} > \<pre className="aui-tool-fallback-args-value whitespace-pre-wrap"> {argsText} \</pre> \</div> ); } function ToolFallbackResult({ result, className, ...props }: React.ComponentProps<"div"> & { result?: unknown; }) { if (result === undefined) return null; return ( \<div data-slot="tool-fallback-result" className={cn( "aui-tool-fallback-result border-t border-dashed px-4 pt-2", className, )} {...props} > \<p className="aui-tool-fallback-result-header font-semibold">Result:\</p> \<pre className="aui-tool-fallback-result-content whitespace-pre-wrap"> {typeof result === "string" ? result : JSON.stringify(result, null, 2)} \</pre> \</div> ); } function ToolFallbackError({ status, className, ...props }: React.ComponentProps<"div"> & { status?: ToolCallMessagePartStatus; }) { if (status?.type !== "incomplete") return null; const error = status.error; const errorText = error ? typeof error === "string" ? error : JSON.stringify(error) : null; if (!errorText) return null; const isCancelled = status.reason === "cancelled"; const headerText = isCancelled ? "Cancelled reason:" : "Error:"; return ( \<div data-slot="tool-fallback-error" className={cn("aui-tool-fallback-error px-4", className)} {...props} > \<p className="aui-tool-fallback-error-header font-semibold text-muted-foreground"> {headerText} \</p> \<p className="aui-tool-fallback-error-reason text-muted-foreground"> {errorText} \</p> \</div> ); } const ToolFallbackImpl: ToolCallMessagePartComponent = ({ toolName, argsText, result, status, }) => { const isCancelled = status?.type === "incomplete" && status.reason === "cancelled"; return ( \<ToolFallbackRoot className={cn(isCancelled && "border-muted-foreground/30 bg-muted/30")} > \<ToolFallbackTrigger toolName={toolName} status={status} /> \<ToolFallbackContent> \<ToolFallbackError status={status} /> \<ToolFallbackArgs argsText={argsText} className={cn(isCancelled && "opacity-60")} /> {!isCancelled && \<ToolFallbackResult result={result} />} \</ToolFallbackContent> \</ToolFallbackRoot> ); }; const ToolFallback = memo( ToolFallbackImpl, ) as unknown as ToolCallMessagePartComponent & { Root: typeof ToolFallbackRoot; Trigger: typeof ToolFallbackTrigger; Content: typeof ToolFallbackContent; Args: typeof ToolFallbackArgs; Result: typeof ToolFallbackResult; Error: typeof ToolFallbackError; }; ToolFallback.displayName = "ToolFallback"; ToolFallback.Root = ToolFallbackRoot; ToolFallback.Trigger = ToolFallbackTrigger; ToolFallback.Content = ToolFallbackContent; ToolFallback.Args = ToolFallbackArgs; ToolFallback.Result = ToolFallbackResult; ToolFallback.Error = ToolFallbackError; export { ToolFallback, ToolFallbackRoot, ToolFallbackTrigger, ToolFallbackContent, ToolFallbackArgs, ToolFallbackResult, ToolFallbackError, };

This adds `/components/assistant-ui/tool-group.tsx` and `/components/assistant-ui/tool-fallback.tsx` files to your project, which you can adjust as needed.

### [Use it in your application](#use-it-in-your-application)

Use `MessagePrimitive.GroupedParts` and return `"group-tool"` for tool-call parts. The group case wraps `children`; the tool-call leaf renders the resolved tool UI or your fallback.

- title

  /components/assistant-ui/thread.tsx

`import { MessagePrimitive } from "@assistant-ui/react"; import { ToolFallback } from "@/components/assistant-ui/tool-fallback"; import { ToolGroupContent, ToolGroupRoot, ToolGroupTrigger, } from "@/components/assistant-ui/tool-group"; const AssistantMessage = () => { return ( <MessagePrimitive.Root> <MessagePrimitive.GroupedParts groupBy={(part) => { if (part.type === "tool-call") return ["group-tool"]; return null; }} > {({ part, children }) => { switch (part.type) { case "group-tool": return ( <ToolGroupRoot> <ToolGroupTrigger count={part.indices.length} active={part.status.type === "running"} /> <ToolGroupContent>{children}</ToolGroupContent> </ToolGroupRoot> ); case "tool-call": return part.toolUI ?? <ToolFallback {...part} />; default: return null; } }} </MessagePrimitive.GroupedParts> </MessagePrimitive.Root> ); };`

## [Variants](#variants)

Use the `variant` prop on `ToolGroup.Root` to change the visual style:

`<ToolGroup.Root variant="outline">...</ToolGroup.Root> <ToolGroup.Root variant="muted">...</ToolGroup.Root>`

| Variant   | Description                  |
| --------- | ---------------------------- |
| `outline` | Rounded border (default)     |
| `ghost`   | No additional styling        |
| `muted`   | Muted background with border |

## [Examples](#examples)

### [Streaming Demo (Custom UI + Fallback)](#streaming-demo-custom-ui--fallback)

Interactive demo showing tool group with **custom tool UIs** and `ToolFallback` working together. Watch as weather cards stream in with loading states, followed by a search tool using the fallback UI.

### [Custom Tool UIs](#custom-tool-uis)

ToolGroup works with any custom tool UI components:

`// Custom Weather Tool UI function WeatherToolUI({ location, temperature, condition }) { return ( <div className="flex items-center gap-3 rounded-lg border p-3"> <WeatherIcon condition={condition} /> <div> <div className="text-xs text-muted-foreground">{location}</div> <div className="text-lg font-medium">{temperature}°F</div> </div> </div> ); } // Use in ToolGroup <ToolGroupRoot variant="outline"> <ToolGroupTrigger count={3} /> <ToolGroupContent> <WeatherToolUI location="New York" temperature={65} condition="Cloudy" /> <WeatherToolUI location="London" temperature={55} condition="Rainy" /> <SearchToolUI query="best restaurants" results={24} /> </ToolGroupContent> </ToolGroupRoot>`

## [Composable API](#composable-api)

All sub-components are exported for custom layouts:

| Component           | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `ToolGroup.Root`    | Collapsible container with scroll lock and variants    |
| `ToolGroup.Trigger` | Header with tool count, shimmer animation, and chevron |
| `ToolGroup.Content` | Animated collapsible content wrapper                   |

`import { ToolGroup, ToolGroupRoot, ToolGroupTrigger, ToolGroupContent, } from "@/components/assistant-ui/tool-group"; // Compound component syntax <ToolGroup.Root variant="outline" defaultOpen> <ToolGroup.Trigger count={3} active={false} /> <ToolGroup.Content> {/* Any tool UI components - custom or ToolFallback */} </ToolGroup.Content> </ToolGroup.Root>`

## [API Reference](#api-reference)

### [ToolGroupRoot](#toolgrouproot)

`ToolGroupRootProps`

- `variant` `: "outline" | "ghost" | "muted"` = "outline"

  Visual variant of the tool group container.

- `open` `?: boolean`

  Controlled open state.

- `onOpenChange` `?: (open: boolean) => void`

  Callback when open state changes.

- `defaultOpen` `: boolean` = false

  Initial open state for uncontrolled usage.

### [ToolGroupTrigger](#toolgrouptrigger)

`ToolGroupTriggerProps`

- `count` `: number`

  Number of tool calls to display in the label.

- `active` `: boolean` = false

  Shows loading spinner and shimmer animation when true.

### [ToolGroup (Legacy Wrapper)](#toolgroup-legacy-wrapper)

`ToolGroup` is kept for existing code that still uses the deprecated `components.ToolGroup` prop on `MessagePrimitive.Parts`. Prefer composing `ToolGroupRoot`, `ToolGroupTrigger`, and `ToolGroupContent` inside `MessagePrimitive.GroupedParts`.

`ToolGroupProps`

- `startIndex` `: number`

  The index of the first tool call in the group.

- `endIndex` `: number`

  The index of the last tool call in the group.

- `children` `: ReactNode`

  The rendered tool call components.

## [Related Components](#related-components)

- - href

    /docs/ui/tool-fallback

  ToolFallback

  \- Default UI for tools without custom renderers

- - href

    /docs/ui/part-grouping

  PartGrouping

  \- Advanced message part grouping (experimental)