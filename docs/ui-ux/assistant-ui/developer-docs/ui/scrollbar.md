# Custom Scrollbar
URL: /docs/ui/scrollbar

Replace the default scrollbar with a custom Radix UI scroll area.

If you want to show a custom scrollbar UI of the `ThreadPrimitive.Viewport` in place of the system default, you can integrate `radix-ui`'s Scroll Area. An example implementation of this is

- href

  https\://ui.shadcn.com/docs/components/scroll-area

shadcn/ui's Scroll Area

.

### [Add shadcn Scroll Area](#add-shadcn-scroll-area)

`npx shadcn@latest add scroll-area`

### [Add Additional Styles](#add-additional-styles)

The Radix UI Viewport component adds an intermediate `<div data-radix-scroll-area-content>` element. Add the following CSS to your `globals.css`:

- title

  @/app/globals.css

`.thread-viewport > [data-radix-scroll-area-content] { @apply flex flex-col items-center self-stretch bg-inherit; }`

### [Integrate with Thread](#integrate-with-thread)

- Wrap `ThreadPrimitive.Root` with `<ScrollAreaPrimitive.Root asChild>`
- Wrap `ThreadPrimitive.Viewport` with `<ScrollAreaPrimitive.Viewport className="thread-viewport" asChild>`
- Add shadcn's `<ScrollBar />` to `ThreadPrimitive.Root`

The resulting MyThread component should look like this:

`import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"; import { ScrollBar } from "@/components/ui/scroll-area"; const MyThread: FC = () => { return ( <ScrollAreaPrimitive.Root asChild> <ThreadPrimitive.Root className="..."> <ScrollAreaPrimitive.Viewport className="thread-viewport" asChild> <ThreadPrimitive.Viewport className="..."> ... </ThreadPrimitive.Viewport> </ScrollAreaPrimitive.Viewport> <ScrollBar /> </ThreadPrimitive.Root> </ScrollAreaPrimitive.Root> ); };`

## [Related Components](#related-components)

- - href

    /docs/ui/thread

  Thread

  \- The main chat interface where the scrollbar is used