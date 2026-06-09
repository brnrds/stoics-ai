import type { ReactNode } from "react";

export const shellNavLinkClassName =
  "inline-flex h-9 items-center gap-2 border border-border bg-surface px-3 text-sm font-medium text-foreground transition hover:border-accent";

type ShellHeaderProps = {
  leading: ReactNode;
  center?: ReactNode;
  trailing: ReactNode;
};

export function ShellHeader({ leading, center, trailing }: ShellHeaderProps) {
  return (
    <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-surface px-6 py-4">
      <div className="min-w-0">{leading}</div>
      {center ? (
        <div>{center}</div>
      ) : (
        <div aria-hidden className="pointer-events-none" />
      )}
      <div className="flex items-center justify-end gap-4">{trailing}</div>
    </header>
  );
}
