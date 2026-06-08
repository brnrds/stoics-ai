import { withAuth } from "@workos-inc/authkit-nextjs";
import { AuthButton } from "./components/auth-button";

export default async function Home() {
  const { user } = await withAuth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Stoics AI
          </h2>
          <AuthButton />
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {user ? (
            <>
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Welcome, {user.firstName || user.email}!
              </h1>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                You are signed in with {user.email}.
              </p>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  User Details
                </h3>
                <pre className="text-sm text-zinc-700 dark:text-zinc-300 overflow-auto">
                  {JSON.stringify(
                    {
                      id: user.id,
                      email: user.email,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      emailVerified: user.emailVerified,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </>
          ) : (
            <>
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Welcome to AuthKit
              </h1>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Sign in to access your account.
              </p>
            </>
          )}
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
