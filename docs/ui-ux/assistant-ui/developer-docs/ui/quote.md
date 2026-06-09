# Quote
URL: /docs/ui/quote

Let users select and quote text from messages with a floating toolbar, composer preview, and inline quote display.

## [Getting Started](#getting-started)

### [Add `quote`](#add-quote)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/quote.json

#### Main Component

- packages

  - @assistant-ui/react

* code

  "use client"; import { memo, type ComponentProps, type FC } from "react"; import type { QuoteMessagePartComponent } from "@assistant-ui/react"; import { ComposerPrimitive, SelectionToolbarPrimitive, } from "@assistant-ui/react"; import { QuoteIcon, XIcon } from "lucide-react"; import { cn } from "@/lib/utils"; function QuoteBlockRoot({ className, ...props }: ComponentProps<"div">) { return ( \<div data-slot="quote-block" className={cn("mb-2 flex items-start gap-1.5", className)} {...props} /> ); } function QuoteBlockIcon({ className, ...props }: ComponentProps\<typeof QuoteIcon>) { return ( \<QuoteIcon data-slot="quote-block-icon" className={cn( "mt-0.5 size-3 shrink-0 text-muted-foreground/60", className, )} {...props} /> ); } function QuoteBlockText({ className, ...props }: ComponentProps<"p">) { return ( \<p data-slot="quote-block-text" className={cn( "line-clamp-2 min-w-0 text-muted-foreground/80 text-sm italic", className, )} {...props} /> ); } /\*\* \* Renders quoted text in user messages. \* \* Pass this to \`MessagePrimitive.Parts\` as the \`Quote\` renderer. \* \* @example \* \`\`\`tsx \* \<MessagePrimitive.Quote> \* {(quote) => \<QuoteBlock {...quote} />} \* \</MessagePrimitive.Quote> \* \`\`\` \*/ const QuoteBlockImpl: QuoteMessagePartComponent = ({ text }) => { return ( \<QuoteBlockRoot> \<QuoteBlockIcon /> \<QuoteBlockText>{text}\</QuoteBlockText> \</QuoteBlockRoot> ); }; const QuoteBlock = memo( QuoteBlockImpl, ) as unknown as QuoteMessagePartComponent & { Root: typeof QuoteBlockRoot; Icon: typeof QuoteBlockIcon; Text: typeof QuoteBlockText; }; QuoteBlock.displayName = "QuoteBlock"; QuoteBlock.Root = QuoteBlockRoot; QuoteBlock.Icon = QuoteBlockIcon; QuoteBlock.Text = QuoteBlockText; function SelectionToolbarRoot({ className, ...props }: ComponentProps\<typeof SelectionToolbarPrimitive.Root>) { return ( \<SelectionToolbarPrimitive.Root data-slot="selection-toolbar" className={cn( "flex items-center gap-1 rounded-lg border bg-popover px-1 py-1 shadow-md", className, )} {...props} /> ); } function SelectionToolbarQuote({ className, children, ...props }: ComponentProps\<typeof SelectionToolbarPrimitive.Quote>) { return ( \<SelectionToolbarPrimitive.Quote data-slot="selection-toolbar-quote" className={cn( "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-popover-foreground text-sm transition-colors hover:bg-accent", className, )} {...props} > {children ?? ( <> \<QuoteIcon className="size-3.5" /> Quote \</> )} \</SelectionToolbarPrimitive.Quote> ); } /\*\* \* Floating toolbar that appears when text is selected in a message. \* \* Render anywhere inside \`ThreadPrimitive.Root\` (or any \`AssistantRuntimeProvider\` scope). \* \* @example \* \`\`\`tsx \* \<ThreadPrimitive.Root> \* \<ThreadPrimitive.Viewport>...\</ThreadPrimitive.Viewport> \* \<SelectionToolbar /> \* \</ThreadPrimitive.Root> \* \`\`\` \*/ const SelectionToolbarImpl: FC\<ComponentProps\<typeof SelectionToolbarRoot>> = ({ className, ...props }) => { return ( \<SelectionToolbarRoot className={className} {...props}> \<SelectionToolbarQuote /> \</SelectionToolbarRoot> ); }; const SelectionToolbar = memo( SelectionToolbarImpl, ) as unknown as typeof SelectionToolbarImpl & { Root: typeof SelectionToolbarRoot; Quote: typeof SelectionToolbarQuote; }; SelectionToolbar.displayName = "SelectionToolbar"; SelectionToolbar.Root = SelectionToolbarRoot; SelectionToolbar.Quote = SelectionToolbarQuote; function ComposerQuotePreviewRoot({ className, ...props }: ComponentProps\<typeof ComposerPrimitive.Quote>) { return ( \<ComposerPrimitive.Quote data-slot="composer-quote" className={cn( "mx-3 mt-2 flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2", className, )} {...props} /> ); } function ComposerQuotePreviewIcon({ className, ...props }: ComponentProps\<typeof QuoteIcon>) { return ( \<QuoteIcon data-slot="composer-quote-icon" className={cn( "mt-0.5 size-3.5 shrink-0 text-muted-foreground/70", className, )} {...props} /> ); } function ComposerQuotePreviewText({ className, ...props }: ComponentProps\<typeof ComposerPrimitive.QuoteText>) { return ( \<ComposerPrimitive.QuoteText data-slot="composer-quote-text" className={cn( "line-clamp-2 min-w-0 flex-1 text-muted-foreground text-sm", className, )} {...props} /> ); } function ComposerQuotePreviewDismiss({ className, children, ...props }: ComponentProps\<typeof ComposerPrimitive.QuoteDismiss>) { const defaultClassName = "shrink-0 rounded-sm p-0.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground"; return ( \<ComposerPrimitive.QuoteDismiss data-slot="composer-quote-dismiss" asChild className={children ? className : undefined} {...props} > {children ?? ( \<button type="button" aria-label="Dismiss quote" className={cn(defaultClassName, className)} > \<XIcon className="size-3.5" /> \</button> )} \</ComposerPrimitive.QuoteDismiss> ); } /\*\* \* Quote preview inside the composer. Only renders when a quote is set. \* \* Place inside \`ComposerPrimitive.Root\`. \* \* @example \* \`\`\`tsx \* \<ComposerPrimitive.Root> \* \<ComposerQuotePreview /> \* \<ComposerPrimitive.Input /> \* \<ComposerPrimitive.Send /> \* \</ComposerPrimitive.Root> \* \`\`\` \*/ const ComposerQuotePreviewImpl: FC< ComponentProps\<typeof ComposerQuotePreviewRoot> > = ({ className, ...props }) => { return ( \<ComposerQuotePreviewRoot className={className} {...props}> \<ComposerQuotePreviewIcon /> \<ComposerQuotePreviewText /> \<ComposerQuotePreviewDismiss /> \</ComposerQuotePreviewRoot> ); }; const ComposerQuotePreview = memo( ComposerQuotePreviewImpl, ) as unknown as typeof ComposerQuotePreviewImpl & { Root: typeof ComposerQuotePreviewRoot; Icon: typeof ComposerQuotePreviewIcon; Text: typeof ComposerQuotePreviewText; Dismiss: typeof ComposerQuotePreviewDismiss; }; ComposerQuotePreview\.displayName = "ComposerQuotePreview"; ComposerQuotePreview\.Root = ComposerQuotePreviewRoot; ComposerQuotePreview\.Icon = ComposerQuotePreviewIcon; ComposerQuotePreview\.Text = ComposerQuotePreviewText; ComposerQuotePreview\.Dismiss = ComposerQuotePreviewDismiss; export { QuoteBlock, QuoteBlockRoot, QuoteBlockIcon, QuoteBlockText, SelectionToolbar, SelectionToolbarRoot, SelectionToolbarQuote, ComposerQuotePreview, ComposerQuotePreviewRoot, ComposerQuotePreviewIcon, ComposerQuotePreviewText, ComposerQuotePreviewDismiss, };

- lang

  tsx

- code

  "use client"; import { memo, type ComponentProps, type FC } from "react"; import type { QuoteMessagePartComponent } from "@assistant-ui/react"; import { ComposerPrimitive, SelectionToolbarPrimitive, } from "@assistant-ui/react"; import { QuoteIcon, XIcon } from "lucide-react"; import { cn } from "@/lib/utils"; function QuoteBlockRoot({ className, ...props }: ComponentProps<"div">) { return ( \<div data-slot="quote-block" className={cn("mb-2 flex items-start gap-1.5", className)} {...props} /> ); } function QuoteBlockIcon({ className, ...props }: ComponentProps\<typeof QuoteIcon>) { return ( \<QuoteIcon data-slot="quote-block-icon" className={cn( "mt-0.5 size-3 shrink-0 text-muted-foreground/60", className, )} {...props} /> ); } function QuoteBlockText({ className, ...props }: ComponentProps<"p">) { return ( \<p data-slot="quote-block-text" className={cn( "line-clamp-2 min-w-0 text-muted-foreground/80 text-sm italic", className, )} {...props} /> ); } /\*\* \* Renders quoted text in user messages. \* \* Pass this to \`MessagePrimitive.Parts\` as the \`Quote\` renderer. \* \* @example \* \`\`\`tsx \* \<MessagePrimitive.Quote> \* {(quote) => \<QuoteBlock {...quote} />} \* \</MessagePrimitive.Quote> \* \`\`\` \*/ const QuoteBlockImpl: QuoteMessagePartComponent = ({ text }) => { return ( \<QuoteBlockRoot> \<QuoteBlockIcon /> \<QuoteBlockText>{text}\</QuoteBlockText> \</QuoteBlockRoot> ); }; const QuoteBlock = memo( QuoteBlockImpl, ) as unknown as QuoteMessagePartComponent & { Root: typeof QuoteBlockRoot; Icon: typeof QuoteBlockIcon; Text: typeof QuoteBlockText; }; QuoteBlock.displayName = "QuoteBlock"; QuoteBlock.Root = QuoteBlockRoot; QuoteBlock.Icon = QuoteBlockIcon; QuoteBlock.Text = QuoteBlockText; function SelectionToolbarRoot({ className, ...props }: ComponentProps\<typeof SelectionToolbarPrimitive.Root>) { return ( \<SelectionToolbarPrimitive.Root data-slot="selection-toolbar" className={cn( "flex items-center gap-1 rounded-lg border bg-popover px-1 py-1 shadow-md", className, )} {...props} /> ); } function SelectionToolbarQuote({ className, children, ...props }: ComponentProps\<typeof SelectionToolbarPrimitive.Quote>) { return ( \<SelectionToolbarPrimitive.Quote data-slot="selection-toolbar-quote" className={cn( "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-popover-foreground text-sm transition-colors hover:bg-accent", className, )} {...props} > {children ?? ( <> \<QuoteIcon className="size-3.5" /> Quote \</> )} \</SelectionToolbarPrimitive.Quote> ); } /\*\* \* Floating toolbar that appears when text is selected in a message. \* \* Render anywhere inside \`ThreadPrimitive.Root\` (or any \`AssistantRuntimeProvider\` scope). \* \* @example \* \`\`\`tsx \* \<ThreadPrimitive.Root> \* \<ThreadPrimitive.Viewport>...\</ThreadPrimitive.Viewport> \* \<SelectionToolbar /> \* \</ThreadPrimitive.Root> \* \`\`\` \*/ const SelectionToolbarImpl: FC\<ComponentProps\<typeof SelectionToolbarRoot>> = ({ className, ...props }) => { return ( \<SelectionToolbarRoot className={className} {...props}> \<SelectionToolbarQuote /> \</SelectionToolbarRoot> ); }; const SelectionToolbar = memo( SelectionToolbarImpl, ) as unknown as typeof SelectionToolbarImpl & { Root: typeof SelectionToolbarRoot; Quote: typeof SelectionToolbarQuote; }; SelectionToolbar.displayName = "SelectionToolbar"; SelectionToolbar.Root = SelectionToolbarRoot; SelectionToolbar.Quote = SelectionToolbarQuote; function ComposerQuotePreviewRoot({ className, ...props }: ComponentProps\<typeof ComposerPrimitive.Quote>) { return ( \<ComposerPrimitive.Quote data-slot="composer-quote" className={cn( "mx-3 mt-2 flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2", className, )} {...props} /> ); } function ComposerQuotePreviewIcon({ className, ...props }: ComponentProps\<typeof QuoteIcon>) { return ( \<QuoteIcon data-slot="composer-quote-icon" className={cn( "mt-0.5 size-3.5 shrink-0 text-muted-foreground/70", className, )} {...props} /> ); } function ComposerQuotePreviewText({ className, ...props }: ComponentProps\<typeof ComposerPrimitive.QuoteText>) { return ( \<ComposerPrimitive.QuoteText data-slot="composer-quote-text" className={cn( "line-clamp-2 min-w-0 flex-1 text-muted-foreground text-sm", className, )} {...props} /> ); } function ComposerQuotePreviewDismiss({ className, children, ...props }: ComponentProps\<typeof ComposerPrimitive.QuoteDismiss>) { const defaultClassName = "shrink-0 rounded-sm p-0.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground"; return ( \<ComposerPrimitive.QuoteDismiss data-slot="composer-quote-dismiss" asChild className={children ? className : undefined} {...props} > {children ?? ( \<button type="button" aria-label="Dismiss quote" className={cn(defaultClassName, className)} > \<XIcon className="size-3.5" /> \</button> )} \</ComposerPrimitive.QuoteDismiss> ); } /\*\* \* Quote preview inside the composer. Only renders when a quote is set. \* \* Place inside \`ComposerPrimitive.Root\`. \* \* @example \* \`\`\`tsx \* \<ComposerPrimitive.Root> \* \<ComposerQuotePreview /> \* \<ComposerPrimitive.Input /> \* \<ComposerPrimitive.Send /> \* \</ComposerPrimitive.Root> \* \`\`\` \*/ const ComposerQuotePreviewImpl: FC< ComponentProps\<typeof ComposerQuotePreviewRoot> > = ({ className, ...props }) => { return ( \<ComposerQuotePreviewRoot className={className} {...props}> \<ComposerQuotePreviewIcon /> \<ComposerQuotePreviewText /> \<ComposerQuotePreviewDismiss /> \</ComposerQuotePreviewRoot> ); }; const ComposerQuotePreview = memo( ComposerQuotePreviewImpl, ) as unknown as typeof ComposerQuotePreviewImpl & { Root: typeof ComposerQuotePreviewRoot; Icon: typeof ComposerQuotePreviewIcon; Text: typeof ComposerQuotePreviewText; Dismiss: typeof ComposerQuotePreviewDismiss; }; ComposerQuotePreview\.displayName = "ComposerQuotePreview"; ComposerQuotePreview\.Root = ComposerQuotePreviewRoot; ComposerQuotePreview\.Icon = ComposerQuotePreviewIcon; ComposerQuotePreview\.Text = ComposerQuotePreviewText; ComposerQuotePreview\.Dismiss = ComposerQuotePreviewDismiss; export { QuoteBlock, QuoteBlockRoot, QuoteBlockIcon, QuoteBlockText, SelectionToolbar, SelectionToolbarRoot, SelectionToolbarQuote, ComposerQuotePreview, ComposerQuotePreviewRoot, ComposerQuotePreviewIcon, ComposerQuotePreviewText, ComposerQuotePreviewDismiss, };

This adds a `/components/assistant-ui/quote.tsx` file with three components: `QuoteBlock`, `SelectionToolbar`, and `ComposerQuotePreview`.

### [Display Quotes in User Messages](#display-quotes-in-user-messages)

Add `MessagePrimitive.Quote` above `MessagePrimitive.Parts` in your user message:

- title

  components/assistant-ui/thread.tsx

`import { QuoteBlock } from "@/components/assistant-ui/quote"; const UserMessage = () => { return ( <MessagePrimitive.Root> <MessagePrimitive.Quote> {(quote) => <QuoteBlock {...quote} />} </MessagePrimitive.Quote> <MessagePrimitive.Parts /> </MessagePrimitive.Root> ); };`

### [Add the Floating Selection Toolbar](#add-the-floating-selection-toolbar)

Render `SelectionToolbar` inside `ThreadPrimitive.Root`. It portals to the document body and appears near the user's text selection.

- title

  components/assistant-ui/thread.tsx

`import { SelectionToolbar } from "@/components/assistant-ui/quote"; const Thread = () => { return ( <ThreadPrimitive.Root> <ThreadPrimitive.Viewport> <ThreadPrimitive.Messages> {({ message }) => { ... }} </ThreadPrimitive.Messages> ... </ThreadPrimitive.Viewport> <SelectionToolbar /> </ThreadPrimitive.Root> ); };`

### [Show Quote Preview in Composer](#show-quote-preview-in-composer)

Add `ComposerQuotePreview` inside your composer. It only renders when a quote is set.

- title

  components/assistant-ui/thread.tsx

`import { ComposerQuotePreview } from "@/components/assistant-ui/quote"; const Composer = () => { return ( <ComposerPrimitive.Root> <ComposerQuotePreview /> <ComposerPrimitive.Input placeholder="Send a message..." /> <ComposerPrimitive.Send /> </ComposerPrimitive.Root> ); };`

### [Forward Quote Context to the LLM](#forward-quote-context-to-the-llm)

Quote data is stored in message metadata, **not** in message content. Use `injectQuoteContext` in your route handler so the LLM sees the quoted text:

- title

  app/api/chat/route.ts

`import { convertToModelMessages, streamText } from "ai"; import { injectQuoteContext } from "@assistant-ui/react-ai-sdk"; export async function POST(req: Request) { const { messages } = await req.json(); const result = streamText({ model: myModel, messages: await convertToModelMessages(injectQuoteContext(messages)), }); return result.toUIMessageStreamResponse(); }`

`injectQuoteContext` prepends the quoted text as a markdown `>` blockquote to the message parts so the LLM receives the context the user is referring to.

For alternative backend approaches (Claude SDK citation source, OpenAI message context), see the

- href

  /docs/guides/quoting#backend-handling

Quoting guide

.

## [Customization](#customization)

All three components expose sub-components for full control over styling:

`// Custom QuoteBlock <QuoteBlock.Root className="my-custom-class"> <QuoteBlock.Icon /> <QuoteBlock.Text>{text}</QuoteBlock.Text> </QuoteBlock.Root> // Custom SelectionToolbar <SelectionToolbar.Root> <SelectionToolbar.Quote>Reply with quote</SelectionToolbar.Quote> </SelectionToolbar.Root> // Custom ComposerQuotePreview <ComposerQuotePreview.Root> <ComposerQuotePreview.Icon /> <ComposerQuotePreview.Text /> <ComposerQuotePreview.Dismiss /> </ComposerQuotePreview.Root>`

## [API Reference](#api-reference)

### [`QuoteBlock`](#quoteblock)

Renders quoted text in user messages. Pass to `MessagePrimitive.Parts` as `components.Quote`.

| Prop        | Type     | Description              |
| ----------- | -------- | ------------------------ |
| `text`      | `string` | The quoted text          |
| `messageId` | `string` | ID of the source message |

**Sub-components:** `QuoteBlock.Root`, `QuoteBlock.Icon`, `QuoteBlock.Text`

### [`SelectionToolbar`](#selectiontoolbar)

Floating toolbar that appears when text is selected within a message. Renders as a portal positioned above the selection.

| Prop        | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `className` | `string` | Additional class names |

**Sub-components:** `SelectionToolbar.Root`, `SelectionToolbar.Quote`

### [`ComposerQuotePreview`](#composerquotepreview)

Quote preview inside the composer. Only renders when a quote is set.

| Prop        | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `className` | `string` | Additional class names |

**Sub-components:** `ComposerQuotePreview.Root`, `ComposerQuotePreview.Icon`, `ComposerQuotePreview.Text`, `ComposerQuotePreview.Dismiss`

### [`injectQuoteContext`](#injectquotecontext)

`import { injectQuoteContext } from "@assistant-ui/react-ai-sdk"; injectQuoteContext(messages: UIMessage[]): UIMessage[]`

Extracts `metadata.custom.quote` from each message and prepends the quoted text as a `> blockquote` text part. Use before `convertToModelMessages` in your route handler. For alternative backend approaches, see the

- href

  /docs/guides/quoting#backend-handling

Quoting guide

.

### [`useMessageQuote`](#usemessagequote)

`import { useMessageQuote } from "@assistant-ui/react"; const quote: QuoteInfo | undefined = useMessageQuote();`

Returns the quote attached to the current message, or `undefined`. Useful for building custom quote displays without `QuoteBlock`. For a usage example, see the

- href

  /docs/guides/quoting#reading-quote-data

Quoting guide

.

### [`ComposerRuntime.setQuote`](#composerruntimesetquote)

`setQuote(quote: QuoteInfo | undefined): void`

Set or clear the quote on the composer programmatically. The quote is automatically cleared when the message is sent. For a usage example, see the

- href

  /docs/guides/quoting#programmatic-api

Quoting guide

.

## [Related](#related)

- - href

    /docs/guides/quoting

  Quoting guide

  : Backend handling, programmatic API, data shape, and design notes

- - href

    /docs/ui/thread

  Thread

  : Main chat container