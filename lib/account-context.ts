import "server-only";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { projectAuthenticatedSession } from "@/lib/account-projection";
import type { AccountContext, AccountResolution } from "@/types/auth";

function isSelfServeAccountsEnabled() {
  return process.env.ENABLE_SELF_SERVE_ACCOUNTS === "true";
}

type AccountContextResult =
  | {
      status: "unauthenticated";
    }
  | {
      status: "account_required";
      workosUserId: string;
      email: string;
      selfServeEnabled: boolean;
    }
  | {
      status: "ready";
      account: AccountContext;
    };

export async function resolveCurrentAccount(): Promise<AccountResolution> {
  const auth = await withAuth();

  if (!auth.user) {
    redirect("/sign-in");
  }

  const projection = await projectAuthenticatedSession({
    user: auth.user,
    organizationId: auth.organizationId,
    roleSlug: auth.role,
    permissions: auth.permissions,
  });

  if (!projection.account || !projection.context) {
    return {
      status: "account_required",
      user: projection.user,
      selfServeEnabled: isSelfServeAccountsEnabled(),
    };
  }

  return {
    status: "ready",
    account: projection.account,
    user: projection.user,
    context: projection.context,
  };
}

export async function resolveCurrentAccountContext(): Promise<AccountContextResult> {
  const auth = await withAuth();

  if (!auth.user) {
    return { status: "unauthenticated" };
  }

  const projection = await projectAuthenticatedSession({
    user: auth.user,
    organizationId: auth.organizationId,
    roleSlug: auth.role,
    permissions: auth.permissions,
  });

  if (!projection.context) {
    return {
      status: "account_required",
      workosUserId: projection.user.workosUserId,
      email: projection.user.email,
      selfServeEnabled: isSelfServeAccountsEnabled(),
    };
  }

  return {
    status: "ready",
    account: projection.context,
  };
}
