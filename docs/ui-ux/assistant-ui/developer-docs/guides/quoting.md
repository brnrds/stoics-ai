# Quote Selected Text
URL: /docs/guides/quoting

Let users select text from AI messages and quote it back into the composer. Full quoting flow with backend handling and programmatic API in assistant-ui.

## [Get Started](#get-started)

Install and wire up the `quote` registry component by following the

- href

  /docs/ui/quote

Quote component page

. It covers the install command, component placement, and the `injectQuoteContext` helper for forwarding quote data to the LLM.

**Limitations:** only one quote can be active at a time. `setQuote` replaces the previous quote instead of appending. The floating toolbar only appears when the selection is entirely within a single message part; cross-message and cross-part selections are ignored.

---

## [How It Works](#how-it-works)

When a user selects text in an assistant message, a floating toolbar appears with a Quote button. Clicking it calls `composer.setQuote()` to store the selection on the composer. The

- href

  /docs/ui/quote

Quote component

does this out of the box.

When the message is sent, the composer runtime automatically writes the quote to `message.metadata.custom.quote` and clears it from the composer.

On the backend, the route handler extracts the quote from metadata and surfaces it to the LLM. We export a helper called `injectQuoteContext` that handles this automatically for AI-SDK. Without this step, the quote appears in the UI but is not sent to the model as context. See

- href

  \#backend-handling

Backend Handling

for more info and alternatives.

### [Data Shape](#data-shape)

`type QuoteInfo = { readonly text: string; // selected plain text readonly messageId: string; // source message ID }; // Stored at: message.metadata.custom.quote`

## [Backend Handling](#backend-handling)

Quote data travels in message metadata, not content, so the LLM will not see it unless your backend extracts and surfaces it. The simplest path is

- href

  /docs/ui/quote#forward-quote-context-to-the-llm

`injectQuoteContext`

, which prepends quoted text as a markdown blockquote before the message parts.

For provider-specific handling, work with the quote metadata directly.

### [Claude SDK Citations](#claude-sdk-citations)

Pass the quoted text as a citation source so Claude produces citations that reference it:

- title

  app/api/chat/route.ts

`import Anthropic from "@anthropic-ai/sdk"; const client = new Anthropic(); export async function POST(req: Request) { const { messages } = await req.json(); const claudeMessages = messages.map((msg) => { const quote = msg.metadata?.custom?.quote; if (!quote?.text) { return { role: msg.role, content: extractText(msg) }; } return { role: "user", content: [ { type: "text", text: quote.text, cache_control: { type: "ephemeral" }, citations: { enabled: true }, }, { type: "text", text: extractText(msg), }, ], }; }); const response = await client.messages.create({ model: "claude-sonnet-4-6", max_tokens: 1024, messages: claudeMessages, }); // ... stream response back }`

### [OpenAI Message Context](#openai-message-context)

Inject the quote as additional context in the user message:

- title

  app/api/chat/route.ts

``function injectQuoteForOpenAI(messages) { return messages.map((msg) => { const quote = msg.metadata?.custom?.quote; if (!quote?.text || msg.role !== "user") return msg; return { ...msg, content: `[Referring to: "${quote.text}"]\n\n${msg.content}`, }; }); }``

## [Reading Quote Data](#reading-quote-data)

Use `useMessageQuote` to access quote data in custom components:

`import { useMessageQuote } from "@assistant-ui/react"; function CustomQuoteDisplay() { const quote = useMessageQuote(); if (!quote) return null; return ( <blockquote className="border-l-2 pl-3 text-sm text-muted-foreground"> {quote.text} </blockquote> ); }`

## [Programmatic API](#programmatic-api)

Set or clear quotes via `useAui` from `@assistant-ui/react`. Call `aui.thread().composer().setQuote()` when your component is rendered outside of a specific thread context, or `aui.composer().setQuote()` when it is rendered inside a thread:

`import { useAui } from "@assistant-ui/react"; function MyComponent() { const aui = useAui(); const quoteText = () => { aui.thread().composer().setQuote({ text: "The text to quote", messageId: "msg-123", }); }; const clearQuote = () => { aui.thread().composer().setQuote(undefined); }; return ( <> <button onClick={quoteText}>Set Quote</button> <button onClick={clearQuote}>Clear Quote</button> </> ); }`

## [Design Notes](#design-notes)

- **snapshot text:** the selected text is captured when the quote is created and is not linked to the source message afterward.
- **streaming messages:** the toolbar still works while a message is streaming because it relies on the captured selection rather than message status.
- **`isEmpty` unchanged:** a quote by itself does not make the composer non-empty; the user still needs to type a reply.
- **scroll hides toolbar:** the toolbar hides on scroll because its position would otherwise become stale.

## [Related](#related)

- - href

    /docs/ui/quote

  Quote component

  : Installation, component setup, and API reference

- - href

    /docs/guides/editing

  Message Editing

  : Edit user messages

- - href

    /docs/ui/thread

  Thread

  : Main chat container