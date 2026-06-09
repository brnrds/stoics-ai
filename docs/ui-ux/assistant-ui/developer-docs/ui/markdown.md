# Markdown
URL: /docs/ui/markdown

Display rich text with headings, lists, links, and code blocks.

Markdown support is already included by default in the `Thread` component.

## [Enabling markdown support](#enabling-markdown-support)

### [Add `markdown-text`](#add-markdown-text)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/markdown-text.json

#### Main Component

- packages

  - @assistant-ui/react-markdown
  - remark-gfm

* code

  "use client"; import "@assistant-ui/react-markdown/styles/dot.css"; import { type CodeHeaderProps, MarkdownTextPrimitive, unstable\_memoizeMarkdownComponents as memoizeMarkdownComponents, useIsMarkdownCodeBlock, } from "@assistant-ui/react-markdown"; import remarkGfm from "remark-gfm"; import { type FC, memo, useState } from "react"; import { CheckIcon, CopyIcon } from "lucide-react"; import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button"; import { cn } from "@/lib/utils"; const MarkdownTextImpl = () => { return ( \<MarkdownTextPrimitive remarkPlugins={\[remarkGfm]} className="aui-md" components={defaultComponents} /> ); }; export const MarkdownText = memo(MarkdownTextImpl); const CodeHeader: FC\<CodeHeaderProps> = ({ language, code }) => { const { isCopied, copyToClipboard } = useCopyToClipboard(); const onCopy = () => { if (!code || isCopied) return; copyToClipboard(code); }; return ( \<div className="aui-code-header-root mt-2.5 flex items-center justify-between rounded-t-lg border border-border/50 border-b-0 bg-muted/50 px-3 py-1.5 text-xs"> \<span className="aui-code-header-language font-medium text-muted-foreground lowercase"> {language} \</span> \<TooltipIconButton tooltip="Copy" onClick={onCopy}> {!isCopied && \<CopyIcon />} {isCopied && \<CheckIcon />} \</TooltipIconButton> \</div> ); }; const useCopyToClipboard = ({ copiedDuration = 3000, }: { copiedDuration?: number; } = {}) => { const \[isCopied, setIsCopied] = useState\<boolean>(false); const copyToClipboard = (value: string) => { if (!value) return; navigator.clipboard.writeText(value).then(() => { setIsCopied(true); setTimeout(() => setIsCopied(false), copiedDuration); }); }; return { isCopied, copyToClipboard }; }; const defaultComponents = memoizeMarkdownComponents({ h1: ({ className, ...props }) => ( \<h1 className={cn( "aui-md-h1 mb-2 scroll-m-20 font-semibold text-base first:mt-0 last:mb-0", className, )} {...props} /> ), h2: ({ className, ...props }) => ( \<h2 className={cn( "aui-md-h2 mt-3 mb-1.5 scroll-m-20 font-semibold text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h3: ({ className, ...props }) => ( \<h3 className={cn( "aui-md-h3 mt-2.5 mb-1 scroll-m-20 font-semibold text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h4: ({ className, ...props }) => ( \<h4 className={cn( "aui-md-h4 mt-2 mb-1 scroll-m-20 font-medium text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h5: ({ className, ...props }) => ( \<h5 className={cn( "aui-md-h5 mt-2 mb-1 font-medium text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h6: ({ className, ...props }) => ( \<h6 className={cn( "aui-md-h6 mt-2 mb-1 font-medium text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), p: ({ className, ...props }) => ( \<p className={cn( "aui-md-p my-2.5 leading-normal first:mt-0 last:mb-0", className, )} {...props} /> ), a: ({ className, ...props }) => ( \<a className={cn( "aui-md-a text-primary underline underline-offset-2 hover:text-primary/80", className, )} {...props} /> ), blockquote: ({ className, ...props }) => ( \<blockquote className={cn( "aui-md-blockquote my-2.5 border-muted-foreground/30 border-s-2 ps-3 text-muted-foreground italic", className, )} {...props} /> ), ul: ({ className, ...props }) => ( \<ul className={cn( "aui-md-ul my-2 ms-4 list-disc marker:text-muted-foreground \[&>li]:mt-1", className, )} {...props} /> ), ol: ({ className, ...props }) => ( \<ol className={cn( "aui-md-ol my-2 ms-4 list-decimal marker:text-muted-foreground \[&>li]:mt-1", className, )} {...props} /> ), hr: ({ className, ...props }) => ( \<hr className={cn("aui-md-hr my-2 border-muted-foreground/20", className)} {...props} /> ), table: ({ className, ...props }) => ( \<table className={cn( "aui-md-table my-2 w-full border-separate border-spacing-0 overflow-y-auto", className, )} {...props} /> ), th: ({ className, ...props }) => ( \<th className={cn( "aui-md-th bg-muted px-2 py-1 text-start font-medium first:rounded-ss-lg last:rounded-se-lg \[\[align=center]]:text-center \[\[align=right]]:text-right", className, )} {...props} /> ), td: ({ className, ...props }) => ( \<td className={cn( "aui-md-td border-muted-foreground/20 border-s border-b px-2 py-1 text-start last:border-e \[\[align=center]]:text-center \[\[align=right]]:text-right", className, )} {...props} /> ), tr: ({ className, ...props }) => ( \<tr className={cn( "aui-md-tr m-0 border-b p-0 first:border-t \[&:last-child>td:first-child]:rounded-es-lg \[&:last-child>td:last-child]:rounded-ee-lg", className, )} {...props} /> ), li: ({ className, ...props }) => ( \<li className={cn("aui-md-li leading-normal", className)} {...props} /> ), sup: ({ className, ...props }) => ( \<sup className={cn("aui-md-sup \[&>a]:text-xs \[&>a]:no-underline", className)} {...props} /> ), pre: ({ className, ...props }) => ( \<pre className={cn( "aui-md-pre overflow-x-auto rounded-t-none rounded-b-lg border border-border/50 border-t-0 bg-muted/30 p-3 text-xs leading-relaxed", className, )} {...props} /> ), code: function Code({ className, ...props }) { const isCodeBlock = useIsMarkdownCodeBlock(); return ( \<code className={cn( !isCodeBlock && "aui-md-inline-code rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-\[0.85em]", className, )} {...props} /> ); }, CodeHeader, });

- lang

  tsx

- code

  "use client"; import "@assistant-ui/react-markdown/styles/dot.css"; import { type CodeHeaderProps, MarkdownTextPrimitive, unstable\_memoizeMarkdownComponents as memoizeMarkdownComponents, useIsMarkdownCodeBlock, } from "@assistant-ui/react-markdown"; import remarkGfm from "remark-gfm"; import { type FC, memo, useState } from "react"; import { CheckIcon, CopyIcon } from "lucide-react"; import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button"; import { cn } from "@/lib/utils"; const MarkdownTextImpl = () => { return ( \<MarkdownTextPrimitive remarkPlugins={\[remarkGfm]} className="aui-md" components={defaultComponents} /> ); }; export const MarkdownText = memo(MarkdownTextImpl); const CodeHeader: FC\<CodeHeaderProps> = ({ language, code }) => { const { isCopied, copyToClipboard } = useCopyToClipboard(); const onCopy = () => { if (!code || isCopied) return; copyToClipboard(code); }; return ( \<div className="aui-code-header-root mt-2.5 flex items-center justify-between rounded-t-lg border border-border/50 border-b-0 bg-muted/50 px-3 py-1.5 text-xs"> \<span className="aui-code-header-language font-medium text-muted-foreground lowercase"> {language} \</span> \<TooltipIconButton tooltip="Copy" onClick={onCopy}> {!isCopied && \<CopyIcon />} {isCopied && \<CheckIcon />} \</TooltipIconButton> \</div> ); }; const useCopyToClipboard = ({ copiedDuration = 3000, }: { copiedDuration?: number; } = {}) => { const \[isCopied, setIsCopied] = useState\<boolean>(false); const copyToClipboard = (value: string) => { if (!value) return; navigator.clipboard.writeText(value).then(() => { setIsCopied(true); setTimeout(() => setIsCopied(false), copiedDuration); }); }; return { isCopied, copyToClipboard }; }; const defaultComponents = memoizeMarkdownComponents({ h1: ({ className, ...props }) => ( \<h1 className={cn( "aui-md-h1 mb-2 scroll-m-20 font-semibold text-base first:mt-0 last:mb-0", className, )} {...props} /> ), h2: ({ className, ...props }) => ( \<h2 className={cn( "aui-md-h2 mt-3 mb-1.5 scroll-m-20 font-semibold text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h3: ({ className, ...props }) => ( \<h3 className={cn( "aui-md-h3 mt-2.5 mb-1 scroll-m-20 font-semibold text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h4: ({ className, ...props }) => ( \<h4 className={cn( "aui-md-h4 mt-2 mb-1 scroll-m-20 font-medium text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h5: ({ className, ...props }) => ( \<h5 className={cn( "aui-md-h5 mt-2 mb-1 font-medium text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), h6: ({ className, ...props }) => ( \<h6 className={cn( "aui-md-h6 mt-2 mb-1 font-medium text-sm first:mt-0 last:mb-0", className, )} {...props} /> ), p: ({ className, ...props }) => ( \<p className={cn( "aui-md-p my-2.5 leading-normal first:mt-0 last:mb-0", className, )} {...props} /> ), a: ({ className, ...props }) => ( \<a className={cn( "aui-md-a text-primary underline underline-offset-2 hover:text-primary/80", className, )} {...props} /> ), blockquote: ({ className, ...props }) => ( \<blockquote className={cn( "aui-md-blockquote my-2.5 border-muted-foreground/30 border-s-2 ps-3 text-muted-foreground italic", className, )} {...props} /> ), ul: ({ className, ...props }) => ( \<ul className={cn( "aui-md-ul my-2 ms-4 list-disc marker:text-muted-foreground \[&>li]:mt-1", className, )} {...props} /> ), ol: ({ className, ...props }) => ( \<ol className={cn( "aui-md-ol my-2 ms-4 list-decimal marker:text-muted-foreground \[&>li]:mt-1", className, )} {...props} /> ), hr: ({ className, ...props }) => ( \<hr className={cn("aui-md-hr my-2 border-muted-foreground/20", className)} {...props} /> ), table: ({ className, ...props }) => ( \<table className={cn( "aui-md-table my-2 w-full border-separate border-spacing-0 overflow-y-auto", className, )} {...props} /> ), th: ({ className, ...props }) => ( \<th className={cn( "aui-md-th bg-muted px-2 py-1 text-start font-medium first:rounded-ss-lg last:rounded-se-lg \[\[align=center]]:text-center \[\[align=right]]:text-right", className, )} {...props} /> ), td: ({ className, ...props }) => ( \<td className={cn( "aui-md-td border-muted-foreground/20 border-s border-b px-2 py-1 text-start last:border-e \[\[align=center]]:text-center \[\[align=right]]:text-right", className, )} {...props} /> ), tr: ({ className, ...props }) => ( \<tr className={cn( "aui-md-tr m-0 border-b p-0 first:border-t \[&:last-child>td:first-child]:rounded-es-lg \[&:last-child>td:last-child]:rounded-ee-lg", className, )} {...props} /> ), li: ({ className, ...props }) => ( \<li className={cn("aui-md-li leading-normal", className)} {...props} /> ), sup: ({ className, ...props }) => ( \<sup className={cn("aui-md-sup \[&>a]:text-xs \[&>a]:no-underline", className)} {...props} /> ), pre: ({ className, ...props }) => ( \<pre className={cn( "aui-md-pre overflow-x-auto rounded-t-none rounded-b-lg border border-border/50 border-t-0 bg-muted/30 p-3 text-xs leading-relaxed", className, )} {...props} /> ), code: function Code({ className, ...props }) { const isCodeBlock = useIsMarkdownCodeBlock(); return ( \<code className={cn( !isCodeBlock && "aui-md-inline-code rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-\[0.85em]", className, )} {...props} /> ); }, CodeHeader, });

#### assistant-ui dependencies

- packages

  - radix-ui

* code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

- lang

  tsx

- code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

This adds a `/components/assistant-ui/markdown-text.tsx` file to your project, which you can adjust as needed.

### [Use it in your application](#use-it-in-your-application)

Pass the `MarkdownText` component to the `MessagePrimitive.Parts` component

- title

  /components/assistant-ui/thread.tsx

`import { MarkdownText } from "@/components/assistant-ui/markdown-text"; const AssistantMessage: FC = () => { return ( <MessagePrimitive.Root className="..."> <div className="..."> <MessagePrimitive.Parts> {({ part }) => part.type === "text" ? <MarkdownText /> : null} </MessagePrimitive.Parts> </div> <AssistantActionBar /> <BranchPicker className="..." /> </MessagePrimitive.Root> ); };`

## [Syntax highlighting](#syntax-highlighting)

Syntax Highlighting is not included by default, see

- href

  /docs/ui/syntax-highlighting

Syntax Highlighting

to learn how to add it.

## [Related Components](#related-components)

- - href

    /docs/ui/syntax-highlighting

  Syntax Highlighting

  \- Add code highlighting to markdown

- - href

    /docs/ui/mermaid

  Mermaid

  \- Render diagrams in markdown code blocks