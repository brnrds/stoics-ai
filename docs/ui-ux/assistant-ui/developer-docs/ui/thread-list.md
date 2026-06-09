# Thread List Component
URL: /docs/ui/thread-list

Sidebar or dropdown component for switching between AI chat conversations. Persistent thread state, search, and active selection — built for assistant-ui apps.

This demo uses `ThreadListSidebar`, which includes `thread-list` as a dependency and provides a complete sidebar layout. For custom implementations, you can use `thread-list` directly.

## [Getting Started](#getting-started)

### [Add the component](#add-the-component)

Use `threadlist-sidebar` for a complete sidebar layout or `thread-list` for custom layouts.

#### [ThreadListSidebar](#threadlistsidebar)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/threadlist-sidebar.json

#### Main Component

- code

  import type \* as React from "react"; import { MessagesSquare } from "lucide-react"; import { GitHubIcon } from "@/components/icons/github"; import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, } from "@/components/ui/sidebar"; import { ThreadList } from "@/components/assistant-ui/thread-list"; export function ThreadListSidebar({ ...props }: React.ComponentProps\<typeof Sidebar>) { return ( \<Sidebar {...props}> \<SidebarHeader className="aui-sidebar-header mb-2 border-b"> \<div className="aui-sidebar-header-content flex items-center justify-between"> \<SidebarMenu> \<SidebarMenuItem> \<SidebarMenuButton size="lg" asChild> \<a href="https\://assistant-ui.com" target="\_blank" rel="noopener noreferrer" > \<div className="aui-sidebar-header-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"> \<MessagesSquare className="aui-sidebar-header-icon size-4" /> \</div> \<div className="aui-sidebar-header-heading me-6 flex flex-col gap-0.5 leading-none"> \<span className="aui-sidebar-header-title font-semibold"> assistant-ui \</span> \</div> \</a> \</SidebarMenuButton> \</SidebarMenuItem> \</SidebarMenu> \</div> \</SidebarHeader> \<SidebarContent className="aui-sidebar-content px-2"> \<ThreadList /> \</SidebarContent> \<SidebarRail /> \<SidebarFooter className="aui-sidebar-footer border-t"> \<SidebarMenu> \<SidebarMenuItem> \<SidebarMenuButton size="lg" asChild> \<a href="https\://github.com/assistant-ui/assistant-ui" target="\_blank" rel="noopener noreferrer" > \<div className="aui-sidebar-footer-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"> \<GitHubIcon className="aui-sidebar-footer-icon size-4" /> \</div> \<div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none"> \<span className="aui-sidebar-footer-title font-semibold"> GitHub \</span> \<span>View Source\</span> \</div> \</a> \</SidebarMenuButton> \</SidebarMenuItem> \</SidebarMenu> \</SidebarFooter> \</Sidebar> ); }

* lang

  tsx

* code

  import type \* as React from "react"; import { MessagesSquare } from "lucide-react"; import { GitHubIcon } from "@/components/icons/github"; import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, } from "@/components/ui/sidebar"; import { ThreadList } from "@/components/assistant-ui/thread-list"; export function ThreadListSidebar({ ...props }: React.ComponentProps\<typeof Sidebar>) { return ( \<Sidebar {...props}> \<SidebarHeader className="aui-sidebar-header mb-2 border-b"> \<div className="aui-sidebar-header-content flex items-center justify-between"> \<SidebarMenu> \<SidebarMenuItem> \<SidebarMenuButton size="lg" asChild> \<a href="https\://assistant-ui.com" target="\_blank" rel="noopener noreferrer" > \<div className="aui-sidebar-header-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"> \<MessagesSquare className="aui-sidebar-header-icon size-4" /> \</div> \<div className="aui-sidebar-header-heading me-6 flex flex-col gap-0.5 leading-none"> \<span className="aui-sidebar-header-title font-semibold"> assistant-ui \</span> \</div> \</a> \</SidebarMenuButton> \</SidebarMenuItem> \</SidebarMenu> \</div> \</SidebarHeader> \<SidebarContent className="aui-sidebar-content px-2"> \<ThreadList /> \</SidebarContent> \<SidebarRail /> \<SidebarFooter className="aui-sidebar-footer border-t"> \<SidebarMenu> \<SidebarMenuItem> \<SidebarMenuButton size="lg" asChild> \<a href="https\://github.com/assistant-ui/assistant-ui" target="\_blank" rel="noopener noreferrer" > \<div className="aui-sidebar-footer-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"> \<GitHubIcon className="aui-sidebar-footer-icon size-4" /> \</div> \<div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none"> \<span className="aui-sidebar-footer-title font-semibold"> GitHub \</span> \<span>View Source\</span> \</div> \</a> \</SidebarMenuButton> \</SidebarMenuItem> \</SidebarMenu> \</SidebarFooter> \</Sidebar> ); }

- code

  export function GitHubIcon({ className }: { className?: string }) { return ( \<svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor" > \<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /> \</svg> ); }

* lang

  tsx

* code

  export function GitHubIcon({ className }: { className?: string }) { return ( \<svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor" > \<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /> \</svg> ); }

#### assistant-ui dependencies

- packages

  - @assistant-ui/react
  - radix-ui

* code

  import { Button } from "@/components/ui/button"; import { Skeleton } from "@/components/ui/skeleton"; import { AuiIf, ThreadListItemMorePrimitive, ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react"; import { ArchiveIcon, MoreHorizontalIcon, PlusIcon, TrashIcon, } from "lucide-react"; import type { FC } from "react"; export const ThreadList: FC = () => { return ( \<ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col gap-1"> \<ThreadListNew /> \<AuiIf condition={(s) => s.threads.isLoading}> \<ThreadListSkeleton /> \</AuiIf> \<AuiIf condition={(s) => !s.threads.isLoading}> \<ThreadListPrimitive.Items> {() => \<ThreadListItem />} \</ThreadListPrimitive.Items> \</AuiIf> \</ThreadListPrimitive.Root> ); }; const ThreadListNew: FC = () => { return ( \<ThreadListPrimitive.New asChild> \<Button variant="outline" className="aui-thread-list-new h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted data-active:bg-muted" > \<PlusIcon className="size-4" /> New Thread \</Button> \</ThreadListPrimitive.New> ); }; const ThreadListSkeleton: FC = () => { return ( \<div className="flex flex-col gap-1"> {Array.from({ length: 5 }, (\_, i) => ( \<div key={i} role="status" aria-label="Loading threads" className="aui-thread-list-skeleton-wrapper flex h-9 items-center px-3" > \<Skeleton className="aui-thread-list-skeleton h-4 w-full" /> \</div> ))} \</div> ); }; const ThreadListItem: FC = () => { return ( \<ThreadListItemPrimitive.Root className="aui-thread-list-item group flex h-9 items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted"> \<ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex h-full min-w-0 flex-1 items-center px-3 text-start text-sm"> \<span className="aui-thread-list-item-title min-w-0 flex-1 truncate"> \<ThreadListItemPrimitive.Title fallback="New Chat" /> \</span> \</ThreadListItemPrimitive.Trigger> \<ThreadListItemMore /> \</ThreadListItemPrimitive.Root> ); }; const ThreadListItemMore: FC = () => { return ( \<ThreadListItemMorePrimitive.Root> \<ThreadListItemMorePrimitive.Trigger asChild> \<Button variant="ghost" size="icon" className="aui-thread-list-item-more me-2 size-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-\[state=open]:bg-accent data-\[state=open]:opacity-100 group-data-active:opacity-100" > \<MoreHorizontalIcon className="size-4" /> \<span className="sr-only">More options\</span> \</Button> \</ThreadListItemMorePrimitive.Trigger> \<ThreadListItemMorePrimitive.Content side="bottom" align="start" className="aui-thread-list-item-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md" > \<ThreadListItemPrimitive.Archive asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"> \<ArchiveIcon className="size-4" /> Archive \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Archive> \<ThreadListItemPrimitive.Delete asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-destructive text-sm outline-none hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"> \<TrashIcon className="size-4" /> Delete \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Delete> \</ThreadListItemMorePrimitive.Content> \</ThreadListItemMorePrimitive.Root> ); };

- lang

  tsx

- code

  import { Button } from "@/components/ui/button"; import { Skeleton } from "@/components/ui/skeleton"; import { AuiIf, ThreadListItemMorePrimitive, ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react"; import { ArchiveIcon, MoreHorizontalIcon, PlusIcon, TrashIcon, } from "lucide-react"; import type { FC } from "react"; export const ThreadList: FC = () => { return ( \<ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col gap-1"> \<ThreadListNew /> \<AuiIf condition={(s) => s.threads.isLoading}> \<ThreadListSkeleton /> \</AuiIf> \<AuiIf condition={(s) => !s.threads.isLoading}> \<ThreadListPrimitive.Items> {() => \<ThreadListItem />} \</ThreadListPrimitive.Items> \</AuiIf> \</ThreadListPrimitive.Root> ); }; const ThreadListNew: FC = () => { return ( \<ThreadListPrimitive.New asChild> \<Button variant="outline" className="aui-thread-list-new h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted data-active:bg-muted" > \<PlusIcon className="size-4" /> New Thread \</Button> \</ThreadListPrimitive.New> ); }; const ThreadListSkeleton: FC = () => { return ( \<div className="flex flex-col gap-1"> {Array.from({ length: 5 }, (\_, i) => ( \<div key={i} role="status" aria-label="Loading threads" className="aui-thread-list-skeleton-wrapper flex h-9 items-center px-3" > \<Skeleton className="aui-thread-list-skeleton h-4 w-full" /> \</div> ))} \</div> ); }; const ThreadListItem: FC = () => { return ( \<ThreadListItemPrimitive.Root className="aui-thread-list-item group flex h-9 items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted"> \<ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex h-full min-w-0 flex-1 items-center px-3 text-start text-sm"> \<span className="aui-thread-list-item-title min-w-0 flex-1 truncate"> \<ThreadListItemPrimitive.Title fallback="New Chat" /> \</span> \</ThreadListItemPrimitive.Trigger> \<ThreadListItemMore /> \</ThreadListItemPrimitive.Root> ); }; const ThreadListItemMore: FC = () => { return ( \<ThreadListItemMorePrimitive.Root> \<ThreadListItemMorePrimitive.Trigger asChild> \<Button variant="ghost" size="icon" className="aui-thread-list-item-more me-2 size-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-\[state=open]:bg-accent data-\[state=open]:opacity-100 group-data-active:opacity-100" > \<MoreHorizontalIcon className="size-4" /> \<span className="sr-only">More options\</span> \</Button> \</ThreadListItemMorePrimitive.Trigger> \<ThreadListItemMorePrimitive.Content side="bottom" align="start" className="aui-thread-list-item-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md" > \<ThreadListItemPrimitive.Archive asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"> \<ArchiveIcon className="size-4" /> Archive \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Archive> \<ThreadListItemPrimitive.Delete asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-destructive text-sm outline-none hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"> \<TrashIcon className="size-4" /> Delete \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Delete> \</ThreadListItemMorePrimitive.Content> \</ThreadListItemMorePrimitive.Root> ); };

* code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

- lang

  tsx

- code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

#### [ThreadList](#threadlist)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/thread-list.json

#### Main Component

- packages

  - @assistant-ui/react

* code

  import { Button } from "@/components/ui/button"; import { Skeleton } from "@/components/ui/skeleton"; import { AuiIf, ThreadListItemMorePrimitive, ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react"; import { ArchiveIcon, MoreHorizontalIcon, PlusIcon, TrashIcon, } from "lucide-react"; import type { FC } from "react"; export const ThreadList: FC = () => { return ( \<ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col gap-1"> \<ThreadListNew /> \<AuiIf condition={(s) => s.threads.isLoading}> \<ThreadListSkeleton /> \</AuiIf> \<AuiIf condition={(s) => !s.threads.isLoading}> \<ThreadListPrimitive.Items> {() => \<ThreadListItem />} \</ThreadListPrimitive.Items> \</AuiIf> \</ThreadListPrimitive.Root> ); }; const ThreadListNew: FC = () => { return ( \<ThreadListPrimitive.New asChild> \<Button variant="outline" className="aui-thread-list-new h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted data-active:bg-muted" > \<PlusIcon className="size-4" /> New Thread \</Button> \</ThreadListPrimitive.New> ); }; const ThreadListSkeleton: FC = () => { return ( \<div className="flex flex-col gap-1"> {Array.from({ length: 5 }, (\_, i) => ( \<div key={i} role="status" aria-label="Loading threads" className="aui-thread-list-skeleton-wrapper flex h-9 items-center px-3" > \<Skeleton className="aui-thread-list-skeleton h-4 w-full" /> \</div> ))} \</div> ); }; const ThreadListItem: FC = () => { return ( \<ThreadListItemPrimitive.Root className="aui-thread-list-item group flex h-9 items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted"> \<ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex h-full min-w-0 flex-1 items-center px-3 text-start text-sm"> \<span className="aui-thread-list-item-title min-w-0 flex-1 truncate"> \<ThreadListItemPrimitive.Title fallback="New Chat" /> \</span> \</ThreadListItemPrimitive.Trigger> \<ThreadListItemMore /> \</ThreadListItemPrimitive.Root> ); }; const ThreadListItemMore: FC = () => { return ( \<ThreadListItemMorePrimitive.Root> \<ThreadListItemMorePrimitive.Trigger asChild> \<Button variant="ghost" size="icon" className="aui-thread-list-item-more me-2 size-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-\[state=open]:bg-accent data-\[state=open]:opacity-100 group-data-active:opacity-100" > \<MoreHorizontalIcon className="size-4" /> \<span className="sr-only">More options\</span> \</Button> \</ThreadListItemMorePrimitive.Trigger> \<ThreadListItemMorePrimitive.Content side="bottom" align="start" className="aui-thread-list-item-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md" > \<ThreadListItemPrimitive.Archive asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"> \<ArchiveIcon className="size-4" /> Archive \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Archive> \<ThreadListItemPrimitive.Delete asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-destructive text-sm outline-none hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"> \<TrashIcon className="size-4" /> Delete \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Delete> \</ThreadListItemMorePrimitive.Content> \</ThreadListItemMorePrimitive.Root> ); };

- lang

  tsx

- code

  import { Button } from "@/components/ui/button"; import { Skeleton } from "@/components/ui/skeleton"; import { AuiIf, ThreadListItemMorePrimitive, ThreadListItemPrimitive, ThreadListPrimitive, } from "@assistant-ui/react"; import { ArchiveIcon, MoreHorizontalIcon, PlusIcon, TrashIcon, } from "lucide-react"; import type { FC } from "react"; export const ThreadList: FC = () => { return ( \<ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col gap-1"> \<ThreadListNew /> \<AuiIf condition={(s) => s.threads.isLoading}> \<ThreadListSkeleton /> \</AuiIf> \<AuiIf condition={(s) => !s.threads.isLoading}> \<ThreadListPrimitive.Items> {() => \<ThreadListItem />} \</ThreadListPrimitive.Items> \</AuiIf> \</ThreadListPrimitive.Root> ); }; const ThreadListNew: FC = () => { return ( \<ThreadListPrimitive.New asChild> \<Button variant="outline" className="aui-thread-list-new h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted data-active:bg-muted" > \<PlusIcon className="size-4" /> New Thread \</Button> \</ThreadListPrimitive.New> ); }; const ThreadListSkeleton: FC = () => { return ( \<div className="flex flex-col gap-1"> {Array.from({ length: 5 }, (\_, i) => ( \<div key={i} role="status" aria-label="Loading threads" className="aui-thread-list-skeleton-wrapper flex h-9 items-center px-3" > \<Skeleton className="aui-thread-list-skeleton h-4 w-full" /> \</div> ))} \</div> ); }; const ThreadListItem: FC = () => { return ( \<ThreadListItemPrimitive.Root className="aui-thread-list-item group flex h-9 items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted"> \<ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex h-full min-w-0 flex-1 items-center px-3 text-start text-sm"> \<span className="aui-thread-list-item-title min-w-0 flex-1 truncate"> \<ThreadListItemPrimitive.Title fallback="New Chat" /> \</span> \</ThreadListItemPrimitive.Trigger> \<ThreadListItemMore /> \</ThreadListItemPrimitive.Root> ); }; const ThreadListItemMore: FC = () => { return ( \<ThreadListItemMorePrimitive.Root> \<ThreadListItemMorePrimitive.Trigger asChild> \<Button variant="ghost" size="icon" className="aui-thread-list-item-more me-2 size-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-\[state=open]:bg-accent data-\[state=open]:opacity-100 group-data-active:opacity-100" > \<MoreHorizontalIcon className="size-4" /> \<span className="sr-only">More options\</span> \</Button> \</ThreadListItemMorePrimitive.Trigger> \<ThreadListItemMorePrimitive.Content side="bottom" align="start" className="aui-thread-list-item-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md" > \<ThreadListItemPrimitive.Archive asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"> \<ArchiveIcon className="size-4" /> Archive \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Archive> \<ThreadListItemPrimitive.Delete asChild> \<ThreadListItemMorePrimitive.Item className="aui-thread-list-item-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-destructive text-sm outline-none hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"> \<TrashIcon className="size-4" /> Delete \</ThreadListItemMorePrimitive.Item> \</ThreadListItemPrimitive.Delete> \</ThreadListItemMorePrimitive.Content> \</ThreadListItemMorePrimitive.Root> ); };

#### assistant-ui dependencies

- packages

  - radix-ui

* code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

- lang

  tsx

- code

  "use client"; import { type ComponentPropsWithRef, forwardRef } from "react"; import { Slot } from "radix-ui"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"; import { Button } from "@/components/ui/button"; import { cn } from "@/lib/utils"; export type TooltipIconButtonProps = ComponentPropsWithRef\<typeof Button> & { tooltip: string; side?: "top" | "bottom" | "left" | "right"; }; export const TooltipIconButton = forwardRef< HTMLButtonElement, TooltipIconButtonProps >(({ children, tooltip, side = "bottom", className, ...rest }, ref) => { return ( \<TooltipProvider delayDuration={0}> \<Tooltip> \<TooltipTrigger asChild> \<Button variant="ghost" size="icon" {...rest} className={cn("aui-button-icon size-6 p-1", className)} ref={ref} > \<Slot.Slottable>{children}\</Slot.Slottable> \<span className="aui-sr-only sr-only">{tooltip}\</span> \</Button> \</TooltipTrigger> \<TooltipContent side={side}>{tooltip}\</TooltipContent> \</Tooltip> \</TooltipProvider> ); }); TooltipIconButton.displayName = "TooltipIconButton";

### [Use in your application](#use-in-your-application)

- items

  - With Sidebar
  - Without Sidebar

* value

  With Sidebar

- title

  /app/assistant.tsx

`import { Thread } from "@/components/assistant-ui/thread"; import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar"; import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; export default function Assistant() { return ( <SidebarProvider> <div className="flex h-dvh w-full"> <ThreadListSidebar /> <SidebarInset> {/* Add sidebar trigger, location can be customized */} <SidebarTrigger className="absolute top-4 left-4" /> <Thread /> </SidebarInset> </div> </SidebarProvider> ); }`

- value

  Without Sidebar

* title

  /app/assistant.tsx

`import { Thread } from "@/components/assistant-ui/thread"; import { ThreadList } from "@/components/assistant-ui/thread-list"; export default function Assistant() { return ( <div className="grid h-full grid-cols-[200px_1fr]"> <ThreadList /> <Thread /> </div> ); }`

## [Anatomy](#anatomy)

The `ThreadList` component is built with the following primitives:

`import { ThreadListPrimitive, ThreadListItemPrimitive } from "@assistant-ui/react"; <ThreadListPrimitive.Root> <ThreadListPrimitive.New /> <ThreadListPrimitive.Items> {() => ( <ThreadListItemPrimitive.Root> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title /> </ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Archive /> <ThreadListItemPrimitive.Delete /> </ThreadListItemPrimitive.Root> )} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root>`

## [API Reference](#api-reference)

### [ThreadListPrimitive.Root](#threadlistprimitiveroot)

Container for the thread list.

`ThreadListPrimitiveRootProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper div.

### [ThreadListPrimitive.Items](#threadlistprimitiveitems)

Renders all threads in the list.

`ThreadListPrimitiveItemsProps`

- `archived` `?: boolean`

  When true, renders archived threads instead of active threads.

- `components` `: object`

  Component configuration.

  - `ThreadListItem` `: ComponentType`

    Component to render for each thread item.

### [ThreadListPrimitive.New](#threadlistprimitivenew)

A button to create a new thread.

`ThreadListPrimitiveNewProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

### [ThreadListPrimitive.LoadMore](#threadlistprimitiveloadmore)

A button that appends the next page of threads. See the

- href

  /docs/primitives/thread-list#loadmore

LoadMore primitive reference

for usage and

- href

  /docs/runtimes/concepts/threads#paginating-the-thread-list

Threads concepts

for the adapter contract.

`ThreadListPrimitiveLoadMoreProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

### [ThreadListItemPrimitive.Root](#threadlistitemprimitiveroot)

Container for a single thread item. Automatically sets `data-active` and `aria-current` when this is the current thread.

`ThreadListItemPrimitiveRootProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper div.

### [ThreadListItemPrimitive.Trigger](#threadlistitemprimitivetrigger)

A button that switches to this thread when clicked.

`ThreadListItemPrimitiveTriggerProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

### [ThreadListItemPrimitive.Title](#threadlistitemprimitivetitle)

Renders the thread's title.

`ThreadListItemPrimitiveTitleProps`

- `fallback` `?: ReactNode`

  Content to display when the thread has no title.

### [ThreadListItemPrimitive.Archive](#threadlistitemprimitivearchive)

A button to archive the thread.

`ThreadListItemPrimitiveArchiveProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

### [ThreadListItemPrimitive.Unarchive](#threadlistitemprimitiveunarchive)

A button to restore an archived thread.

`ThreadListItemPrimitiveUnarchiveProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

### [ThreadListItemPrimitive.Delete](#threadlistitemprimitivedelete)

A button to permanently delete the thread.

`ThreadListItemPrimitiveDeleteProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

### [ThreadListItemMorePrimitive](#threadlistitemmoreprimitive)

A dropdown menu for additional thread actions, built on Radix UI DropdownMenu.

#### [ThreadListItemMorePrimitive.Root](#threadlistitemmoreprimitiveroot)

Menu container that manages dropdown state.

`ThreadListItemMorePrimitiveRootProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper div.

#### [ThreadListItemMorePrimitive.Trigger](#threadlistitemmoreprimitivetrigger)

Button to open the menu.

`ThreadListItemMorePrimitiveTriggerProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper button.

#### [ThreadListItemMorePrimitive.Content](#threadlistitemmoreprimitivecontent)

Menu content container.

`ThreadListItemMorePrimitiveContentProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper div.

#### [ThreadListItemMorePrimitive.Item](#threadlistitemmoreprimitiveitem)

Individual menu item.

`ThreadListItemMorePrimitiveItemProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper div.

#### [ThreadListItemMorePrimitive.Separator](#threadlistitemmoreprimitiveseparator)

Visual separator between items.

`ThreadListItemMorePrimitiveSeparatorProps`

- `asChild` `: boolean` = false

  Merge props with child element instead of rendering a wrapper div.

## [Related Components](#related-components)

- - href

    /docs/ui/thread

  Thread

  \- The main chat interface displayed alongside the list