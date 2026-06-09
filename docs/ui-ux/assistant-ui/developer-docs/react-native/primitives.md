# Primitives
URL: /docs/react-native/primitives

Composable React Native components for building chat UIs.

Primitives are thin wrappers around React Native components (`View`, `TextInput`, `FlatList`, `Pressable`) that integrate with the assistant-ui runtime. They accept all standard React Native props and add runtime-aware behavior.

Primitives are accessed via namespace imports (e.g. `ThreadPrimitive.Root`, `ComposerPrimitive.Input`), matching the pattern used in `@assistant-ui/react`.

Many primitives share their core logic with `@assistant-ui/react` via `@assistant-ui/core/react` — only the UI layer (View/Pressable/Text vs DOM elements) differs.

## [Thread](#thread)

`import { ThreadPrimitive } from "@assistant-ui/react-native";`

### [ThreadPrimitive.Root](#threadprimitiveroot)

Container `View` for the thread area.

`<ThreadPrimitive.Root style={{ flex: 1 }}> {children} </ThreadPrimitive.Root>`

| Prop      | Type        | Description                      |
| --------- | ----------- | -------------------------------- |
| `...rest` | `ViewProps` | Standard React Native View props |

### [ThreadPrimitive.Messages](#threadprimitivemessages)

`FlatList`-based message list with automatic runtime integration. Each message is wrapped in a scoped context so that `useAuiState((s) => s.message)` works inside the rendered component.

`<ThreadPrimitive.Messages> {() => <MyMessage />} </ThreadPrimitive.Messages>`

You can also provide role-specific components:

`<ThreadPrimitive.Messages> {({ message }) => { if (message.role === "user") return <MyUserMessage />; return <MyAssistantMessage />; }} </ThreadPrimitive.Messages>`

| Prop         | Type                | Description                                                                                                                                                                                                                                                                                               |
| ------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components` | `MessageComponents` | Component map — provide either a `Message` component (used for all roles) or role-specific `UserMessage`, `AssistantMessage`, and optionally `SystemMessage`. Edit composers can be set via `EditComposer` or role-specific variants (`UserEditComposer`, `AssistantEditComposer`, `SystemEditComposer`). |
| `...rest`    | `FlatListProps`     | Standard FlatList props (except `data`, `renderItem`)                                                                                                                                                                                                                                                     |

### [ThreadPrimitive.MessageByIndex](#threadprimitivemessagebyindex)

Renders a single message at a specific index in the thread. Provides message context so that `useAuiState((s) => s.message)` works inside the rendered component. This component is shared from `@assistant-ui/core/react`.

`<ThreadPrimitive.MessageByIndex index={0} components={{ UserMessage: MyUserMessage, AssistantMessage: MyAssistantMessage, }} />`

| Prop         | Type                | Description                                      |
| ------------ | ------------------- | ------------------------------------------------ |
| `index`      | `number`            | Zero-based index of the message to render        |
| `components` | `MessageComponents` | Same component map as `ThreadPrimitive.Messages` |

### [ThreadPrimitive.Empty](#threadprimitiveempty)

Renders its children only when the thread has no messages. Deprecated in favor of `AuiIf`.

`<ThreadPrimitive.Empty> <Text>Send a message to get started</Text> </ThreadPrimitive.Empty>`

### [ThreadPrimitive.If](#threadprimitiveif)

Conditional rendering based on thread state. Deprecated in favor of `AuiIf`.

`<ThreadPrimitive.If empty> <Text>No messages yet</Text> </ThreadPrimitive.If> <ThreadPrimitive.If running> <ActivityIndicator /> </ThreadPrimitive.If>`

| Prop      | Type      | Description                                                   |
| --------- | --------- | ------------------------------------------------------------- |
| `empty`   | `boolean` | Renders children when thread emptiness matches this value     |
| `running` | `boolean` | Renders children when thread running state matches this value |

### [ThreadPrimitive.Suggestion](#threadprimitivesuggestion)

`Pressable` that inserts or sends a hard-coded suggestion prompt. Unlike `SuggestionPrimitive.Trigger`, this component does not require a suggestion context — the prompt is passed directly as a prop.

`<ThreadPrimitive.Suggestion prompt="What can you help me with?" send> <Text>What can you help me with?</Text> </ThreadPrimitive.Suggestion>`

| Prop            | Type             | Description                                                                                 |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| `prompt`        | `string`         | The text to send or insert into the composer                                                |
| `send`          | `boolean`        | When true, sends the prompt immediately; when false, inserts into composer (default: false) |
| `clearComposer` | `boolean`        | Whether to replace composer text (default: true)                                            |
| `...rest`       | `PressableProps` | Standard Pressable props (except `onPress`)                                                 |

### [ThreadPrimitive.Suggestions](#threadprimitivesuggestions)

Renders all suggestions using the provided component configuration. This component is shared from `@assistant-ui/core/react`.

`<ThreadPrimitive.Suggestions> {() => <MySuggestion />} </ThreadPrimitive.Suggestions>`

| Prop         | Type                            | Description                             |
| ------------ | ------------------------------- | --------------------------------------- |
| `components` | `{ Suggestion: ComponentType }` | Component to render for each suggestion |

### [ThreadPrimitive.SuggestionByIndex](#threadprimitivesuggestionbyindex)

Renders a single suggestion at the specified index, providing suggestion context. This component is shared from `@assistant-ui/core/react`.

`<ThreadPrimitive.SuggestionByIndex index={0} components={{ Suggestion: MySuggestion }} />`

| Prop         | Type                            | Description                                  |
| ------------ | ------------------------------- | -------------------------------------------- |
| `index`      | `number`                        | Zero-based index of the suggestion to render |
| `components` | `{ Suggestion: ComponentType }` | Component to render for the suggestion       |

### [AuiIf](#auiif)

Conditional rendering based on assistant state. Replaces the deprecated `ThreadPrimitive.Empty`, `ThreadPrimitive.If`, `MessagePrimitive.If`, and `ComposerPrimitive.If`.

`import { AuiIf } from "@assistant-ui/react-native"; <AuiIf condition={(s) => s.thread.isEmpty}> <Text>Send a message to get started</Text> </AuiIf> <AuiIf condition={(s) => s.thread.isRunning}> <ActivityIndicator /> </AuiIf>`

| Prop        | Type                 | Description                                            |
| ----------- | -------------------- | ------------------------------------------------------ |
| `condition` | `(state) => boolean` | Selector that determines whether children are rendered |

## [Composer](#composer)

`import { ComposerPrimitive } from "@assistant-ui/react-native";`

### [ComposerPrimitive.Root](#composerprimitiveroot)

Container `View` for the composer area.

`<ComposerPrimitive.Root style={styles.composerContainer}> {children} </ComposerPrimitive.Root>`

### [ComposerPrimitive.Input](#composerprimitiveinput)

`TextInput` wired to the composer runtime. Value and `onChangeText` are managed automatically.

`<ComposerPrimitive.Input placeholder="Message..." multiline style={styles.input} />`

| Prop         | Type                | Description                                                 |
| ------------ | ------------------- | ----------------------------------------------------------- |
| `submitMode` | `"enter" \| "none"` | Whether Enter sends the message on web (default: `"enter"`) |
| `...rest`    | `TextInputProps`    | Standard TextInput props (except `value`, `onChangeText`)   |

### [ComposerPrimitive.Send](#composerprimitivesend)

`Pressable` that sends the current message. Automatically disabled when the composer is empty.

`<ComposerPrimitive.Send style={styles.sendButton}> <Text>Send</Text> </ComposerPrimitive.Send>`

### [ComposerPrimitive.Cancel](#composerprimitivecancel)

`Pressable` that cancels the current run. Automatically disabled when no run is active.

`<ComposerPrimitive.Cancel style={styles.cancelButton}> <Text>Stop</Text> </ComposerPrimitive.Cancel>`

### [ComposerPrimitive.Attachments](#composerprimitiveattachments)

Renders composer attachments using the provided component configuration.

`<ComposerPrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") return <MyImageAttachment />; if (attachment.type === "document") return <MyDocumentAttachment />; return <MyFallbackAttachment />; }} </ComposerPrimitive.Attachments>`

| Prop         | Type                                        | Description                            |
| ------------ | ------------------------------------------- | -------------------------------------- |
| `components` | `{ Image?, Document?, File?, Attachment? }` | Component renderers by attachment type |

### [ComposerPrimitive.AddAttachment](#composerprimitiveaddattachment)

`Pressable` for triggering attachment addition. The actual file picker must be implemented by the consumer (e.g. using `expo-document-picker` or `expo-image-picker`).

`<ComposerPrimitive.AddAttachment> <Text>Attach</Text> </ComposerPrimitive.AddAttachment>`

### [ComposerPrimitive.AttachmentByIndex](#composerprimitiveattachmentbyindex)

Renders a single composer attachment at the specified index. Useful for building custom attachment layouts.

`<ComposerPrimitive.AttachmentByIndex index={0} components={{ Image: MyImageAttachment, Attachment: MyFallbackAttachment, }} />`

| Prop         | Type                                        | Description                                  |
| ------------ | ------------------------------------------- | -------------------------------------------- |
| `index`      | `number`                                    | Zero-based index of the attachment to render |
| `components` | `{ Image?, Document?, File?, Attachment? }` | Component renderers by attachment type       |

### [ComposerPrimitive.EditInput](#composerprimitiveeditinput)

`TextInput` wired to the edit composer runtime. Used inside an edit composer to allow editing an existing message. Value and `onChangeText` are managed automatically.

`<ComposerPrimitive.EditInput placeholder="Edit message..." multiline style={styles.input} />`

| Prop      | Type             | Description                                               |
| --------- | ---------------- | --------------------------------------------------------- |
| `...rest` | `TextInputProps` | Standard TextInput props (except `value`, `onChangeText`) |

### [ComposerPrimitive.EditSend](#composerprimitiveeditsend)

`Pressable` that confirms and submits a message edit. Automatically disabled when the composer is empty.

`<ComposerPrimitive.EditSend style={styles.sendButton}> <Text>Save</Text> </ComposerPrimitive.EditSend>`

### [ComposerPrimitive.EditCancel](#composerprimitiveeditcancel)

`Pressable` that cancels an in-progress message edit and returns to the original message.

`<ComposerPrimitive.EditCancel style={styles.cancelButton}> <Text>Cancel</Text> </ComposerPrimitive.EditCancel>`

### [Conditional Rendering (Composer)](#conditional-rendering-composer)

Use `AuiIf` for conditional rendering based on composer state:

`<AuiIf condition={(s) => s.composer.isEditing}> <Text>Currently editing</Text> </AuiIf> <AuiIf condition={(s) => s.composer.dictation != null}> <Text>Dictation active</Text> </AuiIf>`

## [Message](#message)

`import { MessagePrimitive } from "@assistant-ui/react-native";`

### [MessagePrimitive.Root](#messageprimitiveroot)

Container `View` for a single message.

`<MessagePrimitive.Root style={styles.messageBubble}> {children} </MessagePrimitive.Root>`

### [MessagePrimitive.Content](#messageprimitivecontent)

Renders message content parts using render-prop functions instead of the component-map approach used by `MessagePrimitive.Parts`. Each part type receives a `part` object and its `index`. Registered tool UIs (via `useAssistantTool`) are automatically dispatched and take priority over `renderToolCall`.

`<MessagePrimitive.Content renderText={({ part }) => <Text>{part.text}</Text>} renderToolCall={({ part, index }) => ( <Text>Tool: {part.toolName}</Text> )} renderImage={({ part }) => ( <Image source={{ uri: part.image }} /> )} />`

| Prop              | Type                                       | Description                                                              |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| `renderText`      | `(props: { part, index }) => ReactElement` | Renderer for text parts (default: React Native `<Text>`)                 |
| `renderToolCall`  | `(props: { part, index }) => ReactElement` | Fallback renderer for tool-call parts not handled by registered tool UIs |
| `renderImage`     | `(props: { part, index }) => ReactElement` | Renderer for image parts                                                 |
| `renderReasoning` | `(props: { part, index }) => ReactElement` | Renderer for reasoning parts                                             |
| `renderSource`    | `(props: { part, index }) => ReactElement` | Renderer for source parts                                                |
| `renderFile`      | `(props: { part, index }) => ReactElement` | Renderer for file parts                                                  |
| `renderData`      | `(props: { part, index }) => ReactElement` | Fallback renderer for data parts not handled by registered data UIs      |

### [MessagePrimitive.Parts](#messageprimitiveparts)

Renders message content parts via a `components` prop. Tool call and data parts automatically render registered tool UIs (via `useAssistantTool` / `useAssistantDataUI`), falling back to components provided here. A default `Text` component using React Native's `<Text>` is provided out of the box.

`<MessagePrimitive.Parts> {({ part }) => { if (part.type === "text") return <Text>{part.text}</Text>; if (part.type === "image") return <Image source={{ uri: part.image }} />; if (part.type === "tool-call") return <MyToolCallComponent {...part} />; return null; }} </MessagePrimitive.Parts>`

| Prop         | Type     | Description                                            |
| ------------ | -------- | ------------------------------------------------------ |
| `components` | `object` | Component map for rendering each part type. See below. |

**`components` fields:**

| Field            | Type                                        | Description                                                                                                                                           |
| ---------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Text`           | `TextMessagePartComponent`                  | Text part renderer (default: React Native `<Text>`)                                                                                                   |
| `Image`          | `ImageMessagePartComponent`                 | Image part renderer                                                                                                                                   |
| `Reasoning`      | `ReasoningMessagePartComponent`             | Reasoning part renderer                                                                                                                               |
| `Source`         | `SourceMessagePartComponent`                | Source part renderer                                                                                                                                  |
| `File`           | `FileMessagePartComponent`                  | File part renderer                                                                                                                                    |
| `Unstable_Audio` | `AudioMessagePartComponent`                 | Audio part renderer (experimental)                                                                                                                    |
| `tools`          | `{ by_name?, Fallback? }` or `{ Override }` | Tool call rendering config — use `by_name` to map tool names to components, `Fallback` for unregistered tools, or `Override` to handle all tool calls |
| `data`           | `{ by_name?, Fallback? }`                   | Data part rendering config — use `by_name` to map data event names, `Fallback` for unmatched events                                                   |
| `Empty`          | `EmptyMessagePartComponent`                 | Component shown for empty messages                                                                                                                    |
| `Quote`          | `QuoteMessagePartComponent`                 | Component for rendering quoted message references                                                                                                     |
| `ChainOfThought` | `ComponentType`                             | Groups all reasoning and tool-call parts into a single component (mutually exclusive with `Reasoning`/`tools`/`ToolGroup`/`ReasoningGroup`)           |

### [MessagePrimitive.PartByIndex](#messageprimitivepartbyindex)

Renders a single message part at the specified index, providing part context. Useful for building custom part layouts outside of `MessagePrimitive.Parts`. This component is shared from `@assistant-ui/core/react`.

`<MessagePrimitive.PartByIndex index={0} components={{ Text: ({ text }) => <Text>{text}</Text>, tools: { Fallback: MyToolComponent }, }} />`

| Prop         | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `index`      | `number` | Zero-based index of the message part to render |
| `components` | `object` | Same component map as `MessagePrimitive.Parts` |

### [Conditional Rendering (Message)](#conditional-rendering-message)

Use `AuiIf` for conditional rendering based on message properties:

`<AuiIf condition={(s) => s.message.role === "user"}> <Text>You said:</Text> </AuiIf> <AuiIf condition={(s) => s.message.role === "assistant" && s.message.isLast}> <ActivityIndicator /> </AuiIf>`

### [MessagePrimitive.Attachments](#messageprimitiveattachments)

Renders user message attachments using the provided component configuration.

`<MessagePrimitive.Attachments> {({ attachment }) => { if (attachment.type === "image") return <MyImageAttachment />; return <MyFallbackAttachment />; }} </MessagePrimitive.Attachments>`

| Prop         | Type                                        | Description                            |
| ------------ | ------------------------------------------- | -------------------------------------- |
| `components` | `{ Image?, Document?, File?, Attachment? }` | Component renderers by attachment type |

### [MessagePrimitive.AttachmentByIndex](#messageprimitiveattachmentbyindex)

Renders a single message attachment at the specified index. Useful for building custom attachment layouts outside of `MessagePrimitive.Attachments`.

`<MessagePrimitive.AttachmentByIndex index={0} components={{ Image: MyImageAttachment, Attachment: MyFallbackAttachment, }} />`

| Prop         | Type                                        | Description                                  |
| ------------ | ------------------------------------------- | -------------------------------------------- |
| `index`      | `number`                                    | Zero-based index of the attachment to render |
| `components` | `{ Image?, Document?, File?, Attachment? }` | Component renderers by attachment type       |

## [Attachment](#attachment)

`import { AttachmentPrimitive } from "@assistant-ui/react-native";`

Primitives for rendering individual attachments (inside `ComposerPrimitive.Attachments` or `MessagePrimitive.Attachments`).

### [AttachmentPrimitive.Root](#attachmentprimitiveroot)

Container `View` for an attachment.

`<AttachmentPrimitive.Root style={styles.attachment}> {children} </AttachmentPrimitive.Root>`

### [AttachmentPrimitive.Name](#attachmentprimitivename)

`Text` component displaying the attachment filename.

`<AttachmentPrimitive.Name style={styles.filename} />`

### [AttachmentPrimitive.Thumb](#attachmentprimitivethumb)

`Text` component displaying the file extension (e.g. `.pdf`).

`<AttachmentPrimitive.Thumb style={styles.extension} />`

### [AttachmentPrimitive.Remove](#attachmentprimitiveremove)

`Pressable` that removes the attachment from the composer.

`<AttachmentPrimitive.Remove> <Text>Remove</Text> </AttachmentPrimitive.Remove>`

## [ActionBar](#actionbar)

`import { ActionBarPrimitive } from "@assistant-ui/react-native";`

### [ActionBarPrimitive.Copy](#actionbarprimitivecopy)

`Pressable` that copies the message content. Supports function-as-children for copy state feedback.

`<ActionBarPrimitive.Copy copiedDuration={3000}> {({ isCopied }) => <Text>{isCopied ? "Copied!" : "Copy"}</Text>} </ActionBarPrimitive.Copy>`

| Prop              | Type                     | Description                                           |
| ----------------- | ------------------------ | ----------------------------------------------------- |
| `copiedDuration`  | `number`                 | Duration in ms to show "copied" state (default: 3000) |
| `copyToClipboard` | `(text: string) => void` | Custom clipboard function                             |

### [ActionBarPrimitive.Edit](#actionbarprimitiveedit)

`Pressable` that enters edit mode for a message.

`<ActionBarPrimitive.Edit> <Text>Edit</Text> </ActionBarPrimitive.Edit>`

### [ActionBarPrimitive.Reload](#actionbarprimitivereload)

`Pressable` that regenerates an assistant message.

`<ActionBarPrimitive.Reload> <Text>Retry</Text> </ActionBarPrimitive.Reload>`

### [ActionBarPrimitive.FeedbackPositive / ActionBarPrimitive.FeedbackNegative](#actionbarprimitivefeedbackpositive--actionbarprimitivefeedbacknegative)

`Pressable` buttons for submitting message feedback.

`<ActionBarPrimitive.FeedbackPositive> {({ isSubmitted }) => <Text>{isSubmitted ? "Liked" : "Like"}</Text>} </ActionBarPrimitive.FeedbackPositive> <ActionBarPrimitive.FeedbackNegative> {({ isSubmitted }) => <Text>{isSubmitted ? "Disliked" : "Dislike"}</Text>} </ActionBarPrimitive.FeedbackNegative>`

## [BranchPicker](#branchpicker)

`import { BranchPickerPrimitive } from "@assistant-ui/react-native";`

### [BranchPickerPrimitive.Previous / BranchPickerPrimitive.Next](#branchpickerprimitiveprevious--branchpickerprimitivenext)

`Pressable` buttons to navigate between message branches.

`<View style={{ flexDirection: "row", alignItems: "center" }}> <BranchPickerPrimitive.Previous> <Text>-</Text> </BranchPickerPrimitive.Previous> <BranchPickerPrimitive.Number /> <Text>/</Text> <BranchPickerPrimitive.Count /> <BranchPickerPrimitive.Next> <Text>+</Text> </BranchPickerPrimitive.Next> </View>`

### [BranchPickerPrimitive.Number / BranchPickerPrimitive.Count](#branchpickerprimitivenumber--branchpickerprimitivecount)

`Text` components displaying the current branch number and total count.

## [ThreadList](#threadlist)

`import { ThreadListPrimitive } from "@assistant-ui/react-native";`

### [ThreadListPrimitive.Root](#threadlistprimitiveroot)

Container `View` for the thread list.

`<ThreadListPrimitive.Root style={styles.threadList}> {children} </ThreadListPrimitive.Root>`

### [ThreadListPrimitive.Items](#threadlistprimitiveitems)

`FlatList` of thread IDs with runtime integration.

`<ThreadListPrimitive.Items renderItem={({ threadId }) => ( <ThreadListEntry threadId={threadId} /> )} />`

| Prop         | Type                                                           | Description                                           |
| ------------ | -------------------------------------------------------------- | ----------------------------------------------------- |
| `renderItem` | `(props: { threadId: string; index: number }) => ReactElement` | Thread item renderer                                  |
| `...rest`    | `FlatListProps`                                                | Standard FlatList props (except `data`, `renderItem`) |

### [ThreadListPrimitive.New](#threadlistprimitivenew)

`Pressable` that creates a new thread.

`<ThreadListPrimitive.New style={styles.newThreadButton}> <Text>New Chat</Text> </ThreadListPrimitive.New>`

## [ThreadListItem](#threadlistitem)

`import { ThreadListItemPrimitive } from "@assistant-ui/react-native";`

Primitives for rendering individual thread list items.

### [ThreadListItemPrimitive.Root](#threadlistitemprimitiveroot)

Container `View` for a thread list item.

`<ThreadListItemPrimitive.Root style={styles.threadItem}> {children} </ThreadListItemPrimitive.Root>`

### [ThreadListItemPrimitive.Title](#threadlistitemprimitivetitle)

Renders the thread title text. Falls back to the provided fallback when title is empty. This component is shared from `@assistant-ui/core/react`.

`<ThreadListItemPrimitive.Title fallback="New Chat" />`

| Prop       | Type        | Description                         |
| ---------- | ----------- | ----------------------------------- |
| `fallback` | `ReactNode` | Content to show when title is empty |

### [ThreadListItemPrimitive.Trigger](#threadlistitemprimitivetrigger)

`Pressable` that switches to the thread.

`<ThreadListItemPrimitive.Trigger> <ThreadListItemPrimitive.Title fallback="New Chat" /> </ThreadListItemPrimitive.Trigger>`

### [ThreadListItemPrimitive.Delete](#threadlistitemprimitivedelete)

`Pressable` that deletes the thread.

`<ThreadListItemPrimitive.Delete> <Text>Delete</Text> </ThreadListItemPrimitive.Delete>`

### [ThreadListItemPrimitive.Archive / ThreadListItemPrimitive.Unarchive](#threadlistitemprimitivearchive--threadlistitemprimitiveunarchive)

`Pressable` buttons that archive or unarchive the thread.

`<ThreadListItemPrimitive.Archive> <Text>Archive</Text> </ThreadListItemPrimitive.Archive> <ThreadListItemPrimitive.Unarchive> <Text>Unarchive</Text> </ThreadListItemPrimitive.Unarchive>`

## [Suggestion](#suggestion)

`import { SuggestionPrimitive } from "@assistant-ui/react-native";`

Primitives for rendering suggestions. Use inside a `SuggestionByIndexProvider` (from `@assistant-ui/core/react`).

### [SuggestionPrimitive.Title](#suggestionprimitivetitle)

`Text` component displaying the suggestion title.

`<SuggestionPrimitive.Title style={styles.suggestionTitle} />`

### [SuggestionPrimitive.Description](#suggestionprimitivedescription)

`Text` component displaying the suggestion description/label.

`<SuggestionPrimitive.Description style={styles.suggestionDescription} />`

### [SuggestionPrimitive.Trigger](#suggestionprimitivetrigger)

`Pressable` that triggers the suggestion action (send or insert into composer).

`<SuggestionPrimitive.Trigger send> <SuggestionPrimitive.Title /> </SuggestionPrimitive.Trigger>`

| Prop            | Type      | Description                                                     |
| --------------- | --------- | --------------------------------------------------------------- |
| `send`          | `boolean` | When true, sends immediately; when false, inserts into composer |
| `clearComposer` | `boolean` | Whether to clear/replace composer text (default: true)          |

## [ChainOfThought](#chainofthought)

`import { ChainOfThoughtPrimitive } from "@assistant-ui/react-native";`

Primitives for rendering chain of thought content (grouped reasoning and tool-call parts).

### [ChainOfThoughtPrimitive.Root](#chainofthoughtprimitiveroot)

Container `View` for chain of thought content.

`<ChainOfThoughtPrimitive.Root style={styles.chainOfThought}> {children} </ChainOfThoughtPrimitive.Root>`

### [ChainOfThoughtPrimitive.AccordionTrigger](#chainofthoughtprimitiveaccordiontrigger)

`Pressable` that toggles the collapsed state of the chain of thought.

`<ChainOfThoughtPrimitive.AccordionTrigger> <Text>Toggle reasoning</Text> </ChainOfThoughtPrimitive.AccordionTrigger>`

### [ChainOfThoughtPrimitive.Parts](#chainofthoughtprimitiveparts)

Renders the parts within a chain of thought. Shared from `@assistant-ui/core/react`.

`<ChainOfThoughtPrimitive.Parts> {({ part }) => { if (part.type === "reasoning") return <Text>{part.text}</Text>; if (part.type === "tool-call") return <MyToolComponent {...part} />; return null; }} </ChainOfThoughtPrimitive.Parts>`