# LaTeX in Chat Messages
URL: /docs/guides/latex

Render LaTeX math expressions in AI chat messages with KaTeX — drop-in equation support for React chat UIs built on assistant-ui.

Render LaTeX mathematical expressions in chat messages using KaTeX.

LaTeX rendering is not enabled by default.

- items

  - react-markdown
  - Streamdown

* value

  react-markdown

### [Install dependencies](#install-dependencies)

- packages

  - katex
  - rehype-katex
  - remark-math

### [Add KaTeX CSS to your layout](#add-katex-css-to-your-layout)

- title

  /app/layout.tsx

`import "katex/dist/katex.min.css";`

### [Update `markdown-text.tsx`](#update-markdown-texttsx)

- title

  /components/assistant-ui/markdown-text.tsx

`import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown"; import remarkMath from "remark-math"; import rehypeKatex from "rehype-katex"; const MarkdownTextImpl = () => { return ( <MarkdownTextPrimitive remarkPlugins={[remarkGfm, remarkMath]} // add remarkMath rehypePlugins={[rehypeKatex]} // add rehypeKatex className="aui-md" components={defaultComponents} /> ); }; export const MarkdownText = memo(MarkdownTextImpl);`

- value

  Streamdown

Using

- href

  /docs/ui/streamdown

Streamdown

as your renderer? Math support is a first-party plugin — no remark or rehype packages needed.

### [Install dependencies](#install-dependencies-1)

- packages

  - @streamdown/math
  - katex

### [Add KaTeX CSS to your layout](#add-katex-css-to-your-layout-1)

- title

  /app/layout.tsx

`import "katex/dist/katex.min.css";`

### [Pass the `math` plugin to `StreamdownTextPrimitive`](#pass-the-math-plugin-to-streamdowntextprimitive)

- title

  /components/assistant-ui/streamdown-text.tsx

`import { math } from "@streamdown/math"; import "katex/dist/katex.min.css"; <StreamdownTextPrimitive plugins={{ math }} />`

## [Supported Formats](#supported-formats)

By default, remark-math (react-markdown path) supports:

- `$...$` for inline math
- `$$...$$` for display math
- Fenced code blocks with the `math` language identifier

## [Supporting Alternative LaTeX Delimiters](#supporting-alternative-latex-delimiters)

Many language models generate LaTeX using different delimiter formats:

- `\(...\)` for inline math
- `\[...\]` for display math
- Custom formats like `[/math]...[/math]`

You can use the `preprocess` prop on `MarkdownTextPrimitive` to normalize these formats before parsing:

- title

  /components/assistant-ui/markdown-text.tsx

``import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown"; const MarkdownTextImpl = () => { return ( <MarkdownTextPrimitive remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} preprocess={normalizeCustomMathTags} className="aui-md" components={defaultComponents} /> ); }; // Your LaTeX preprocessing function function normalizeCustomMathTags(input: string): string { return ( input // Convert [/math]...[/math] to $$...$$ .replace(/\[\/math\]([\s\S]*?)\[\/math\]/g, (_, content) => `$$${content.trim()}$$`) // Convert [/inline]...[/inline] to $...$ .replace(/\[\/inline\]([\s\S]*?)\[\/inline\]/g, (_, content) => `$${content.trim()}$`) // Convert \( ... \) to $...$ (inline math) - handles both single and double backslashes .replace(/\\{1,2}\(([\s\S]*?)\\{1,2}\)/g, (_, content) => `$${content.trim()}$`) // Convert \[ ... \] to $$...$$ (block math) - handles both single and double backslashes .replace(/\\{1,2}\[([\s\S]*?)\\{1,2}\]/g, (_, content) => `$$${content.trim()}$$`) ); }``

Inside `MarkdownTextPrimitive`, the streamed text first passes through `preprocess` (delimiter normalization) and then through `useSmooth` (character-by-character accumulation), and only then reaches the markdown parser. Both run before remark-math sees the text, so delimiter replacement and the streaming smoothing are streaming-safe — partially-received delimiters are accumulated in the smoothing buffer rather than parsed mid-fragment.