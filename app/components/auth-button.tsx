"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function AuthButton() {
  const { user, loading, refreshAuth } = useAuth();

  if (loading) {
    return (
      <div className="h-12 w-[120px] animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (user) {
    return (
      <form action="/auth/signout" method="GET">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[120px]"
        >
          Sign out
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void refreshAuth({ ensureSignedIn: true })}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[120px]"
    >
      Sign in
    </button>
  );
}
