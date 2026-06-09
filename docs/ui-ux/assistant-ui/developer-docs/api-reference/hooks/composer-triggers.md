# Composer Trigger Hooks
URL: /docs/api-reference/hooks/composer-triggers

Unstable assistant-ui hooks for mention menus, slash commands, and custom composer trigger popovers.

## [API Reference](#api-reference)

### [unstable\_useTriggerPopoverRootContext](#unstable_usetriggerpopoverrootcontext)

`const unstable_useTriggerPopoverRootContext: () => TriggerPopoverRootContextValue;`

### [unstable\_useTriggerPopoverRootContextOptional](#unstable_usetriggerpopoverrootcontextoptional)

`const unstable_useTriggerPopoverRootContextOptional: () => TriggerPopoverRootContextValue | null;`

### [unstable\_useTriggerPopoverScopeContext](#unstable_usetriggerpopoverscopecontext)

`const unstable_useTriggerPopoverScopeContext: () => TriggerPopoverResourceOutput;`

### [unstable\_useTriggerPopoverScopeContextOptional](#unstable_usetriggerpopoverscopecontextoptional)

`const unstable_useTriggerPopoverScopeContextOptional: () => TriggerPopoverResourceOutput | null;`

### [unstable\_useTriggerPopoverTriggers](#unstable_usetriggerpopovertriggers)

Live map of registered triggers, re-rendering on change. Prefer `subscribeLifecycle` for incremental add/remove handling.

`const unstable_useTriggerPopoverTriggers: () => ReadonlyMap<string, RegisteredTrigger>;`

### [unstable\_useTriggerPopoverTriggersOptional](#unstable_usetriggerpopovertriggersoptional)

Like `useTriggerPopoverTriggers` but returns an empty map outside a root.

`const unstable_useTriggerPopoverTriggersOptional: () => ReadonlyMap<string, RegisteredTrigger>;`

### [unstable\_useMentionAdapter](#unstable_usementionadapter)

**Deprecated.** Under active development and might change without notice.

Creates a spreadable `{ adapter, directive }` bundle for `@` mentions. Supports tools registered via `useAssistantTool`, explicit items, or both — flat or categorized.

`unstable_useMentionAdapter`

- `options` `?: Unstable_UseMentionAdapterOptions`

  - `items` `?: readonly Unstable_Mention[]`

    Flat mention list. Ignored when \`categories\` is set.

  - `categories` `?: readonly Unstable_MentionCategory[]`

    Categorized mentions for drill-down navigation.

  - `includeModelContextTools` `?: boolean | Unstable_ModelContextToolsOptions`

    How tools registered via \`useAssistantTool\` integrate. - \`false\`: exclude. - \`true\`: include (default when no \`items\`/\`categories\`; as a category if \`categories\` is set, flat otherwise). - object: explicit config. Omitted → defaults to \`true\` iff neither \`items\` nor \`categories\`.

  - `formatter` `: Unstable_DirectiveFormatter` = unstable\_defaultDirectiveFormatter

    Directive formatter.

    - `serialize` `: (item: Unstable_TriggerItem) => string`

      Serialize a trigger item to directive text.

    - `parse` `: (text: string) => readonly Unstable_DirectiveSegment[]`

      Parse text into alternating text and directive segments.

  - `onInserted` `?: (item: Unstable_TriggerItem) => void`

    Fires after an item is inserted into the composer.

  - `iconMap` `?: Record<string, Unstable_IconComponent>`

    Maps \`metadata.icon\` / \`category.id\` string keys to React components.

  - `fallbackIcon` `?: Unstable_IconComponent`

    Fallback icon when no entry in \`iconMap\` matches.

### [unstable\_useSlashCommandAdapter](#unstable_useslashcommandadapter)

**Deprecated.** Under active development and may change without notice.

Bundles slash command definitions (with inline `execute` callbacks) into `{adapter, action}` that plug directly into `ComposerTriggerPopover`. `execute` stays in the hook closure and is never attached to the returned `TriggerItem`, keeping items serializable.

`unstable_useSlashCommandAdapter`

- `options` `: Unstable_UseSlashCommandAdapterOptions`

  - `commands` `: readonly Unstable_SlashCommand[]`

  - `removeOnExecute` `: boolean` = false

    Strip the trigger text from the composer after executing.

  - `iconMap` `?: Record<string, Unstable_IconComponent>`

    Maps \`metadata.icon\` / \`category.id\` string keys to React components.

  - `fallbackIcon` `?: Unstable_IconComponent`

    Fallback icon when no entry in \`iconMap\` matches.