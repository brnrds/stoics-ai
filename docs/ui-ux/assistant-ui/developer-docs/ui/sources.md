# Sources
URL: /docs/ui/sources

Display URL sources with favicon, title, and external link.

## [Getting Started](#getting-started)

### [Add `sources`](#add-sources)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/sources.json

#### Main Component

- packages

  - @assistant-ui/react

* code

  "use client"; import { memo, useState, type ComponentProps } from "react"; import { FileTextIcon } from "lucide-react"; import type { SourceMessagePartComponent } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; import { Badge, badgeVariants, type BadgeProps } from "./badge"; const extractDomain = (url: string): string => { try { return new URL(url).hostname.replace(/^www\\./, ""); } catch { return url; } }; const defaultFaviconUrl = (domain: string) => \`https\://icons.duckduckgo.com/ip3/${domain}.ico\`; function SourceIcon({ url, className, faviconUrl = defaultFaviconUrl, ...props }: ComponentProps<"span"> & { url: string; faviconUrl?: (domain: string) => string; }) { const domain = extractDomain(url); const src = faviconUrl(domain); const \[errorSrc, setErrorSrc] = useState\<string | undefined>(undefined); const hasError = errorSrc === src; if (hasError) { return ( \<span data-slot="source-icon-fallback" className={cn( "flex size-3 shrink-0 items-center justify-center rounded-sm bg-muted font-medium text-\[10px]", className, )} {...props} > {domain.charAt(0).toUpperCase() || "?"} \</span> ); } return ( \<img data-slot="source-icon" src={src} alt="" className={cn("size-3 shrink-0 rounded-sm", className)} onError={() => setErrorSrc(src)} {...(props as ComponentProps<"img">)} /> ); } function SourceTitle({ className, ...props }: ComponentProps<"span">) { return ( \<span data-slot="source-title" className={cn("max-w-37.5 truncate", className)} {...props} /> ); } function DocumentSourceIcon({ className, ...props }: ComponentProps<"span">) { return ( \<span data-slot="source-document-icon" className={cn( "flex size-3 shrink-0 items-center justify-center text-muted-foreground", className, )} {...props} > \<FileTextIcon className="size-3" /> \</span> ); } export type SourceProps = Omit\<BadgeProps, "asChild"> & ComponentProps<"a"> & { asChild?: boolean; }; function Source({ className, variant, size, asChild = false, target = "\_blank", rel = "noopener noreferrer", ...props }: SourceProps) { return ( \<Badge asChild variant={variant} size={size} className={cn( "cursor-pointer outline-none focus-visible:border-ring focus-visible:ring-\[3px] focus-visible:ring-ring/50", className, )} > \<a data-slot="source" target={target} rel={rel} {...(props as ComponentProps<"a">)} /> \</Badge> ); } const SourcesImpl: SourceMessagePartComponent = (part) => { if (part.sourceType === "url" && part.url) { const domain = extractDomain(part.url); const displayTitle = part.title || domain; return ( \<Source href={part.url}> \<SourceIcon url={part.url} /> \<SourceTitle>{displayTitle}\</SourceTitle> \</Source> ); } if (part.sourceType === "document") { return ( \<Badge variant="secondary" className="outline-none focus-visible:border-ring focus-visible:ring-\[3px] focus-visible:ring-ring/50" > \<span data-slot="source" className="inline-flex items-center gap-1.5"> \<DocumentSourceIcon /> \<SourceTitle>{part.title}\</SourceTitle> \</span> \</Badge> ); } return null; }; const Sources = memo(SourcesImpl) as unknown as SourceMessagePartComponent & { Root: typeof Source; Icon: typeof SourceIcon; Title: typeof SourceTitle; }; Sources.displayName = "Sources"; Sources.Root = Source; Sources.Icon = SourceIcon; Sources.Title = SourceTitle; export { Sources, Source, SourceIcon, SourceTitle, badgeVariants as sourceVariants, };

- lang

  tsx

- code

  "use client"; import { memo, useState, type ComponentProps } from "react"; import { FileTextIcon } from "lucide-react"; import type { SourceMessagePartComponent } from "@assistant-ui/react"; import { cn } from "@/lib/utils"; import { Badge, badgeVariants, type BadgeProps } from "./badge"; const extractDomain = (url: string): string => { try { return new URL(url).hostname.replace(/^www\\./, ""); } catch { return url; } }; const defaultFaviconUrl = (domain: string) => \`https\://icons.duckduckgo.com/ip3/${domain}.ico\`; function SourceIcon({ url, className, faviconUrl = defaultFaviconUrl, ...props }: ComponentProps<"span"> & { url: string; faviconUrl?: (domain: string) => string; }) { const domain = extractDomain(url); const src = faviconUrl(domain); const \[errorSrc, setErrorSrc] = useState\<string | undefined>(undefined); const hasError = errorSrc === src; if (hasError) { return ( \<span data-slot="source-icon-fallback" className={cn( "flex size-3 shrink-0 items-center justify-center rounded-sm bg-muted font-medium text-\[10px]", className, )} {...props} > {domain.charAt(0).toUpperCase() || "?"} \</span> ); } return ( \<img data-slot="source-icon" src={src} alt="" className={cn("size-3 shrink-0 rounded-sm", className)} onError={() => setErrorSrc(src)} {...(props as ComponentProps<"img">)} /> ); } function SourceTitle({ className, ...props }: ComponentProps<"span">) { return ( \<span data-slot="source-title" className={cn("max-w-37.5 truncate", className)} {...props} /> ); } function DocumentSourceIcon({ className, ...props }: ComponentProps<"span">) { return ( \<span data-slot="source-document-icon" className={cn( "flex size-3 shrink-0 items-center justify-center text-muted-foreground", className, )} {...props} > \<FileTextIcon className="size-3" /> \</span> ); } export type SourceProps = Omit\<BadgeProps, "asChild"> & ComponentProps<"a"> & { asChild?: boolean; }; function Source({ className, variant, size, asChild = false, target = "\_blank", rel = "noopener noreferrer", ...props }: SourceProps) { return ( \<Badge asChild variant={variant} size={size} className={cn( "cursor-pointer outline-none focus-visible:border-ring focus-visible:ring-\[3px] focus-visible:ring-ring/50", className, )} > \<a data-slot="source" target={target} rel={rel} {...(props as ComponentProps<"a">)} /> \</Badge> ); } const SourcesImpl: SourceMessagePartComponent = (part) => { if (part.sourceType === "url" && part.url) { const domain = extractDomain(part.url); const displayTitle = part.title || domain; return ( \<Source href={part.url}> \<SourceIcon url={part.url} /> \<SourceTitle>{displayTitle}\</SourceTitle> \</Source> ); } if (part.sourceType === "document") { return ( \<Badge variant="secondary" className="outline-none focus-visible:border-ring focus-visible:ring-\[3px] focus-visible:ring-ring/50" > \<span data-slot="source" className="inline-flex items-center gap-1.5"> \<DocumentSourceIcon /> \<SourceTitle>{part.title}\</SourceTitle> \</span> \</Badge> ); } return null; }; const Sources = memo(SourcesImpl) as unknown as SourceMessagePartComponent & { Root: typeof Source; Icon: typeof SourceIcon; Title: typeof SourceTitle; }; Sources.displayName = "Sources"; Sources.Root = Source; Sources.Icon = SourceIcon; Sources.Title = SourceTitle; export { Sources, Source, SourceIcon, SourceTitle, badgeVariants as sourceVariants, };

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

### [Use in your application](#use-in-your-application)

Pass `Sources` to `MessagePrimitive.Parts`:

- title

  /components/assistant-ui/thread.tsx

`import { Sources } from "@/components/assistant-ui/sources"; const AssistantMessage: FC = () => { return ( <MessagePrimitive.Root className="..."> <MessagePrimitive.Parts> {({ part }) => { if (part.type === "source") return <Sources {...part} />; return null; }} </MessagePrimitive.Parts> </MessagePrimitive.Root> ); };`

## [Variants](#variants)

Use the `variant` prop to change the visual style. The default is `outline`.

`<Source variant="outline" /> // Border (default) <Source variant="ghost" /> // No background <Source variant="muted" /> // Solid muted background <Source variant="secondary" /> // Secondary background <Source variant="info" /> // Blue <Source variant="warning" /> // Amber <Source variant="success" /> // Emerald <Source variant="destructive" /> // Red`

## [Sizes](#sizes)

Use the `size` prop to change the size.

`<Source size="sm" /> // Small <Source size="default" /> // Default <Source size="lg" /> // Large`

## [API Reference](#api-reference)

### [`Sources`](#sources)

The default export used as a `SourceMessagePartComponent`. Renders a single source part when `sourceType === "url"`. Also exposes compound sub-components for custom layouts.

| Prop         | Type                  | Default | Description                                        |
| ------------ | --------------------- | ------- | -------------------------------------------------- |
| `url`        | `string`              | —       | The URL of the source (provided by the runtime)    |
| `title`      | `string \| undefined` | —       | Display title; falls back to the domain if omitted |
| `sourceType` | `string`              | —       | Must be `"url"` to render; other types are ignored |

#### [Compound sub-components](#compound-sub-components)

`import { Sources } from "@/components/assistant-ui/sources"; <Sources.Root href="https://example.com"> <Sources.Icon url="https://example.com" /> <Sources.Title>Example</Sources.Title> </Sources.Root>`

| Sub-component   | Equivalent named export | Description                          |
| --------------- | ----------------------- | ------------------------------------ |
| `Sources.Root`  | `Source`                | Root anchor element                  |
| `Sources.Icon`  | `SourceIcon`            | Favicon with domain initial fallback |
| `Sources.Title` | `SourceTitle`           | Truncated title text                 |

### [`Source`](#source)

Root container rendered as an `<a>` tag. Accepts all `<a>` props plus `variant` and `size`.

| Prop        | Type                                                                                                  | Default                 | Description                                |
| ----------- | ----------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------ |
| `href`      | `string`                                                                                              | —                       | URL the link points to                     |
| `variant`   | `"outline" \| "ghost" \| "muted" \| "secondary" \| "info" \| "warning" \| "success" \| "destructive"` | `"outline"`             | Visual style                               |
| `size`      | `"sm" \| "default" \| "lg"`                                                                           | `"default"`             | Size of the badge                          |
| `target`    | `string`                                                                                              | `"_blank"`              | Link target                                |
| `rel`       | `string`                                                                                              | `"noopener noreferrer"` | Link rel attribute                         |
| `asChild`   | `boolean`                                                                                             | `false`                 | Render as a child element using Radix Slot |
| `className` | `string`                                                                                              | —                       | Additional CSS classes                     |

### [`SourceIcon`](#sourceicon)

Displays the favicon for the given URL. Falls back to the domain initial inside a muted box when the favicon fails to load.

| Prop         | Type                         | Default                     | Description                                                                                   |
| ------------ | ---------------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| `url`        | `string`                     | —                           | URL used to derive the favicon and fallback initial                                           |
| `faviconUrl` | `(domain: string) => string` | DuckDuckGo's `ip3` endpoint | Override the favicon source — useful in environments where the default service is unreachable |
| `className`  | `string`                     | —                           | Additional CSS classes applied to the `<img>` or fallback `<span>`                            |

#### [Customizing the favicon provider](#customizing-the-favicon-provider)

The default `<Sources>` component renders `<SourceIcon>` without forwarding `faviconUrl`, so the prop only applies when you compose `Sources.Icon` directly:

``<Sources.Root href={url}> <Sources.Icon url={url} faviconUrl={(domain) => `https://my-favicon-proxy.example.com/${domain}.ico`} /> <Sources.Title>{title}</Sources.Title> </Sources.Root>``

To change the default for every source in your app, edit the `defaultFaviconUrl` constant at the top of your copied `sources.tsx` — that is the single source of truth used by `<Sources>`.

### [`SourceTitle`](#sourcetitle)

Truncated title text rendered as a `<span>`.

| Prop        | Type        | Default | Description                                             |
| ----------- | ----------- | ------- | ------------------------------------------------------- |
| `children`  | `ReactNode` | —       | Title content to display                                |
| `className` | `string`    | —       | Additional CSS classes (default max-width is `37.5rem`) |

### [`sourceVariants`](#sourcevariants)

The underlying CVA variant function used to generate badge class names. Use this when building custom source-like components that need to match the built-in styling.

`import { sourceVariants } from "@/components/assistant-ui/sources"; <span className={sourceVariants({ variant: "info", size: "sm" })}> Custom badge </span>`

## [Composable API](#composable-api)

Use the named exports to build fully custom source layouts:

`import { Source, SourceIcon, SourceTitle } from "@/components/assistant-ui/sources"; <Source href="https://example.com" variant="muted" className="gap-2"> <SourceIcon url="https://example.com" className="size-4" /> <SourceTitle className="max-w-none font-medium">Example</SourceTitle> </Source>`

## [Related Components](#related-components)

- - href

    /docs/ui/part-grouping

  PartGrouping

  \- Group sources by parentId