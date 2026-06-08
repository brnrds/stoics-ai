import { signOut } from "@workos-inc/authkit-nextjs";

export function SignOutForm() {
  return (
    <form
      action={async () => {
        "use server";
        const returnTo = new URL(
          process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ??
            "http://localhost:3000",
        ).origin;
        await signOut({ returnTo });
      }}
    >
      <button
        type="submit"
        className="h-9 border border-border px-3 text-sm font-medium text-foreground transition hover:border-accent"
      >
        Sign out
      </button>
    </form>
  );
}
