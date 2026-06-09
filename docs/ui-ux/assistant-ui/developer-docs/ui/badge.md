# Badge
URL: /docs/ui/badge

A small label component for displaying status, categories, or metadata.

This is a **standalone component** that does not depend on the assistant-ui runtime. Use it anywhere in your application.

## [Installation](#installation)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/badge.json

#### Main Component

- packages

  - class-variance-authority
  - radix-ui

* code

  "use client"; import type { ComponentProps } from "react"; import { Slot } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; const badgeVariants = cva( "inline-flex items-center justify-center gap-1 rounded-md font-medium text-xs transition-colors \[&\_svg]:size-3 \[&\_svg]:shrink-0", { variants: { variant: { outline: "border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", muted: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground", ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", info: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/50 dark:text-blue-300", warning: "bg-amber-100 text-amber-700 hover:bg-amber-100/80 dark:bg-amber-900/50 dark:text-amber-300", success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/50 dark:text-emerald-300", destructive: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/50 dark:text-red-300", }, size: { sm: "px-1.5 py-0.5", default: "px-2 py-1", lg: "px-2.5 py-1.5 text-sm", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); export type BadgeProps = ComponentProps<"span"> & VariantProps\<typeof badgeVariants> & { asChild?: boolean; }; function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) { const Comp = asChild ? Slot.Root : "span"; return ( \<Comp data-slot="badge" data-variant={variant} data-size={size} className={cn(badgeVariants({ variant, size }), className)} {...props} /> ); } export { Badge, badgeVariants };

- lang

  tsx

- code

  "use client"; import type { ComponentProps } from "react"; import { Slot } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; const badgeVariants = cva( "inline-flex items-center justify-center gap-1 rounded-md font-medium text-xs transition-colors \[&\_svg]:size-3 \[&\_svg]:shrink-0", { variants: { variant: { outline: "border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", muted: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground", ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground", info: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/50 dark:text-blue-300", warning: "bg-amber-100 text-amber-700 hover:bg-amber-100/80 dark:bg-amber-900/50 dark:text-amber-300", success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/50 dark:text-emerald-300", destructive: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/50 dark:text-red-300", }, size: { sm: "px-1.5 py-0.5", default: "px-2 py-1", lg: "px-2.5 py-1.5 text-sm", }, }, defaultVariants: { variant: "outline", size: "default", }, }, ); export type BadgeProps = ComponentProps<"span"> & VariantProps\<typeof badgeVariants> & { asChild?: boolean; }; function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) { const Comp = asChild ? Slot.Root : "span"; return ( \<Comp data-slot="badge" data-variant={variant} data-size={size} className={cn(badgeVariants({ variant, size }), className)} {...props} /> ); } export { Badge, badgeVariants };

## [Usage](#usage)

`import { Badge } from "@/components/assistant-ui/badge"; export function Example() { return <Badge>Label</Badge>; }`

## [Examples](#examples)

### [Variants](#variants)

Use the `variant` prop to change the visual style.

`<Badge variant="outline" /> // Border (default) <Badge variant="secondary" /> // Secondary background <Badge variant="muted" /> // Muted background <Badge variant="ghost" /> // No background <Badge variant="info" /> // Blue/info style <Badge variant="warning" /> // Amber/warning style <Badge variant="success" /> // Green/success style <Badge variant="destructive" /> // Red/error style`

### [Sizes](#sizes)

Use the `size` prop to change the badge size.

`<Badge size="sm" /> // Small <Badge size="default" /> // Default <Badge size="lg" /> // Large`

### [With Icons](#with-icons)

Badges automatically style SVG icons.

- code

  import { ArrowUpRight, Check, X, AlertCircle, Loader2 } from "lucide-react"; import { Badge } from "@/components/ui/badge"; function BadgeWithIconSample() { return ( \<Badge variant="secondary"> \<Check /> Success \</Badge> \<Badge variant="destructive"> \<X /> Failed \</Badge> \<Badge variant="muted"> \<AlertCircle /> Pending \</Badge> ); }

### [As Link](#as-link)

Use the `asChild` prop to render the badge as a different element, like a link.

- code

  import { ArrowUpRight, Check, X, AlertCircle, Loader2 } from "lucide-react"; import { Badge } from "@/components/ui/badge"; function BadgeAsLinkSample() { return ( \<Badge asChild variant="muted"> \<a href="https\://github.com/assistant-ui/assistant-ui" target="\_blank" rel="noopener noreferrer" > GitHub \<ArrowUpRight /> \</a> \</Badge> \<Badge asChild variant="outline"> \<a href="https\://www\.npmjs.com/package/@assistant-ui/react" target="\_blank" rel="noopener noreferrer" > npm \<ArrowUpRight /> \</a> \</Badge> ); }

### [Animated](#animated)

Combine with CSS transitions for scroll and color animations.

- code

  import { useEffect, useState } from "react"; import { ArrowUpRight, Check, X, AlertCircle, Loader2 } from "lucide-react"; import { Badge } from "@/components/ui/badge"; import { cn } from "@/lib/utils"; function BadgeAnimatedSample() { const \[status, setStatus] = useState<"loading" | "success">("loading"); useEffect(() => { const interval = setInterval(() => { setStatus((prev) => (prev === "loading" ? "success" : "loading")); }, 2000); return () => clearInterval(interval); }, \[]); return ( \<Badge variant={status === "loading" ? "muted" : "success"} className="overflow-hidden" > \<span className="relative inline-flex h-4 overflow-hidden"> \<span className={cn( "invisible overflow-hidden transition-\[max-width] duration-500", status === "loading" ? "max-w-24" : "max-w-0", )} > \<span className="flex items-center gap-1 whitespace-nowrap"> \<Loader2 className="shrink-0" /> Loading \</span> \</span> \<span className={cn( "invisible overflow-hidden transition-\[max-width] duration-500", status === "success" ? "max-w-40" : "max-w-0", )} > \<span className="flex items-center gap-1 whitespace-nowrap"> \<Check className="shrink-0" /> Mission Success \</span> \</span> \<span className={cn( "absolute inset-y-0 start-0 flex items-center gap-1 whitespace-nowrap transition-all duration-500", status === "loading" ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0", )} > \<Loader2 className="shrink-0 animate-spin" /> Loading \</span> \<span className={cn( "absolute inset-y-0 start-0 flex items-center gap-1 whitespace-nowrap transition-all duration-500", status === "success" ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0", )} > \<Check className="shrink-0" /> Mission Success \</span> \</span> \</Badge> ); }

## [API Reference](#api-reference)

### [Badge](#badge)

`BadgeProps`

- `variant` `: "outline" | "secondary" | "muted" | "ghost" | "info" | "warning" | "success" | "destructive"` = "outline"

  The visual style of the badge.

- `size` `: "sm" | "default" | "lg"` = "default"

  The size of the badge.

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a span.

- `className` `?: string`

  Additional CSS classes.

### [Style Variants (CVA)](#style-variants-cva)

| Export          | Description                     |
| --------------- | ------------------------------- |
| `badgeVariants` | Styles for the badge component. |

`import { badgeVariants } from "@/components/assistant-ui/badge"; <span className={badgeVariants({ variant: "muted", size: "sm" })}> Custom Badge </span>`