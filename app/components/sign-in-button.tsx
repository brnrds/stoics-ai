"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function SignInButton() {
  const { refreshAuth } = useAuth();

  return (
    <button
      type="button"
      onClick={() => void refreshAuth({ ensureSignedIn: true })}
      className="h-10 bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:bg-accent-hover"
    >
      Sign in
    </button>
  );
}
