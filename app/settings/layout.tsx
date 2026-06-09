import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ShellHeader,
  shellNavLinkClassName,
} from "@/app/components/shell-header";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { resolveCurrentAccount } from "@/lib/account-context";
import { SettingsNav } from "./settings-nav";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accountState = await resolveCurrentAccount();

  if (accountState.status === "account_required") {
    redirect("/account/setup");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <ShellHeader
        leading={
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Stoics AI
            </p>
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              Settings
            </h1>
          </div>
        }
        trailing={
          <>
            <Link href="/" className={shellNavLinkClassName}>
              Back to workspace
            </Link>
            <ThemeToggle />
          </>
        }
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
          <div className="flex-1 overflow-y-auto p-3">
            <SettingsNav />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
