"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

import { useTheme } from "./theme-provider";

const labels = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const;

const icons: Record<keyof typeof labels, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const Icon = icons[mode];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${labels[mode]}. Click to change.`}
      title={`Theme: ${labels[mode]}`}
      className="inline-flex size-9 items-center justify-center border border-border bg-surface text-foreground transition hover:border-accent"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
