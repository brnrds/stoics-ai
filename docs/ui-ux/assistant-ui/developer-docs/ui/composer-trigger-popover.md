# Composer Trigger Popover
URL: /docs/ui/composer-trigger-popover

Reusable picker UI for @ mentions, / slash commands, and any other character-triggered popover.

## [Getting Started](#getting-started)

### [Add `composer-trigger-popover`](#add-composer-trigger-popover)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/composer-trigger-popover.json

#### Main Component

- packages

  - @assistant-ui/react

* code

  "use client"; import { memo, useRef, type ComponentPropsWithoutRef, type FC } from "react"; import { ComposerPrimitive } from "@assistant-ui/react"; import type { Unstable\_DirectiveFormatter, Unstable\_TriggerItem, } from "@assistant-ui/core"; import { unstable\_defaultDirectiveFormatter } from "@assistant-ui/core"; import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "lucide-react"; import { cn } from "@/lib/utils"; type IconComponent = FC<{ className?: string }>; type DirectiveBehaviorProps = { /\*\* Formatter used to serialize the selected item into composer text. \*/ formatter?: Unstable\_DirectiveFormatter | undefined; /\*\* Called after the directive text has been inserted into the composer. \*/ onInserted?: ((item: Unstable\_TriggerItem) => void) | undefined; }; type ActionBehaviorProps = { /\*\* Formatter used to serialize the audit-trail chip (when \`removeOnExecute\` is false). \*/ formatter?: Unstable\_DirectiveFormatter | undefined; /\*\* Invoked with the selected item at the moment of selection. \*/ onExecute: (item: Unstable\_TriggerItem) => void; /\*\* If \`true\`, strip the trigger text from the composer after executing. @default false \*/ removeOnExecute?: boolean | undefined; }; type ComposerTriggerPopoverBaseProps = Omit< ComponentPropsWithoutRef\<typeof ComposerPrimitive.Unstable\_TriggerPopover>, "children" > & { /\*\* \* Maps icon keys to components. Items look up via \`item.metadata?.icon\` \* (string); categories look up via their \`id\`. \*/ iconMap?: Record\<string, IconComponent>; /\*\* Fallback icon when no entry in \`iconMap\` matches. \*/ fallbackIcon?: IconComponent; /\*\* Label shown on the back button. @default "Back" \*/ backLabel?: string; /\*\* Label shown when no categories are available. @default "No items available" \*/ emptyCategoriesLabel?: string; /\*\* Label shown when no items match. @default "No matching items" \*/ emptyItemsLabel?: string; }; type ComposerTriggerPopoverProps = ComposerTriggerPopoverBaseProps & ( | { /\*\* Insert-directive behavior. \*/ directive: DirectiveBehaviorProps; action?: never; } | { /\*\* Action behavior. \*/ action: ActionBehaviorProps; directive?: never; } ); function resolveIcon( iconKey: string | undefined, iconMap: Record\<string, IconComponent> | undefined, fallback: IconComponent, ): IconComponent { if (iconKey && iconMap?.\[iconKey]) return iconMap\[iconKey]!; return fallback; } type CategoriesProps = { iconMap: Record\<string, IconComponent> | undefined; fallbackIcon: IconComponent; emptyLabel: string; }; const Categories: FC\<CategoriesProps> = ({ iconMap, fallbackIcon, emptyLabel, }) => ( \<ComposerPrimitive.Unstable\_TriggerPopoverCategories> {(categories) => ( \<div data-slot="composer-trigger-popover-categories" className="flex flex-col py-1" > {categories.map((cat) => { const Icon = resolveIcon(cat.id, iconMap, fallbackIcon); return ( \<ComposerPrimitive.Unstable\_TriggerPopoverCategoryItem key={cat.id} categoryId={cat.id} className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent data-\[highlighted]:bg-accent" > \<span className="flex items-center gap-2"> \<Icon className="size-4 text-muted-foreground" /> {cat.label} \</span> \<ChevronRightIcon className="size-4 text-muted-foreground" /> \</ComposerPrimitive.Unstable\_TriggerPopoverCategoryItem> ); })} {categories.length === 0 && ( \<div className="px-3 py-2 text-muted-foreground text-sm"> {emptyLabel} \</div> )} \</div> )} \</ComposerPrimitive.Unstable\_TriggerPopoverCategories> ); type ItemsProps = { iconMap: Record\<string, IconComponent> | undefined; fallbackIcon: IconComponent; backLabel: string; emptyLabel: string; }; const Items: FC\<ItemsProps> = ({ iconMap, fallbackIcon, backLabel, emptyLabel, }) => { return ( \<ComposerPrimitive.Unstable\_TriggerPopoverItems> {(items) => ( \<div data-slot="composer-trigger-popover-items" className="flex flex-col" > \<ComposerPrimitive.Unstable\_TriggerPopoverBack className="flex cursor-pointer items-center gap-1.5 border-b px-3 py-2 text-muted-foreground text-xs uppercase tracking-wide transition-colors hover:bg-accent"> \<ChevronLeftIcon className="size-3.5" /> {backLabel} \</ComposerPrimitive.Unstable\_TriggerPopoverBack> \<div className="py-1"> {items.map((item, index) => { const iconKey = typeof item.metadata?.icon === "string" ? item.metadata.icon : undefined; const Icon = resolveIcon(iconKey, iconMap, fallbackIcon); return ( \<ComposerPrimitive.Unstable\_TriggerPopoverItem key={item.id} item={item} index={index} className="flex w-full cursor-pointer flex-col items-start gap-0.5 px-3 py-2 text-start outline-none transition-colors hover:bg-accent focus:bg-accent data-\[highlighted]:bg-accent" > \<span className="flex items-center gap-2 font-medium text-sm"> \<Icon className="size-3.5 text-primary" /> {item.label} \</span> {item.description && ( \<span className="ms-5.5 text-muted-foreground text-xs leading-tight"> {item.description} \</span> )} \</ComposerPrimitive.Unstable\_TriggerPopoverItem> ); })} {items.length === 0 && ( \<div className="px-3 py-2 text-muted-foreground text-sm"> {emptyLabel} \</div> )} \</div> \</div> )} \</ComposerPrimitive.Unstable\_TriggerPopoverItems> ); }; /\*\* \* Pre-built popover UI for a trigger-driven picker (mentions, slash commands, etc). \* Pass exactly one of \`directive\` (inserts a chip) or \`action\` (fires a handler). \*/ const ComposerTriggerPopoverImpl: FC\<ComposerTriggerPopoverProps> = ({ iconMap, fallbackIcon = SparklesIcon, backLabel = "Back", emptyCategoriesLabel = "No items available", emptyItemsLabel = "No matching items", className, directive, action, ...props }) => { const warnedRef = useRef(false); if ( process.env.NODE\_ENV !== "production" && !warnedRef.current && Boolean(directive) === Boolean(action) ) { warnedRef.current = true; console.warn( "\[assistant-ui] ComposerTriggerPopover requires exactly one of \`directive\` or \`action\` props.", ); } return ( \<ComposerPrimitive.Unstable\_TriggerPopover data-slot="composer-trigger-popover" className={cn( "aui-composer-trigger-popover absolute start-0 bottom-full z-50 mb-2 w-64 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg", className, )} {...props} > {directive ? ( \<ComposerPrimitive.Unstable\_TriggerPopover.Directive formatter={directive.formatter ?? unstable\_defaultDirectiveFormatter} onInserted={directive.onInserted} /> ) : action ? ( \<ComposerPrimitive.Unstable\_TriggerPopover.Action formatter={action.formatter ?? unstable\_defaultDirectiveFormatter} onExecute={action.onExecute} removeOnExecute={action.removeOnExecute} /> ) : null} \<Categories iconMap={iconMap} fallbackIcon={fallbackIcon} emptyLabel={emptyCategoriesLabel} /> \<Items iconMap={iconMap} fallbackIcon={fallbackIcon} backLabel={backLabel} emptyLabel={emptyItemsLabel} /> \</ComposerPrimitive.Unstable\_TriggerPopover> ); }; ComposerTriggerPopoverImpl.displayName = "ComposerTriggerPopover"; export const ComposerTriggerPopover = memo( ComposerTriggerPopoverImpl, ) as FC\<ComposerTriggerPopoverProps>;

- lang

  tsx

- code

  "use client"; import { memo, useRef, type ComponentPropsWithoutRef, type FC } from "react"; import { ComposerPrimitive } from "@assistant-ui/react"; import type { Unstable\_DirectiveFormatter, Unstable\_TriggerItem, } from "@assistant-ui/core"; import { unstable\_defaultDirectiveFormatter } from "@assistant-ui/core"; import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "lucide-react"; import { cn } from "@/lib/utils"; type IconComponent = FC<{ className?: string }>; type DirectiveBehaviorProps = { /\*\* Formatter used to serialize the selected item into composer text. \*/ formatter?: Unstable\_DirectiveFormatter | undefined; /\*\* Called after the directive text has been inserted into the composer. \*/ onInserted?: ((item: Unstable\_TriggerItem) => void) | undefined; }; type ActionBehaviorProps = { /\*\* Formatter used to serialize the audit-trail chip (when \`removeOnExecute\` is false). \*/ formatter?: Unstable\_DirectiveFormatter | undefined; /\*\* Invoked with the selected item at the moment of selection. \*/ onExecute: (item: Unstable\_TriggerItem) => void; /\*\* If \`true\`, strip the trigger text from the composer after executing. @default false \*/ removeOnExecute?: boolean | undefined; }; type ComposerTriggerPopoverBaseProps = Omit< ComponentPropsWithoutRef\<typeof ComposerPrimitive.Unstable\_TriggerPopover>, "children" > & { /\*\* \* Maps icon keys to components. Items look up via \`item.metadata?.icon\` \* (string); categories look up via their \`id\`. \*/ iconMap?: Record\<string, IconComponent>; /\*\* Fallback icon when no entry in \`iconMap\` matches. \*/ fallbackIcon?: IconComponent; /\*\* Label shown on the back button. @default "Back" \*/ backLabel?: string; /\*\* Label shown when no categories are available. @default "No items available" \*/ emptyCategoriesLabel?: string; /\*\* Label shown when no items match. @default "No matching items" \*/ emptyItemsLabel?: string; }; type ComposerTriggerPopoverProps = ComposerTriggerPopoverBaseProps & ( | { /\*\* Insert-directive behavior. \*/ directive: DirectiveBehaviorProps; action?: never; } | { /\*\* Action behavior. \*/ action: ActionBehaviorProps; directive?: never; } ); function resolveIcon( iconKey: string | undefined, iconMap: Record\<string, IconComponent> | undefined, fallback: IconComponent, ): IconComponent { if (iconKey && iconMap?.\[iconKey]) return iconMap\[iconKey]!; return fallback; } type CategoriesProps = { iconMap: Record\<string, IconComponent> | undefined; fallbackIcon: IconComponent; emptyLabel: string; }; const Categories: FC\<CategoriesProps> = ({ iconMap, fallbackIcon, emptyLabel, }) => ( \<ComposerPrimitive.Unstable\_TriggerPopoverCategories> {(categories) => ( \<div data-slot="composer-trigger-popover-categories" className="flex flex-col py-1" > {categories.map((cat) => { const Icon = resolveIcon(cat.id, iconMap, fallbackIcon); return ( \<ComposerPrimitive.Unstable\_TriggerPopoverCategoryItem key={cat.id} categoryId={cat.id} className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent data-\[highlighted]:bg-accent" > \<span className="flex items-center gap-2"> \<Icon className="size-4 text-muted-foreground" /> {cat.label} \</span> \<ChevronRightIcon className="size-4 text-muted-foreground" /> \</ComposerPrimitive.Unstable\_TriggerPopoverCategoryItem> ); })} {categories.length === 0 && ( \<div className="px-3 py-2 text-muted-foreground text-sm"> {emptyLabel} \</div> )} \</div> )} \</ComposerPrimitive.Unstable\_TriggerPopoverCategories> ); type ItemsProps = { iconMap: Record\<string, IconComponent> | undefined; fallbackIcon: IconComponent; backLabel: string; emptyLabel: string; }; const Items: FC\<ItemsProps> = ({ iconMap, fallbackIcon, backLabel, emptyLabel, }) => { return ( \<ComposerPrimitive.Unstable\_TriggerPopoverItems> {(items) => ( \<div data-slot="composer-trigger-popover-items" className="flex flex-col" > \<ComposerPrimitive.Unstable\_TriggerPopoverBack className="flex cursor-pointer items-center gap-1.5 border-b px-3 py-2 text-muted-foreground text-xs uppercase tracking-wide transition-colors hover:bg-accent"> \<ChevronLeftIcon className="size-3.5" /> {backLabel} \</ComposerPrimitive.Unstable\_TriggerPopoverBack> \<div className="py-1"> {items.map((item, index) => { const iconKey = typeof item.metadata?.icon === "string" ? item.metadata.icon : undefined; const Icon = resolveIcon(iconKey, iconMap, fallbackIcon); return ( \<ComposerPrimitive.Unstable\_TriggerPopoverItem key={item.id} item={item} index={index} className="flex w-full cursor-pointer flex-col items-start gap-0.5 px-3 py-2 text-start outline-none transition-colors hover:bg-accent focus:bg-accent data-\[highlighted]:bg-accent" > \<span className="flex items-center gap-2 font-medium text-sm"> \<Icon className="size-3.5 text-primary" /> {item.label} \</span> {item.description && ( \<span className="ms-5.5 text-muted-foreground text-xs leading-tight"> {item.description} \</span> )} \</ComposerPrimitive.Unstable\_TriggerPopoverItem> ); })} {items.length === 0 && ( \<div className="px-3 py-2 text-muted-foreground text-sm"> {emptyLabel} \</div> )} \</div> \</div> )} \</ComposerPrimitive.Unstable\_TriggerPopoverItems> ); }; /\*\* \* Pre-built popover UI for a trigger-driven picker (mentions, slash commands, etc). \* Pass exactly one of \`directive\` (inserts a chip) or \`action\` (fires a handler). \*/ const ComposerTriggerPopoverImpl: FC\<ComposerTriggerPopoverProps> = ({ iconMap, fallbackIcon = SparklesIcon, backLabel = "Back", emptyCategoriesLabel = "No items available", emptyItemsLabel = "No matching items", className, directive, action, ...props }) => { const warnedRef = useRef(false); if ( process.env.NODE\_ENV !== "production" && !warnedRef.current && Boolean(directive) === Boolean(action) ) { warnedRef.current = true; console.warn( "\[assistant-ui] ComposerTriggerPopover requires exactly one of \`directive\` or \`action\` props.", ); } return ( \<ComposerPrimitive.Unstable\_TriggerPopover data-slot="composer-trigger-popover" className={cn( "aui-composer-trigger-popover absolute start-0 bottom-full z-50 mb-2 w-64 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg", className, )} {...props} > {directive ? ( \<ComposerPrimitive.Unstable\_TriggerPopover.Directive formatter={directive.formatter ?? unstable\_defaultDirectiveFormatter} onInserted={directive.onInserted} /> ) : action ? ( \<ComposerPrimitive.Unstable\_TriggerPopover.Action formatter={action.formatter ?? unstable\_defaultDirectiveFormatter} onExecute={action.onExecute} removeOnExecute={action.removeOnExecute} /> ) : null} \<Categories iconMap={iconMap} fallbackIcon={fallbackIcon} emptyLabel={emptyCategoriesLabel} /> \<Items iconMap={iconMap} fallbackIcon={fallbackIcon} backLabel={backLabel} emptyLabel={emptyItemsLabel} /> \</ComposerPrimitive.Unstable\_TriggerPopover> ); }; ComposerTriggerPopoverImpl.displayName = "ComposerTriggerPopover"; export const ComposerTriggerPopover = memo( ComposerTriggerPopoverImpl, ) as FC\<ComposerTriggerPopoverProps>;

This adds `/components/assistant-ui/composer-trigger-popover.tsx` — a generic picker UI (Categories + Items + Back) driven by an adapter and one of two behavior props: `directive` (insert a chip) or `action` (run a callback).

### [Wrap the composer](#wrap-the-composer)

Place `ComposerPrimitive.Unstable_TriggerPopoverRoot` around your composer. Any number of `ComposerTriggerPopover` declarations can live inside — each with its own trigger character, adapter, and behavior prop.

- title

  components/assistant-ui/thread.tsx

`import { ComposerPrimitive } from "@assistant-ui/react"; import { ComposerTriggerPopover } from "@/components/assistant-ui/composer-trigger-popover"; const Composer = () => ( <ComposerPrimitive.Unstable_TriggerPopoverRoot> <ComposerPrimitive.Root> <ComposerPrimitive.Input placeholder="Type @ to mention, / for commands..." /> <ComposerPrimitive.Send /> {/* triggers declared here */} </ComposerPrimitive.Root> </ComposerPrimitive.Unstable_TriggerPopoverRoot> );`

## [@ Mention](#-mention)

Pair the popover with `unstable_useMentionAdapter` — the hook returns a spreadable `{ adapter, directive }` bundle so selecting an item writes a `:tool[Label]{name=id}` directive into the composer text.

`import { unstable_useMentionAdapter } from "@assistant-ui/react"; import { WrenchIcon } from "lucide-react"; const mention = unstable_useMentionAdapter(); <ComposerTriggerPopover char="@" {...mention} fallbackIcon={WrenchIcon} />;`

Override formatter or add an `onInserted` callback via hook options: `unstable_useMentionAdapter({ formatter, onInserted })`.

`unstable_useMentionAdapter` also accepts `items` (flat custom list), `categories` (multi-category drill-down), and `includeModelContextTools` for fine-grained control. See the

- href

  /docs/guides/mentions#built-in-mention-adapter

Mentions guide

.

Render selected mentions as chips in user messages with

- href

  /docs/ui/directive-text

`DirectiveText`

. For inline chips **inside** the composer, use

- href

  /docs/guides/mentions#textarea-vs-lexical

`LexicalComposerInput`

.

## [/ Slash Command](#-slash-command)

Use

- href

  /docs/guides/slash-commands

`unstable_useSlashCommandAdapter`

to bundle commands (data + `execute`) into `{ adapter, action }` — then plug both into `ComposerTriggerPopover`. By default a directive chip is left in the composer as an audit trail; pass `removeOnExecute` to strip the `/command` text entirely. `iconMap` maps `metadata.icon` strings on items and categories to Lucide icons.`import { unstable_useSlashCommandAdapter, type Unstable_SlashCommand, } from "@assistant-ui/react"; import { FileTextIcon, GlobeIcon, LanguagesIcon, SlashIcon } from "lucide-react"; const SLASH_COMMANDS: readonly Unstable_SlashCommand[] = [ { id: "summarize", description: "Summarize the conversation", icon: "FileText", execute: () => {/* ... */}, }, { id: "translate", description: "Translate to another language", icon: "Languages", execute: () => {/* ... */}, }, { id: "search", description: "Search the web", icon: "Globe", execute: () => {/* ... */}, }, ]; function SlashComposer() { const slash = unstable_useSlashCommandAdapter({ commands: SLASH_COMMANDS }); return ( <ComposerTriggerPopover char="/" {...slash} iconMap={{ FileText: FileTextIcon, Languages: LanguagesIcon, Globe: GlobeIcon, }} fallbackIcon={SlashIcon} /> ); }`

## [Combining Triggers](#combining-triggers)

Multiple popovers coexist under one `TriggerPopoverRoot`. Each reads state from its own declaration, so `@` and `/` never collide.

`const commandHandlers: Record<string, () => void> = { summarize: () => {/* ... */}, translate: () => {/* ... */}, }; <ComposerPrimitive.Unstable_TriggerPopoverRoot> <ComposerPrimitive.Root> <ComposerPrimitive.Input placeholder="Type @ to mention, / for commands..." /> <ComposerTriggerPopover char="@" adapter={mentionAdapter} directive={{ formatter: unstable_defaultDirectiveFormatter }} fallbackIcon={WrenchIcon} /> <ComposerTriggerPopover char="/" adapter={slashAdapter} action={{ formatter: unstable_defaultDirectiveFormatter, onExecute: (item) => commandHandlers[item.id]?.(), }} iconMap={slashIcons} fallbackIcon={SlashIcon} /> </ComposerPrimitive.Root> </ComposerPrimitive.Unstable_TriggerPopoverRoot>`

## [Keyboard Navigation](#keyboard-navigation)

| Key             | Action                                        |
| --------------- | --------------------------------------------- |
| `ArrowDown`     | Highlight next item                           |
| `ArrowUp`       | Highlight previous item                       |
| `Enter` / `Tab` | Select highlighted item / drill into category |
| `Shift + Enter` | Insert newline (popover stays open)           |
| `Shift + Tab`   | Pass through (native focus traversal)         |
| `Escape`        | Close popover                                 |
| `Backspace`     | Go back to categories (when query is empty)   |

## [Accessibility](#accessibility)

The popover implements the WAI-ARIA editable combobox pattern.

- The listbox container has `role="listbox"` and each item has `role="option"` plus `aria-selected`.
- When a popover is open, `ComposerPrimitive.Input` (the underlying `<textarea>`) automatically receives `aria-controls`, `aria-expanded="true"`, `aria-haspopup="listbox"`, and `aria-activedescendant` pointing at the highlighted option. Attributes are removed when the popover closes.
- When `ComposerPrimitive.Input` is rendered outside a `TriggerPopoverRoot`, no ARIA attributes are added.

## [API Reference](#api-reference)

| Prop                   | Type                                                | Default                | Description                                                               |
| ---------------------- | --------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------- |
| `char`                 | `string`                                            | —                      | Trigger character, e.g. `"@"` or `"/"` (required; unique within the root) |
| `adapter`              | `Unstable_TriggerAdapter`                           | —                      | Provides categories, items, and search (required)                         |
| `directive`            | `{ formatter, onInserted?, chip? }`                 | —                      | Enables directive-insert behavior. Mutually exclusive with `action`.      |
| `action`               | `{ formatter, onExecute, removeOnExecute?, chip? }` | —                      | Enables action behavior. Mutually exclusive with `directive`.             |
| `iconMap`              | `Record<string, IconComponent>`                     | —                      | Maps `item.metadata.icon` / `category.metadata.icon` strings to icons     |
| `fallbackIcon`         | `IconComponent`                                     | `SparklesIcon`         | Icon used when no `iconMap` entry matches                                 |
| `backLabel`            | `string`                                            | `"Back"`               | Back button label                                                         |
| `emptyCategoriesLabel` | `string`                                            | `"No items available"` | Shown when no categories are available                                    |
| `emptyItemsLabel`      | `string`                                            | `"No matching items"`  | Shown when no items match                                                 |

All other props (`className`, etc.) forward to the underlying popover `div`.

### [`directive` object](#directive-object)

| Field        | Type                          | Description                                                                  |
| ------------ | ----------------------------- | ---------------------------------------------------------------------------- |
| `formatter`  | `Unstable_DirectiveFormatter` | Serializes the selected item into the directive text written to the composer |
| `onInserted` | `(item) => void`              | Optional callback fired after the directive has been inserted                |

### [`action` object](#action-object)

| Field             | Type                          | Description                                                                            |
| ----------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| `formatter`       | `Unstable_DirectiveFormatter` | Serializes the selected item into the chip left behind (unused when `removeOnExecute`) |
| `onExecute`       | `(item) => void`              | Callback fired when an item is selected                                                |
| `removeOnExecute` | `boolean`                     | When `true`, strips the trigger text instead of leaving a chip. Default `false`.       |

## [Related](#related)

- - href

    /docs/ui/directive-text

  Directive Text

  — renderer for mention chips in user messages

- - href

    /docs/guides/mentions

  Mentions guide

  — `@`-mention architecture and formatter details

- - href

    /docs/guides/slash-commands

  Slash Commands guide

  — `/`-command architecture