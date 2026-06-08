import { withAuth } from "@workos-inc/authkit-nextjs";

import { AccountRequiredView } from "@/app/components/account-required-view";
import { AppHeader } from "@/app/components/app-header";
import { AuthButton } from "@/app/components/auth-button";
import { resolveCurrentAccount } from "@/lib/account-context";

export const dynamic = "force-dynamic";

function SignedOutView() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-end">
          <AuthButton />
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to AuthKit
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Sign in to access your account.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://workos.com/docs/user-management"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await withAuth();

  if (!auth.user) {
    return <SignedOutView />;
  }

  const accountState = await resolveCurrentAccount();

  if (accountState.status === "account_required") {
    return (
      <AccountRequiredView
        email={accountState.user.email}
        selfServeEnabled={accountState.selfServeEnabled}
      />
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <AppHeader
        accountName={accountState.account.name}
        email={accountState.user.email}
      />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </main>
  );
}
