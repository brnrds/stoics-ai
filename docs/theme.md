# Theme System

## Where

- Tokens: `app/globals.css`
- Shared logic: `lib/theme.ts` (`THEME_STORAGE_KEY`, apply/read helpers, inline script source)
- Anti-flash script: `app/components/theme-script.tsx` (injected in `<head>` from `app/layout.tsx`)
- Provider: `app/components/theme-provider.tsx` (`useTheme`, `cycle`)
- Toggle: `app/components/theme-toggle.tsx`
- App shell header: `app/components/app-header.tsx`
- Modal: `app/components/ui/Modal.tsx`
- Utility: `lib/utils.ts` (`cn()`)
- Reduced motion hook: `lib/hooks/useReducedMotion.ts`

## How it works

Three modes: Light, Dark, System. Stored in `localStorage` under key `theme`.

- `.dark` class on `<html>` = dark mode active.
- No stored value, or stored value `system` = follows `prefers-color-scheme`.
- Stored `light` removes `.dark`. Stored `dark` adds `.dark`.
- `ThemeScript` runs before paint and applies `.dark` from storage or system preference. Prevents flash.
- `ThemeProvider` wraps the app in `app/layout.tsx` and keeps the DOM class in sync after hydration and when the OS theme changes.
- `ThemeToggle` cycles: Light → Dark → System. Click, not dropdown.
- Other client components may read the active mode via `useTheme()` from `@/app/components/theme-provider`.

Storage key and apply logic live in `lib/theme.ts` so the head script and client code stay aligned.

## Token naming

All tokens are CSS custom properties defined in `app/globals.css` and bridged to Tailwind v4 via `@theme inline`.

Use Tailwind classes: `bg-background`, `text-foreground`, `border-border`, `bg-accent`, etc.

### Approved tokens

These are the only color tokens agents may use in product UI unless an approved task doc explicitly adds more:

| Token | Tailwind examples | Purpose |
|---|---|---|
| `background` | `bg-background` | Page background |
| `surface` | `bg-surface` | Cards, panels, modals, inputs |
| `surface-muted` | `bg-surface-muted` | Table headers, hover rows, secondary panels |
| `foreground` | `text-foreground` | Primary text |
| `muted` | `text-muted` | Secondary text, placeholders |
| `border` | `border-border` | Borders and dividers |
| `accent` | `bg-accent`, `border-accent` | Primary actions, focus emphasis |
| `accent-hover` | `hover:bg-accent-hover` | Primary action hover |
| `accent-foreground` | `text-accent-foreground` | Text on accent backgrounds |

Fonts (from `app/layout.tsx`):

| Token | Purpose |
|---|---|
| `--font-geist-sans` / `font-sans` | UI text |
| `--font-geist-mono` / `font-mono` | Monospace values |

### Light values

```text
background:       #fafaf9
surface:          #ffffff
surface-muted:    #f4f4f5
foreground:       #09090b
muted:            #71717a
border:           #e4e4e7
accent:           #09090b
accent-hover:     #27272a
accent-foreground:#ffffff
```

### Dark values

```text
background:       #09090b
surface:          #18181b
surface-muted:    #27272a
foreground:       #fafafa
muted:            #a1a1aa
border:           #27272a
accent:           #fafafa
accent-hover:     #e4e4e7
accent-foreground:#09090b
```

## What NOT to do

- Do not invent new color values. Use approved tokens.
- Do not use the `dark:` Tailwind prefix in components. The `.dark` class on `<html>` switches token values.
- Do not add `tailwind.config.js`. Tailwind v4 is CSS-first.
- Do not hardcode hex values in components.
- Do not create color utilities outside `globals.css` without approval.
- Do not use `prefers-color-scheme` media queries in components for theming. The root script and `ThemeToggle` handle it.

## Animation

Motion library: `motion` (Framer Motion). Imported as `from "motion/react"`.

Reduced motion: always use `useReducedMotion` from `@/lib/hooks/useReducedMotion`. When true, set `transition={{ duration: 0 }}`. Do not skip `AnimatePresence` — zero out duration instead.

### Modal

File: `app/components/ui/Modal.tsx`.

Pattern:

- Overlay: `backdrop-filter: blur(4px)` + `background-color: rgba(0, 0, 0, 0.18)`. Fades in 200ms ease-out.
- Content: scales from 95% to 100%, fades in 200ms with easing `[0.32, 0.72, 0, 1]`.
- Exit: reverse of enter. `AnimatePresence` handles unmount animation.
- Body scroll locked while open. Escape closes. Overlay click closes (configurable).
- Sizes: `sm` (`max-w-md`), `md` (`max-w-lg`), `lg` (`max-w-2xl`), `xl` (`max-w-4xl`), `full`.

Usage:

```tsx
import { Modal, ModalFooter } from "@/app/components/ui/Modal";

<Modal open={open} onClose={() => setOpen(false)} title="Edit record" size="md">
  <p className="text-sm text-foreground">Content here.</p>
  <ModalFooter>
    <button type="button" onClick={() => setOpen(false)}>Cancel</button>
    <button type="button">Save</button>
  </ModalFooter>
</Modal>
```

Props: `open`, `onClose`, `title?`, `size?`, `showClose?`, `closeOnOverlay?`, `closeOnEscape?`, `className?`, `children`.

`ModalFooter` — convenience wrapper for action buttons. Right-aligned, top border, `bg-surface-muted`.

Modal surfaces use theme tokens: `bg-surface`, `border-border`, `text-foreground`, `text-muted`, `hover:bg-surface-muted`.

### Animation rules for agents

- Do not use CSS `@keyframes` or `animate-*` Tailwind utilities for component enter/exit. Use Framer Motion.
- Do not use `transition-*` / `animate-*` Tailwind utilities for mount/unmount. Use `AnimatePresence` + `motion.*`.
- CSS `transition-colors` (and similar) on hover/focus is fine. That is not enter/exit animation.
- Always respect `useReducedMotion`. When reduced, use `{ duration: 0 }` for transitions.

## Layout patterns

| File / route | What |
|---|---|
| `app/(app)/layout.tsx` | Logged-in app shell: `AppHeader` + scrollable/flex child area. Used by `/`, `/drive`, and `/sheets/*`. |
| `app/components/app-header.tsx` | Standard top bar: product label, account name, email, settings link, sign out, theme toggle. |
| `app/settings/layout.tsx` | Settings-only shell: left sidebar nav + content column. Intentionally different from the main app shell. |
| `app/components/sheets/SheetTabs.tsx` | Spreadsheet tab strip with horizontal scroll. |
| `app/components/sheets/DataTable.tsx` | TanStack table: search, column visibility, sort, pagination, inline cell edit. |
| `app/components/ui/Modal.tsx` | Animated modal with backdrop blur. |

### Sheets workspace

Route: `/sheets/[spreadsheetId]`.

- Full viewport height under `AppHeader`.
- Tab strip, then toolbar + table, then pagination footer.
- Pagination controls are centered in the footer row. Lower-right corner is reserved (`pr-80` + empty anchor) for a future assistant panel. Do not place persistent UI in that corner without approval.

### Settings

Route: `/settings` redirects to `/settings/integrations`.

- Sidebar order: Integrations, then Keys / Secrets.
- Settings does not use `AppHeader`. Keep settings visually distinct from the main app shell.

## For agents

- Use approved tokens only.
- Use `cn()` from `@/lib/utils` when composing conditional classes.
- Use `AppHeader` via `app/(app)/layout.tsx` for standard logged-in pages. Do not duplicate the header markup.
- Use `Modal` for dialogs that need enter/exit animation and backdrop blur.
- For new spreadsheet UI, extend `SheetTabs` and `DataTable`; keep token classes consistent with `globals.css`.
- Settings pages stay under `app/settings/` with the settings layout unless explicitly approved otherwise.
