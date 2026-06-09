# ActionBar
URL: /docs/primitives/action-bar

Build message action buttons with auto-hide, copy state, and intelligent disabling.

The ActionBar primitive provides message actions: copy, reload, edit, feedback, speech, and export. It handles intelligent visibility with auto-hide on hover, automatic disabling based on message state, and floating behavior. You compose the buttons; the primitive handles action state and availability.

- items

  - Preview
  - Code

`import { ActionBarPrimitive, MessagePrimitive, } from "@assistant-ui/react"; import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react"; function AssistantMessage() { return ( <MessagePrimitive.Root className="group flex flex-col items-start gap-1"> <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm"> <MessagePrimitive.Parts /> </div> <ActionBarPrimitive.Root hideWhenRunning autohide="not-last" autohideFloat="always" className="flex gap-0.5 data-[floating]:opacity-0 data-[floating]:group-hover:opacity-100 data-[floating]:transition-opacity" > <ActionBarPrimitive.Copy className="group/copy flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"> <CopyIcon className="size-4 group-data-[copied]/copy:hidden" /> <CheckIcon className="hidden size-4 group-data-[copied]/copy:block" /> </ActionBarPrimitive.Copy> <ActionBarPrimitive.Reload className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"> <RefreshCwIcon className="size-4" /> </ActionBarPrimitive.Reload> </ActionBarPrimitive.Root> </MessagePrimitive.Root> ); }`

## [Quick Start](#quick-start)

A minimal action bar with copy and reload:

`import { ActionBarPrimitive } from "@assistant-ui/react"; <ActionBarPrimitive.Root> <ActionBarPrimitive.Copy>Copy</ActionBarPrimitive.Copy> <ActionBarPrimitive.Reload>Reload</ActionBarPrimitive.Reload> </ActionBarPrimitive.Root>`

`Root` renders a `<div>`, action buttons render `<button>` elements. Each button auto-disables when its action isn't available (e.g., Copy is disabled when there's no content, Reload is disabled while the model is running).

ActionBar must be placed inside a `MessagePrimitive.Root` because it reads message state from the nearest message context.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

## [Core Concepts](#core-concepts)

### [Auto-Hide & Floating](#auto-hide--floating)

The `autohide` prop controls when the action bar is visible:

- **`"never"`** (default): always visible
- **`"not-last"`**: hidden on all messages except the last, shown on hover
- **`"always"`**: hidden on all messages, shown on hover

When `autohideFloat` is set, hidden action bars get the `data-floating` attribute instead of being removed from the DOM. This lets you animate them with CSS:

`<ActionBarPrimitive.Root autohide="not-last" autohideFloat="always" className="data-[floating]:opacity-0 data-[floating]:group-hover:opacity-100 data-[floating]:transition-opacity" > {/* buttons */} </ActionBarPrimitive.Root>`

The `"single-branch"` option for `autohideFloat` only floats when the message has a single branch (no alternatives).

### [Automatic Disabling](#automatic-disabling)

Action buttons automatically disable based on state, with no manual wiring needed:

- **Copy**: disabled when there's no copyable text content or an assistant message is still running
- **Reload**: disabled when the thread is running or the message role isn't assistant
- **Edit**: disabled when the message is already being edited
- **Speak**: disabled when there's no speakable text or an assistant message is still running

### [Copy State](#copy-state)

After clicking Copy, the button gets a `data-copied` attribute for a configurable duration (default 3 seconds). Use this for visual feedback:

`<ActionBarPrimitive.Copy copiedDuration={2000} className="group"> <CopyIcon className="group-data-[copied]:hidden" /> <CheckIcon className="hidden group-data-[copied]:block" /> </ActionBarPrimitive.Copy>`

### [Feedback Buttons](#feedback-buttons)

Feedback buttons track submission state with `data-submitted`:

`<ActionBarPrimitive.FeedbackPositive className="data-[submitted]:text-green-500"> 👍 </ActionBarPrimitive.FeedbackPositive> <ActionBarPrimitive.FeedbackNegative className="data-[submitted]:text-red-500"> 👎 </ActionBarPrimitive.FeedbackNegative>`

## [Parts](#parts)

### [Root](#root)

Container with auto-hide and floating behavior. Renders a `<div>` element unless `asChild` is set.

`<ActionBarPrimitive.Root hideWhenRunning autohide="not-last" autohideFloat="always" className="flex gap-1" > <ActionBarPrimitive.Copy>Copy</ActionBarPrimitive.Copy> <ActionBarPrimitive.Reload>Reload</ActionBarPrimitive.Reload> </ActionBarPrimitive.Root>`

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

  - - name

      hideWhenRunning

    - type

      ```
      boolean
      ```

    - typeFull

      ```
      boolean | undefined
      ```

    - description

      - Whether to hide the action bar when the thread is running.

    - default

      ```
      false
      ```

  - - name

      autohide

    - type

      ```
      "always" | "not-last" | "never"
      ```

    - typeFull

      ```
      "always" | "not-last" | "never" | undefined
      ```

    - description

      - Controls when the action bar should automatically hide.\
        \- "always": Always hide unless hovered\
        \- "not-last": Hide unless this is the last message\
        \- "never": Never auto-hide

    - default

      ```
      "never"
      ```

  - - name

      autohideFloat

    - type

      ```
      "always" | "never" | "single-branch"
      ```

    - typeFull

      ```
      "always" | "never" | "single-branch" | undefined
      ```

    - description

      - Controls floating behavior when auto-hidden.\
        \- "always": Always float when hidden\
        \- "single-branch": Float only for single-branch messages\
        \- "never": Never float

    - default

      ```
      "never"
      ```

### [Copy](#copy)

Copies message text to clipboard. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.Copy copiedDuration={2000} className="group"> <CopyIcon className="group-data-[copied]:hidden" /> <CheckIcon className="hidden group-data-[copied]:block" /> </ActionBarPrimitive.Copy>`

- rows

  - - name

      copiedDuration

    - type

      ```
      number
      ```

### [Reload](#reload)

Reloads or regenerates the current assistant message. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.Reload className="rounded-md px-2 py-1 text-sm hover:bg-muted"> Regenerate </ActionBarPrimitive.Reload>`

### [Edit](#edit)

Enters edit mode for the current message. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.Edit className="rounded-md px-2 py-1 text-sm hover:bg-muted"> Edit </ActionBarPrimitive.Edit>`

### [Speak](#speak)

Starts speech playback for the current message. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.Speak className="rounded-md px-2 py-1 text-sm hover:bg-muted"> Play </ActionBarPrimitive.Speak>`

### [StopSpeaking](#stopspeaking)

Stops speech playback for the current message. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.StopSpeaking className="rounded-md px-2 py-1 text-sm hover:bg-muted"> Stop </ActionBarPrimitive.StopSpeaking>`

### [FeedbackPositive](#feedbackpositive)

Submits positive feedback for the current message. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.FeedbackPositive className="rounded-md px-2 py-1 text-sm hover:bg-muted"> Helpful </ActionBarPrimitive.FeedbackPositive>`

### [FeedbackNegative](#feedbacknegative)

Submits negative feedback for the current message. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.FeedbackNegative className="rounded-md px-2 py-1 text-sm hover:bg-muted"> Not helpful </ActionBarPrimitive.FeedbackNegative>`

### [ExportMarkdown](#exportmarkdown)

Downloads message as Markdown or calls custom handler. Renders a `<button>` element unless `asChild` is set.

`<ActionBarPrimitive.ExportMarkdown onExport={async (content) => { await navigator.clipboard.writeText(content); }} > Export </ActionBarPrimitive.ExportMarkdown>`

- rows

  - - name

      filename

    - type

      ```
      string
      ```

  - - name

      onExport

    - type

      ```
      ((content: string) => void | Promise<void>)
      ```

## [Patterns](#patterns)

### [Assistant Action Bar](#assistant-action-bar)

`<ActionBarPrimitive.Root hideWhenRunning autohide="not-last" autohideFloat="single-branch" > <ActionBarPrimitive.Copy>Copy</ActionBarPrimitive.Copy> <ActionBarPrimitive.Reload>Regenerate</ActionBarPrimitive.Reload> <ActionBarPrimitive.ExportMarkdown>Export</ActionBarPrimitive.ExportMarkdown> </ActionBarPrimitive.Root>`

### [User Action Bar](#user-action-bar)

`<ActionBarPrimitive.Root hideWhenRunning autohide="not-last"> <ActionBarPrimitive.Edit>Edit</ActionBarPrimitive.Edit> </ActionBarPrimitive.Root>`

### [Speech Toggle](#speech-toggle)

`<AuiIf condition={(s) => !s.message.isSpeaking}> <ActionBarPrimitive.Speak>Play</ActionBarPrimitive.Speak> </AuiIf> <AuiIf condition={(s) => s.message.isSpeaking}> <ActionBarPrimitive.StopSpeaking>Stop</ActionBarPrimitive.StopSpeaking> </AuiIf>`

Speech requires a `SpeechSynthesisAdapter` configured in your runtime. See

- href

  /docs/guides/speech

Speech & Dictation

for setup.

### [Export with Custom Handler](#export-with-custom-handler)

`<ActionBarPrimitive.ExportMarkdown onExport={async (content) => { await navigator.clipboard.writeText(content); toast("Copied as Markdown!"); }} > Copy Markdown </ActionBarPrimitive.ExportMarkdown>`

## [Overflow Menu (ActionBarMorePrimitive)](#overflow-menu-actionbarmoreprimitive)

`ActionBarMorePrimitive` is a Radix DropdownMenu for overflow actions, using the same pattern as `ThreadListItemMorePrimitive`. Use it to group secondary actions behind a "more" button.

`ActionBarMorePrimitive.Item` maps to Radix `DropdownMenu.Item`, so it preserves menu keyboard/focus semantics. Prefer `asChild` when composing an `ActionBarPrimitive` button into a menu item.

`ActionBarMorePrimitive.Content` defaults to `sideOffset={4}` so the menu has a small gap from the trigger.

| Part        | Element          | Purpose                        |
| ----------- | ---------------- | ------------------------------ |
| `Root`      | N/A              | Radix DropdownMenu provider    |
| `Trigger`   | `<button>`       | Opens the dropdown             |
| `Content`   | `<div>` (portal) | The dropdown panel             |
| `Item`      | `<div>`          | A menu item                    |
| `Separator` | `<div>`          | Visual separator between items |

`import { ActionBarPrimitive, ActionBarMorePrimitive, } from "@assistant-ui/react"; import { MoreHorizontalIcon } from "lucide-react"; <ActionBarPrimitive.Root> <ActionBarPrimitive.Copy>Copy</ActionBarPrimitive.Copy> <ActionBarPrimitive.Reload>Regenerate</ActionBarPrimitive.Reload> <ActionBarMorePrimitive.Root> <ActionBarMorePrimitive.Trigger className="flex size-8 items-center justify-center rounded-lg hover:bg-muted"> <MoreHorizontalIcon className="size-4" /> </ActionBarMorePrimitive.Trigger> <ActionBarMorePrimitive.Content side="bottom" align="end"> <ActionBarMorePrimitive.Item asChild> <ActionBarPrimitive.ExportMarkdown> Export Markdown </ActionBarPrimitive.ExportMarkdown> </ActionBarMorePrimitive.Item> <ActionBarMorePrimitive.Separator /> <ActionBarMorePrimitive.Item asChild> <ActionBarPrimitive.FeedbackPositive> Helpful </ActionBarPrimitive.FeedbackPositive> </ActionBarMorePrimitive.Item> </ActionBarMorePrimitive.Content> </ActionBarMorePrimitive.Root> </ActionBarPrimitive.Root>`

See the

- href

  /docs/api-reference/primitives/action-bar-more

ActionBarMorePrimitive API Reference

for full prop details.

## [Relationship to Components](#relationship-to-components)

The shadcn

- href

  /docs/ui/thread

Thread

component uses `ActionBarPrimitive` inside its `AssistantMessage` (with Copy, Reload, and an export dropdown) and `UserMessage` (with Edit). If those defaults work, use the component. Reach for `ActionBarPrimitive` directly when you need different actions, custom layout, or actions outside the standard thread UI.

ActionBar is commonly paired with

- href

  /docs/primitives/branch-picker

BranchPicker

for navigating between alternative responses on assistant messages.

## [API Reference](#api-reference)

For full prop details on every part, see the

- href

  /docs/api-reference/primitives/action-bar

ActionBarPrimitive API Reference

.

Related:

- - href

    /docs/api-reference/primitives/action-bar-more

  ActionBarMorePrimitive API Reference