# makeAssistantTool
URL: /docs/copilots/make-assistant-tool

Create React components that provide reusable tools to the assistant.

For most apps, the

- href

  /docs/guides/tools

`Tools()` API

is an easier starting point: tool definitions live in a toolkit object rather than the component tree. `makeAssistantTool` is fully supported and remains a good fit when a tool's availability is tied to a component being mounted, for example a product-specific tool that should only be exposed while that product's UI is on screen (the

- href

  /docs/copilots/motivation

intelligent components

pattern).

`makeAssistantTool` creates a React component that provides a tool to the assistant. This is useful for defining reusable tools that can be composed into your application.

## [Usage](#usage)

`import { makeAssistantTool, tool } from "@assistant-ui/react"; import { z } from "zod"; // Define the tool using the tool() helper const submitForm = tool({ parameters: z.object({ email: z.string().email(), name: z.string(), }), execute: async ({ email, name }) => { // Implementation return { success: true }; }, }); // Create a tool component const SubmitFormTool = makeAssistantTool({ ...submitForm, toolName: "submitForm", }); // Use in your component function Form() { return ( <div> <form>{/* form fields */}</form> <SubmitFormTool /> </div> ); }`

## [API Reference](#api-reference)

### [Parameters](#parameters)

`AssistantToolProps<TArgs, TResult>`

- `toolName` `: string`

  The unique identifier for the tool

- `parameters` `: StandardSchemaV1<TArgs> | JSONSchema7`

  Schema defining the tool's parameters (typically a Zod schema)

- `execute` `: (args: TArgs, context: ToolExecutionContext) => TResult | Promise<TResult>`

  Function that implements the tool's behavior (required for frontend tools)

- `description` `?: string`

  Optional description of the tool's purpose

- `render` `?: ComponentType<ToolCallMessagePartProps<TArgs, TResult>>`

  Optional custom UI component for rendering the tool execution. Receives the following props:

  - `type` `?: "tool-call"`

    The message part type

  - `toolCallId` `?: string`

    Unique identifier for this tool call

  - `toolName` `?: string`

    The name of the tool being called

  - `args` `?: TArgs`

    The arguments passed to the tool

  - `argsText` `?: string`

    String representation of the arguments

  - `result` `?: TResult | undefined`

    The result of the tool execution (if complete)

  - `isError` `?: boolean | undefined`

    Whether the result is an error

  - `status` `?: ToolCallMessagePartStatus`

    The execution status object with a type property: "running", "complete", "incomplete", or "requires-action"

  - `addResult` `?: (result: TResult | ToolResponse<TResult>) => void`

    Function to add a result (useful for human-in-the-loop tools)

  - `artifact` `?: unknown`

    Optional artifact data associated with the tool call

### [Returns](#returns)

Returns a React component that:

- Provides the tool to the assistant when mounted
- Automatically removes the tool when unmounted
- Renders nothing in the DOM (returns null)

## [Example with Multiple Tools](#example-with-multiple-tools)

`import { makeAssistantTool, tool } from "@assistant-ui/react"; import { z } from "zod"; // Define tools const validateEmail = tool({ parameters: z.object({ email: z.string(), }), execute: ({ email }) => { const isValid = email.includes("@"); return { isValid, reason: isValid ? "Valid email" : "Missing @" }; }, }); const sendEmail = tool({ parameters: z.object({ to: z.string().email(), subject: z.string(), body: z.string(), }), execute: async (params) => { // Tool logic return { sent: true }; }, }); // Create tool components const EmailValidator = makeAssistantTool({ ...validateEmail, toolName: "validateEmail", }); const EmailSender = makeAssistantTool({ ...sendEmail, toolName: "sendEmail", }); // Use together function EmailForm() { return ( <div> <form>{/* form fields */}</form> <EmailValidator /> <EmailSender /> </div> ); }`

## [Best Practices](#best-practices)

1. **Parameter Validation**

   - Always use Zod schemas to define parameters
   - Be specific about parameter types and constraints
   - Add helpful error messages to schema validations

2. **Error Handling**

   - Return meaningful error messages
   - Consider returning partial results when possible
   - Handle async errors appropriately

3. **Composition**

   - Break complex tools into smaller, focused ones
   - Consider tool dependencies and interactions
   - Use multiple tools together for complex functionality