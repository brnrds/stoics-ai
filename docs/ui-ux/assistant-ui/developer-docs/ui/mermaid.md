# Mermaid Diagrams
URL: /docs/ui/mermaid

Render Mermaid diagrams in chat messages with streaming support.

## [Getting Started](#getting-started)

### [Add `mermaid-diagram` component](#add-mermaid-diagram-component)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/mermaid-diagram.json

#### Main Component

- packages

  - @assistant-ui/react
  - @assistant-ui/react-markdown
  - mermaid

* code

  "use client"; import { useAuiState } from "@assistant-ui/react"; import type { SyntaxHighlighterProps } from "@assistant-ui/react-markdown"; import mermaid from "mermaid"; import { type FC, useEffect, useRef } from "react"; import { cn } from "@/lib/utils"; /\*\* \* Props for the MermaidDiagram component \*/ export type MermaidDiagramProps = SyntaxHighlighterProps & { className?: string; }; // Configure mermaid options here mermaid.initialize({ theme: "default", startOnLoad: false }); /\*\* \* MermaidDiagram component for rendering Mermaid diagrams \* Use it by passing to \`componentsByLanguage\` for mermaid in \`markdown-text.tsx\` \* \* @example \* const MarkdownTextImpl = () => { \* return ( \* \<MarkdownTextPrimitive \* remarkPlugins={\[remarkGfm]} \* className="aui-md" \* components={defaultComponents} \* componentsByLanguage={{ \* mermaid: { \* SyntaxHighlighter: MermaidDiagram \* }, \* }} \* /> \* ); \* }; \*/ export const MermaidDiagram: FC\<MermaidDiagramProps> = ({ code, className, node: \_node, components: \_components, language: \_language, }) => { const ref = useRef\<HTMLPreElement>(null); // Detect when this code block is complete const isComplete = useAuiState((s) => { if (s.part.type !== "text") return false; // Find the position of this code block const codeIndex = s.part.text.indexOf(code); if (codeIndex === -1) return false; // Check if there are closing backticks immediately after this code block const afterCode = s.part.text.substring(codeIndex + code.length); // Look for the closing backticks - should be at the start or after a newline const closingBackticksMatch = afterCode.match(/^\`\`\`|^\n\`\`\`/); return closingBackticksMatch !== null; }); useEffect(() => { if (!isComplete) return; (async () => { try { const id = \`mermaid-${Math.random().toString(36).slice(2)}\`; const result = await mermaid.render(id, code); if (ref.current) { ref.current.innerHTML = result.svg; result.bindFunctions?.(ref.current); } } catch (e) { console.warn("Failed to render Mermaid diagram:", e); } })(); }, \[isComplete, code]); return ( \<pre ref={ref} className={cn( "aui-mermaid-diagram rounded-b-lg bg-muted p-2 text-center \[&\_svg]:mx-auto", className, )} > Drawing diagram... \</pre> ); }; MermaidDiagram.displayName = "MermaidDiagram";

- lang

  tsx

- code

  "use client"; import { useAuiState } from "@assistant-ui/react"; import type { SyntaxHighlighterProps } from "@assistant-ui/react-markdown"; import mermaid from "mermaid"; import { type FC, useEffect, useRef } from "react"; import { cn } from "@/lib/utils"; /\*\* \* Props for the MermaidDiagram component \*/ export type MermaidDiagramProps = SyntaxHighlighterProps & { className?: string; }; // Configure mermaid options here mermaid.initialize({ theme: "default", startOnLoad: false }); /\*\* \* MermaidDiagram component for rendering Mermaid diagrams \* Use it by passing to \`componentsByLanguage\` for mermaid in \`markdown-text.tsx\` \* \* @example \* const MarkdownTextImpl = () => { \* return ( \* \<MarkdownTextPrimitive \* remarkPlugins={\[remarkGfm]} \* className="aui-md" \* components={defaultComponents} \* componentsByLanguage={{ \* mermaid: { \* SyntaxHighlighter: MermaidDiagram \* }, \* }} \* /> \* ); \* }; \*/ export const MermaidDiagram: FC\<MermaidDiagramProps> = ({ code, className, node: \_node, components: \_components, language: \_language, }) => { const ref = useRef\<HTMLPreElement>(null); // Detect when this code block is complete const isComplete = useAuiState((s) => { if (s.part.type !== "text") return false; // Find the position of this code block const codeIndex = s.part.text.indexOf(code); if (codeIndex === -1) return false; // Check if there are closing backticks immediately after this code block const afterCode = s.part.text.substring(codeIndex + code.length); // Look for the closing backticks - should be at the start or after a newline const closingBackticksMatch = afterCode.match(/^\`\`\`|^\n\`\`\`/); return closingBackticksMatch !== null; }); useEffect(() => { if (!isComplete) return; (async () => { try { const id = \`mermaid-${Math.random().toString(36).slice(2)}\`; const result = await mermaid.render(id, code); if (ref.current) { ref.current.innerHTML = result.svg; result.bindFunctions?.(ref.current); } } catch (e) { console.warn("Failed to render Mermaid diagram:", e); } })(); }, \[isComplete, code]); return ( \<pre ref={ref} className={cn( "aui-mermaid-diagram rounded-b-lg bg-muted p-2 text-center \[&\_svg]:mx-auto", className, )} > Drawing diagram... \</pre> ); }; MermaidDiagram.displayName = "MermaidDiagram";

This will install the required dependencies and add the component to your project.

### [Add it to `componentsByLanguage` in `markdown-text.tsx`](#add-it-to-componentsbylanguage-in-markdown-texttsx)

- title

  /components/assistant-ui/markdown-text.tsx

`import { MermaidDiagram } from "@/components/assistant-ui/mermaid-diagram"; const MarkdownTextImpl = () => { return ( <MarkdownTextPrimitive remarkPlugins={[remarkGfm]} className="aui-md" components={defaultComponents} componentsByLanguage={{ mermaid: { SyntaxHighlighter: MermaidDiagram }, }} /> ); }; export const MarkdownText = memo(MarkdownTextImpl);`

## [Configuration](#configuration)

Configure mermaid options in `mermaid-diagram.tsx`:

- title

  /components/assistant-ui/mermaid-diagram.tsx

`mermaid.initialize({ theme: "default" });`

## [Streaming Performance](#streaming-performance)

The `MermaidDiagram` component is optimized for streaming scenarios:

- **Smart completion detection**: Only renders when the specific code block is complete
- **Zero failed renders**: Avoids parsing incomplete diagram code during streaming

## [Supported Diagram Types](#supported-diagram-types)

Mermaid supports various diagram types including:

- Flowcharts and decision trees
- Sequence diagrams
- Gantt charts
- Class diagrams
- State diagrams
- Git graphs
- User journey maps
- Entity relationship diagrams

See the

- href

  https\://mermaid.js.org/

Mermaid documentation

for complete syntax reference.

## [Related Components](#related-components)

- - href

    /docs/ui/markdown

  Markdown

  \- Rich text rendering where mermaid is integrated

- - href

    /docs/ui/syntax-highlighting

  Syntax Highlighting

  \- Code highlighting for other languages