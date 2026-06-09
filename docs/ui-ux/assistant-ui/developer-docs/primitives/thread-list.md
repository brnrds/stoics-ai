# ThreadList
URL: /docs/primitives/thread-list

Multi-thread management for listing, creating, switching, archiving, and deleting conversations.

The ThreadList primitive manages multiple conversations by listing threads, creating new ones, switching between them, and archiving or deleting old ones. It's composed from three primitive namespaces: `ThreadListPrimitive`, `ThreadListItemPrimitive`, and `ThreadListItemMorePrimitive`.

- items

  - Preview
  - Code

`import { ThreadListPrimitive, ThreadListItemPrimitive, ThreadListItemMorePrimitive, } from "@assistant-ui/react"; import { ArchiveIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"; function MyThreadList() { return ( <ThreadListPrimitive.Root className="flex flex-col gap-1"> <ThreadListPrimitive.New className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm hover:bg-muted"> <PlusIcon className="size-4" /> New Thread </ThreadListPrimitive.New> <ThreadListPrimitive.Items> {() => <ThreadListItem />} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root> ); } function ThreadListItem() { return ( <ThreadListItemPrimitive.Root className="group flex h-9 items-center rounded-lg hover:bg-muted data-active:bg-muted"> <ThreadListItemPrimitive.Trigger className="flex-1 truncate px-3 text-sm"> <ThreadListItemPrimitive.Title fallback="New Chat" /> </ThreadListItemPrimitive.Trigger> <ThreadListItemMorePrimitive.Root> <ThreadListItemMorePrimitive.Trigger className="mr-2 size-7 rounded-md opacity-0 group-hover:opacity-100"> <MoreHorizontalIcon className="size-4" /> </ThreadListItemMorePrimitive.Trigger> <ThreadListItemMorePrimitive.Content className="rounded-md border bg-popover p-1 shadow-md"> <ThreadListItemPrimitive.Archive asChild> <ThreadListItemMorePrimitive.Item className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"> <ArchiveIcon className="size-4" /> Archive </ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Archive> <ThreadListItemPrimitive.Delete asChild> <ThreadListItemMorePrimitive.Item className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"> <TrashIcon className="size-4" /> Delete </ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Delete> </ThreadListItemMorePrimitive.Content> </ThreadListItemMorePrimitive.Root> </ThreadListItemPrimitive.Root> ); }`

## [Quick Start](#quick-start)

Minimal example:

`import { ThreadListPrimitive, ThreadListItemPrimitive, } from "@assistant-ui/react"; <ThreadListPrimitive.Root> <ThreadListPrimitive.New>New Thread</ThreadListPrimitive.New> <ThreadListPrimitive.Items> {() => ( <ThreadListItemPrimitive.Root> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title fallback="New Chat" /> </ThreadListItemPrimitive.Trigger> </ThreadListItemPrimitive.Root> )} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root>`

`Root` renders a `<div>`, `New` renders a `<button>` that creates a new thread, and `Items` iterates over the thread list. Each item is composed from `ThreadListItemPrimitive` parts.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Three Namespaces](#three-namespaces)

ThreadList is split across three namespaces to keep each level of abstraction composable:

- **`ThreadListPrimitive`**: The outer container. `Root` wraps the list, `New` creates threads, and `Items` iterates over them.
- **`ThreadListItemPrimitive`**: An individual thread row. `Root` provides context, `Trigger` switches to the thread, `Title` shows the thread name, and action buttons (Archive, Unarchive, Delete) manage the thread lifecycle.
- **`ThreadListItemMorePrimitive`**: An overflow dropdown menu (built on Radix DropdownMenu) for thread actions. Compose action buttons with menu items using `asChild`.

### [Active State](#active-state)

Both `ThreadListPrimitive.New` and `ThreadListItemPrimitive.Root` get a `data-active` attribute when they represent the current thread. Use this for styling:

`<ThreadListItemPrimitive.Root className="hover:bg-muted data-active:bg-muted"> {/* ... */} </ThreadListItemPrimitive.Root>`

The `New` button gets `data-active` when the user is on a fresh, unsaved thread.

### [Items Iterator](#items-iterator)

`ThreadListPrimitive.Items` now prefers a children render function, similar to `ThreadPrimitive.Messages`:

`<ThreadListPrimitive.Items> {({ threadListItem }) => ( <MyThreadItem threadId={threadListItem.id} /> )} </ThreadListPrimitive.Items>`

`components` is deprecated. Use the `children` render function instead.

### [Archived Threads](#archived-threads)

Pass `archived` to `Items` to render archived threads separately:

`<ThreadListPrimitive.Root> <ThreadListPrimitive.New>New Thread</ThreadListPrimitive.New> <ThreadListPrimitive.Items> {() => <ThreadListItem />} </ThreadListPrimitive.Items> <h3>Archived</h3> <ThreadListPrimitive.Items archived> {() => <ArchivedThreadItem />} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root>`

### [Thread Actions](#thread-actions)

`Archive`, `Unarchive`, and `Delete` buttons disable automatically when the runtime capability is unavailable.

### [Composing Actions with Menu Items](#composing-actions-with-menu-items)

The canonical pattern composes `ThreadListItemPrimitive.Archive asChild` with `ThreadListItemMorePrimitive.Item` to get both the action behavior AND the menu item styling:

`<ThreadListItemPrimitive.Archive asChild> <ThreadListItemMorePrimitive.Item> <ArchiveIcon className="size-4" /> Archive </ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Archive>`

`Archive` provides the click handler and disabled logic. `Item` provides the menu item behavior and styling. `asChild` merges them into a single element.

## [Parts](#parts)

### [ThreadListPrimitive](#threadlistprimitive)

#### [Root](#root)

Container for the full thread list. Renders a `<div>` element unless `asChild` is set.

`<ThreadListPrimitive.Root className="flex flex-col gap-1"> <ThreadListPrimitive.Items> {() => <MyThreadItem />} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root>`

#### [New](#new)

Button that creates a new thread. Renders a `<button>` element unless `asChild` is set.

`<ThreadListPrimitive.New className="rounded-lg border px-3 py-2 text-sm"> New Thread </ThreadListPrimitive.New>`

#### [Items](#items)

Renders a component per thread.

`<ThreadListPrimitive.Items> {() => <MyThreadItem />} </ThreadListPrimitive.Items>`

- rows

  - - name

      archived

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

  - - name

      components

    - type

      ```
      ThreadListItemsComponentConfig
      ```

    - description

      - - variant

          deprecated

        Use the children render function instead.

  - - name

      children

    - type

      ```
      (value: object) => ReactNode
      ```

    - typeFull

      ```
      (value: { threadListItem: ThreadListItemState; }) => ReactNode
      ```

    - description

      - Render function called for each thread list item. Receives the item.

#### [ItemByIndex](#itembyindex)

Renders a single thread at a specific index.

`<ThreadListPrimitive.ItemByIndex index={0} components={{ ThreadListItem: MyThreadItem }} />`

- rows

  - - name

      index

    - type

      ```
      number
      ```

  - - name

      archived

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

  - - name

      components

    - type

      ```
      ThreadListItemsComponentConfig
      ```

#### [LoadMore](#loadmore)

Button that appends the next page of threads. Renders a `<button>` element unless `asChild` is set, and is automatically disabled when the runtime is loading or when the adapter's last `list()` did not return a `nextCursor`. See

- href

  /docs/runtimes/concepts/threads#paginating-the-thread-list

Threads concepts

for the adapter contract.`<ThreadListPrimitive.LoadMore className="rounded-lg border px-3 py-2 text-sm"> Load more </ThreadListPrimitive.LoadMore>`

For scroll-driven loading, wrap `aui.threads().loadMore()` in your own `IntersectionObserver` at the application layer; assistant-ui ships the explicit button to keep the primitive surface predictable.

`import { useAui, useAuiState } from "@assistant-ui/react"; import { useEffect, useRef } from "react"; function LoadMoreSentinel() { const aui = useAui(); const disabled = useAuiState( (s) => !s.threads.hasMore || s.threads.isLoading || s.threads.isLoadingMore, ); const ref = useRef<HTMLDivElement>(null); useEffect(() => { const el = ref.current; if (!el || disabled) return; const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) aui.threads().loadMore(); }); observer.observe(el); return () => observer.disconnect(); }, [aui, disabled]); return disabled ? null : <div ref={ref} className="h-9" />; }`

### [ThreadListItemPrimitive](#threadlistitemprimitive)

#### [Root](#root-1)

Container for one thread list item. Renders a `<div>` element unless `asChild` is set.

`<ThreadListItemPrimitive.Root className="flex items-center gap-2 rounded-lg px-2 py-1.5"> <ThreadListItemPrimitive.Trigger className="flex-1 text-left"> <ThreadListItemPrimitive.Title fallback="New Chat" /> </ThreadListItemPrimitive.Trigger> </ThreadListItemPrimitive.Root>`

#### [Trigger](#trigger)

Interactive button that selects the thread. Renders a `<button>` element unless `asChild` is set.

`<ThreadListItemPrimitive.Trigger className="flex-1 text-left"> <ThreadListItemPrimitive.Title fallback="New Chat" /> </ThreadListItemPrimitive.Trigger>`

#### [Title](#title)

Displays the thread title with a `fallback` prop. Renders a React fragment (no wrapper element). Use a `<span>` wrapper if you need to style it.

`<ThreadListItemPrimitive.Title fallback="New Chat" />`

- rows

  - - name

      fallback

    - type

      ```
      ReactNode
      ```

#### [Archive](#archive)

Button that archives the current thread item. Renders a `<button>` element unless `asChild` is set.

`<ThreadListItemPrimitive.Archive>Archive</ThreadListItemPrimitive.Archive>`

#### [Unarchive](#unarchive)

Button that restores the current thread item from the archive. Renders a `<button>` element unless `asChild` is set.

`<ThreadListItemPrimitive.Unarchive>Unarchive</ThreadListItemPrimitive.Unarchive>`

#### [Delete](#delete)

Button that deletes the current thread item. Renders a `<button>` element unless `asChild` is set.

`<ThreadListItemPrimitive.Delete>Delete</ThreadListItemPrimitive.Delete>`

### [ThreadListItemMorePrimitive](#threadlistitemmoreprimitive)

#### [Root](#root-2)

Root container for the overflow menu primitives.

`<ThreadListItemMorePrimitive.Root> <ThreadListItemMorePrimitive.Trigger>More</ThreadListItemMorePrimitive.Trigger> </ThreadListItemMorePrimitive.Root>`

#### [Trigger](#trigger-1)

Button that opens the overflow menu. Renders a `<button>` element unless `asChild` is set.

`<ThreadListItemMorePrimitive.Trigger className="rounded-md p-1 hover:bg-muted"> More </ThreadListItemMorePrimitive.Trigger>`

#### [Content](#content)

The dropdown panel. Renders a `<div>` via a portal (positioned relative to the trigger).

`<ThreadListItemMorePrimitive.Content className="rounded-md border bg-popover p-1 shadow-md"> <ThreadListItemPrimitive.Archive asChild> <ThreadListItemMorePrimitive.Item>Archive</ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Archive> </ThreadListItemMorePrimitive.Content>`

- rows

  - - name

      asChild

    - type

      ```
      boolean
      ```

    - description

      - Change the default rendered element for the one passed as a child, merging their props and behavior.
        - href

          /docs/api-reference/primitives/composition
        Composition guide

    - default

      ```
      false
      ```

  - - name

      render

    - type

      ```
      ReactElement<unknown, string | JSXElementConstructor<any>>
      ```

    - typeFull

      ```
      ReactElement<unknown, string | JSXElementConstructor<any>> | undefined
      ```

  - - name

      portalProps

    - type

      ```
      DropdownMenuPrimitive.DropdownMenuPortalProps
      ```

    - typeFull

      ```
      DropdownMenuPrimitive.DropdownMenuPortalProps | undefined
      ```

#### [Item](#item)

Menu item slot inside the overflow menu. Renders a `<div>` element unless `asChild` is set.

`<ThreadListItemMorePrimitive.Item>Archive</ThreadListItemMorePrimitive.Item>`

#### [Separator](#separator)

Visual separator between groups of menu items. Renders a `<div>` element unless `asChild` is set.

`<ThreadListItemMorePrimitive.Separator className="my-1 h-px bg-border" />`

## [Patterns](#patterns)

### [Basic Thread List with New Button](#basic-thread-list-with-new-button)

`<ThreadListPrimitive.Root className="flex flex-col gap-1"> <ThreadListPrimitive.New className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"> <PlusIcon className="size-4" /> New Thread </ThreadListPrimitive.New> <ThreadListPrimitive.Items> {() => <ThreadListItem />} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root>`

### [Thread Item with More Menu](#thread-item-with-more-menu)

`function ThreadListItem() { return ( <ThreadListItemPrimitive.Root className="group flex items-center rounded-lg hover:bg-muted data-active:bg-muted"> <ThreadListItemPrimitive.Trigger className="flex-1 truncate px-3 py-2 text-sm"> <ThreadListItemPrimitive.Title fallback="New Chat" /> </ThreadListItemPrimitive.Trigger> <ThreadListItemMorePrimitive.Root> <ThreadListItemMorePrimitive.Trigger className="opacity-0 group-hover:opacity-100"> <MoreHorizontalIcon className="size-4" /> </ThreadListItemMorePrimitive.Trigger> <ThreadListItemMorePrimitive.Content> <ThreadListItemPrimitive.Archive asChild> <ThreadListItemMorePrimitive.Item>Archive</ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Archive> <ThreadListItemMorePrimitive.Separator /> <ThreadListItemPrimitive.Delete asChild> <ThreadListItemMorePrimitive.Item>Delete</ThreadListItemMorePrimitive.Item> </ThreadListItemPrimitive.Delete> </ThreadListItemMorePrimitive.Content> </ThreadListItemMorePrimitive.Root> </ThreadListItemPrimitive.Root> ); }`

### [Archived Threads Section](#archived-threads-section)

`<ThreadListPrimitive.Root> <ThreadListPrimitive.New>New Thread</ThreadListPrimitive.New> <h3 className="px-3 pt-4 text-xs font-medium text-muted-foreground">Recent</h3> <ThreadListPrimitive.Items> {() => <ThreadListItem />} </ThreadListPrimitive.Items> <h3 className="px-3 pt-4 text-xs font-medium text-muted-foreground">Archived</h3> <ThreadListPrimitive.Items archived> {() => <ArchivedItem />} </ThreadListPrimitive.Items> </ThreadListPrimitive.Root>`

In the `ArchivedItem` component, use `ThreadListItemPrimitive.Unarchive` instead of `Archive` to let users restore threads.

## [Relationship to Components](#relationship-to-components)

The shadcn

- href

  /docs/ui/thread-list

ThreadList

component wraps these primitives with Tailwind styling in a sidebar layout, including a skeleton loading state and a prebuilt more menu with archive and delete actions. Start there for a default thread list implementation. Reach for the primitives directly when you need a custom layout, different actions, or integration with your own sidebar or navigation system.

## [API Reference](#api-reference)

For full prop details on every part, see the API reference for each namespace:

- - href

    /docs/api-reference/primitives/thread-list

  ThreadListPrimitive

- - href

    /docs/api-reference/primitives/thread-list-item

  ThreadListItemPrimitive

- - href

    /docs/api-reference/primitives/thread-list-item-more

  ThreadListItemMorePrimitive