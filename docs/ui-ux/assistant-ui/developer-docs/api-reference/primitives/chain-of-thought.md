# ChainOfThoughtPrimitive
URL: /docs/api-reference/primitives/chain-of-thought

Chain of thought primitives for rendering assistant reasoning, step lists, and collapsible disclosure UI in message content.

For examples and usage patterns, see

- href

  /docs/primitives/chain-of-thought

ChainOfThought

.

## [API Reference](#api-reference)

### [Root](#root)

The root container for chain of thought components. This component provides a wrapper for chain of thought content, including reasoning and tool-call parts that can be collapsed in an accordion.

This primitive renders a `<div>` element unless `asChild` is set.

`ChainOfThoughtPrimitiveRootProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [AccordionTrigger](#accordiontrigger)

A button component that toggles the collapsed state of the chain of thought accordion. This component automatically handles the toggle functionality, expanding or collapsing the chain of thought parts when clicked.

This primitive renders a `<button>` element unless `asChild` is set.

`ChainOfThoughtPrimitiveAccordionTriggerProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Parts](#parts)

Renders the parts within a chain of thought, with support for collapsed/expanded states. When collapsed, no parts are shown. When expanded, all parts are rendered using the provided component configuration through the part scope mechanism.

`ChainOfThoughtPrimitivePartsProps`

- `components`

  - variant

    deprecated

  `?: ChainOfThoughtPartsComponentConfig`

  Deprecated: Use the children render function instead.

  - `Reasoning` `?: ReasoningMessagePartComponent`

    Component for rendering reasoning parts

  - `tools` `?: ChainOfThoughtPartsComponentConfig["tools"]`

    Fallback component for tool-call parts

    - `Fallback` `?: ToolCallMessagePartComponent`

  - `Layout` `?: ComponentType<PropsWithChildren>`

    Layout component to wrap the rendered parts when expanded

- `children` `?: (value: { part: PartState }) => ReactNode`

  Render function called for each part. Receives the part.