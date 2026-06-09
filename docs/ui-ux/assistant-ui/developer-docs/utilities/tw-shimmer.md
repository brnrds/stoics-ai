# tw-shimmer
URL: /docs/utilities/tw-shimmer

Tailwind CSS v4 plugin for shimmer effects.

`tw-shimmer` is a zero-dependency Tailwind CSS v4 plugin that provides polished shimmer animations for both text and skeleton loaders. It uses sine-eased gradients with 17 carefully calculated stops and OKLCH color mixing for smooth, banding-free effects.

- **CSS-only** — No JavaScript runtime, pure Tailwind utilities
- **Text + Background** — Shimmer text or skeleton placeholders
- **Auto-sizing** — CSS container queries for automatic width detection
- **Customizable** — Speed, spread, angle, color, and timing

See the

- href

  /tw-shimmer

interactive demo

for live examples.

## [Installation](#installation)

- items

  - npm
  - pnpm
  - yarn

* value

  npm

`npm install tw-shimmer`

- value

  pnpm

`pnpm add tw-shimmer`

- value

  yarn

`yarn add tw-shimmer`

Add to your CSS:

- title

  app/globals.css

`@import "tailwindcss"; @import "tw-shimmer";`

## [Quick Start](#quick-start)

### [Text Shimmer](#text-shimmer)

`<span class="shimmer text-foreground/60">Loading...</span>`

Set a semi-transparent text color (e.g., `text-foreground/40`) for the shimmer highlight to be visible.

### [Skeleton Loader](#skeleton-loader)

`<div class="shimmer shimmer-bg bg-muted h-4 w-48 rounded" />`

### [Skeleton Card with Auto-Sizing](#skeleton-card-with-auto-sizing)

`<div class="shimmer-container flex gap-3"> <div class="shimmer-bg bg-muted size-12 rounded-full" /> <div class="flex-1 space-y-2"> <div class="shimmer-bg bg-muted h-4 w-1/4 rounded" /> <div class="shimmer-bg bg-muted h-4 w-full rounded" /> <div class="shimmer-bg bg-muted h-4 w-4/5 rounded" /> </div> </div>`

## [API Reference](#api-reference)

### [Core Utilities](#core-utilities)

#### [`shimmer`](#shimmer)

Base utility for text shimmer. Applies a gradient animation over the text foreground color.

#### [`shimmer-bg`](#shimmer-bg)

Background shimmer for skeleton loaders. Applies a gradient animation over the element's background. Requires a base `bg-*` class.

`<div class="shimmer shimmer-bg bg-muted h-4 w-64 rounded" />`

#### [`shimmer-container`](#shimmer-container)

CSS-only auto-sizing helper using container queries. Sets `container-type: inline-size` and automatically derives speed and spread from the container width.

`<div class="shimmer-container"> <div class="shimmer-bg bg-muted h-4 w-full rounded" /> </div>`

`shimmer-container` sets `container-type: inline-size`, which prevents shrink-to-fit sizing. Not recommended for text-only containers.

### [Customization Utilities](#customization-utilities)

| Utility                     | Default (text) | Default (bg) | Description                        |
| --------------------------- | -------------- | ------------ | ---------------------------------- |
| `shimmer-speed-{n}`         | `150`          | `1000`       | Animation speed in px/s            |
| `shimmer-width-{n}`         | `200`          | `800`        | Container width in px for timing   |
| `shimmer-spread-{n}`        | `6ch`          | —            | Text shimmer highlight width       |
| `shimmer-bg-spread-{n}`     | —              | `480px`      | Background shimmer highlight width |
| `shimmer-color-{color}`     | auto           | auto         | Highlight color (Tailwind palette) |
| `shimmer-angle-{deg}`       | `90`           | `90`         | Sweep direction in degrees         |
| `shimmer-duration-{ms}`     | auto           | auto         | Fixed animation duration           |
| `shimmer-repeat-delay-{ms}` | `1000`         | `1000`       | Pause between cycles               |
| `shimmer-invert`            | —              | —            | Invert highlight direction         |

All utilities are **inheritable** — set on a parent to affect all shimmer children.

### [Speed and Width](#speed-and-width)

Speed controls how fast the shimmer moves in pixels per second. Width tells the animation how wide the container is for timing calculations.

`<span class="shimmer shimmer-speed-200 shimmer-width-400 text-foreground/40"> Fast, wide shimmer </span>`

### [Color](#color)

Use any Tailwind color with optional opacity:

`<span class="shimmer shimmer-color-blue-500 text-blue-500/40"> Blue shimmer </span> <div class="shimmer shimmer-bg shimmer-color-blue-300/30 bg-muted h-4 rounded" />`

### [Angle](#angle)

Control the sweep direction. Default is `90deg` (vertical sweep).

`<div class="shimmer-container shimmer-angle-15"> <div class="shimmer-bg bg-muted h-4 w-full rounded" /> </div>`

Avoid exactly `0deg` and `180deg` — they cause extreme animation delays. Safe range: 15-75° or 105-165°.

### [Position Hints (Angled Shimmer)](#position-hints-angled-shimmer)

For angled shimmers, use `shimmer-x-{n}` and `shimmer-y-{n}` to sync elements:

`<div class="shimmer-container shimmer-angle-15 flex gap-3"> <div class="shimmer-bg shimmer-x-20 shimmer-y-20 bg-muted size-12 rounded-full" /> <div class="flex-1 space-y-2"> <div class="shimmer-bg shimmer-x-52 shimmer-y-0 bg-muted h-4 w-24 rounded" /> <div class="shimmer-bg shimmer-x-52 shimmer-y-24 bg-muted h-4 w-full rounded" /> </div> </div>`

### [Repeat Delay](#repeat-delay)

Control the pause between animation cycles:

`<!-- Continuous shimmer, no pause --> <span class="shimmer shimmer-repeat-delay-0 text-foreground/40"> Always moving </span> <!-- Long pause between cycles --> <span class="shimmer shimmer-repeat-delay-3000 text-foreground/40"> Slow pulse </span>`

## [CSS Variables](#css-variables)

All values can be set via CSS variables for dynamic control:

| Variable                 | Description               |
| ------------------------ | ------------------------- |
| `--shimmer-speed`        | Speed in px/s             |
| `--shimmer-width`        | Track width in px         |
| `--shimmer-spread`       | Highlight width           |
| `--shimmer-angle`        | Sweep angle               |
| `--shimmer-color`        | Highlight color           |
| `--shimmer-duration`     | Override duration (ms)    |
| `--shimmer-repeat-delay` | Pause between cycles (ms) |

`<div style={{ "--shimmer-width": containerWidth } as React.CSSProperties}> <div className="shimmer shimmer-bg bg-muted h-4 w-full rounded" /> </div>`

## [Browser Support](#browser-support)

Uses modern CSS features: `oklch()`, `color-mix()`, independent `translate` transform, and CSS Container Queries.

**Supported:** Chrome 111+, Firefox 113+, Safari 16.4+

Older browsers degrade gracefully — shimmer effects simply won't appear.