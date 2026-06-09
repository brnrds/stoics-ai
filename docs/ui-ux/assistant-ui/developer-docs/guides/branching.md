# Message Branching
URL: /docs/guides/branching

Edit messages or regenerate AI responses, then switch between alternative replies. Branching navigation built into assistant-ui's React chat UI.

Branching lets users navigate between alternative versions of a message. A new branch is created when:

- A user message is edited
- An assistant message is reloaded (reload creates a new branch on the same message)

Branches are automatically tracked by assistant-ui by observing changes to the `messages` array.

## [Shortest Working Pattern](#shortest-working-pattern)

Place a branch picker inside your message component:

`import { BranchPickerPrimitive } from "@assistant-ui/react"; const BranchPicker = () => ( <BranchPickerPrimitive.Root hideWhenSingleBranch> <BranchPickerPrimitive.Previous /> <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count /> <BranchPickerPrimitive.Next /> </BranchPickerPrimitive.Root> );`

`BranchPickerPrimitive.Previous` and `.Next` automatically disable at branch boundaries and while a run is in flight (unless the runtime supports `switchBranchDuringRun`). For the full primitive API, see

- href

  /docs/primitives/branch-picker

BranchPickerPrimitive

.

## [Triggering Reload](#triggering-reload)

`ActionBarPrimitive.Reload` creates a new branch on an assistant message and re-runs from there:

`import { ActionBarPrimitive, MessagePrimitive } from "@assistant-ui/react"; const AssistantMessage = () => ( <MessagePrimitive.Root> <MessagePrimitive.Parts /> <ActionBarPrimitive.Root> <ActionBarPrimitive.Reload /> </ActionBarPrimitive.Root> </MessagePrimitive.Root> );`

`Reload` is disabled while `thread.isRunning` or `thread.isDisabled` is true. See

- href

  /docs/primitives/action-bar

ActionBarPrimitive

for the full reference.

## [Programmatic Branch Navigation](#programmatic-branch-navigation)

For headless or keyboard-shortcut flows, navigate directly to a branch by id via `aui.message().switchToBranch`:

`import { useAui } from "@assistant-ui/react"; const SwitchToBranch = ({ branchId }: { branchId: string }) => { const aui = useAui(); return ( <button onClick={() => aui.message().switchToBranch({ branchId })}> Go to branch </button> ); };`

This must be called inside a message context (e.g. nested within `MessagePrimitive.Root`).

## [Grouped Parts After Branching](#grouped-parts-after-branching)

Each branch is a distinct message version with its own content parts. `MessagePrimitive.GroupedParts` provides hierarchical adjacent grouping of those parts, useful when a message mixes tool calls and text across branches. See the

- href

  /docs/primitives/message

MessagePrimitive

reference for `GroupedParts` usage.