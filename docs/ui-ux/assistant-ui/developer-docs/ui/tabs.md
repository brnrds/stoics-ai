# Tabs
URL: /docs/ui/tabs

A multi-variant tabs component for organizing content into switchable panels.

This is a **standalone component** that does not depend on the assistant-ui runtime. Use it anywhere in your application.

## [Installation](#installation)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/tabs.json

#### Main Component

- packages

  - class-variance-authority
  - radix-ui

* code

  "use client"; import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, } from "react"; import { Tabs as TabsPrimitive, Slot as SlotPrimitive } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; type IndicatorStyle = { left: string; width: string }; type TabsListContextValue = { registerTrigger: (value: string, element: HTMLElement | null) => void; setHoveredValue: (value: string | null) => void; }; const TabsListContext = createContext\<TabsListContextValue | null>(null); function Tabs({ className, ...props }: ComponentProps\<typeof TabsPrimitive.Root>) { return ( \<TabsPrimitive.Root data-slot="tabs" className={cn("group/tabs flex flex-col gap-2", className)} {...props} /> ); } const tabsListVariants = cva( "group/tabs-list relative inline-flex w-fit items-center justify-center text-muted-foreground", { variants: { variant: { default: "gap-1 rounded-lg bg-muted p-1", line: "gap-1 border-border border-b bg-transparent pb-2", ghost: "gap-1.5 bg-transparent", pills: "gap-2 bg-transparent", outline: "gap-1 rounded-lg border border-border p-1", }, size: { sm: "h-8", default: "h-9", lg: "h-10", }, }, defaultVariants: { variant: "default", size: "default", }, }, ); const tabsActiveIndicatorVariants = cva( "pointer-events-none absolute transition-all duration-300 ease-out", { variants: { variant: { default: "inset-y-1 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30", line: "bottom-0 h-0.5 bg-foreground", ghost: "inset-y-1 rounded-md bg-foreground/8", pills: "inset-y-0 rounded-full bg-primary", outline: "inset-y-1 rounded-md border border-border bg-background", }, }, defaultVariants: { variant: "default", }, }, ); function TabsList({ className, variant, size, children, ...props }: ComponentProps\<typeof TabsPrimitive.List> & VariantProps\<typeof tabsListVariants>) { const resolvedVariant = variant ?? "default"; const resolvedSize = size ?? "default"; const triggerRefs = useRef\<Map\<string, HTMLElement>>(new Map()); const listRef = useRef\<HTMLDivElement>(null); const \[hoveredValue, setHoveredValue] = useState\<string | null>(null); const \[activeStyle, setActiveStyle] = useState\<IndicatorStyle>({ left: "0px", width: "0px", }); const \[hoverStyle, setHoverStyle] = useState\<IndicatorStyle>({ left: "0px", width: "0px", }); const registerTrigger = useCallback( (value: string, element: HTMLElement | null) => { if (element) { triggerRefs.current.set(value, element); } else { triggerRefs.current.delete(value); } }, \[], ); useEffect(() => { if (hoveredValue) { const element = triggerRefs.current.get(hoveredValue); if (element) { setHoverStyle({ left: \`${element.offsetLeft}px\`, width: \`${element.offsetWidth}px\`, }); } } }, \[hoveredValue]); useEffect(() => { const listElement = listRef.current; if (!listElement) return; const updateActiveFromDOM = () => { const activeElement = listElement.querySelector( '\[data-state="active"]', ) as HTMLElement | null; if (activeElement) { setActiveStyle({ left: \`${activeElement.offsetLeft}px\`, width: \`${activeElement.offsetWidth}px\`, }); } }; requestAnimationFrame(updateActiveFromDOM); const observer = new MutationObserver(updateActiveFromDOM); observer.observe(listElement, { attributes: true, attributeFilter: \["data-state"], subtree: true, }); return () => observer.disconnect(); }, \[]); const contextValue = useMemo( () => ({ registerTrigger, setHoveredValue }), \[registerTrigger], ); return ( \<TabsListContext.Provider value={contextValue}> \<TabsPrimitive.List ref={listRef} data-slot="tabs-list" data-variant={resolvedVariant} data-size={resolvedSize} className={cn( tabsListVariants({ variant: resolvedVariant, size: resolvedSize }), className, )} {...props} > {resolvedVariant === "ghost" && hoveredValue !== null && hoverStyle.width !== "0px" && ( \<div data-slot="tabs-hover-indicator" className="pointer-events-none absolute inset-y-1 rounded-md bg-foreground/8 transition-all duration-300 ease-out" style={hoverStyle} /> )} {activeStyle.width !== "0px" && ( \<div data-slot="tabs-active-indicator" className={tabsActiveIndicatorVariants({ variant: resolvedVariant, })} style={activeStyle} /> )} {children} \</TabsPrimitive.List> \</TabsListContext.Provider> ); } function TabsTrigger({ className, value, asChild = false, ...props }: Omit\<ComponentProps\<typeof TabsPrimitive.Trigger>, "asChild"> & { asChild?: boolean; }) { const context = useContext(TabsListContext); const ref = useRef\<HTMLButtonElement>(null); useEffect(() => { context?.registerTrigger(value, ref.current); return () => context?.registerTrigger(value, null); }, \[context, value]); const handleMouseEnter = useCallback(() => { context?.setHoveredValue(value); }, \[context, value]); const handleMouseLeave = useCallback(() => { context?.setHoveredValue(null); }, \[context]); const Comp = asChild ? SlotPrimitive.Root : TabsPrimitive.Trigger; return ( \<Comp ref={ref} value={value} data-slot="tabs-trigger" data-value={value} className={cn( "relative z-10 inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium text-foreground/60 transition-\[color] duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-\[state=active]:font-medium data-\[state=active]:text-foreground dark:text-muted-foreground dark:hover:text-foreground \[&\_svg:not(\[class\*='size-'])]:size-4 \[&\_svg]:pointer-events-none \[&\_svg]:shrink-0", "group-data-\[variant=default]/tabs-list:rounded-md", "group-data-\[variant=line]/tabs-list:rounded-md group-data-\[variant=line]/tabs-list:bg-transparent", "group-data-\[variant=ghost]/tabs-list:rounded-md group-data-\[variant=ghost]/tabs-list:bg-transparent", "group-data-\[variant=pills]/tabs-list:rounded-full group-data-\[variant=pills]/tabs-list:data-\[state=active]:text-primary-foreground dark:group-data-\[variant=pills]/tabs-list:data-\[state=active]:text-primary-foreground", "group-data-\[variant=outline]/tabs-list:rounded-md", "group-data-\[size=sm]/tabs-list:h-\[calc(100%-8px)] group-data-\[size=sm]/tabs-list:px-2 group-data-\[size=sm]/tabs-list:py-0.5 group-data-\[size=sm]/tabs-list:text-xs", "group-data-\[size=default]/tabs-list:h-\[calc(100%-8px)] group-data-\[size=default]/tabs-list:px-3 group-data-\[size=default]/tabs-list:py-1 group-data-\[size=default]/tabs-list:text-sm", "group-data-\[size=lg]/tabs-list:h-\[calc(100%-8px)] group-data-\[size=lg]/tabs-list:px-4 group-data-\[size=lg]/tabs-list:py-1.5 group-data-\[size=lg]/tabs-list:text-sm", className, )} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props} /> ); } function TabsContent({ className, ...props }: ComponentProps\<typeof TabsPrimitive.Content>) { return ( \<TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} /> ); } export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsActiveIndicatorVariants, };

- lang

  tsx

- code

  "use client"; import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, } from "react"; import { Tabs as TabsPrimitive, Slot as SlotPrimitive } from "radix-ui"; import { cva, type VariantProps } from "class-variance-authority"; import { cn } from "@/lib/utils"; type IndicatorStyle = { left: string; width: string }; type TabsListContextValue = { registerTrigger: (value: string, element: HTMLElement | null) => void; setHoveredValue: (value: string | null) => void; }; const TabsListContext = createContext\<TabsListContextValue | null>(null); function Tabs({ className, ...props }: ComponentProps\<typeof TabsPrimitive.Root>) { return ( \<TabsPrimitive.Root data-slot="tabs" className={cn("group/tabs flex flex-col gap-2", className)} {...props} /> ); } const tabsListVariants = cva( "group/tabs-list relative inline-flex w-fit items-center justify-center text-muted-foreground", { variants: { variant: { default: "gap-1 rounded-lg bg-muted p-1", line: "gap-1 border-border border-b bg-transparent pb-2", ghost: "gap-1.5 bg-transparent", pills: "gap-2 bg-transparent", outline: "gap-1 rounded-lg border border-border p-1", }, size: { sm: "h-8", default: "h-9", lg: "h-10", }, }, defaultVariants: { variant: "default", size: "default", }, }, ); const tabsActiveIndicatorVariants = cva( "pointer-events-none absolute transition-all duration-300 ease-out", { variants: { variant: { default: "inset-y-1 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30", line: "bottom-0 h-0.5 bg-foreground", ghost: "inset-y-1 rounded-md bg-foreground/8", pills: "inset-y-0 rounded-full bg-primary", outline: "inset-y-1 rounded-md border border-border bg-background", }, }, defaultVariants: { variant: "default", }, }, ); function TabsList({ className, variant, size, children, ...props }: ComponentProps\<typeof TabsPrimitive.List> & VariantProps\<typeof tabsListVariants>) { const resolvedVariant = variant ?? "default"; const resolvedSize = size ?? "default"; const triggerRefs = useRef\<Map\<string, HTMLElement>>(new Map()); const listRef = useRef\<HTMLDivElement>(null); const \[hoveredValue, setHoveredValue] = useState\<string | null>(null); const \[activeStyle, setActiveStyle] = useState\<IndicatorStyle>({ left: "0px", width: "0px", }); const \[hoverStyle, setHoverStyle] = useState\<IndicatorStyle>({ left: "0px", width: "0px", }); const registerTrigger = useCallback( (value: string, element: HTMLElement | null) => { if (element) { triggerRefs.current.set(value, element); } else { triggerRefs.current.delete(value); } }, \[], ); useEffect(() => { if (hoveredValue) { const element = triggerRefs.current.get(hoveredValue); if (element) { setHoverStyle({ left: \`${element.offsetLeft}px\`, width: \`${element.offsetWidth}px\`, }); } } }, \[hoveredValue]); useEffect(() => { const listElement = listRef.current; if (!listElement) return; const updateActiveFromDOM = () => { const activeElement = listElement.querySelector( '\[data-state="active"]', ) as HTMLElement | null; if (activeElement) { setActiveStyle({ left: \`${activeElement.offsetLeft}px\`, width: \`${activeElement.offsetWidth}px\`, }); } }; requestAnimationFrame(updateActiveFromDOM); const observer = new MutationObserver(updateActiveFromDOM); observer.observe(listElement, { attributes: true, attributeFilter: \["data-state"], subtree: true, }); return () => observer.disconnect(); }, \[]); const contextValue = useMemo( () => ({ registerTrigger, setHoveredValue }), \[registerTrigger], ); return ( \<TabsListContext.Provider value={contextValue}> \<TabsPrimitive.List ref={listRef} data-slot="tabs-list" data-variant={resolvedVariant} data-size={resolvedSize} className={cn( tabsListVariants({ variant: resolvedVariant, size: resolvedSize }), className, )} {...props} > {resolvedVariant === "ghost" && hoveredValue !== null && hoverStyle.width !== "0px" && ( \<div data-slot="tabs-hover-indicator" className="pointer-events-none absolute inset-y-1 rounded-md bg-foreground/8 transition-all duration-300 ease-out" style={hoverStyle} /> )} {activeStyle.width !== "0px" && ( \<div data-slot="tabs-active-indicator" className={tabsActiveIndicatorVariants({ variant: resolvedVariant, })} style={activeStyle} /> )} {children} \</TabsPrimitive.List> \</TabsListContext.Provider> ); } function TabsTrigger({ className, value, asChild = false, ...props }: Omit\<ComponentProps\<typeof TabsPrimitive.Trigger>, "asChild"> & { asChild?: boolean; }) { const context = useContext(TabsListContext); const ref = useRef\<HTMLButtonElement>(null); useEffect(() => { context?.registerTrigger(value, ref.current); return () => context?.registerTrigger(value, null); }, \[context, value]); const handleMouseEnter = useCallback(() => { context?.setHoveredValue(value); }, \[context, value]); const handleMouseLeave = useCallback(() => { context?.setHoveredValue(null); }, \[context]); const Comp = asChild ? SlotPrimitive.Root : TabsPrimitive.Trigger; return ( \<Comp ref={ref} value={value} data-slot="tabs-trigger" data-value={value} className={cn( "relative z-10 inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium text-foreground/60 transition-\[color] duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-\[state=active]:font-medium data-\[state=active]:text-foreground dark:text-muted-foreground dark:hover:text-foreground \[&\_svg:not(\[class\*='size-'])]:size-4 \[&\_svg]:pointer-events-none \[&\_svg]:shrink-0", "group-data-\[variant=default]/tabs-list:rounded-md", "group-data-\[variant=line]/tabs-list:rounded-md group-data-\[variant=line]/tabs-list:bg-transparent", "group-data-\[variant=ghost]/tabs-list:rounded-md group-data-\[variant=ghost]/tabs-list:bg-transparent", "group-data-\[variant=pills]/tabs-list:rounded-full group-data-\[variant=pills]/tabs-list:data-\[state=active]:text-primary-foreground dark:group-data-\[variant=pills]/tabs-list:data-\[state=active]:text-primary-foreground", "group-data-\[variant=outline]/tabs-list:rounded-md", "group-data-\[size=sm]/tabs-list:h-\[calc(100%-8px)] group-data-\[size=sm]/tabs-list:px-2 group-data-\[size=sm]/tabs-list:py-0.5 group-data-\[size=sm]/tabs-list:text-xs", "group-data-\[size=default]/tabs-list:h-\[calc(100%-8px)] group-data-\[size=default]/tabs-list:px-3 group-data-\[size=default]/tabs-list:py-1 group-data-\[size=default]/tabs-list:text-sm", "group-data-\[size=lg]/tabs-list:h-\[calc(100%-8px)] group-data-\[size=lg]/tabs-list:px-4 group-data-\[size=lg]/tabs-list:py-1.5 group-data-\[size=lg]/tabs-list:text-sm", className, )} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props} /> ); } function TabsContent({ className, ...props }: ComponentProps\<typeof TabsPrimitive.Content>) { return ( \<TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} /> ); } export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsActiveIndicatorVariants, };

## [Usage](#usage)

`import { Tabs, TabsList, TabsTrigger, TabsContent, } from "@/components/assistant-ui/tabs"; export function Example() { return ( <Tabs defaultValue="account"> <TabsList> <TabsTrigger value="account">Account</TabsTrigger> <TabsTrigger value="password">Password</TabsTrigger> </TabsList> <TabsContent value="account">Account settings here.</TabsContent> <TabsContent value="password">Password settings here.</TabsContent> </Tabs> ); }`

## [Examples](#examples)

### [Variants](#variants)

Use the `variant` prop on `TabsList` to change the visual style. Child components inherit the variant automatically.

`<TabsList variant="default" /> // Muted background with shadow (default) <TabsList variant="line" /> // Underline indicator <TabsList variant="ghost" /> // Transparent with hover states <TabsList variant="pills" /> // Rounded pill buttons <TabsList variant="outline" /> // Border with background on active`

### [Sizes](#sizes)

Use the `size` prop on `TabsList` to change the tab height. Child components inherit the size automatically.

`<TabsList size="sm" /> // 32px height <TabsList size="default" /> // 36px height <TabsList size="lg" /> // 40px height`

### [With Icons](#with-icons)

Tabs automatically style SVG icons placed inside triggers.

- code

  import { FileText, Settings, User, Bell, Lock } from "lucide-react"; import { Tabs, TabsList, TabsTrigger, TabsContent, } from "@/components/ui/tabs"; function TabsWithIconsSample() { return ( \<Tabs defaultValue="profile" className="w-\[400px]"> \<TabsList variant="ghost"> \<TabsTrigger value="profile"> \<User /> Profile \</TabsTrigger> \<TabsTrigger value="notifications"> \<Bell /> Notifications \</TabsTrigger> \<TabsTrigger value="security"> \<Lock /> Security \</TabsTrigger> \</TabsList> \<TabsContent value="profile" className="p-4"> \<p className="text-muted-foreground text-sm"> Edit your profile information. \</p> \</TabsContent> \<TabsContent value="notifications" className="p-4"> \<p className="text-muted-foreground text-sm"> Manage your notification preferences. \</p> \</TabsContent> \<TabsContent value="security" className="p-4"> \<p className="text-muted-foreground text-sm"> Configure security and privacy settings. \</p> \</TabsContent> \</Tabs> ); }

### [Controlled](#controlled)

Use `value` and `onValueChange` for controlled tab state.

- code

  import { useState } from "react"; import { Tabs, TabsList, TabsTrigger, TabsContent, } from "@/components/ui/tabs"; function TabsControlledSample() { const \[activeTab, setActiveTab] = useState("overview"); return ( \<Tabs value={activeTab} onValueChange={setActiveTab} className="w-\[400px]" > \<TabsList variant="pills"> \<TabsTrigger value="overview">Overview\</TabsTrigger> \<TabsTrigger value="analytics">Analytics\</TabsTrigger> \<TabsTrigger value="reports">Reports\</TabsTrigger> \</TabsList> \<TabsContent value="overview" className="p-4"> \<p className="text-muted-foreground text-sm">Overview content\</p> \</TabsContent> \<TabsContent value="analytics" className="p-4"> \<p className="text-muted-foreground text-sm">Analytics content\</p> \</TabsContent> \<TabsContent value="reports" className="p-4"> \<p className="text-muted-foreground text-sm">Reports content\</p> \</TabsContent> \</Tabs> \<p className="text-muted-foreground text-sm"> Current tab: \<code className="font-mono">{activeTab}\</code> \</p> ); }

### [As Link](#as-link)

Use the `asChild` prop on `TabsTrigger` to render as a different element, like a navigation link.

- code

  import { FileText, Settings, User, Bell, Lock } from "lucide-react"; import { Tabs, TabsList, TabsTrigger, TabsContent, } from "@/components/ui/tabs"; function TabsAsLinkSample() { return ( \<Tabs defaultValue="docs"> \<TabsList variant="line"> \<TabsTrigger value="docs" asChild> \<a href="#installation"> \<FileText /> Docs \</a> \</TabsTrigger> \<TabsTrigger value="api" asChild> \<a href="#api-reference"> \<Settings /> API \</a> \</TabsTrigger> \</TabsList> \</Tabs> ); }

### [Animated Indicator](#animated-indicator)

All variants feature smooth animated indicators that slide between tabs:

| Variant   | Indicator Style                      |
| --------- | ------------------------------------ |
| `default` | Sliding background with shadow       |
| `line`    | Sliding underline                    |
| `ghost`   | Sliding background with hover effect |
| `pills`   | Sliding pill background              |
| `outline` | Sliding border                       |

- code

  import { Tabs, TabsList, TabsTrigger, TabsContent, } from "@/components/ui/tabs"; function TabsAnimatedIndicatorSample() { return ( \<div className="flex flex-col gap-2"> \<span className="text-muted-foreground text-xs"> Default - Sliding background \</span> \<Tabs defaultValue="home"> \<TabsList variant="default"> \<TabsTrigger value="home">Home\</TabsTrigger> \<TabsTrigger value="about">About\</TabsTrigger> \<TabsTrigger value="services">Services\</TabsTrigger> \<TabsTrigger value="contact">Contact\</TabsTrigger> \</TabsList> \</Tabs> \</div> \<div className="flex flex-col gap-2"> \<span className="text-muted-foreground text-xs"> Line - Sliding underline \</span> \<Tabs defaultValue="home"> \<TabsList variant="line"> \<TabsTrigger value="home">Home\</TabsTrigger> \<TabsTrigger value="about">About\</TabsTrigger> \<TabsTrigger value="services">Services\</TabsTrigger> \<TabsTrigger value="contact">Contact\</TabsTrigger> \</TabsList> \</Tabs> \</div> \<div className="flex flex-col gap-2"> \<span className="text-muted-foreground text-xs"> Ghost - Sliding background with hover effect \</span> \<Tabs defaultValue="dashboard"> \<TabsList variant="ghost"> \<TabsTrigger value="dashboard">Dashboard\</TabsTrigger> \<TabsTrigger value="projects">Projects\</TabsTrigger> \<TabsTrigger value="tasks">Tasks\</TabsTrigger> \<TabsTrigger value="team">Team\</TabsTrigger> \</TabsList> \</Tabs> \</div> \<div className="flex flex-col gap-2"> \<span className="text-muted-foreground text-xs"> Pills - Sliding pill background \</span> \<Tabs defaultValue="all"> \<TabsList variant="pills"> \<TabsTrigger value="all">All\</TabsTrigger> \<TabsTrigger value="active">Active\</TabsTrigger> \<TabsTrigger value="completed">Completed\</TabsTrigger> \<TabsTrigger value="archived">Archived\</TabsTrigger> \</TabsList> \</Tabs> \</div> \<div className="flex flex-col gap-2"> \<span className="text-muted-foreground text-xs"> Outline - Sliding border \</span> \<Tabs defaultValue="week"> \<TabsList variant="outline"> \<TabsTrigger value="day">Day\</TabsTrigger> \<TabsTrigger value="week">Week\</TabsTrigger> \<TabsTrigger value="month">Month\</TabsTrigger> \<TabsTrigger value="year">Year\</TabsTrigger> \</TabsList> \</Tabs> \</div> ); }

## [API Reference](#api-reference)

### [Composable API](#composable-api)

| Component     | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `Tabs`        | The root component that manages tab state.                     |
| `TabsList`    | The container for tab triggers. Set `variant` and `size` here. |
| `TabsTrigger` | An individual tab button. Inherits variant/size from TabsList. |
| `TabsContent` | The content panel for a tab.                                   |

### [Tabs](#tabs)

The root component that manages tab state.

`TabsProps`

- `defaultValue` `?: string`

  The default active tab value (uncontrolled).

- `value` `?: string`

  The controlled active tab value.

- `onValueChange` `?: (value: string) => void`

  Callback when the active tab changes.

- `className` `?: string`

  Additional CSS classes.

### [TabsList](#tabslist)

The container for tab triggers. Set `variant` and `size` here to style all child components.

`TabsListProps`

- `variant` `: "default" | "line" | "ghost" | "pills" | "outline"` = "default"

  The visual style of the tabs. Child components inherit this automatically.

- `size` `: "sm" | "default" | "lg"` = "default"

  The size of the tabs. Child components inherit this automatically.

- `className` `?: string`

  Additional CSS classes.

### [TabsTrigger](#tabstrigger)

An individual tab button.

`TabsTriggerProps`

- `value` `: string`

  The unique value for this tab.

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a button.

- `disabled` `?: boolean`

  Whether the tab is disabled.

- `className` `?: string`

  Additional CSS classes.

### [TabsContent](#tabscontent)

The content panel for a tab.

`TabsContentProps`

- `value` `: string`

  The value matching the corresponding TabsTrigger.

- `className` `?: string`

  Additional CSS classes.

### [Style Variants (CVA)](#style-variants-cva)

| Export                        | Description                               |
| ----------------------------- | ----------------------------------------- |
| `tabsListVariants`            | Styles for the tabs list container.       |
| `tabsActiveIndicatorVariants` | Styles for the animated active indicator. |

`import { tabsListVariants, tabsActiveIndicatorVariants, } from "@/components/assistant-ui/tabs"; <div className={tabsListVariants({ variant: "ghost", size: "sm" })}> Custom Tabs Container </div>`