# Directive Text
URL: /docs/ui/directive-text

Render mention directives as inline chips in user messages.

`DirectiveText` parses the directive syntax written by

- href

  /docs/ui/composer-trigger-popover

`ComposerTriggerPopover`

(default: `:type[label]{name=id}`) and renders each segment as an inline chip. Use it as the `Text` component in user messages so the raw directive syntax never shows up.

## [Getting Started](#getting-started)

### [Add `directive-text`](#add-directive-text)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/directive-text.json

#### Main Component

- packages

  - @assistant-ui/core
  - @assistant-ui/react

* code

  "use client"; import { memo, type FC } from "react"; import type { TextMessagePartComponent } from "@assistant-ui/react"; import type { Unstable\_DirectiveFormatter } from "@assistant-ui/core"; import { unstable\_defaultDirectiveFormatter } from "@assistant-ui/core"; import { Badge } from "./badge"; type IconComponent = FC<{ className?: string }>; export type CreateDirectiveTextOptions = { /\*\* Maps a directive \`type\` to an icon component. \*/ iconMap?: Record\<string, IconComponent>; /\*\* Icon rendered when \`iconMap\` has no entry for the segment type. \*/ fallbackIcon?: IconComponent; }; /\*\* Creates a \`Text\` message part component that parses directive syntax and renders inline chips. \*/ export function createDirectiveText( formatter: Unstable\_DirectiveFormatter, options?: CreateDirectiveTextOptions, ): TextMessagePartComponent { const iconMap = options?.iconMap; const fallbackIcon = options?.fallbackIcon; const Component: TextMessagePartComponent = ({ text }) => { const segments = formatter.parse(text); if (segments.length === 1 && segments\[0]!.kind === "text") { return <>{text}\</>; } return ( <> {segments.map((seg, i) => { if (seg.kind === "text") { return ( \<span key={i} className="whitespace-pre-wrap"> {seg.text} \</span> ); } const Icon = iconMap?.\[seg.type] ?? fallbackIcon; return ( \<Badge key={i} variant="info" size="sm" data-slot="directive-text-chip" data-directive-type={seg.type} data-directive-id={seg.id} aria-label={\`${seg.type}: ${seg.label}\`} className="aui-directive-chip items-baseline text-\[13px] leading-none \[&\_svg]:self-center" > {Icon && \<Icon />} {seg.label} \</Badge> ); })} \</> ); }; Component.displayName = "DirectiveText"; return Component; } const DirectiveTextImpl = createDirectiveText( unstable\_defaultDirectiveFormatter, ); /\*\* \`Text\` message part component that renders directive syntax as inline chips. \*/ export const DirectiveText: TextMessagePartComponent = memo(DirectiveTextImpl);

- lang

  tsx

- code

  "use client"; import { memo, type FC } from "react"; import type { TextMessagePartComponent } from "@assistant-ui/react"; import type { Unstable\_DirectiveFormatter } from "@assistant-ui/core"; import { unstable\_defaultDirectiveFormatter } from "@assistant-ui/core"; import { Badge } from "./badge"; type IconComponent = FC<{ className?: string }>; export type CreateDirectiveTextOptions = { /\*\* Maps a directive \`type\` to an icon component. \*/ iconMap?: Record\<string, IconComponent>; /\*\* Icon rendered when \`iconMap\` has no entry for the segment type. \*/ fallbackIcon?: IconComponent; }; /\*\* Creates a \`Text\` message part component that parses directive syntax and renders inline chips. \*/ export function createDirectiveText( formatter: Unstable\_DirectiveFormatter, options?: CreateDirectiveTextOptions, ): TextMessagePartComponent { const iconMap = options?.iconMap; const fallbackIcon = options?.fallbackIcon; const Component: TextMessagePartComponent = ({ text }) => { const segments = formatter.parse(text); if (segments.length === 1 && segments\[0]!.kind === "text") { return <>{text}\</>; } return ( <> {segments.map((seg, i) => { if (seg.kind === "text") { return ( \<span key={i} className="whitespace-pre-wrap"> {seg.text} \</span> ); } const Icon = iconMap?.\[seg.type] ?? fallbackIcon; return ( \<Badge key={i} variant="info" size="sm" data-slot="directive-text-chip" data-directive-type={seg.type} data-directive-id={seg.id} aria-label={\`${seg.type}: ${seg.label}\`} className="aui-directive-chip items-baseline text-\[13px] leading-none \[&\_svg]:self-center" > {Icon && \<Icon />} {seg.label} \</Badge> ); })} \</> ); }; Component.displayName = "DirectiveText"; return Component; } const DirectiveTextImpl = createDirectiveText( unstable\_defaultDirectiveFormatter, ); /\*\* \`Text\` message part component that renders directive syntax as inline chips. \*/ export const DirectiveText: TextMessagePartComponent = memo(DirectiveTextImpl);

#### assistant-ui dependencies

- packages

  - class-variance-authority
  - radix-ui

* code

  "use client"; import type { ComponentProps } from "react"; import { Slot } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; const badgeVariants = cva( "inline-flex items-center justify-center gap-1 rounded-md font-medium text-xs transition-colors \[&\_svg]:size-3 \[&\_svg]:shrink-0", { variants: { variant: { outline: "border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", muted: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground", ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", info: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/50 dark:text-blue-300", warning: "bg-amber-100 text-amber-700 hover:bg-amber-100/80 dark:bg-amber-900/50 dark:text-amber-300", success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/50 dark:text-emerald-300", destructive: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/50 dark:text-red-300", }, size: { sm: "px-1.5 py-0.5", default: "px-2 py-1", lg: "px-2.5 py-1.5 text-sm", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); export type BadgeProps = ComponentProps<"span"> & VariantProps\<typeof badgeVariants> & { asChild?: boolean; }; function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) { const Comp = asChild ? Slot.Root : "span"; return ( \<Comp data-slot="badge" data-variant={variant} data-size={size} className={cn(badgeVariants({ variant, size }), className)} {...props} /> ); } export { Badge, badgeVariants };

- lang

  tsx

- code

  "use client"; import type { ComponentProps } from "react"; import { Slot } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; const badgeVariants = cva( "inline-flex items-center justify-center gap-1 rounded-md font-medium text-xs transition-colors \[&\_svg]:size-3 \[&\_svg]:shrink-0", { variants: { variant: { outline: "border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", muted: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground", ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", info: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/50 dark:text-blue-300", warning: "bg-amber-100 text-amber-700 hover:bg-amber-100/80 dark:bg-amber-900/50 dark:text-amber-300", success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/50 dark:text-emerald-300", destructive: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/50 dark:text-red-300", }, size: { sm: "px-1.5 py-0.5", default: "px-2 py-1", lg: "px-2.5 py-1.5 text-sm", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); export type BadgeProps = ComponentProps<"span"> & VariantProps\<typeof badgeVariants> & { asChild?: boolean; }; function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) { const Comp = asChild ? Slot.Root : "span"; return ( \<Comp data-slot="badge" data-variant={variant} data-size={size} className={cn(badgeVariants({ variant, size }), className)} {...props} /> ); } export { Badge, badgeVariants };

This adds `/components/assistant-ui/directive-text.tsx` with `DirectiveText` and the `createDirectiveText(formatter, options?)` factory.

### [Use in user messages](#use-in-user-messages)

Pass `DirectiveText` as the `Text` component in `MessagePrimitive.Parts`:

- title

  components/assistant-ui/thread.tsx

`import { DirectiveText } from "@/components/assistant-ui/directive-text"; const UserMessage = () => ( <MessagePrimitive.Root> <MessagePrimitive.Parts components={{ Text: DirectiveText }} /> </MessagePrimitive.Root> );`

Keep your markdown renderer (e.g. `MarkdownText`) for assistant messages — assistants rarely emit directive syntax.

## [Icons per Directive Type](#icons-per-directive-type)

`DirectiveText` ships icon-free by default — every parsed segment renders as a plain label chip regardless of its `type`. To add icons, use the `createDirectiveText` factory and pass an `iconMap` that routes each `type` string to an icon component, plus an optional `fallbackIcon` for unmapped types:

`import { createDirectiveText } from "@/components/assistant-ui/directive-text"; import { unstable_defaultDirectiveFormatter } from "@assistant-ui/core"; import { FileTextIcon, SparklesIcon, UserIcon, WrenchIcon } from "lucide-react"; const DirectiveTextWithIcons = createDirectiveText( unstable_defaultDirectiveFormatter, { iconMap: { tool: WrenchIcon, user: UserIcon, file: FileTextIcon, }, fallbackIcon: SparklesIcon, }, ); <MessagePrimitive.Parts components={{ Text: DirectiveTextWithIcons }} />;`

A matching `iconMap` / `fallbackIcon` option is accepted by

- href

  /docs/ui/composer-trigger-popover

`ComposerTriggerPopover`

, where it routes `item.metadata.icon` strings instead of `type` — keeping icon configuration consistent across the composer and the rendered message.

## [Custom Formatter](#custom-formatter)

The default format is `:type[label]{name=id}`. For a different format, build a custom `Unstable_DirectiveFormatter` and wrap it with `createDirectiveText`:

``import type { Unstable_DirectiveFormatter } from "@assistant-ui/core"; import { createDirectiveText } from "@/components/assistant-ui/directive-text"; const slashFormatter: Unstable_DirectiveFormatter = { serialize: (item) => `/${item.id}`, parse: (text) => { /* return alternating text / mention segments */ }, }; const SlashDirectiveText = createDirectiveText(slashFormatter);``

Pass the **same formatter** to the composer trigger's `directive={{ formatter }}` (or `action={{ formatter }}`) so insertion and rendering stay consistent.

## [Customizing the Chip](#customizing-the-chip)

Because `directive-text.tsx` is copied into your project, you can also edit it directly — swap the chip styling, read `data-directive-id` to link to a detail page, or replace the chip wrapper entirely.

## [API Reference](#api-reference)

### [`DirectiveText`](#directivetext)

A `TextMessagePartComponent` that parses `:type[label]{name=id}` directives and renders them as inline chips. Uses the default formatter from `@assistant-ui/core` and renders chips without icons. For per-type icons, build a component with `createDirectiveText(formatter, { iconMap })`.

### [`createDirectiveText(formatter, options?)`](#createdirectivetextformatter-options)

Factory that returns a `TextMessagePartComponent` bound to a custom `Unstable_DirectiveFormatter`.

| Option         | Type                                                    | Description                                                                                                |
| -------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `iconMap`      | `Record<string, ComponentType<{ className?: string }>>` | Maps a directive segment's `type` to an icon rendered inside the chip                                      |
| `fallbackIcon` | `ComponentType<{ className?: string }>`                 | Icon used when no `iconMap` entry matches. When neither option resolves, the chip renders without an icon. |

## [Related](#related)

- - href

    /docs/ui/composer-trigger-popover

  Composer Trigger Popover

  — the picker that inserts directives

- - href

    /docs/guides/mentions

  Mentions guide

  — directive format, backend parsing