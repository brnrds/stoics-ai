import Link from "next/link";

import { Mail, MessageSquare, Settings } from "lucide-react";

import {
  ShellHeader,
  shellNavLinkClassName,
} from "@/app/components/shell-header";
import { SignOutForm } from "./sign-out-form";
import { ThemeToggle } from "./theme-toggle";

type AppHeaderProps = {
  accountName: string;
  email: string;
};

export function AppHeader({ accountName, email }: AppHeaderProps) {
  return (
    <ShellHeader
      leading={
        <Link href="/" className="block transition hover:opacity-80">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Stoics AI
          </p>
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {accountName}
          </h1>
        </Link>
      }
      center={
        <nav className="flex items-center gap-2" aria-label="App">
          <Link href="/" className={shellNavLinkClassName}>
            Workspace
          </Link>
          <Link href="/chat" className={shellNavLinkClassName}>
            <MessageSquare className="size-4" aria-hidden />
            Chat
          </Link>
        </nav>
      }
      trailing={
        <>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-64 items-center gap-2 text-sm text-muted-foreground sm:inline-flex">
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
        </>
      }
    />
  );
}
