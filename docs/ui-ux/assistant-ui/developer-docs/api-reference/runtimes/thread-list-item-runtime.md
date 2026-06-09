# ThreadListItemRuntime
URL: /docs/api-reference/runtimes/thread-list-item-runtime

ThreadListItemRuntime state and actions for selecting, archiving, unarchiving, deleting, and renaming assistant-ui conversations.

## [API Reference](#api-reference)

### [ThreadListItemRuntime](#threadlistitemruntime)

`ThreadListItemRuntime`

- `path` `: ThreadListItemRuntimePath`

  - `ref` `: string`

  - `threadSelector` `: ThreadListItemRuntimePath["threadSelector"]`

    - `type` `: "main"`

- `getState` `: () => ThreadListItemState`

- `initialize` `: () => Promise<{ remoteId: string; externalId: string | undefined; }>`

- `generateTitle` `: () => Promise<void>`

- `switchTo` `: () => Promise<void>`

- `rename` `: (newTitle: string) => Promise<void>`

- `archive` `: () => Promise<void>`

- `unarchive` `: () => Promise<void>`

- `delete` `: () => Promise<void>`

- `detach` `: () => void`

- `subscribe` `: (callback: () => void) => Unsubscribe`

- `unstable_on`

  - variant

    unstable

  `: <E extends ThreadListItemEventType>(event: E, callback: ThreadListItemEventCallback<E>) => Unsubscribe`

### [ThreadListItemState](#threadlistitemstate)

`ThreadListItemState`

- `isMain` `: boolean`
- `id` `: string`
- `remoteId` `?: string`
- `externalId` `?: string`
- `status` `: ThreadListItemStatus`
- `title` `?: string`
- `custom` `?: Record<string, unknown>`