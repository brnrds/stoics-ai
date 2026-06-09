# Primitives
URL: /docs/ink/primitives

Composable terminal components for building chat UIs with Ink.

Primitives are thin wrappers around Ink components (`Box`, `Text`, `TextInput`) that integrate with the assistant-ui runtime. They accept all standard Ink props and add runtime-aware behavior.

Primitives use namespace imports, the same pattern as the web package (e.g. `ThreadPrimitive.Root`, `ComposerPrimitive.Input`).

Many primitives share their core logic with `@assistant-ui/react` via `@assistant-ui/core/react` — only the UI layer (Ink vs DOM) differs.

## [Thread](#thread)

`import { ThreadPrimitive } from "@assistant-ui/react-ink";`

### [Root](#root)

Container `Box` for the thread area.

`<ThreadPrimitive.Root> {children} </ThreadPrimitive.Root>`

| Prop      | Type       | Description            |
| --------- | ---------- | ---------------------- |
| `...rest` | `BoxProps` | Standard Ink Box props |

### [Messages](#messages)

Renders the message list with automatic runtime integration. Each message is wrapped in a scoped context so that `useAuiState((s) => s.message)` works inside the message component.

`<ThreadPrimitive.Messages> {() => <MyMessage />} </ThreadPrimitive.Messages>`

| Prop         | Type                | Description                                                                                                  |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `components` | `MessageComponents` | Component map with `Message`, `UserMessage`, `AssistantMessage`, `SystemMessage`, and edit composer variants |

### [AuiIf](#auiif)

Conditional rendering based on assistant state. Replaces the deprecated `ThreadPrimitive.Empty`, `ThreadPrimitive.If`, `MessagePrimitive.If`, and `ComposerPrimitive.If`.

`import { AuiIf } from "@assistant-ui/react-ink"; <AuiIf condition={(s) => s.thread.isEmpty}> <Text dimColor>Send a message to get started</Text> </AuiIf> <AuiIf condition={(s) => s.thread.isRunning}> <Text color="yellow">Generating...</Text> </AuiIf>`

| Prop        | Type                 | Description                                            |
| ----------- | -------------------- | ------------------------------------------------------ |
| `condition` | `(state) => boolean` | Selector that determines whether children are rendered |

### [Empty (deprecated)](#empty-deprecated)

Deprecated. Use `AuiIf` with `condition={(s) => s.thread.isEmpty}` instead.

Renders children only when the thread has no messages.

`<ThreadPrimitive.Empty> <Text dimColor>Send a message to get started</Text> </ThreadPrimitive.Empty>`

### [If (deprecated)](#if-deprecated)

Deprecated. Use `AuiIf` instead.

Conditional rendering based on thread state.

`<ThreadPrimitive.If empty> <Text>No messages yet</Text> </ThreadPrimitive.If> <ThreadPrimitive.If running> <Text color="yellow">Generating...</Text> </ThreadPrimitive.If>`

| Prop      | Type      | Description                   |
| --------- | --------- | ----------------------------- |
| `empty`   | `boolean` | Render when thread is empty   |
| `running` | `boolean` | Render when thread is running |

### [MessageByIndex](#messagebyindex)

Low-level provider that sets up the message context for a specific message by index. Used internally by `ThreadPrimitive.Messages`.

`<ThreadPrimitive.MessageByIndex index={0}> {/* content rendered with message context */} </ThreadPrimitive.MessageByIndex>`

| Prop    | Type     | Description              |
| ------- | -------- | ------------------------ |
| `index` | `number` | Zero-based message index |

### [Suggestions](#suggestions)

Renders all thread suggestions using a provided component. Each suggestion is wrapped in a `SuggestionByIndexProvider` context.

`<ThreadPrimitive.Suggestions> {() => <MySuggestion />} </ThreadPrimitive.Suggestions>`

| Prop       | Type                 | Description                         |
| ---------- | -------------------- | ----------------------------------- |
| `children` | `() => ReactElement` | Render function for each suggestion |

### [SuggestionByIndex](#suggestionbyindex)

Low-level provider that sets up the suggestion context for a specific suggestion by index. Used internally by `ThreadPrimitive.Suggestions`.

`<ThreadPrimitive.SuggestionByIndex index={0}> <SuggestionPrimitive.Title /> </ThreadPrimitive.SuggestionByIndex>`

| Prop    | Type     | Description                 |
| ------- | -------- | --------------------------- |
| `index` | `number` | Zero-based suggestion index |

### [Suggestion](#suggestion)

Renders a suggestion button. Uses Ink `Box` + `Text`.

`<ThreadPrimitive.Suggestion prompt="What is the weather?" send />`

| Prop            | Type      | Description                                                      |
| --------------- | --------- | ---------------------------------------------------------------- |
| `prompt`        | `string`  | The suggestion text                                              |
| `send`          | `boolean` | When true, automatically sends the message                       |
| `clearComposer` | `boolean` | When true (default), replaces composer text; when false, appends |

## [Composer](#composer)

`import { ComposerPrimitive } from "@assistant-ui/react-ink";`

### [Root](#root-1)

Container `Box` for the composer area.

`<ComposerPrimitive.Root> {children} </ComposerPrimitive.Root>`

### [Input](#input)

Terminal line editor wired to the composer runtime. Value is managed automatically and supports cursor-aware editing.

`<ComposerPrimitive.Input submitOnEnter multiLine placeholder="Type a message..." autoFocus />`

| Prop            | Type                     | Description                                                                |
| --------------- | ------------------------ | -------------------------------------------------------------------------- |
| `submitOnEnter` | `boolean`                | Whether Enter sends the message (default: `false`)                         |
| `placeholder`   | `string`                 | Placeholder text when empty                                                |
| `autoFocus`     | `boolean`                | Auto-focus on mount                                                        |
| `multiLine`     | `boolean`                | When true, Enter inserts a newline unless `submitOnEnter` is enabled       |
| `onSubmit`      | `(text: string) => void` | Overrides the default send behavior and receives the current composer text |

Supported keyboard bindings:

| Key                    | Action                                                                                           | Context                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `Left` / `Right`       | Move cursor by one grapheme                                                                      | Always                                                        |
| `Backspace` / `Delete` | Remove the grapheme before / after the cursor                                                    | Always                                                        |
| `Home` / `End`         | Jump to buffer or line boundary                                                                  | Buffer in single-line, line in multi-line                     |
| `Up` / `Down`          | Move between lines, preserving column when possible                                              | Multi-line only                                               |
| `Ctrl+A` / `Ctrl+E`    | Move to line start / end                                                                         | Always                                                        |
| `Ctrl+W`               | Kill the word before the cursor                                                                  | Always                                                        |
| `Ctrl+D`               | Delete the grapheme after the cursor                                                             | Always                                                        |
| `Ctrl+U` / `Ctrl+K`    | Kill from cursor to line start / end; in multi-line, `Ctrl+K` at end-of-line joins the next line | Always                                                        |
| `Ctrl+J`               | Insert a newline                                                                                 | Multi-line only; swallowed in single-line so it never submits |
| `Alt+B` / `Alt+F`      | Move by word backward / forward                                                                  | Terminals that emit meta-key sequences                        |
| `Alt+D`                | Kill the word after the cursor                                                                   | Terminals that emit meta-key sequences                        |
| `Shift+Enter`          | Insert a newline                                                                                 | Multi-line submit mode, terminals that distinguish it         |

Word boundaries and grapheme stepping use `Intl.Segmenter`, so emoji, accented letters, skin-tone modifiers, ZWJ sequences, and CJK ideographs each move and delete as a single character.

Some bindings depend on terminal capabilities. iTerm2, Windows Terminal, and most Linux terminals emit `Alt`-letter combinations as `Esc`-prefixed sequences that Ink decodes as meta-key input; macOS Terminal.app requires enabling "Use Option as Meta key" in its preferences before `Alt+B` / `Alt+F` / `Alt+D` work as expected. `Shift+Enter` requires a terminal that supports the CSI-u protocol (iTerm2 3.4+, kitty, foot, and similar) — terminals that conflate it with `Enter` will fall back to the `submitOnEnter` behaviour.

Example with custom submit handling:

`<ComposerPrimitive.Input multiLine submitOnEnter onSubmit={(text) => { console.log("submit", text); }} />`

### [Send](#send)

`Box` that triggers sending the current message. Typically used with a button-like UI.

`<ComposerPrimitive.Send> <Text color="green">[Send]</Text> </ComposerPrimitive.Send>`

### [Cancel](#cancel)

`Box` that cancels the current run.

`<ComposerPrimitive.Cancel> <Text color="red">[Stop]</Text> </ComposerPrimitive.Cancel>`

### [Attachments](#attachments)

Renders composer attachments using the provided component configuration.

`<ComposerPrimitive.Attachments> {() => <MyAttachment />} </ComposerPrimitive.Attachments>`

| Prop         | Type                                        | Description                            |
| ------------ | ------------------------------------------- | -------------------------------------- |
| `components` | `{ Image?, Document?, File?, Attachment? }` | Component renderers by attachment type |

### [AddAttachment](#addattachment)

Triggers attachment addition.

`<ComposerPrimitive.AddAttachment> <Text>[Attach]</Text> </ComposerPrimitive.AddAttachment>`

### [Quote](#quote)

Renders the active composer quote preview. Children are only rendered while `s.composer.quote` is set, so this acts as both a container and a gate.

`<ComposerPrimitive.Quote> <Box> <Text dimColor>Quoting:</Text> <ComposerPrimitive.QuoteText color="gray" /> <ComposerPrimitive.QuoteDismiss> <Text color="red">[x]</Text> </ComposerPrimitive.QuoteDismiss> </Box> </ComposerPrimitive.Quote>`

| Prop       | Type        | Description                                              |
| ---------- | ----------- | -------------------------------------------------------- |
| `children` | `ReactNode` | Quote preview content; only rendered when a quote is set |
| `...rest`  | `BoxProps`  | Standard Ink Box props                                   |

### [QuoteText](#quotetext)

Renders the quoted text from `s.composer.quote?.text`. Pass `children` to override the displayed value.

`<ComposerPrimitive.QuoteText color="gray" />`

| Prop       | Type        | Description                                            |
| ---------- | ----------- | ------------------------------------------------------ |
| `children` | `ReactNode` | Override content; defaults to `s.composer.quote?.text` |
| `...rest`  | `TextProps` | Standard Ink Text props                                |

### [QuoteDismiss](#quotedismiss)

Pressable that clears the active quote by calling `aui.composer().setQuote(undefined)`.

`<ComposerPrimitive.QuoteDismiss> <Text color="red">[x]</Text> </ComposerPrimitive.QuoteDismiss>`

| Prop       | Type        | Description                        |
| ---------- | ----------- | ---------------------------------- |
| `children` | `ReactNode` | Button content                     |
| `disabled` | `boolean`   | Disable Enter activation and focus |
| `...rest`  | `BoxProps`  | Standard Ink Box props             |

### [Conditional Rendering (Composer)](#conditional-rendering-composer)

Use `AuiIf` for conditional rendering based on composer state:

`<AuiIf condition={(s) => s.composer.isEditing}> <Text>Currently editing</Text> </AuiIf>`

### [AttachmentByIndex](#attachmentbyindex)

Low-level provider that sets up the attachment context for a specific attachment by index. Used internally by `ComposerPrimitive.Attachments`.

`<ComposerPrimitive.AttachmentByIndex index={0}> <AttachmentPrimitive.Name /> </ComposerPrimitive.AttachmentByIndex>`

| Prop    | Type     | Description                 |
| ------- | -------- | --------------------------- |
| `index` | `number` | Zero-based attachment index |

### [If (deprecated)](#if-deprecated-1)

Deprecated. Use `AuiIf` instead.

Conditional rendering based on composer state. Shared from `@assistant-ui/core/react`.

`<ComposerPrimitive.If editing> <Text>Currently editing</Text> </ComposerPrimitive.If> <ComposerPrimitive.If dictation> <Text>Dictating...</Text> </ComposerPrimitive.If>`

| Prop        | Type      | Description                               |
| ----------- | --------- | ----------------------------------------- |
| `editing`   | `boolean` | Render when composer is in editing mode   |
| `dictation` | `boolean` | Render when dictation is currently active |

## [Message](#message)

`import { MessagePrimitive } from "@assistant-ui/react-ink";`

### [Root](#root-2)

Container `Box` for a single message.

`<MessagePrimitive.Root> {children} </MessagePrimitive.Root>`

### [Parts](#parts)

Renders message content parts via a `components` prop. Tool call and data parts automatically render registered tool UIs (via `useAssistantTool` / `useAssistantDataUI`), falling back to components provided here. A default `Text` component using Ink's `<Text>` is provided out of the box.

`<MessagePrimitive.Parts> {({ part }) => { if (part.type === "text") return <Text>{part.text}</Text>; if (part.type === "tool-call") return <Text dimColor>[Tool: {part.toolName}]</Text>; return null; }} </MessagePrimitive.Parts>`

### [Content (deprecated)](#content-deprecated)

Deprecated. Use `MessagePrimitive.Parts` instead. See the

- href

  /docs/migrations/v0-11

v0.11 migration guide

for details.

Renders message content parts using render props. Tool call and data parts automatically render registered tool UIs (via `useAssistantTool` / `useAssistantDataUI`), falling back to render props if provided.

`<MessagePrimitive.Content renderText={({ part }) => <Text>{part.text}</Text>} renderToolCall={({ part }) => <Text dimColor>[Tool: {part.toolName}]</Text>} />`

| Prop              | Type                                       | Description             |
| ----------------- | ------------------------------------------ | ----------------------- |
| `renderText`      | `(props: { part; index }) => ReactElement` | Text part renderer      |
| `renderToolCall`  | `(props: { part; index }) => ReactElement` | Tool call fallback      |
| `renderImage`     | `(props: { part; index }) => ReactElement` | Image part renderer     |
| `renderReasoning` | `(props: { part; index }) => ReactElement` | Reasoning part renderer |
| `renderSource`    | `(props: { part; index }) => ReactElement` | Source part renderer    |
| `renderFile`      | `(props: { part; index }) => ReactElement` | File part renderer      |
| `renderData`      | `(props: { part; index }) => ReactElement` | Data part fallback      |

### [PartByIndex](#partbyindex)

Low-level provider that sets up the part context for a specific message part by index. Used internally by `MessagePrimitive.Parts`.

`<MessagePrimitive.PartByIndex index={0}> {/* content rendered with part context */} </MessagePrimitive.PartByIndex>`

| Prop    | Type     | Description           |
| ------- | -------- | --------------------- |
| `index` | `number` | Zero-based part index |

### [AttachmentByIndex](#attachmentbyindex-1)

Low-level provider that sets up the attachment context for a specific message attachment by index. Used internally by `MessagePrimitive.Attachments`.

`<MessagePrimitive.AttachmentByIndex index={0}> <AttachmentPrimitive.Name /> </MessagePrimitive.AttachmentByIndex>`

| Prop    | Type     | Description                 |
| ------- | -------- | --------------------------- |
| `index` | `number` | Zero-based attachment index |

### [Conditional Rendering (Message)](#conditional-rendering-message)

Use `AuiIf` for conditional rendering based on message properties:

`<AuiIf condition={(s) => s.message.role === "user"}> <Text bold color="green">You:</Text> </AuiIf> <AuiIf condition={(s) => s.message.role === "assistant" && s.message.isLast}> <Text color="yellow">Thinking...</Text> </AuiIf>`

### [If (deprecated)](#if-deprecated-2)

Deprecated. Use `AuiIf` instead.

Conditional rendering based on message properties.

`<MessagePrimitive.If user> <Text bold color="green">You:</Text> </MessagePrimitive.If> <MessagePrimitive.If assistant last> <Text color="yellow">Thinking...</Text> </MessagePrimitive.If>`

| Prop        | Type      | Description                            |
| ----------- | --------- | -------------------------------------- |
| `user`      | `boolean` | Render for user messages               |
| `assistant` | `boolean` | Render for assistant messages          |
| `running`   | `boolean` | Render when message is being generated |
| `last`      | `boolean` | Render for the last message            |

### [Attachments](#attachments-1)

Renders user message attachments using the provided component configuration.

`<MessagePrimitive.Attachments> {() => <Text>[attachment]</Text>} </MessagePrimitive.Attachments>`

| Prop         | Type                                        | Description                            |
| ------------ | ------------------------------------------- | -------------------------------------- |
| `components` | `{ Image?, Document?, File?, Attachment? }` | Component renderers by attachment type |

## [Attachment](#attachment)

`import { AttachmentPrimitive } from "@assistant-ui/react-ink";`

Primitives for rendering individual attachments. Each primitive reads from the current attachment context (provided by `ComposerPrimitive.Attachments`, `ComposerPrimitive.AttachmentByIndex`, `MessagePrimitive.Attachments`, or `MessagePrimitive.AttachmentByIndex`).

### [Root](#root-3)

Container `Box` for an attachment. Forwards all `Box` props.

| Prop       | Type                         | Description                           |
| ---------- | ---------------------------- | ------------------------------------- |
| `children` | `ReactNode`                  | Attachment sub-components             |
| `...rest`  | `ComponentProps<typeof Box>` | Forwarded to the underlying Ink `Box` |

### [Name](#name)

`Text` component displaying `s.attachment.name`.

| Prop      | Type                          | Description                            |
| --------- | ----------------------------- | -------------------------------------- |
| `...rest` | `ComponentProps<typeof Text>` | Forwarded to the underlying Ink `Text` |

### [Thumb](#thumb)

`Text` component displaying a short identifier for the attachment. Renders the file extension (`.pdf`, `.png`, …) when the name has one. Falls back to the attachment `type` (e.g. `image`, `document`) otherwise, and finally to `file`.

| Prop      | Type                          | Description                            |
| --------- | ----------------------------- | -------------------------------------- |
| `...rest` | `ComponentProps<typeof Text>` | Forwarded to the underlying Ink `Text` |

### [Status](#status)

`Text` component rendering the current attachment status from `s.attachment.status`. Uses the same visual vocabulary as `ToolFallback`: spinner = uploading, `?` = pending action, `x` = error, `||` = paused. By default, completed attachments render nothing.

| Prop           | Type                                            | Description                                                                                                                                                            |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showComplete` | `boolean`                                       | When `true`, completed attachments render `+ ready` instead of `null`                                                                                                  |
| `...rest`      | `Omit<ComponentProps<typeof Text>, "children">` | Forwarded to the underlying Ink `Text`. Caller-supplied `color` overrides the per-status default. `children` is not accepted; `Status` always renders its own content. |

### [Remove](#remove)

`Pressable` that calls `aui.attachment().remove()` when activated (Enter while focused). Disabled when not focused or when the `disabled` prop is set.

| Prop       | Type                         | Description                                   |
| ---------- | ---------------------------- | --------------------------------------------- |
| `children` | `ReactNode`                  | Visual content for the button                 |
| `disabled` | `boolean`                    | Skip focus registration and ignore Enter      |
| `...rest`  | `ComponentProps<typeof Box>` | Forwarded to the underlying Pressable's `Box` |

`<AttachmentPrimitive.Root> <AttachmentPrimitive.Thumb /> <AttachmentPrimitive.Name /> <AttachmentPrimitive.Status /> <AttachmentPrimitive.Remove> <Text color="red">[x]</Text> </AttachmentPrimitive.Remove> </AttachmentPrimitive.Root>`

## [ActionBar](#actionbar)

`import { ActionBarPrimitive } from "@assistant-ui/react-ink";`

### [Copy](#copy)

Pressable that copies the message content. Supports function-as-children for copy state feedback.

`<ActionBarPrimitive.Copy copiedDuration={3000}> {({ isCopied }) => <Text>{isCopied ? "[Copied!]" : "[Copy]"}</Text>} </ActionBarPrimitive.Copy>`

| Prop              | Type                     | Description                                           |
| ----------------- | ------------------------ | ----------------------------------------------------- |
| `copiedDuration`  | `number`                 | Duration in ms to show "copied" state (default: 3000) |
| `copyToClipboard` | `(text: string) => void` | Custom clipboard function                             |

### [Edit](#edit)

Pressable that enters edit mode for a message.

`<ActionBarPrimitive.Edit> <Text>[Edit]</Text> </ActionBarPrimitive.Edit>`

### [Reload](#reload)

Pressable that regenerates an assistant message.

`<ActionBarPrimitive.Reload> <Text>[Retry]</Text> </ActionBarPrimitive.Reload>`

### [FeedbackPositive / FeedbackNegative](#feedbackpositive--feedbacknegative)

Pressable buttons for submitting message feedback.

`<ActionBarPrimitive.FeedbackPositive> {({ isSubmitted }) => <Text>{isSubmitted ? "[Liked]" : "[Like]"}</Text>} </ActionBarPrimitive.FeedbackPositive> <ActionBarPrimitive.FeedbackNegative> {({ isSubmitted }) => <Text>{isSubmitted ? "[Disliked]" : "[Dislike]"}</Text>} </ActionBarPrimitive.FeedbackNegative>`

## [BranchPicker](#branchpicker)

`import { BranchPickerPrimitive } from "@assistant-ui/react-ink";`

### [Previous / Next](#previous--next)

Pressable buttons to navigate between message branches.

`<Box> <BranchPickerPrimitive.Previous> <Text>{"<"}</Text> </BranchPickerPrimitive.Previous> <BranchPickerPrimitive.Number /> <Text>/</Text> <BranchPickerPrimitive.Count /> <BranchPickerPrimitive.Next> <Text>{">"}</Text> </BranchPickerPrimitive.Next> </Box>`

### [Number / Count](#number--count)

`Text` components displaying the current branch number and total count.

## [ThreadList](#threadlist)

`import { ThreadListPrimitive } from "@assistant-ui/react-ink";`

### [Root](#root-4)

Container `Box` for the thread list.

### [Items](#items)

Renders thread list items with runtime integration.

`<ThreadListPrimitive.Items renderItem={({ threadId }) => ( <ThreadEntry threadId={threadId} /> )} />`

| Prop         | Type                                                           | Description          |
| ------------ | -------------------------------------------------------------- | -------------------- |
| `renderItem` | `(props: { threadId: string; index: number }) => ReactElement` | Thread item renderer |

### [New](#new)

Pressable that creates a new thread.

`<ThreadListPrimitive.New> <Text color="green">[New Chat]</Text> </ThreadListPrimitive.New>`

## [ThreadListItem](#threadlistitem)

`import { ThreadListItemPrimitive } from "@assistant-ui/react-ink";`

### [Root](#root-5)

Container `Box` for a thread list item.

### [Title](#title)

`Text` component displaying the thread list item title. Shared from `@assistant-ui/core/react`.

### [Trigger](#trigger)

Pressable that switches to the thread.

### [Delete](#delete)

Pressable that deletes the thread.

### [Archive / Unarchive](#archive--unarchive)

Pressable buttons that archive or unarchive the thread.

`<ThreadListItemPrimitive.Root> <ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title /> </ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Delete> <Text color="red">[x]</Text> </ThreadListItemPrimitive.Delete> </ThreadListItemPrimitive.Root>`

## [Suggestion](#suggestion-1)

`import { SuggestionPrimitive } from "@assistant-ui/react-ink";`

### [Title](#title-1)

`Text` component displaying the suggestion title.

### [Description](#description)

`Text` component displaying the suggestion label. Despite the component name, this reads from the `label` field of the suggestion state (not a separate `description` field).

### [Trigger](#trigger-1)

Pressable that triggers the suggestion action.

`<SuggestionPrimitive.Trigger send> <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger>`

| Prop            | Type      | Description                                                     |
| --------------- | --------- | --------------------------------------------------------------- |
| `send`          | `boolean` | When true, sends immediately; when false, inserts into composer |
| `clearComposer` | `boolean` | Whether to clear/replace composer text (default: true)          |

## [ChainOfThought](#chainofthought)

`import { ChainOfThoughtPrimitive } from "@assistant-ui/react-ink";`

### [Root](#root-6)

Container `Box` for chain of thought content.

### [AccordionTrigger](#accordiontrigger)

Pressable that toggles the collapsed state of the chain of thought.

### [Parts](#parts-1)

Renders the individual parts of a chain of thought using a provided components map. Shared from `@assistant-ui/core/react`.

`<ChainOfThoughtPrimitive.Root> <ChainOfThoughtPrimitive.AccordionTrigger> <Text dimColor>[Toggle reasoning]</Text> </ChainOfThoughtPrimitive.AccordionTrigger> <ChainOfThoughtPrimitive.Parts> {({ part }) => part.type === "text" ? <Text dimColor>{part.text}</Text> : null} </ChainOfThoughtPrimitive.Parts> </ChainOfThoughtPrimitive.Root>`

## [ToolCall](#toolcall)

`import { ToolCallPrimitive } from "@assistant-ui/react-ink";`

### [Fallback](#fallback)

A built-in component for rendering tool calls with expandable/collapsible output. Includes a spinner for running tools, formatted JSON args and result output, and status icons for completed, errored, or interrupted calls.

`<MessagePrimitive.Parts> {({ part }) => { if (part.type === "tool-call") return <ToolCallPrimitive.Fallback part={part} />; return null; }} </MessagePrimitive.Parts>`

| Prop                    | Type                                                   | Description                                                                                      |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `part`                  | `ToolCallMessagePartProps`                             | The tool call message part (pass the component prop directly)                                    |
| `expanded`              | `boolean`                                              | Force expanded or collapsed. When unset, auto-expands while running, awaiting action, or errored |
| `maxArgLines`           | `number`                                               | Maximum lines to show for args when expanded (default: 20)                                       |
| `maxResultLines`        | `number`                                               | Maximum lines to show for result when expanded (default: 20)                                     |
| `maxResultPreviewLines` | `number`                                               | Maximum lines to show for result preview when collapsed (default: 1)                             |
| `renderHeader`          | `(props: { toolName, status, expanded }) => ReactNode` | Custom header renderer                                                                           |
| `renderArgs`            | `(props: { args, argsText }) => ReactNode`             | Custom args renderer                                                                             |
| `renderResult`          | `(props: { result, isError }) => ReactNode`            | Custom result renderer                                                                           |

## [Diff](#diff)

`import { DiffPrimitive, DiffView } from "@assistant-ui/react-ink";`

Components for rendering code diffs in the terminal.

### [DiffView](#diffview)

Pre-composed component that combines all diff primitives for easy diff rendering. Accepts either a unified diff patch string or old/new file content for inline comparison.

When a replacement is rendered as an equal-length adjacent `-`/`+` run, `DiffView` also highlights the changed word spans inside those lines. The existing prefixes, line numbers, folding, and primitive API surface stay the same. This intra-line behavior is internal to `DiffView`; `DiffPrimitive.Line` remains a line-level primitive.

`// From a patch string <DiffView patch={unifiedDiffString} showLineNumbers contextLines={3} maxLines={50} /> // From file contents <DiffView oldFile={{ content: "old text", name: "file.txt" }} newFile={{ content: "new text", name: "file.txt" }} showLineNumbers />`

| Prop              | Type                                 | Description                                    |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| `patch`           | `string`                             | Unified diff patch string to parse and display |
| `oldFile`         | `{ content: string; name?: string }` | Old file content for inline comparison         |
| `newFile`         | `{ content: string; name?: string }` | New file content for inline comparison         |
| `showLineNumbers` | `boolean`                            | Whether to show line numbers (default: true)   |
| `contextLines`    | `number`                             | Number of context lines to show around changes |
| `maxLines`        | `number`                             | Maximum number of lines to display             |

### [Root](#root-7)

Container `Box` that provides diff context to child components. Parses the patch or computes the diff from old/new file content.

`<DiffPrimitive.Root patch={patchString} oldFile={{ content: oldContent, name: "file.txt" }} newFile={{ content: newContent, name: "file.txt" }} > {children} </DiffPrimitive.Root>`

| Prop      | Type                                 | Description               |
| --------- | ------------------------------------ | ------------------------- |
| `patch`   | `string`                             | Unified diff patch string |
| `oldFile` | `{ content: string; name?: string }` | Old file for inline diff  |
| `newFile` | `{ content: string; name?: string }` | New file for inline diff  |

### [Header](#header)

Displays file header information including filename(s) and change statistics.

`<DiffPrimitive.Header fileIndex={0} />`

| Prop        | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `fileIndex` | `number` | Index of file to display header for (default: 0) |

### [Content](#content)

Renders the diff content with lines. Supports context folding and line truncation.

`<DiffPrimitive.Content fileIndex={0} showLineNumbers contextLines={3} maxLines={100} renderLine={({ line, index }) => <CustomLine line={line} />} renderFold={({ region, index }) => <CustomFold region={region} />} />`

| Prop              | Type                                      | Description                            |
| ----------------- | ----------------------------------------- | -------------------------------------- |
| `fileIndex`       | `number`                                  | Index of file to display (default: 0)  |
| `showLineNumbers` | `boolean`                                 | Show line numbers (default: true)      |
| `contextLines`    | `number`                                  | Number of context lines around changes |
| `maxLines`        | `number`                                  | Maximum lines to display               |
| `renderLine`      | `(props: { line; index }) => ReactNode`   | Custom line renderer                   |
| `renderFold`      | `(props: { region; index }) => ReactNode` | Custom fold region renderer            |

### [Line](#line)

Renders an individual diff line with appropriate coloring and indicators.

`<DiffPrimitive.Line line={parsedLine} showLineNumbers lineNumberWidth={4} />`

| Prop              | Type         | Description                                |
| ----------------- | ------------ | ------------------------------------------ |
| `line`            | `ParsedLine` | The parsed line object to render           |
| `showLineNumbers` | `boolean`    | Show line numbers (default: true)          |
| `lineNumberWidth` | `number`     | Width for line number padding (default: 4) |

### [Stats](#stats)

Displays diff statistics (additions and deletions count).

`<DiffPrimitive.Stats fileIndex={0} />`

| Prop        | Type     | Description                                     |
| ----------- | -------- | ----------------------------------------------- |
| `fileIndex` | `number` | Index of file to display stats for (default: 0) |

### [Composing with Primitives](#composing-with-primitives)

For custom layouts, use the primitives directly:

`<DiffPrimitive.Root patch={patchString}> <Box flexDirection="column"> <DiffPrimitive.Header /> <DiffPrimitive.Stats /> <DiffPrimitive.Content showLineNumbers contextLines={2} /> </Box> </DiffPrimitive.Root>`