# Assistant Frame API
URL: /docs/copilots/assistant-frame

Share model context across iframe boundaries

The Assistant Frame API enables iframes to provide model context (tools and instructions) to a parent window's assistant. This is particularly useful for embedded applications, plugins, or sandboxed components that need to contribute capabilities to the main assistant.

## [Overview](#overview)

The Assistant Frame system consists of two main components:

- **AssistantFrameProvider**: Runs inside the iframe and provides model context
- **AssistantFrameHost**: Runs in the parent window and consumes context from iframes

## [Basic Usage](#basic-usage)

### [In the iframe (Provider)](#in-the-iframe-provider)

The iframe acts as a provider of model context using `AssistantFrameProvider`:

`// iframe.tsx import { AssistantFrameProvider } from "@assistant-ui/react"; import { ModelContextRegistry } from "@assistant-ui/react"; import { z } from "zod"; // Create a registry to manage your model context const registry = new ModelContextRegistry(); // Expose the registry to the parent window AssistantFrameProvider.addModelContextProvider(registry); // Add tools that will be available to the parent assistant registry.addTool({ toolName: "searchProducts", description: "Search for products in the catalog", parameters: z.object({ query: z.string(), category: z.string().optional(), }), execute: async ({ query, category }) => { // Tool implementation runs in the iframe const results = await searchAPI(query, category); return { products: results }; }, }); // Add system instructions const instructionHandle = registry.addInstruction( "You are a helpful assistant.", ); // update the instruction instructionHandle.update("You have access to a product catalog search tool.");`

### [In the parent window (Host)](#in-the-parent-window-host)

The parent window consumes the iframe's context using `AssistantFrameHost`:

`// parent.tsx import { useAssistantFrameHost } from "@assistant-ui/react"; import { useRef } from "react"; function ParentComponent() { const iframeRef = useRef<HTMLIFrameElement>(null); // Connect to the iframe's model context useAssistantFrameHost({ iframeRef, targetOrigin: "https://trusted-iframe-domain.com", // optional for increased security }); return ( <div> <Thread /> {/* Your assistant-ui */} <iframe ref={iframeRef} src="https://trusted-iframe-domain.com/embed" title="Embedded App" /> </div> ); }`

## [Advanced Usage](#advanced-usage)

### [ModelContextRegistry](#modelcontextregistry)

The `ModelContextRegistry` provides a flexible way to manage model context dynamically:

`const registry = new ModelContextRegistry(); // Add a tool with handle for updates const toolHandle = registry.addTool({ toolName: "convertCurrency", description: "Convert between currencies", parameters: z.object({ amount: z.number(), from: z.string(), to: z.string(), }), execute: async ({ amount, from, to }) => { const rate = await fetchExchangeRate(from, to); return { result: amount * rate, currency: to }; }, }); // Update the tool later toolHandle.update({ toolName: "convertCurrency", description: "Convert between currencies with live rates", // Updated description parameters: z.object({ amount: z.number(), from: z.string(), to: z.string(), includesFees: z.boolean().optional(), }), execute: async ({ amount, from, to, includesFees }) => { const rate = await fetchExchangeRate(from, to); const fee = includesFees ? 0.02 : 0; // 2% fee return { result: amount * rate * (1 - fee), currency: to, fee: includesFees ? amount * rate * fee : 0, }; }, }); // Remove the tool when no longer needed toolHandle.remove(); // Add multiple instructions const instruction1 = registry.addInstruction("Be helpful and concise."); const instruction2 = registry.addInstruction("Use metric units."); // Remove instructions instruction1.remove();`

### [Multiple Providers](#multiple-providers)

You can register multiple model context providers in the same iframe:

`const catalogRegistry = new ModelContextRegistry(); const analyticsRegistry = new ModelContextRegistry(); // Add different tools to each registry catalogRegistry.addTool({ /* ... */ }); analyticsRegistry.addTool({ /* ... */ }); // Register both providers const unsubscribe1 = AssistantFrameProvider.addModelContextProvider(catalogRegistry); const unsubscribe2 = AssistantFrameProvider.addModelContextProvider(analyticsRegistry); // Later, unsubscribe if needed unsubscribe1(); unsubscribe2();`

### [Security Considerations](#security-considerations)

#### [Origin Validation](#origin-validation)

Both the provider and host can specify allowed origins for security:

`// In iframe - only accept messages from specific parent AssistantFrameProvider.addModelContextProvider( registry, "https://parent-app.com", ); // In parent - only accept messages from specific iframe useAssistantFrameHost({ iframeRef, targetOrigin: "https://iframe-app.com", });`

#### [Tool Execution](#tool-execution)

Tools are executed in the iframe's context, keeping sensitive operations sandboxed:

`registry.addTool({ toolName: "accessDatabase", description: "Query the database", parameters: z.object({ query: z.string() }), execute: async ({ query }) => { // This runs in the iframe with iframe's permissions // Parent cannot directly access the database const results = await db.query(query); return results; }, });`

## [API Reference](#api-reference)

### [AssistantFrameProvider](#assistantframeprovider)

Static class that manages model context providers in an iframe.

#### [Methods](#methods)

##### [`addModelContextProvider(provider, targetOrigin?)`](#addmodelcontextproviderprovider-targetorigin)

Registers a model context provider to share with parent windows.

`const unsubscribe = AssistantFrameProvider.addModelContextProvider( registry, "https://parent-domain.com", // Optional origin restriction );`

##### [`dispose()`](#dispose)

Cleans up all resources and removes all providers.

`AssistantFrameProvider.dispose();`

### [AssistantFrameHost](#assistantframehost)

Class that connects to an iframe's model context providers.

#### [Constructor](#constructor)

`const host = new AssistantFrameHost( iframeWindow, targetOrigin? // Optional origin restriction );`

#### [Methods](#methods-1)

##### [`getModelContext()`](#getmodelcontext)

Returns the current merged model context from the iframe.

`const context = host.getModelContext(); // { system: "...", tools: { ... } }`

##### [`subscribe(callback)`](#subscribecallback)

Subscribes to model context changes.

`const unsubscribe = host.subscribe(() => { console.log("Context updated:", host.getModelContext()); });`

##### [`dispose()`](#dispose-1)

Cleans up the connection to the iframe.

`host.dispose();`

### [useAssistantFrameHost](#useassistantframehost)

React hook that manages the lifecycle of an AssistantFrameHost.

`useAssistantFrameHost({ iframeRef: RefObject<HTMLIFrameElement>, targetOrigin?: string, });`

### [ModelContextRegistry](#modelcontextregistry-1)

A flexible registry for managing model context with dynamic updates.

#### [Methods](#methods-2)

##### [`addTool(tool)`](#addtooltool)

Adds a tool and returns a handle for updates/removal.

`const handle = registry.addTool({ toolName: string, description?: string, parameters: ZodSchema | JSONSchema, execute: (args, context) => Promise<any>, }); handle.update(newTool); // Update the tool handle.remove(); // Remove the tool`

##### [`addInstruction(instruction)`](#addinstructioninstruction)

Adds a system instruction and returns a handle.

`const handle = registry.addInstruction("Be concise."); handle.update("Be detailed."); // Update instruction handle.remove(); // Remove instruction`

##### [`addProvider(provider)`](#addproviderprovider)

Adds another model context provider.

`const handle = registry.addProvider(anotherProvider); handle.remove(); // Remove provider`

## [Use Cases](#use-cases)

### [Embedded Analytics Dashboard](#embedded-analytics-dashboard)

An analytics iframe can provide data query tools to the parent assistant:

`// In analytics iframe registry.addTool({ toolName: "queryMetrics", description: "Query analytics data", parameters: z.object({ metric: z.string(), timeRange: z.string(), }), execute: async ({ metric, timeRange }) => { const data = await analyticsAPI.query(metric, timeRange); return { data, visualization: createChart(data) }; }, });`

### [Plugin System](#plugin-system)

Third-party plugins can extend the assistant's capabilities:

`// In plugin iframe registry.addTool({ toolName: "translateText", description: "Translate text to another language", parameters: z.object({ text: z.string(), targetLanguage: z.string(), }), execute: async ({ text, targetLanguage }) => { return await pluginAPI.translate(text, targetLanguage); }, });`

### [Data Visualization](#data-visualization)

Provide data visualization tools in an iframe:

``// In visualization iframe registry.addTool({ toolName: "createChart", description: "Generate a chart from data", parameters: z.object({ data: z.array( z.object({ label: z.string(), value: z.number(), }), ), chartType: z.enum(["bar", "line", "pie"]), title: z.string().optional(), }), execute: async ({ data, chartType, title }) => { // Generate chart using a library like Chart.js or D3 const chartUrl = await generateChart(data, chartType, title); return { chartUrl, summary: `Created ${chartType} chart with ${data.length} data points`, }; }, });``