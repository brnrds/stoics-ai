# SuggestionPrimitive
URL: /docs/api-reference/primitives/suggestion

Suggestion primitives for rendering starter prompts, follow-up actions, and composer suggestions in assistant-ui threads.

For examples and usage patterns, see

- href

  /docs/primitives/suggestion

Suggestion

.

## [API Reference](#api-reference)

### [Title](#title)

Renders the title of the suggestion.

This primitive renders a `<span>` element unless `asChild` is set.

`SuggestionPrimitiveTitleProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Description](#description)

Renders the description/label of the suggestion.

This primitive renders a `<span>` element unless `asChild` is set.

`SuggestionPrimitiveDescriptionProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

### [Trigger](#trigger)

A button that triggers the suggestion action (send or insert into composer).

This primitive renders a `<button>` element unless `asChild` is set.

`SuggestionPrimitiveTriggerProps`

- `asChild` `: boolean` = false

  Change the default rendered element for the one passed as a child, merging their props and behavior.\
  \
  Read the

  - href

    /docs/api-reference/primitives/composition

  Composition

  guide for more details.

- `render` `?: ReactElement`

- `send` `?: boolean`

  When true, automatically sends the message. When false, replaces or appends the composer text with the suggestion - depending on the value of \`clearComposer\`.

- `clearComposer` `: boolean` = true

  Whether to clear the composer after sending. When send is set to false, determines if composer text is replaced with suggestion (true, default), or if it's appended to the composer text (false).