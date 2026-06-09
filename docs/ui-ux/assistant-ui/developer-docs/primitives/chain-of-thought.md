# ChainOfThought
URL: /docs/primitives/chain-of-thought

Collapsible accordion for grouping reasoning steps and tool calls.

The ChainOfThought primitive is the legacy accordion API for grouped reasoning and tool-call parts. Reasoning models emit reasoning tokens and tool calls before producing a final answer.

For new grouped reasoning/tool-call UI, use `MessagePrimitive.GroupedParts`. `ChainOfThoughtPrimitive` and `components.ChainOfThought` remain available for maintaining existing code.

- items

  - Preview
  - Code

`import { MessagePrimitive } from "@assistant-ui/react"; function AssistantMessage() { return ( <MessagePrimitive.Root> <MessagePrimitive.GroupedParts groupBy={(part) => { if (part.type === "reasoning") return ["group-chainOfThought", "group-reasoning"]; if (part.type === "tool-call") return ["group-chainOfThought", "group-tool"]; return null; }} > {({ part, children }) => { switch (part.type) { case "group-chainOfThought": return <ThinkingAccordion>{children}</ThinkingAccordion>; case "group-reasoning": return <ReasoningGroup>{children}</ReasoningGroup>; case "group-tool": return <ToolGroup>{children}</ToolGroup>; case "text": return <MyText />; case "reasoning": return <MyReasoning {...part} />; case "tool-call": return part.toolUI ?? <MyToolFallback {...part} />; default: return null; } }} </MessagePrimitive.GroupedParts> </MessagePrimitive.Root> ); }`

## [Recommended: GroupedParts](#recommended-groupedparts)

Group reasoning and tool-call parts directly in your assistant message:

`import { MessagePrimitive } from "@assistant-ui/react"; <MessagePrimitive.Root> <MessagePrimitive.GroupedParts groupBy={(part) => { if (part.type === "reasoning") return ["group-chainOfThought", "group-reasoning"]; if (part.type === "tool-call") return ["group-chainOfThought", "group-tool"]; return null; }} > {({ part, children }) => { switch (part.type) { case "group-chainOfThought": return <ThinkingAccordion>{children}</ThinkingAccordion>; case "group-reasoning": return <ReasoningGroup>{children}</ReasoningGroup>; case "group-tool": return <ToolGroup>{children}</ToolGroup>; case "text": return <MyText />; case "reasoning": return <MyReasoning {...part} />; case "tool-call": return part.toolUI ?? <MyToolFallback {...part} />; default: return null; } }} </MessagePrimitive.GroupedParts> </MessagePrimitive.Root>`

### [GroupedParts API Reference](#groupedparts-api-reference)

- rows

  - - name

      groupBy

    - type

      ```
      (part: PartState, index: number, parts: readonly PartStat...
      ```

    - typeFull

      ```
      (part: PartState, index: number, parts: readonly PartState[]) => GroupKey<TKey>
      ```

    - description

      - Maps each part to its group key path. Adjacent parts that share a\
        prefix coalesce up to that prefix. Return \`null\`, \`undefined\`, or\
        \`\[]\` to leave a part ungrouped — it will be rendered as a leaf\
        through \`children\` with \`part\` set to its EnrichedPartState.\
        \
        Keys must start with \`"group-"\` so the renderer's\
        \`switch (part.type)\` can distinguish groups from real part types.\
        \
        For best performance, pass a stable reference (module-level\
        constant or \`useCallback\`).

  - - name

      children

    - type

      ```
      (info: RenderInfo<TKey>) => ReactNode
      ```

    - description

      - Render function called once per group node and once per leaf part.\
        Switch on \`part.type\`: \`"group-…"\` cases wrap \`children\`; real\
        part types (\`"text"\`, \`"tool-call"\`, …) render the part directly.\
        \
        Leaf parts receive the same EnrichedPartState that\
        \`\<MessagePrimitive.Parts>\` would produce (\`toolUI\`, \`addResult\`,\
        \`resume\`, \`dataRendererUI\`).

## [Legacy: ChainOfThoughtPrimitive](#legacy-chainofthoughtprimitive)

### [Quick Start](#quick-start)

Render your normal message parts with `MessagePrimitive.Parts`, then place a `ChainOfThought` component alongside them inside the same `MessagePrimitive.Root` only when maintaining older code that already uses the ChainOfThought primitive.

Runtime setup: primitives require runtime context. Wrap your UI in `AssistantRuntimeProvider` with a runtime (for example `useLocalRuntime(...)`). See

- href

  /docs/runtimes/pick-a-runtime

Pick a Runtime

.

### [Concepts](#concepts)

#### [How Grouping Works](#how-grouping-works)

`ChainOfThoughtPrimitive.Parts` reads the current message's grouped reasoning and tool-call context from the legacy `components.ChainOfThought` path. New code should use `MessagePrimitive.GroupedParts` instead.

#### [Collapsed State](#collapsed-state)

The accordion starts collapsed by default. `AccordionTrigger` toggles between collapsed and expanded. Use `AuiIf` to conditionally render parts based on the collapsed state:

`import { AuiIf, ChainOfThoughtPrimitive } from "@assistant-ui/react"; <ChainOfThoughtPrimitive.Root> <ChainOfThoughtPrimitive.AccordionTrigger> Thinking </ChainOfThoughtPrimitive.AccordionTrigger> <AuiIf condition={(s) => !s.chainOfThought.collapsed}> <ChainOfThoughtPrimitive.Parts components={{ Reasoning }} /> </AuiIf> </ChainOfThoughtPrimitive.Root>`

#### [Chevron Indicators](#chevron-indicators)

Use `AuiIf` to show directional icons that reflect the current state:

`import { AuiIf, ChainOfThoughtPrimitive } from "@assistant-ui/react"; import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"; <ChainOfThoughtPrimitive.AccordionTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm"> <AuiIf condition={(s) => s.chainOfThought.collapsed}> <ChevronRightIcon className="size-4" /> </AuiIf> <AuiIf condition={(s) => !s.chainOfThought.collapsed}> <ChevronDownIcon className="size-4" /> </AuiIf> Thinking </ChainOfThoughtPrimitive.AccordionTrigger>`

#### [Parts Components](#parts-components)

`ChainOfThoughtPrimitive.Parts` accepts a deprecated `components` prop to control how each part type renders:

``<ChainOfThoughtPrimitive.Parts components={{ Reasoning: ({ text }) => ( <p className="whitespace-pre-wrap px-4 py-2 text-muted-foreground text-sm italic"> {text} </p> ), tools: { Fallback: ({ toolName, status }) => ( <div className="px-4 py-2 text-sm"> {status.type === "running" ? `Running ${toolName}...` : `${toolName} completed`} </div> ), }, Layout: ({ children }) => ( <div className="border-t">{children}</div> ), }} />``

| Prop                        | Type                               | Description                       |
| --------------------------- | ---------------------------------- | --------------------------------- |
| `components.Reasoning`      | `FC<{ text: string }>`             | Renders reasoning parts           |
| `components.tools.Fallback` | `ToolCallMessagePartComponent`     | Fallback for tool-call parts      |
| `components.Layout`         | `ComponentType<PropsWithChildren>` | Wrapper around each rendered part |

### [Parts API Reference](#parts-api-reference)

#### [Root](#root)

Container for the chain-of-thought disclosure UI. Renders a `<div>` element unless `asChild` is set.

`<ChainOfThoughtPrimitive.Root className="rounded-lg border"> ... </ChainOfThoughtPrimitive.Root>`

#### [AccordionTrigger](#accordiontrigger)

Trigger that toggles the collapsed state. Renders a `<button>` element unless `asChild` is set.

`<ChainOfThoughtPrimitive.AccordionTrigger className="flex w-full items-center justify-between px-4 py-2 text-sm"> Thinking </ChainOfThoughtPrimitive.AccordionTrigger>`

#### [Parts](#parts)

Renders reasoning and tool-call parts. This component does not track collapsed state internally, so control visibility with `AuiIf` as shown in the patterns below.

``<ChainOfThoughtPrimitive.Parts components={{ Reasoning: ({ text }) => ( <p className="whitespace-pre-wrap px-4 py-2 text-muted-foreground text-sm italic"> {text} </p> ), tools: { Fallback: ({ toolName, status }) => ( <div className="px-4 py-2 text-sm"> {status.type === "running" ? `Running ${toolName}...` : `${toolName} completed`} </div> ), }, }} />``

- rows

  - - name

      components

    - type

      ```
      ChainOfThoughtPartsComponentConfig
      ```

    - description

      - - variant

          deprecated

        Use the children render function instead.

  - - name

      children

    - type

      ```
      (value: object) => ReactNode
      ```

    - typeFull

      ```
      (value: { part: PartState; }) => ReactNode
      ```

    - description

      - Render function called for each part. Receives the part.

### [Patterns](#patterns)

#### [Minimal Accordion](#minimal-accordion)

`function ChainOfThought() { return ( <ChainOfThoughtPrimitive.Root className="my-2 rounded-lg border"> <ChainOfThoughtPrimitive.AccordionTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 font-medium text-sm hover:bg-muted/50"> Thinking </ChainOfThoughtPrimitive.AccordionTrigger> <AuiIf condition={(s) => !s.chainOfThought.collapsed}> <ChainOfThoughtPrimitive.Parts components={{ Reasoning: ({ text }) => ( <p className="whitespace-pre-wrap px-4 py-2 text-muted-foreground text-sm italic"> {text} </p> ), }} /> </AuiIf> </ChainOfThoughtPrimitive.Root> ); }`

#### [With Tool Calls](#with-tool-calls)

`function ChainOfThought() { return ( <ChainOfThoughtPrimitive.Root className="my-2 rounded-lg border"> <ChainOfThoughtPrimitive.AccordionTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 font-medium text-sm hover:bg-muted/50"> Thinking </ChainOfThoughtPrimitive.AccordionTrigger> <AuiIf condition={(s) => !s.chainOfThought.collapsed}> <ChainOfThoughtPrimitive.Parts components={{ Reasoning: ({ text }) => ( <p className="whitespace-pre-wrap px-4 py-2 text-muted-foreground text-sm italic"> {text} </p> ), tools: { Fallback: ({ toolName, status }) => ( <div className="flex items-center gap-2 px-4 py-2 text-sm"> <span className="font-medium">{toolName}</span> <span className="text-muted-foreground"> {status.type === "running" ? "running..." : "done"} </span> </div> ), }, Layout: ({ children }) => ( <div className="border-t">{children}</div> ), }} /> </AuiIf> </ChainOfThoughtPrimitive.Root> ); }`

### [Relationship to Components](#relationship-to-components)

The

- href

  /docs/guides/chain-of-thought

Chain of Thought guide

covers end-to-end setup with `MessagePrimitive.GroupedParts`, including backend configuration with reasoning models. See the complete

- href

  https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-chain-of-thought

with-chain-of-thought example

for a full working implementation.

### [API Reference](#api-reference)

For the complete guide including backend configuration, see

- href

  /docs/guides/chain-of-thought

Chain of Thought

. For prop details, see the

- href

  https\://github.com/assistant-ui/assistant-ui/tree/main/packages/react/src/primitives/chainOfThought

ChainOfThoughtPrimitive source

.

Related:

- - href

    /docs/guides/chain-of-thought

  Chain of Thought Guide

- - href

    /docs/primitives/message

  MessagePrimitive