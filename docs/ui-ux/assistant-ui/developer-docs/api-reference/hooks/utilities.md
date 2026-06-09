# Utility Hooks
URL: /docs/api-reference/hooks/utilities

Focused helpers for message parts, quotes, timing, and viewport behavior.

Utility hooks expose commonly needed slices of assistant-ui behavior without requiring a full primitive.

## [Message Helpers](#message-helpers)

- `useMessageQuote` reads the quote state for the current message.
- `useMessageTiming` reads timing metadata for the current message.

## [Message Part Helpers](#message-part-helpers)

- `useMessagePartText`
- `useMessagePartReasoning`
- `useMessagePartSource`
- `useMessagePartFile`
- `useMessagePartImage`
- `useMessagePartData`

These hooks are intended for custom message part renderers. They read the nearest message part context established by `MessagePrimitive.Parts`, `MessagePartPrimitive`, or the lower-level providers.

## [Viewport Helpers](#viewport-helpers)

- `useThreadViewport` reads and controls the thread viewport.
- `useThreadViewportAutoScroll` wires auto-scroll behavior for custom viewport compositions.
- `useScrollLock` helps reasoning and grouped-part UIs preserve scroll behavior while content changes.

For primitive-specific prop APIs, see

- href

  /docs/api-reference/primitives

Primitives

.

## [API Reference](#api-reference)

Generated reference for Utilities.

### [unstable\_useCloudThreadListAdapter](#unstable_usecloudthreadlistadapter)

Deprecated: Use `useCloudThreadListAdapter` instead.

`import { unstable_useCloudThreadListAdapter } from "@assistant-ui/react";`

Source: `packages/core/src/react/runtimes/cloud/useCloudThreadListAdapter.tsx`

### [unstable\_useMentionAdapter](#unstable_usementionadapter)

Deprecated: Under active development and might change without notice.

Creates a spreadable `\{ adapter, directive \}` bundle for `@` mentions. Supports tools registered via `useAssistantTool`, explicit items, or both — flat or categorized.

`import { unstable_useMentionAdapter } from "@assistant-ui/react";`

Source: `packages/react/src/unstable/useMentionAdapter.ts`

### [unstable\_useSlashCommandAdapter](#unstable_useslashcommandadapter)

Deprecated: Under active development and may change without notice.

Bundles slash command definitions (with inline `execute` callbacks) into `\{adapter, action\}` that plug directly into `ComposerTriggerPopover`. `execute` stays in the hook closure and is never attached to the returned `TriggerItem`, keeping items serializable.

`import { unstable_useSlashCommandAdapter } from "@assistant-ui/react";`

Source: `packages/react/src/unstable/useSlashCommandAdapter.ts`

### [unstable\_useTriggerPopoverRootContext](#unstable_usetriggerpopoverrootcontext)

`import { unstable_useTriggerPopoverRootContext } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/composer/trigger/TriggerPopoverRootContext.tsx`

### [unstable\_useTriggerPopoverRootContextOptional](#unstable_usetriggerpopoverrootcontextoptional)

`import { unstable_useTriggerPopoverRootContextOptional } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/composer/trigger/TriggerPopoverRootContext.tsx`

### [unstable\_useTriggerPopoverScopeContext](#unstable_usetriggerpopoverscopecontext)

`import { unstable_useTriggerPopoverScopeContext } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/composer/trigger/TriggerPopover.tsx`

### [unstable\_useTriggerPopoverScopeContextOptional](#unstable_usetriggerpopoverscopecontextoptional)

`import { unstable_useTriggerPopoverScopeContextOptional } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/composer/trigger/TriggerPopover.tsx`

### [unstable\_useTriggerPopoverTriggers](#unstable_usetriggerpopovertriggers)

Live map of registered triggers, re-rendering on change. Prefer `subscribeLifecycle` for incremental add/remove handling.

`import { unstable_useTriggerPopoverTriggers } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/composer/trigger/TriggerPopoverRootContext.tsx`

### [unstable\_useTriggerPopoverTriggersOptional](#unstable_usetriggerpopovertriggersoptional)

Like `useTriggerPopoverTriggers` but returns an empty map outside a root.

`import { unstable_useTriggerPopoverTriggersOptional } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/composer/trigger/TriggerPopoverRootContext.tsx`

### [useAssistantApi](#useassistantapi)

Deprecated: Use `useAui` instead. This alias will be removed in v0.13.

`import { useAssistantApi } from "@assistant-ui/react";`

Source: `packages/store/src/useAui.ts`

### [useAssistantEvent](#useassistantevent)

Deprecated: Use `useAuiEvent` instead. This alias will be removed in v0.13.

`import { useAssistantEvent } from "@assistant-ui/react";`

Source: `packages/store/src/useAuiEvent.ts`

### [useAssistantFrameHost](#useassistantframehost)

React hook that manages the lifecycle of an AssistantFrameHost and its binding to the current AssistantRuntime.

Usage example:

`function MyComponent() { const iframeRef = useRef<HTMLIFrameElement>(null); useAssistantFrameHost({ iframeRef, targetOrigin: "https://trusted-domain.com", // optional }); return <iframe ref={iframeRef} src="..." />; }` `import { useAssistantFrameHost } from "@assistant-ui/react";`

Source: `packages/react/src/model-context/frame/useAssistantFrameHost.ts`

### [useAssistantState](#useassistantstate)

Deprecated: Use `useAuiState` instead. This alias will be removed in v0.13.

Hook to access a slice of the assistant state with automatic subscription

`import { useAssistantState } from "@assistant-ui/react";`

Source: `packages/store/src/useAuiState.ts`

### [useAttachment](#useattachment)

Deprecated: Use `useAuiState((s) =&gt; s.attachment)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

`import { useAttachment } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/AttachmentContext.ts`

### [useCloudThreadListAdapter](#usecloudthreadlistadapter)

`import { useCloudThreadListAdapter } from "@assistant-ui/react";`

Source: `packages/core/src/react/runtimes/cloud/useCloudThreadListAdapter.tsx`

### [useComposer](#usecomposer)

Deprecated: Use `useAuiState((s) =&gt; s.composer)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

Hook to access the current composer state.

This hook provides reactive access to the composer's state, including text content, attachments, editing status, and send/cancel capabilities.

`import { useComposer } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/ComposerContext.ts`

### [useEditComposer](#useeditcomposer)

Deprecated: Use `useAuiState((s) =&gt; s.message.composer)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

`import { useEditComposer } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/MessageContext.ts`

### [useEditComposerAttachment](#useeditcomposerattachment)

`import { useEditComposerAttachment } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/AttachmentContext.ts`

### [useExternalMessageConverter](#useexternalmessageconverter)

`import { useExternalMessageConverter } from "@assistant-ui/react";`

Source: `packages/core/src/react/runtimes/external-message-converter.ts`

### [useMessage](#usemessage)

Deprecated: Use `useAuiState((s) =&gt; s.message)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

Hook to access the current message state.

This hook provides reactive access to the message's state, including content, role, status, and other message-level properties.

`import { useMessage } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/MessageContext.ts`

### [useMessageAttachment](#usemessageattachment)

`import { useMessageAttachment } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/AttachmentContext.ts`

### [useMessagePart](#usemessagepart)

Deprecated: Use `useAuiState((s) =&gt; s.part)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

`import { useMessagePart } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/MessagePartContext.ts`

### [useMessagePartData](#usemessagepartdata)

`import { useMessagePartData } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/messagePart/useMessagePartData.ts`

### [useMessagePartFile](#usemessagepartfile)

`import { useMessagePartFile } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/messagePart/useMessagePartFile.ts`

### [useMessagePartImage](#usemessagepartimage)

`import { useMessagePartImage } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/messagePart/useMessagePartImage.ts`

### [useMessagePartReasoning](#usemessagepartreasoning)

`import { useMessagePartReasoning } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/messagePart/useMessagePartReasoning.ts`

### [useMessagePartSource](#usemessagepartsource)

`import { useMessagePartSource } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/messagePart/useMessagePartSource.ts`

### [useMessagePartText](#usemessageparttext)

`import { useMessagePartText } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/messagePart/useMessagePartText.ts`

### [useMessageQuote](#usemessagequote)

Hook that returns the quote info for the current message, if any.

Reads from `message.metadata.custom.quote`.

`import { useMessageQuote } from "@assistant-ui/react";`

Source: `packages/react/src/hooks/useMessageQuote.ts`

### [useMessageTiming](#usemessagetiming)

Hook that returns timing information for the current assistant message.

Reads from `message.metadata.timing`.

`import { useMessageTiming } from "@assistant-ui/react";`

Source: `packages/react/src/hooks/useMessageTiming.ts`

### [useRuntimeAdapters](#useruntimeadapters)

`import { useRuntimeAdapters } from "@assistant-ui/react";`

Source: `packages/core/src/react/runtimes/RuntimeAdapterProvider.tsx`

### [useScrollLock](#usescrolllock)

Locks scroll position during collapsible/height animations and hides scrollbar.

This utility prevents page jumps when content height changes during animations, providing a smooth user experience. It finds the nearest scrollable ancestor and temporarily locks its scroll position while the animation completes.

- Prevents forced reflows: no layout reads, mutations scoped to scrollable parent only
- Reactive: only intercepts scroll events when browser actually adjusts
- Cleans up automatically after animation duration

`import { useScrollLock } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/reasoning/useScrollLock.ts`

### [useThread](#usethread)

Deprecated: Use `useAuiState((s) =&gt; s.thread)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

Hook to access the current thread state.

This hook provides reactive access to the thread's state, including messages, running status, capabilities, and other thread-level properties.

`import { useThread } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/ThreadContext.ts`

### [useThreadComposer](#usethreadcomposer)

Deprecated: Use `useAuiState((s) =&gt; s.thread.composer)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

`import { useThreadComposer } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/ThreadContext.ts`

### [useThreadComposerAttachment](#usethreadcomposerattachment)

`import { useThreadComposerAttachment } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/AttachmentContext.ts`

### [useThreadList](#usethreadlist)

Deprecated: Use `useAuiState((s) =&gt; s.threads)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

`import { useThreadList } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/AssistantContext.ts`

### [useThreadListItem](#usethreadlistitem)

Deprecated: Use `useAuiState((s) =&gt; s.threadListItem)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

`import { useThreadListItem } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/ThreadListItemContext.ts`

### [useThreadModelContext](#usethreadmodelcontext)

Deprecated: Use `useAuiState((s) =&gt; s.thread.modelContext)` instead. See migration guide:

- href

  https\://assistant-ui.com/docs/migrations/v0-12

https\://assistant-ui.com/docs/migrations/v0-12

`import { useThreadModelContext } from "@assistant-ui/react";`

Source: `packages/react/src/legacy-runtime/hooks/ThreadContext.ts`

### [useThreadViewport](#usethreadviewport)

`import { useThreadViewport } from "@assistant-ui/react";`

Source: `packages/react/src/context/react/ThreadViewportContext.ts`

### [useThreadViewportAutoScroll](#usethreadviewportautoscroll)

`import { useThreadViewportAutoScroll } from "@assistant-ui/react";`

Source: `packages/react/src/primitives/thread/useThreadViewportAutoScroll.ts`

### [useThreadViewportStore](#usethreadviewportstore)

`import { useThreadViewportStore } from "@assistant-ui/react";`

Source: `packages/react/src/context/react/ThreadViewportContext.ts`