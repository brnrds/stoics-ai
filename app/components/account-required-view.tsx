import Link from "next/link";

import { SignOutForm } from "./sign-out-form";

export function AccountRequiredView({
  email,
  selfServeEnabled,
}: {
  email: string;
  selfServeEnabled: boolean;
}) {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-xl flex-col justify-center px-6 py-16">
        <div className="border border-border bg-surface p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-muted-foreground">{email}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                Account required
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Select or join a WorkOS organization to continue.
              </p>
            </div>
            <SignOutForm />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account/setup"
              className="inline-flex h-10 items-center justify-center bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:bg-accent-hover"
            >
              {selfServeEnabled ? "Create account" : "View access"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
