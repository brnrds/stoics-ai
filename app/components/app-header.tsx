import Link from "next/link";

import { Mail, Settings } from "lucide-react";

import { SignOutForm } from "./sign-out-form";
import { ThemeToggle } from "./theme-toggle";

type AppHeaderProps = {
  accountName: string;
  email: string;
};

export function AppHeader({ accountName, email }: AppHeaderProps) {
  return (
    <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-surface px-6 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          Stoics AI
        </p>
        <h1 className="truncate text-2xl font-semibold tracking-tight">
          {accountName}
        </h1>
      </div>

      <nav className="flex items-center gap-2" aria-label="App" />

      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <span className="hidden max-w-64 items-center gap-2 text-sm text-muted sm:inline-flex">
            <Mail className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{email}</span>
          </span>
          <Link
            href="/settings"
            aria-label="Settings"
            title="Settings"
            className="inline-flex size-9 items-center justify-center border border-border bg-surface text-foreground transition hover:border-accent"
          >
            <Settings className="size-4" aria-hidden />
          </Link>
          <SignOutForm />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
