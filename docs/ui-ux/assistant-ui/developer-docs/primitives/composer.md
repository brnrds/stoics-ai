# Composer
URL: /docs/primitives/composer

Build custom message input UIs with full control over layout and behavior.

The Composer primitive is the interface for composing new messages or editing existing ones. It handles submit behavior, keyboard shortcuts, focus management, attachment state, and streaming status. You provide the UI.

- items

  - Preview
  - Code

`import { ComposerPrimitive } from "@assistant-ui/react"; import { ArrowUpIcon } from "lucide-react"; export function MinimalComposer() { return ( <ComposerPrimitive.Root className="flex w-full flex-col rounded-3xl border bg-muted"> <ComposerPrimitive.Input placeholder="Ask anything..." className="min-h-10 w-full resize-none bg-transparent px-5 pt-4 pb-3 text-sm focus:outline-none" rows={1} /> <div className="flex items-center justify-end px-3 pb-3"> <ComposerPrimitive.Send className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-30"> <ArrowUpIcon className="size-4" /> </ComposerPrimitive.Send> </div> </ComposerPrimitive.Root> ); }`

## [Quick Start](#quick-start)

Minimal example:

`import { ComposerPrimitive } from "@assistant-ui/react"; <ComposerPrimitive.Root> <ComposerPrimitive.Input placeholder="Ask anything..." /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

`Root` renders a `<form>`, `Input` renders a `<textarea>`, and `Send` renders a `<button>`. Each part renders its native element by default, and supports `asChild` for element substitution.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [New Message vs Edit Mode](#new-message-vs-edit-mode)

A Composer placed inside a **Thread** composes new messages. A Composer placed inside a **Message** edits that message. The same primitives handle both, and the behavior changes automatically based on context.

`// New message composer <ThreadPrimitive.Root> <ComposerPrimitive.Root> <ComposerPrimitive.Input /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root> </ThreadPrimitive.Root> // Edit composer (inside a message) <MessagePrimitive.Root> <ComposerPrimitive.Root> <ComposerPrimitive.Input /> <ComposerPrimitive.Send>Save</ComposerPrimitive.Send> <ComposerPrimitive.Cancel>Cancel</ComposerPrimitive.Cancel> </ComposerPrimitive.Root> </MessagePrimitive.Root>`

### [The `asChild` Pattern](#the-aschild-pattern)

Every primitive part accepts `asChild` to merge its behavior onto your own element. This is how you use primitives with your own design system:

`import { ComposerPrimitive } from "@assistant-ui/react"; <ComposerPrimitive.Input asChild> <textarea className="my-custom-textarea" placeholder="Type here..." /> </ComposerPrimitive.Input> <ComposerPrimitive.Send asChild> <MyButton variant="primary">Send</MyButton> </ComposerPrimitive.Send>`

The primitive's behavior (keyboard handling, disabled state, form submission) is merged onto your element. Your styles, your component, primitive wiring.

### [Unstable Trigger Popovers](#unstable-trigger-popovers)

Composer includes an unstable **trigger popover** system for character-triggered popovers (e.g. `@` for mentions, `/` for slash commands). Multiple triggers coexist under a single `TriggerPopoverRoot`.

`<ComposerPrimitive.Unstable_TriggerPopoverRoot> <ComposerPrimitive.Root> <ComposerPrimitive.Input placeholder="Type @ to mention, / for commands..." /> {/* @ mention — inserts directive text into the message */} <ComposerPrimitive.Unstable_TriggerPopover char="@" adapter={mentionAdapter} > <ComposerPrimitive.Unstable_TriggerPopover.Directive formatter={formatter} /> {/* popover UI */} </ComposerPrimitive.Unstable_TriggerPopover> {/* / slash command — runs a handler on selection; leaves an audit-trail chip by default */} <ComposerPrimitive.Unstable_TriggerPopover char="/" adapter={slashAdapter} > <ComposerPrimitive.Unstable_TriggerPopover.Action formatter={formatter} onExecute={(item) => commandHandlers[item.id]?.()} /> <ComposerPrimitive.Unstable_TriggerPopoverItems> {(items) => items.map(item => ( <ComposerPrimitive.Unstable_TriggerPopoverItem key={item.id} item={item}> {item.label} </ComposerPrimitive.Unstable_TriggerPopoverItem> ))} </ComposerPrimitive.Unstable_TriggerPopoverItems> </ComposerPrimitive.Unstable_TriggerPopover> </ComposerPrimitive.Root> </ComposerPrimitive.Unstable_TriggerPopoverRoot>`

See the

- href

  /docs/guides/mentions

Mentions guide

and

- href

  /docs/guides/slash-commands

Slash Commands guide

for full documentation.

## [Parts](#parts)

### [Root](#root)

Form container for message composition. Renders a `<form>` element unless `asChild` is set.

`<ComposerPrimitive.Root className="flex w-full flex-col rounded-3xl border bg-muted"> <ComposerPrimitive.Input placeholder="Ask anything..." /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

### [Input](#input)

Text input with keyboard shortcuts. Renders a `<textarea>` element unless `asChild` is set.

`<ComposerPrimitive.Input submitMode="ctrlEnter" cancelOnEscape placeholder="Ask anything..." />`

- rows

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

    - description

      - A React element to use as the input container, with props merged in.

  - - name

      cancelOnEscape

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - Whether to cancel message composition when Escape is pressed.

    - default

      ```
      true
      ```

  - - name

      unstable\_focusOnRunStart

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - - variant

          unstable

      - Whether to automatically focus the input when a new run starts.

    - default

      ```
      true
      ```

  - - name

      unstable\_focusOnScrollToBottom

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - - variant

          unstable

      - Whether to automatically focus the input when scrolling to bottom.

    - default

      ```
      true
      ```

  - - name

      unstable\_focusOnThreadSwitched

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - - variant

          unstable

      - Whether to automatically focus the input when switching threads.

    - default

      ```
      true
      ```

  - - name

      addAttachmentOnPaste

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - Whether to automatically add pasted files as attachments.

    - default

      ```
      true
      ```

  - - name

      submitMode

    - type

      ```
      "none" | "enter" | "ctrlEnter"
      ```

    - typeFull

      ```
      "none" | "enter" | "ctrlEnter" | undefined
      ```

    - description

      - Controls how the Enter key submits messages.\
        \- "enter": Plain Enter submits (Shift+Enter for newline)\
        \- "ctrlEnter": Ctrl/Cmd+Enter submits (plain Enter for newline)\
        \- "none": Keyboard submission disabled

    - default

      ```
      "enter"
      ```

  - - name

      submitOnEnter

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - - variant

          deprecated

        Use \`submitMode\` instead

      - Whether to submit the message when Enter is pressed (without Shift).

    - default

      ```
      true
      ```

### [Send](#send)

Submits the composer form. Renders a `<button>` element unless `asChild` is set.

`<ComposerPrimitive.Send className="rounded-full bg-primary px-3 py-2 text-primary-foreground"> Send </ComposerPrimitive.Send>`

### [Cancel](#cancel)

Cancels the current composition or edit session. Renders a `<button>` element unless `asChild` is set.

`<ComposerPrimitive.Cancel className="rounded-md px-3 py-2 text-sm hover:bg-muted"> Cancel </ComposerPrimitive.Cancel>`

### [AddAttachment](#addattachment)

Opens file picker for attachments. Renders a `<button>` element unless `asChild` is set.

`<ComposerPrimitive.AddAttachment multiple> Attach Files </ComposerPrimitive.AddAttachment>`

- rows

  - - name

      multiple

    - type

      ```
      boolean
      ```

    - description

      - allow selecting multiple files

### [Attachments](#attachments)

Renders each attachment. Prefer the children render function for new code.

`<ComposerPrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") return <ImagePreview />; if (attachment.type === "document") return <DocumentPreview />; return <GenericPreview />; }} </ComposerPrimitive.Attachments>`

- rows

  - - name

      components

    - type

      ```
      ComposerAttachmentsComponentConfig
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
      (value: { attachment: Attachment; }) => ReactNode
      ```

    - description

      - Render function called for each attachment. Receives the attachment.

### [AttachmentByIndex](#attachmentbyindex)

Renders a single attachment at a specific index.

`<ComposerPrimitive.AttachmentByIndex index={0} components={{ Attachment: MyAttachment }} />`

- rows

  - - name

      index

    - type

      ```
      number
      ```

  - - name

      components

    - type

      ```
      ComposerAttachmentsComponentConfig
      ```

### [AttachmentDropzone](#attachmentdropzone)

Drag-and-drop zone for file attachments. Sets `data-dragging` when a file is being dragged over it. Renders a `<div>` element unless `asChild` is set.

`<ComposerPrimitive.AttachmentDropzone className="rounded-xl border-2 border-dashed data-[dragging]:border-primary data-[dragging]:bg-primary/5"> <ComposerPrimitive.Root> ... </ComposerPrimitive.Root> </ComposerPrimitive.AttachmentDropzone>`

- rows

  - - name

      render

    - type

      ```
      ReactElement<unknown, string | React.JSXElementConstructo...
      ```

    - typeFull

      ```
      ReactElement<unknown, string | React.JSXElementConstructor<any>> | undefined
      ```

  - - name

      disabled

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

### [Dictate](#dictate)

Starts a dictation session. Renders a `<button>` element unless `asChild` is set.

`<ComposerPrimitive.Dictate className="rounded-md px-3 py-2 text-sm hover:bg-muted"> Start Dictation </ComposerPrimitive.Dictate>`

### [StopDictation](#stopdictation)

Stops the current dictation session. Renders a `<button>` element unless `asChild` is set.

`<ComposerPrimitive.StopDictation className="rounded-md px-3 py-2 text-sm hover:bg-muted"> Stop Dictation </ComposerPrimitive.StopDictation>`

### [DictationTranscript](#dictationtranscript)

Renders the interim transcript while dictation is active. Renders a `<span>` element unless `asChild` is set.

`<ComposerPrimitive.DictationTranscript className="text-sm text-muted-foreground" />`

### [If (deprecated)](#if-deprecated)

Deprecated. Use

- href

  /docs/api-reference/primitives/assistant-if

`AuiIf`

instead.

`// Before (deprecated) <ComposerPrimitive.If editing>...</ComposerPrimitive.If> <ComposerPrimitive.If dictation>...</ComposerPrimitive.If> // After <AuiIf condition={(s) => s.composer.isEditing}>...</AuiIf> <AuiIf condition={(s) => s.composer.dictation != null}>...</AuiIf>`

### [Quote](#quote)

Container for quoted text preview inside the composer. Only renders when a quote is set. Renders a `<div>` element unless `asChild` is set.

`<ComposerPrimitive.Quote className="rounded-lg border bg-background px-3 py-2 text-sm"> <ComposerPrimitive.QuoteText /> <ComposerPrimitive.QuoteDismiss className="ml-2" /> </ComposerPrimitive.Quote>`

### [QuoteText](#quotetext)

Renders the quoted text content. Renders a `<span>` element unless `asChild` is set.

`<ComposerPrimitive.QuoteText />`

### [QuoteDismiss](#quotedismiss)

Clears the active quote from the composer. Renders a `<button>` element unless `asChild` is set.

`<ComposerPrimitive.QuoteDismiss className="rounded-full p-1 hover:bg-muted"> Dismiss </ComposerPrimitive.QuoteDismiss>`

### [Unstable\_TriggerPopoverRoot](#unstable_triggerpopoverroot)

Root provider that groups one or more `TriggerPopover` declarations and owns the shared input plugin registry.

`<ComposerPrimitive.Unstable_TriggerPopoverRoot> <ComposerPrimitive.Root> <LexicalComposerInput placeholder="Type @ to mention, / for commands..." /> <ComposerPrimitive.Unstable_TriggerPopover char="@" adapter={mentionAdapter}> <ComposerPrimitive.Unstable_TriggerPopover.Directive formatter={formatter} /> ... </ComposerPrimitive.Unstable_TriggerPopover> </ComposerPrimitive.Root> </ComposerPrimitive.Unstable_TriggerPopoverRoot>`

### [Unstable\_TriggerPopover](#unstable_triggerpopover)

Declares a trigger (by `char`, `adapter`) and renders the popover container. Selection behavior is declared by rendering exactly one behavior sub-primitive inside — either `<Unstable_TriggerPopover.Directive>` (insert a directive on selection) or `<Unstable_TriggerPopover.Action>` (run `onExecute` on selection). Only renders its DOM (and children) while the trigger is active in the composer input.

`<ComposerPrimitive.Unstable_TriggerPopover char="@" adapter={mentionAdapter} className="rounded-lg border bg-popover p-1 shadow-md" > <ComposerPrimitive.Unstable_TriggerPopover.Directive formatter={formatter} /> <ComposerPrimitive.Unstable_TriggerPopoverCategories> {(categories) => categories.map((category) => ( <ComposerPrimitive.Unstable_TriggerPopoverCategoryItem key={category.id} categoryId={category.id} > {category.label} </ComposerPrimitive.Unstable_TriggerPopoverCategoryItem> ))} </ComposerPrimitive.Unstable_TriggerPopoverCategories> </ComposerPrimitive.Unstable_TriggerPopover>`

Behavior is supplied by exactly one of two sub-primitives:

- `<Unstable_TriggerPopover.Directive formatter={...} onInserted={...} />` — writes `:type[label]{name=id}` into the composer text (mention behavior)
- `<Unstable_TriggerPopover.Action onExecute={...} removeOnExecute={...} />` — runs a callback on selection; leaves a directive chip behind by default (slash-command behavior)

### [Unstable\_TriggerPopover.Directive](#unstable_triggerpopoverdirective)

Behavior sub-primitive. Registers the directive-insert behavior with its parent `TriggerPopover`. Renders nothing.

`<ComposerPrimitive.Unstable_TriggerPopover.Directive formatter={unstable_defaultDirectiveFormatter} onInserted={(item) => track("mention", item.id)} />`

### [Unstable\_TriggerPopover.Action](#unstable_triggerpopoveraction)

Behavior sub-primitive. Registers the action behavior with its parent `TriggerPopover`. Renders nothing. By default leaves a directive chip behind after executing (audit trail); pass `removeOnExecute` to strip the trigger text entirely.

`<ComposerPrimitive.Unstable_TriggerPopover.Action onExecute={(item) => commandHandlers[item.id]?.()} removeOnExecute={false} />`

### [Unstable\_TriggerPopoverCategories](#unstable_triggerpopovercategories)

Render-function primitive for the top-level category list. Only renders while no category is active and search mode is off.

`<ComposerPrimitive.Unstable_TriggerPopoverCategories> {(categories) => categories.map((category) => ( <ComposerPrimitive.Unstable_TriggerPopoverCategoryItem key={category.id} categoryId={category.id} > {category.label} </ComposerPrimitive.Unstable_TriggerPopoverCategoryItem> ))} </ComposerPrimitive.Unstable_TriggerPopoverCategories>`

### [Unstable\_TriggerPopoverCategoryItem](#unstable_triggerpopovercategoryitem)

Button that selects a category and drills into its items.

`<ComposerPrimitive.Unstable_TriggerPopoverCategoryItem categoryId="tools"> Tools </ComposerPrimitive.Unstable_TriggerPopoverCategoryItem>`

### [Unstable\_TriggerPopoverItems](#unstable_triggerpopoveritems)

Render-function primitive for the items inside the currently selected category (or global search results).

`<ComposerPrimitive.Unstable_TriggerPopoverItems> {(items) => items.map((item) => ( <ComposerPrimitive.Unstable_TriggerPopoverItem key={item.id} item={item} /> ))} </ComposerPrimitive.Unstable_TriggerPopoverItems>`

### [Unstable\_TriggerPopoverItem](#unstable_triggerpopoveritem)

Selectable item inside the popover.

`<ComposerPrimitive.Unstable_TriggerPopoverItem item={item}> {item.label} </ComposerPrimitive.Unstable_TriggerPopoverItem>`

### [Unstable\_TriggerPopoverBack](#unstable_triggerpopoverback)

Back button used when drilling from categories into a specific item list.

`<ComposerPrimitive.Unstable_TriggerPopoverBack className="rounded-md px-2 py-1 text-sm hover:bg-accent"> Back </ComposerPrimitive.Unstable_TriggerPopoverBack>`

## [Patterns](#patterns)

### [With Attachments](#with-attachments)

`<ComposerPrimitive.Root> <ComposerPrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") return <ImagePreview />; if (attachment.type === "document") return <DocumentPreview />; return <GenericPreview />; }} </ComposerPrimitive.Attachments> <ComposerPrimitive.Input placeholder="Ask anything..." /> <ComposerPrimitive.AddAttachment> Attach </ComposerPrimitive.AddAttachment> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

### [With Drag-and-Drop](#with-drag-and-drop)

Wrap your composer with `AttachmentDropzone` to support dragging files directly onto the input area:

`<ComposerPrimitive.AttachmentDropzone className="rounded-xl border-2 border-dashed data-[dragging]:border-primary data-[dragging]:bg-primary/5"> <ComposerPrimitive.Root> <ComposerPrimitive.Attachments> {() => <MyAttachment />} </ComposerPrimitive.Attachments> <ComposerPrimitive.Input placeholder="Drop files or type..." /> <ComposerPrimitive.AddAttachment>Attach</ComposerPrimitive.AddAttachment> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root> </ComposerPrimitive.AttachmentDropzone>`

The dropzone sets `data-dragging` when a file is being dragged over it, so you can style the active state with CSS.

### [With Voice Input](#with-voice-input)

`<ComposerPrimitive.Root> <ComposerPrimitive.Input placeholder="Ask or speak..." /> <AuiIf condition={(s) => s.composer.dictation != null}> <ComposerPrimitive.DictationTranscript className="text-sm text-muted-foreground" /> </AuiIf> <AuiIf condition={(s) => s.composer.dictation == null}> <ComposerPrimitive.Dictate>Mic</ComposerPrimitive.Dictate> </AuiIf> <AuiIf condition={(s) => s.composer.dictation != null}> <ComposerPrimitive.StopDictation>Stop</ComposerPrimitive.StopDictation> </AuiIf> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

`DictationTranscript` renders a `<span>` showing the interim speech-to-text transcript while the user is speaking.

Voice input requires a `DictationAdapter` configured in your runtime. See

- href

  /docs/guides/dictation

Dictation

for setup.

### [Custom Submit Behavior](#custom-submit-behavior)

Use `onSubmit` on `Root` to intercept submission:

`<ComposerPrimitive.Root onSubmit={(e) => { // Runs before the message is sent // e.g., track analytics, transform input // Call e.preventDefault() to cancel the send }} > <ComposerPrimitive.Input /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

### [Gate Sending on External State](#gate-sending-on-external-state)

Sometimes you want users to type while sending is temporarily blocked, for example while tool configuration, auth, or the first model context is still loading. Disabling the entire thread via `isDisabled` works but also disables the text input, which feels broken.

Use `isSendDisabled` on the runtime adapter to keep the input usable while blocking send:

`const runtime = useExternalStoreRuntime({ isSendDisabled: !toolsLoaded, onNew, messages, // ... });`

When `isSendDisabled` is `true`:

- `composer.canSend` becomes `false`
- `<ComposerPrimitive.Send>` is disabled
- Enter and the `Cmd/Ctrl+Shift+Enter` steer hotkey become no-ops
- `aui.composer().send()` short-circuits at the runtime, so direct calls cannot escape the gate

Read the same flag from React with `<AuiIf>` to render hints alongside the input:

`<ComposerPrimitive.Root> <ComposerPrimitive.Input placeholder="Ask anything..." /> <AuiIf condition={(s) => !s.composer.canSend}> <p className="text-sm text-muted-foreground">Loading tools, hang on...</p> </AuiIf> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

`canSend` reflects the composer's own willingness to send (editing mode, non-empty content, `isSendDisabled` not set). Cross-thread gating like an in-flight run without queue support is layered on top by `<ComposerPrimitive.Send>` automatically.

`isSendDisabled` only gates the thread composer. Saving an in-progress message edit is unaffected, since it is a per-message action rather than a new send.

For the difference between `isDisabled` and `isSendDisabled`, see the

- href

  /docs/runtimes/custom/external-store

external store adapter reference

.

### [Ctrl+Enter to Submit](#ctrlenter-to-submit)

`<ComposerPrimitive.Root> <ComposerPrimitive.Input submitMode="ctrlEnter" /> <ComposerPrimitive.Send>Send</ComposerPrimitive.Send> </ComposerPrimitive.Root>`

With `submitMode="ctrlEnter"`, plain Enter inserts a newline and Ctrl/Cmd+Enter submits.

### [Floating Composer](#floating-composer)

Primitives aren't bound to any layout. Here's how the floating composer on this docs site is built, using the same `ComposerPrimitive.Root` and `ComposerPrimitive.Input` positioned with CSS:

`import { ComposerPrimitive } from "@assistant-ui/react"; function FloatingComposer() { return ( <div className="fixed bottom-6 left-1/2 z-40 w-full max-w-md -translate-x-1/2"> <ComposerPrimitive.Root> <div className="rounded-xl border bg-background/80 shadow-lg backdrop-blur-sm"> <ComposerPrimitive.Input asChild unstable_focusOnRunStart={false} unstable_focusOnScrollToBottom={false} > <textarea placeholder="Ask a question..." className="w-full resize-none bg-transparent px-3 py-2.5 text-sm focus:outline-none" rows={1} /> </ComposerPrimitive.Input> </div> </ComposerPrimitive.Root> </div> ); }`

The primitive handles everything about composing a message. The layout, animation, and visibility logic is all yours.

## [Relationship to Components](#relationship-to-components)

The

- href

  /docs/ui/thread

Thread

component includes a full composer built from these primitives. If you need a working chat UI fast, start there. When you need a composer that doesn't fit inside a thread, such as a floating input, a sidebar composer, or a multi-step form, reach for `ComposerPrimitive` directly.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/composer

ComposerPrimitive API Reference

.

Related:

- - href

    /docs/primitives/thread

  ThreadPrimitive

- - href

    /docs/primitives/attachment

  AttachmentPrimitive