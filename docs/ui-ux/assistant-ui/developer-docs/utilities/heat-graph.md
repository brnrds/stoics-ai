# heat-graph
URL: /docs/utilities/heat-graph

Headless, composable activity heatmap components for React.

`heat-graph` provides headless, Radix-style primitives for building GitHub-style activity heatmap graphs.

- **Composable** — Radix-style compound components you fully control
- **Headless** — Zero styling opinions, bring your own CSS/Tailwind
- **Tooltip built-in** — Powered by Radix Popper for positioning
- **Customizable bucketing** — Plug in your own classification function

## [Installation](#installation)

- items

  - shadcn
  - npm
  - pnpm
  - yarn

* value

  shadcn

`npx shadcn@latest add https://r.assistant-ui.com/heat-graph`

This installs a pre-styled `HeatGraph` component to `components/assistant-ui/heat-graph.tsx` along with the `heat-graph` package.

- value

  npm

`npm install heat-graph`

- value

  pnpm

`pnpm add heat-graph`

- value

  yarn

`yarn add heat-graph`

## [Quick Start](#quick-start)

- title

  components/activity-graph.tsx

`"use client"; import * as HeatGraph from "heat-graph"; const COLORS = ["#ebedf0", "#c6d7f9", "#8fb0f3", "#5888e8", "#2563eb"]; export function ActivityGraph({ data }: { data: HeatGraph.DataPoint[] }) { return ( <HeatGraph.Root data={data} weekStart="monday" colorScale={COLORS}> <HeatGraph.Grid className="gap-[3px]"> {() => ( <HeatGraph.Cell className="aspect-square rounded-sm" /> )} </HeatGraph.Grid> <HeatGraph.Tooltip> {({ cell }) => ( <div> {cell.count} contributions on {cell.date.toLocaleDateString()} </div> )} </HeatGraph.Tooltip> </HeatGraph.Root> ); }`

Components using Heat Graph must be Client Components (`"use client"`), since they rely on React Context and interactivity.

## [Anatomy](#anatomy)

``import * as HeatGraph from "heat-graph"; <HeatGraph.Root data={data} colorScale={colors}> {/* Month labels — iterates internally, renders each label */} <HeatGraph.MonthLabels> {({ label, totalWeeks }) => ( <span style={{ left: `${(label.column / totalWeeks) * 100}%` }}> {HeatGraph.MONTH_SHORT[label.month]} </span> )} </HeatGraph.MonthLabels> {/* Day-of-week labels — iterates internally, renders each label */} <HeatGraph.DayLabels> {({ label }) => ( <span>{HeatGraph.DAY_SHORT[label.dayOfWeek]}</span> )} </HeatGraph.DayLabels> {/* Grid + Cells — iterates internally, renders each cell */} <HeatGraph.Grid> {() => <HeatGraph.Cell />} </HeatGraph.Grid> {/* Legend — iterates internally, renders each level */} <HeatGraph.Legend> {() => <HeatGraph.LegendLevel />} </HeatGraph.Legend> {/* Tooltip */} <HeatGraph.Tooltip> {({ cell }) => <div>{cell.count} on {cell.date.toLocaleDateString()}</div>} </HeatGraph.Tooltip> </HeatGraph.Root>``

## [API Reference](#api-reference)

### [Root](#root)

The top-level provider. Renders a `<div>` that computes the grid layout and provides state to all children. Accepts all standard div props.

| Prop         | Type                   | Default             | Description                                        |
| ------------ | ---------------------- | ------------------- | -------------------------------------------------- |
| `data`       | `DataPoint[]`          | required            | Array of `{ date: string \| Date, count: number }` |
| `start`      | `string \| Date`       | 1 year before `end` | Start of the date range                            |
| `end`        | `string \| Date`       | today               | End of the date range                              |
| `weekStart`  | `"sunday" \| "monday"` | `"sunday"`          | First day of the week                              |
| `classify`   | `ClassifyFn`           | `autoLevels(5)`     | Bucketing function mapping counts to levels        |
| `colorScale` | `string[]`             | —                   | Array of colors, one per level (index 0 = lowest)  |

### [Grid](#grid)

A `<div>` with CSS Grid layout. Renders `gridTemplateColumns` and `gridTemplateRows` based on the computed data. Accepts all standard div props.

Iterates over cells internally, calling the children render function for each cell. Each cell is wrapped in a context that `Cell` reads from.

`type CellData = { date: Date; count: number; level: number; column: number; row: number; };`

### [Cell](#cell)

A `<div>` that reads from cell context. Automatically applies:

- Grid positioning (`gridColumn`, `gridRow`)
- Background color from `colorScale`
- Tooltip hover handlers

Accepts all standard div props. Pass `colorScale` to override the Root-level color scale.

### [MonthLabels](#monthlabels)

Iterates over month labels, calling the children render function for each label.

``<HeatGraph.MonthLabels> {({ label, totalWeeks }) => ( <span style={{ left: `${(label.column / totalWeeks) * 100}%` }}> {HeatGraph.MONTH_SHORT[label.month]} </span> )} </HeatGraph.MonthLabels>``

Each label has `{ month: number, column: number }`. Use `totalWeeks` to compute label positions. Use `MONTH_SHORT[label.month]` for English labels, or format with `Intl.DateTimeFormat` for localization.

### [DayLabels](#daylabels)

Iterates over day-of-week labels, calling the children render function for each label.

`<HeatGraph.DayLabels> {({ label }) => ( <span>{HeatGraph.DAY_SHORT[label.dayOfWeek]}</span> )} </HeatGraph.DayLabels>`

Each label has `{ dayOfWeek: number, row: number }` where `dayOfWeek` is 0=Sun..6=Sat. Use `DAY_SHORT[label.dayOfWeek]` for English labels, or format with `Intl.DateTimeFormat` for localization.

### [Legend](#legend)

Iterates over legend levels, calling the children render function for each item. Each item has `{ level: number, color: string | undefined }`.

### [LegendLevel](#legendlevel)

A `<div>` that reads from legend item context. Automatically applies `backgroundColor` from the color scale. Use inside `Legend`.

### [Tooltip](#tooltip)

Renders only when a cell is hovered. Positioned by Radix Popper relative to the hovered cell. Accepts Radix Popper `Content` props (`side`, `sideOffset`, `align`, etc.).

`<HeatGraph.Tooltip side="top" sideOffset={8} className="..."> {({ cell }) => <div>{cell.count} contributions</div>} </HeatGraph.Tooltip>`

### [autoLevels(n)](#autolevelsn)

Default classification function. Maps counts into `n` evenly-distributed levels (0 to n-1). Level 0 is always count 0.

`type ClassifyFn = (counts: number[]) => (count: number) => number;`

To provide a custom classifier:

`const myClassify: HeatGraph.ClassifyFn = (counts) => { const p75 = percentile(counts, 75); return (count) => { if (count === 0) return 0; if (count < p75 * 0.25) return 1; if (count < p75 * 0.5) return 2; if (count < p75) return 3; return 4; }; }; <HeatGraph.Root data={data} classify={myClassify}>`

### [MONTH\_SHORT](#month_short)

English month abbreviations array: `["Jan", "Feb", ..., "Dec"]`. Index by `MonthLabel.month`.

### [DAY\_SHORT](#day_short)

English day abbreviations array: `["Sun", "Mon", ..., "Sat"]`. Index by `DayLabel.dayOfWeek`.