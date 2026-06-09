# Suggestion
URL: /docs/primitives/suggestion

Suggested prompts that users can click to quickly send or populate the composer.

The Suggestion primitive renders suggested prompts as clickable pills that send a message or populate the composer. Use it for welcome screen suggestions, follow-up prompts, or quick actions. You provide the layout and styling.

- items

  - Preview
  - Code

`import { ThreadPrimitive, SuggestionPrimitive, } from "@assistant-ui/react"; function SuggestionList() { return ( <div className="grid grid-cols-2 gap-2"> <ThreadPrimitive.Suggestions> {() => <SuggestionItem />} </ThreadPrimitive.Suggestions> </div> ); } function SuggestionItem() { return ( <SuggestionPrimitive.Trigger send className="flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left text-sm hover:bg-muted" > <span className="font-medium"> <SuggestionPrimitive.Title /> </span> <span className="text-muted-foreground"> <SuggestionPrimitive.Description /> </span> </SuggestionPrimitive.Trigger> ); }`

## [Quick Start](#quick-start)

A suggestion list using the iterator pattern:

`import { ThreadPrimitive, SuggestionPrimitive } from "@assistant-ui/react"; <ThreadPrimitive.Suggestions> {() => <MySuggestionItem />} </ThreadPrimitive.Suggestions> function MySuggestionItem() { return ( <SuggestionPrimitive.Trigger className="rounded-lg border px-3 py-2 hover:bg-muted"> <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger> ); }`

`ThreadPrimitive.Suggestions` iterates over available suggestions and renders your component for each one. Inside the component, `SuggestionPrimitive` parts read from the suggestion context automatically.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Context-Based Rendering](#context-based-rendering)

SuggestionPrimitive parts read from a suggestion context. Use `ThreadPrimitive.Suggestions` to provide this context. It iterates over the thread's suggestions and renders your component for each one:

`<ThreadPrimitive.Suggestions> {() => <MySuggestion />} </ThreadPrimitive.Suggestions>`

You can also use `ThreadPrimitive.SuggestionByIndex` to render a specific suggestion by index if you need more layout control.

### [Title and Description](#title-and-description)

Suggestions support two text parts for structured display:

- **`Title`**: the primary text (e.g., "Write a blog post")
- **`Description`**: secondary text — renders the `label` field from the suggestion config (e.g., `{ prompt: "...", label: "About React Server Components" }`)

Both render a `<span>` and accept `children` to override the value from state:

`<SuggestionPrimitive.Title>Custom title</SuggestionPrimitive.Title>`

### [Send vs Populate](#send-vs-populate)

`Trigger`'s `send` prop controls what happens on click:

- **`send={true}`**: immediately sends the suggestion as a new message. When the thread is running, it falls back to populating the composer instead.
- **`send={false}`** (default): populates the composer text so the user can edit before sending

`// Send immediately <SuggestionPrimitive.Trigger send> <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger> // Populate composer for editing <SuggestionPrimitive.Trigger> <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger>`

### [clearComposer](#clearcomposer)

When `send={false}`, the `clearComposer` prop controls whether the suggestion replaces or appends to existing composer text:

- **`clearComposer={true}`** (default): replaces the current composer text
- **`clearComposer={false}`**: appends the suggestion to the existing text

### [Static configuration vs. runtime suggestions](#static-configuration-vs-runtime-suggestions)

There are two separate data flows for suggestions:

- **Static configuration** flows through the `suggestions` scope. Pass an array to `Suggestions(...)` in your runtime provider; render it with `ThreadPrimitive.Suggestions`. Best for welcome screen prompts.
- **Runtime / dynamic suggestions** flow through `thread.suggestions`. Populate it via `SuggestionAdapter` (local runtime) or the `suggestions` field on `useExternalStoreRuntime`; render it with the shadcn `ThreadFollowupSuggestions` component or your own component reading `useAuiState((s) => s.thread.suggestions)`. Best for follow up prompts after a turn.

See

- href

  /docs/guides/suggestions

Suggested Prompts

for end to end examples.

### [ThreadPrimitive.Suggestion (Legacy)](#threadprimitivesuggestion-legacy)

`ThreadPrimitive.Suggestion` is a self-contained button that takes a `prompt` prop directly. The newer pattern (`ThreadPrimitive.Suggestions` + `SuggestionPrimitive` parts) is preferred for structured suggestions with title and description:

`// Legacy: still works, but limited <ThreadPrimitive.Suggestion prompt="Write a blog post" /> // Preferred: structured with title/description <ThreadPrimitive.Suggestions> {() => <MySuggestionItem />} </ThreadPrimitive.Suggestions>`

`ThreadPrimitive.Suggestion` also supports deprecated `autoSend` and `method` props for backwards compatibility. Prefer `send` and `clearComposer`.

## [Parts](#parts)

### [Title](#title)

Renders the suggestion title. Renders a `<span>` element unless `asChild` is set.

`<SuggestionPrimitive.Title />`

### [Description](#description)

Renders the secondary suggestion description text. Renders a `<span>` element unless `asChild` is set.

`<SuggestionPrimitive.Description />`

### [Trigger](#trigger)

Clickable button that sends or populates the suggestion. Renders a `<button>` element unless `asChild` is set.

`<SuggestionPrimitive.Trigger send className="rounded-lg border px-3 py-2 hover:bg-muted"> <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger>`

- rows

  - - name

      send

    - type

      ```
      boolean
      ```

    - description

      - When true, automatically sends the message.\
        When false, replaces or appends the composer text with the suggestion - depending on the value of \`clearComposer\`.

  - - name

      clearComposer

    - type

      ```
      boolean
      ```

    - description

      - Whether to clear the composer after sending.\
        When send is set to false, determines if composer text is replaced with suggestion (true, default),\
        or if it's appended to the composer text (false).

    - default

      ```
      true
      ```

## [Patterns](#patterns)

### [Welcome Screen Grid](#welcome-screen-grid)

`function WelcomeSuggestions() { return ( <AuiIf condition={(s) => s.thread.isEmpty}> <div className="text-center"> <h2 className="text-lg font-semibold">How can I help you?</h2> <div className="mt-4 grid grid-cols-2 gap-2"> <ThreadPrimitive.Suggestions> {() => <SuggestionCard />} </ThreadPrimitive.Suggestions> </div> </div> </AuiIf> ); } function SuggestionCard() { return ( <SuggestionPrimitive.Trigger send className="flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left hover:bg-muted" > <span className="font-medium"> <SuggestionPrimitive.Title /> </span> <span className="text-sm text-muted-foreground"> <SuggestionPrimitive.Description /> </span> </SuggestionPrimitive.Trigger> ); }`

### [Send-On-Click Suggestions](#send-on-click-suggestions)

`<SuggestionPrimitive.Trigger send className="rounded-full border px-4 py-2 hover:bg-muted"> <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger>`

### [Populate-Only Suggestions](#populate-only-suggestions)

`<SuggestionPrimitive.Trigger send={false} clearComposer={false} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted" > <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger>`

## [Relationship to Components](#relationship-to-components)

The shadcn

- href

  /docs/ui/thread

Thread

component includes suggestions in its welcome screen using `ThreadPrimitive.Suggestions` with `SuggestionPrimitive` parts in a responsive grid. Start there for a prebuilt welcome experience.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/suggestion

SuggestionPrimitive API Reference

.

Related:

- - href

    /docs/api-reference/primitives/thread

  ThreadPrimitive API Reference