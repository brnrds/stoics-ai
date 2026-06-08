import Link from "next/link";
import { redirect } from "next/navigation";

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
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-border px-5">
          <span className="text-sm font-semibold tracking-tight">Stoics AI</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <SettingsNav />
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-6">
          <h1 className="text-base font-semibold tracking-tight">Settings</h1>
          <Link
            href="/"
            className="h-9 border border-border px-3 text-sm font-medium leading-9 text-foreground transition hover:border-accent"
          >
            Back to workspace
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
