# AttachmentRuntime
URL: /docs/api-reference/runtimes/attachment-runtime

AttachmentRuntime state and actions for reading attachment data and controlling files inside assistant-ui messages and composers.

## [API Reference](#api-reference)

### [AttachmentRuntime](#attachmentruntime)

`AttachmentRuntime`

- `path` `: AttachmentRuntimePath & { attachmentSource: TSource }`

  - `ref` `: string`

  - `threadSelector` `: AttachmentRuntime["path"]["threadSelector"]`

    - `type` `: "main"`

  - `attachmentSource` `: "message" | "edit-composer"`

  - `attachmentSelector` `: AttachmentRuntime["path"]["attachmentSelector"]`

    - `type` `: "index"`
    - `index` `: number`

- `source` `: TSource`

- `getState` `: () => AttachmentState & { source: TSource; }`

- `remove` `: () => Promise<void>`

- `subscribe` `: (callback: () => void) => Unsubscribe`

### [AttachmentState](#attachmentstate)

`AttachmentState`

- `id` `: string`

- `type` `: "image" | "document" | "file" | (string & {})`

- `name` `: string`

- `contentType` `?: string`

- `file` `?: File`

  - `lastModified` `: number`

    The \*\*\`lastModified\`\*\* read-only property of the File interface provides the last modified date of the file as the number of milliseconds since the Unix epoch (January 1, 1970 at midnight). Files without a known last modified date return the current date. [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/lastModified)

  - `name` `: string`

    The \*\*\`name\`\*\* read-only property of the File interface returns the name of the file represented by a File object. For security reasons, the path is excluded from this property. [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/name)

  - `webkitRelativePath` `: string`

    The \*\*\`webkitRelativePath\`\*\* read-only property of the File interface contains a string which specifies the file's path relative to the directory selected by the user in an \<input> element with its webkitdirectory attribute set. [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/webkitRelativePath)

  - `size` `: number`

  - `type` `: string`

  - `arrayBuffer` `: () => Promise<ArrayBuffer>`

  - `bytes` `: () => Promise<Uint8Array<ArrayBuffer>>`

  - `slice` `: (start?: number, end?: number, contentType?: string) => Blob`

  - `stream` `: () => ReadableStream<Uint8Array<ArrayBuffer>>`

  - `text` `: () => Promise<string>`

- `content` `?: ThreadUserMessagePart[]`

- `status` `: PendingAttachmentStatus`

  - `type` `: "complete"`

- `source` `: "thread-composer"`