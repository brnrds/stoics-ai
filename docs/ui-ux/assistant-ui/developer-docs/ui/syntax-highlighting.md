# Syntax Highlighting
URL: /docs/ui/syntax-highlighting

Code block syntax highlighting with react-shiki or react-syntax-highlighter.

Syntax highlighting is not enabled in markdown by default.

`assistant-ui` provides two options for syntax highlighting:

- **react-shiki** (recommended for performance & dynamic language support)
- **react-syntax-highlighter** (legacy - Prism or Highlight.js based)

---

## [react-shiki](#react-shiki)

#### [Add `shiki-highlighter`](#add-shiki-highlighter)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/shiki-highlighter.json

#### Main Component

- packages

  - react-shiki

* code

  "use client"; import type { FC } from "react"; import ShikiHighlighter, { type ShikiHighlighterProps } from "react-shiki"; import type { SyntaxHighlighterProps as AUIProps } from "@assistant-ui/react-markdown"; import { cn } from "@/lib/utils"; /\*\* \* Props for the SyntaxHighlighter component \*/ export type HighlighterProps = Omit< ShikiHighlighterProps, "children" | "theme" > & { theme?: ShikiHighlighterProps\["theme"]; } & Pick\<AUIProps, "language" | "code"> & Partial\<Pick\<AUIProps, "node" | "components">>; /\*\* \* SyntaxHighlighter component, using react-shiki \* Use it by passing to \`defaultComponents\` in \`markdown-text.tsx\` \* \* @example \* const defaultComponents = memoizeMarkdownComponents({ \* SyntaxHighlighter, \* h1: //... \* //...other elements... \* }); \*/ export const SyntaxHighlighter: FC\<HighlighterProps> = ({ code, language, theme = { dark: "kanagawa-wave", light: "kanagawa-lotus" }, className, addDefaultStyles = false, // assistant-ui requires custom base styles showLanguage = false, // assistant-ui/react-markdown handles language labels node: \_node, components: \_components, ...props }) => { return ( \<ShikiHighlighter {...props} language={language} theme={theme} addDefaultStyles={addDefaultStyles} showLanguage={showLanguage} defaultColor="light-dark()" className={cn( "aui-shiki-base \[&\_pre]:overflow-x-auto \[&\_pre]:rounded-b-lg \[&\_pre]:bg-muted/75! \[&\_pre]:p-4", className, )} > {code.trim()} \</ShikiHighlighter> ); }; SyntaxHighlighter.displayName = "SyntaxHighlighter";

- lang

  tsx

- code

  "use client"; import type { FC } from "react"; import ShikiHighlighter, { type ShikiHighlighterProps } from "react-shiki"; import type { SyntaxHighlighterProps as AUIProps } from "@assistant-ui/react-markdown"; import { cn } from "@/lib/utils"; /\*\* \* Props for the SyntaxHighlighter component \*/ export type HighlighterProps = Omit< ShikiHighlighterProps, "children" | "theme" > & { theme?: ShikiHighlighterProps\["theme"]; } & Pick\<AUIProps, "language" | "code"> & Partial\<Pick\<AUIProps, "node" | "components">>; /\*\* \* SyntaxHighlighter component, using react-shiki \* Use it by passing to \`defaultComponents\` in \`markdown-text.tsx\` \* \* @example \* const defaultComponents = memoizeMarkdownComponents({ \* SyntaxHighlighter, \* h1: //... \* //...other elements... \* }); \*/ export const SyntaxHighlighter: FC\<HighlighterProps> = ({ code, language, theme = { dark: "kanagawa-wave", light: "kanagawa-lotus" }, className, addDefaultStyles = false, // assistant-ui requires custom base styles showLanguage = false, // assistant-ui/react-markdown handles language labels node: \_node, components: \_components, ...props }) => { return ( \<ShikiHighlighter {...props} language={language} theme={theme} addDefaultStyles={addDefaultStyles} showLanguage={showLanguage} defaultColor="light-dark()" className={cn( "aui-shiki-base \[&\_pre]:overflow-x-auto \[&\_pre]:rounded-b-lg \[&\_pre]:bg-muted/75! \[&\_pre]:p-4", className, )} > {code.trim()} \</ShikiHighlighter> ); }; SyntaxHighlighter.displayName = "SyntaxHighlighter";

This adds a `/components/assistant-ui/shiki-highlighter.tsx` file to your project and installs the `react-shiki` dependency. The highlighter can be customized by editing the config in the `shiki-highlighter.tsx` file.

#### [Add it to `defaultComponents` in `markdown-text.tsx`](#add-it-to-defaultcomponents-in-markdown-texttsx)

- title

  /components/assistant-ui/markdown-text.tsx

`import { SyntaxHighlighter } from "./shiki-highlighter"; export const defaultComponents = memoizeMarkdownComponents({ SyntaxHighlighter: SyntaxHighlighter, h1: /* ... */, // ...other elements... });`

### [Options](#options)

See

- href

  https\://github.com/AVGVSTVS96/react-shiki#props

react-shiki documentation

for all available options.

Key options:

- `theme` - Shiki theme or multi-theme object (`{ light, dark, ... }`)

- `language` - Language for highlighting (default: `"text"`)

- `defaultColor` - Default color mode (`string | false`, e.g. `light-dark()`)

- `delay` - Delay between highlights, useful for streaming (default: `0`)

- `customLanguages` - Custom languages to preload for dynamic support

- `codeToHastOptions` - All other options accepted by Shiki's

  - href

    https\://github.com/shikijs/shiki/blob/main/packages/types/src/options.ts#L121

  `codeToHast`

### [Dual/multi theme support](#dualmulti-theme-support)

To use multiple themes, pass a theme object:

- title

  /components/assistant-ui/shiki-highlighter.tsx

`<ShikiHighlighter /* ... */ theme={{ light: "github-light", dark: "github-dark", }} defaultColor="light-dark()" /* ... */ >`

**Note:** The `shiki-highlighter` component sets `defaultColor="light-dark()"` automatically. Only set this manually if using `ShikiHighlighter` directly.

With `defaultColor="light-dark()"`, theme switching is automatic based on your site's `color-scheme`. No custom Shiki CSS overrides are required.

Set `color-scheme` on your app root:

System-based (follows OS/browser preference):

- title

  globals.css

`:root { color-scheme: light dark; }`

Class-based theme switching:

- title

  globals.css

`:root { color-scheme: light; } :root.dark { color-scheme: dark; }`

If you need broader support for older browsers, you can still use the manual CSS-variable switching approach from the Shiki dual-theme docs.

For more information:

- - href

    https\://github.com/AVGVSTVS96/react-shiki

  react-shiki multi-theme/reactive themes

- - href

    https\://shiki.style/guide/dual-themes

  Shiki dual themes + `light-dark()`

### [Bundle Optimization](#bundle-optimization)

By default, `react-shiki` includes the full Shiki bundle, which contains all supported languages and themes.

To reduce bundle size, you can use the web bundle by changing the import to `react-shiki/web`, to include a smaller bundle of web related languages:

- title

  /components/assistant-ui/shiki-highlighter.tsx

`import ShikiHighlighter, { type ShikiHighlighterProps } from "react-shiki/web";`

#### [Custom Bundles](#custom-bundles)

For strict bundle size control, `react-shiki` also supports custom bundles created using `createHighlighterCore` from `react-shiki/core` (re-exported from Shiki):

- title

  /components/assistant-ui/shiki-highlighter.tsx

`import { createHighlighterCore, createOnigurumaEngine } from "react-shiki/core"; // Create the highlighter // Use dynamic imports to load languages and themes on client on demand const customHighlighter = await createHighlighterCore({ themes: [import("@shikijs/themes/nord")], langs: [ import("@shikijs/langs/javascript"), import("@shikijs/langs/typescript"), ], engine: createOnigurumaEngine(import("shiki/wasm")), }); // Then pass it to the highlighter prop <SyntaxHighlighter {...props} language={language} theme={theme} highlighter={customHighlighter} />;`

For more information, see

- href

  https\://github.com/avgvstvs96/react-shiki#bundle-options

react-shiki - bundle options

.

---

## [react-syntax-highlighter](#react-syntax-highlighter)

This option may be removed in a future release. Consider using

- href

  \#react-shiki

react-shiki

instead.

#### [Add `syntax-highlighter`](#add-syntax-highlighter)

- items

  - CLI
  - Manual

* urls

  - https\://r.assistant-ui.com/syntax-highlighter.json

#### Main Component

- packages

  - @assistant-ui/react-syntax-highlighter
  - @types/react-syntax-highlighter
  - react-syntax-highlighter

* code

  import { PrismAsyncLight } from "react-syntax-highlighter"; import { makePrismAsyncLightSyntaxHighlighter } from "@assistant-ui/react-syntax-highlighter"; import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx"; import python from "react-syntax-highlighter/dist/esm/languages/prism/python"; import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism"; // register languages you want to support PrismAsyncLight.registerLanguage("js", tsx); PrismAsyncLight.registerLanguage("jsx", tsx); PrismAsyncLight.registerLanguage("ts", tsx); PrismAsyncLight.registerLanguage("tsx", tsx); PrismAsyncLight.registerLanguage("python", python); export const SyntaxHighlighter = makePrismAsyncLightSyntaxHighlighter({ style: coldarkDark, customStyle: { margin: 0, width: "100%", background: "black", padding: "1.5rem 1rem", }, });

- lang

  tsx

- code

  import { PrismAsyncLight } from "react-syntax-highlighter"; import { makePrismAsyncLightSyntaxHighlighter } from "@assistant-ui/react-syntax-highlighter"; import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx"; import python from "react-syntax-highlighter/dist/esm/languages/prism/python"; import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism"; // register languages you want to support PrismAsyncLight.registerLanguage("js", tsx); PrismAsyncLight.registerLanguage("jsx", tsx); PrismAsyncLight.registerLanguage("ts", tsx); PrismAsyncLight.registerLanguage("tsx", tsx); PrismAsyncLight.registerLanguage("python", python); export const SyntaxHighlighter = makePrismAsyncLightSyntaxHighlighter({ style: coldarkDark, customStyle: { margin: 0, width: "100%", background: "black", padding: "1.5rem 1rem", }, });

Adds a `/components/assistant-ui/syntax-highlighter.tsx` file to your project and installs the `react-syntax-highlighter` dependency.

#### [Add it to `defaultComponents` in `markdown-text.tsx`](#add-it-to-defaultcomponents-in-markdown-texttsx-1)

- title

  /components/assistant-ui/markdown-text.tsx

`import { SyntaxHighlighter } from "./syntax-highlighter"; export const defaultComponents = memoizeMarkdownComponents({ SyntaxHighlighter: SyntaxHighlighter, h1: /* ... */, // ...other elements... });`

### [Options](#options-1)

Supports all options from

- href

  https\://github.com/react-syntax-highlighter/react-syntax-highlighter#props

`react-syntax-highlighter`

.

### [Bundle Optimization](#bundle-optimization-1)

By default, the syntax highlighter uses a light build that only includes languages you register. To include all languages:

- title

  /components/assistant-ui/syntax-highlighter.tsx

`import { makePrismAsyncSyntaxHighlighter } from "@assistant-ui/react-syntax-highlighter/full";`

## [Related Components](#related-components)

- - href

    /docs/ui/markdown

  Markdown

  \- Rich text rendering that uses syntax highlighting

- - href

    /docs/ui/mermaid

  Mermaid

  \- Render diagrams instead of code blocks