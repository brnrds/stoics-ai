# Migrating to react-langgraph v0.7
URL: /docs/migrations/react-langgraph-v0-7

Guide to upgrading to the simplified LangGraph integration API.

## [Overview](#overview)

This guide helps you migrate from the previous LangGraph integration pattern to the new simplified API introduced in `@assistant-ui/react-langgraph` v0.7. The new API consolidates thread management directly into `useLangGraphRuntime`, eliminating the need for separate runtime hooks and manual thread state management.

## [Key Changes](#key-changes)

### [1. Simplified Thread Management](#1-simplified-thread-management)

The `useLangGraphRuntime` hook now directly handles thread lifecycle:

- No more `useRemoteThreadListRuntime` wrapper
- No more separate runtime hook functions
- Thread management is built into the core runtime

### [2. New `initialize` Parameter](#2-new-initialize-parameter)

The `stream` function now receives an `initialize` parameter that handles thread creation and loading automatically.

### [3. Direct Cloud Integration](#3-direct-cloud-integration)

Cloud persistence can now be configured directly in `useLangGraphRuntime` with the `cloud` parameter.

## [Migration Steps](#migration-steps)

### [Update Your Runtime Implementation](#update-your-runtime-implementation)

#### [Before (Old Pattern)](#before-old-pattern)

`import { useCloudThreadListRuntime, useThreadListItemRuntime, } from "@assistant-ui/react"; import { useLangGraphRuntime } from "@assistant-ui/react-langgraph"; const useMyLangGraphRuntime = () => { const threadListItemRuntime = useThreadListItemRuntime(); const runtime = useLangGraphRuntime({ stream: async function* (messages) { const { externalId } = await threadListItemRuntime.initialize(); if (!externalId) throw new Error("Thread not found"); return sendMessage({ threadId: externalId, messages, }); }, onSwitchToThread: async (externalId) => { const state = await getThreadState(externalId); return { messages: state.values.messages, }; }, }); return runtime; }; // In your component: const runtime = useCloudThreadListRuntime({ cloud, runtimeHook: useMyLangGraphRuntime, create: async () => { const { thread_id } = await createThread(); return { externalId: thread_id }; }, });`

#### [After (New Pattern)](#after-new-pattern)

`import { useLangGraphRuntime } from "@assistant-ui/react-langgraph"; // Directly in your component: const runtime = useLangGraphRuntime({ cloud, // Optional: for cloud persistence stream: async function* (messages, { initialize }) { const { externalId } = await initialize(); if (!externalId) throw new Error("Thread not found"); return sendMessage({ threadId: externalId, messages, }); }, create: async () => { const { thread_id } = await createThread(); return { externalId: thread_id }; }, load: async (externalId) => { const state = await getThreadState(externalId); return { messages: state.values.messages, }; }, });`

### [Update Import Statements](#update-import-statements)

Remove unused imports:

`- import { - useCloudThreadListRuntime, - useThreadListItemRuntime, - } from "@assistant-ui/react"; + import { AssistantCloud } from "@assistant-ui/react";`

### [Simplify Component Structure](#simplify-component-structure)

You no longer need a separate runtime hook function. Everything can be defined directly in your component or provider:

`export function MyRuntimeProvider({ children }) { const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL, anonymous: true, }), [] ); const runtime = useLangGraphRuntime({ cloud, // All configuration inline stream: async function* (messages, { initialize }) { // Your stream implementation }, create: async () => { // Your create implementation }, load: async (externalId) => { // Your load implementation }, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

### [Update Method Names](#update-method-names)

Rename methods to match the new API:

- `onSwitchToThread` → `load`
- `onSwitchToNewThread` → handled automatically via `create`
- Thread ID management is now automatic

## [API Reference Changes](#api-reference-changes)

### [Old API](#old-api)

`type OldLangGraphRuntimeOptions = { threadId?: string; stream: (messages: Message[]) => AsyncGenerator; onSwitchToNewThread?: () => Promise<void>; onSwitchToThread?: (threadId: string) => Promise<ThreadState>; };`

### [New API](#new-api)

`type NewLangGraphRuntimeOptions = { cloud?: AssistantCloud; stream: ( messages: Message[], config: { abortSignal: AbortSignal; initialize: () => Promise<{ remoteId: string; externalId: string | undefined; }>; command?: { resume: string }; runConfig?: unknown; checkpointId?: string; } ) => AsyncGenerator; create?: () => Promise<{ externalId: string }>; load?: (threadId: string) => Promise<ThreadState>; delete?: (threadId: string) => Promise<void>; };`

## [Benefits of the New API](#benefits-of-the-new-api)

1. **Simpler Setup**: No need for multiple runtime hooks and wrappers
2. **Cleaner Code**: All configuration in one place
3. **Better Type Safety**: More explicit types for thread management
4. **Automatic Thread Handling**: The runtime manages thread lifecycle internally
5. **Optional Cloud Integration**: Add cloud persistence with a single parameter

## [Common Migration Issues](#common-migration-issues)

**Breaking Change**: The `threadId` and `onSwitchToNewThread` parameters are no longer supported. Use the new `create` and `load` methods instead.

### [Issue: `threadListItemRuntime` is not defined](#issue-threadlistitemruntime-is-not-defined)

**Solution**: Remove references to `useThreadListItemRuntime()`. Use the `initialize` parameter in the stream function instead.

### [Issue: Thread switching doesn't work](#issue-thread-switching-doesnt-work)

**Solution**: Ensure you've implemented both `create` and `load` functions. The runtime needs both to manage thread lifecycle.

### [Issue: Cloud persistence not working](#issue-cloud-persistence-not-working)

**Solution**: Pass the `AssistantCloud` instance directly to `useLangGraphRuntime` via the `cloud` parameter.

## [Example: Complete Migration](#example-complete-migration)

Here's a complete before and after example for a typical LangGraph integration:

### [Before](#before)

- title

  runtime-provider.tsx

`import { AssistantCloud, AssistantRuntimeProvider, useCloudThreadListRuntime, useThreadListItemRuntime, } from "@assistant-ui/react"; import { useLangGraphRuntime } from "@assistant-ui/react-langgraph"; const useMyRuntime = () => { const threadListItemRuntime = useThreadListItemRuntime(); return useLangGraphRuntime({ stream: async function* (messages) { const { externalId } = await threadListItemRuntime.initialize(); // ... implementation }, onSwitchToThread: async (externalId) => { // ... implementation }, }); }; export function Provider({ children }) { const cloud = new AssistantCloud({ /* config */ }); const runtime = useCloudThreadListRuntime({ cloud, runtimeHook: useMyRuntime, create: async () => { /* ... */ }, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

### [After](#after)

- title

  runtime-provider.tsx

`import { AssistantCloud, AssistantRuntimeProvider, } from "@assistant-ui/react"; import { useLangGraphRuntime } from "@assistant-ui/react-langgraph"; export function Provider({ children }) { const cloud = new AssistantCloud({ /* config */ }); const runtime = useLangGraphRuntime({ cloud, stream: async function* (messages, { initialize }) { const { externalId } = await initialize(); // ... implementation }, create: async () => { /* ... */ }, load: async (externalId) => { // ... implementation (formerly onSwitchToThread) }, }); return ( <AssistantRuntimeProvider runtime={runtime}> {children} </AssistantRuntimeProvider> ); }`

## [Need Help?](#need-help)

If you encounter issues during migration:

1. Check the updated

   - href

     /docs/runtimes/langgraph

   LangGraph documentation

2. Review the

   - href

     https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-langgraph

   example implementation

3. Report issues on

   - href

     https\://github.com/assistant-ui/assistant-ui/issues

   GitHub