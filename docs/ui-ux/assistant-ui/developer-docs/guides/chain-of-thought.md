# Chain of Thought UI
URL: /docs/guides/chain-of-thought

Show AI reasoning steps and tool calls in a collapsible thinking accordion. Build chain-of-thought visualizations in React chat with assistant-ui.

LLMs often produce reasoning steps and tool calls in succession. Chain of Thought lets you visually group these consecutive parts into a single collapsible accordion, giving users a clean "thinking" UI.

## [Overview](#overview)

When a reasoning model responds, it may emit a sequence of reasoning tokens and tool calls before producing its final text answer. Use `MessagePrimitive.GroupedParts` to group those adjacent reasoning and tool-call parts into a single collapsible "thinking" section.

The older `components.ChainOfThought` prop on `MessagePrimitive.Parts` and `components` prop on `ChainOfThoughtPrimitive.Parts` are legacy APIs. They still work for existing code, but new code should use `MessagePrimitive.GroupedParts`.

## [Quick Start](#quick-start)

### [Wire GroupedParts into your assistant message](#wire-groupedparts-into-your-assistant-message)

Return the same top-level group for reasoning and tool calls, with nested groups for each type:

`import { MessagePrimitive, } from "@assistant-ui/react"; import { MarkdownText } from "@/components/assistant-ui/markdown-text"; import { Reasoning, ReasoningContent, ReasoningRoot, ReasoningText, ReasoningTrigger, } from "@/components/assistant-ui/reasoning"; import { ToolFallback } from "@/components/assistant-ui/tool-fallback"; import { ToolGroupContent, ToolGroupRoot, ToolGroupTrigger, } from "@/components/assistant-ui/tool-group"; import type { FC } from "react"; const AssistantMessage: FC = () => { return ( <MessagePrimitive.Root> <MessagePrimitive.GroupedParts groupBy={(part) => { if (part.type === "reasoning") return ["group-chainOfThought", "group-reasoning"]; if (part.type === "tool-call") return ["group-chainOfThought", "group-tool"]; return null; }} > {({ part, children }) => { switch (part.type) { case "group-chainOfThought": return <div className="my-2">{children}</div>; case "group-reasoning": { const running = part.status.type === "running"; return ( <ReasoningRoot defaultOpen={running}> <ReasoningTrigger active={running} /> <ReasoningContent aria-busy={running}> <ReasoningText>{children}</ReasoningText> </ReasoningContent> </ReasoningRoot> ); } case "group-tool": return ( <ToolGroupRoot> <ToolGroupTrigger count={part.indices.length} active={part.status.type === "running"} /> <ToolGroupContent>{children}</ToolGroupContent> </ToolGroupRoot> ); case "text": return <MarkdownText />; case "reasoning": return <Reasoning {...part} />; case "tool-call": return part.toolUI ?? <ToolFallback {...part} />; default: return null; } }} </MessagePrimitive.GroupedParts> </MessagePrimitive.Root> ); };`

### [Use a Reasoning Model](#use-a-reasoning-model)

Chain of Thought is most useful with models that produce reasoning tokens. Here's an example backend route using the AI SDK:

- title

  app/api/chat/route.ts

`import { openai } from "@ai-sdk/openai"; import { streamText, convertToModelMessages } from "ai"; export async function POST(req: Request) { const { messages } = await req.json(); const result = streamText({ model: openai("gpt-5.4-mini"), messages: await convertToModelMessages(messages), }); return result.toUIMessageStreamResponse(); }`

## [LangGraph](#langgraph)

Chain-of-thought parts are surfaced by the AI SDK's built-in reasoning stream. LangGraph does not emit reasoning tokens in that format, so reasoning grouping will not activate automatically. If you want to display reasoning text from a LangGraph agent, emit it as a custom data part from your graph and render it with `makeAssistantDataUI`. See

- href

  /docs/runtimes/langgraph/generative-ui

generative UI with LangGraph

for details.

## [Legacy: ChainOfThoughtPrimitive](#legacy-chainofthoughtprimitive)

### [Reading Collapsed State](#reading-collapsed-state)

For existing `ChainOfThoughtPrimitive` code, use `AuiIf` to conditionally render based on the accordion state:

`import { AuiIf, ChainOfThoughtPrimitive } from "@assistant-ui/react"; import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"; const ChainOfThoughtAccordionTrigger = () => { return ( <ChainOfThoughtPrimitive.AccordionTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm"> <AuiIf condition={(s) => s.chainOfThought.collapsed}> <ChevronRightIcon className="size-4" /> </AuiIf> <AuiIf condition={(s) => !s.chainOfThought.collapsed}> <ChevronDownIcon className="size-4" /> </AuiIf> Thinking </ChainOfThoughtPrimitive.AccordionTrigger> ); };`

### [API Reference](#api-reference)

For lower-level legacy compatibility details, see the

- href

  /docs/primitives/chain-of-thought

`ChainOfThought` primitive reference

.

## [Full Example](#full-example)

See the complete

- href

  https\://github.com/assistant-ui/assistant-ui/tree/main/examples/with-chain-of-thought

with-chain-of-thought example

for a working implementation with tool calls and reasoning.

## [Related Guides](#related-guides)

- - href

    /docs/ui/reasoning

  Reasoning

  — reasoning UI primitives for grouped parts

- - href

    /docs/guides/tool-ui

  Generative UI

  — custom UI for tool calls

- - href

    /docs/guides/tools

  Tools

  — defining and using tools