import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { getDb, schema } from "@/db";
import { withAccountDb } from "@/db/tenant";
import { getWorkOSClient } from "@/lib/workos";
import type {
  AccountContext,
  AccountSummary,
  CurrentUserSummary,
  EntityStatus,
} from "@/types/auth";

type WorkOSUserProjection = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

export class UserEmailConflictError extends Error {
  constructor(message = "workos_user_email_conflict") {
    super(message);
    this.name = "UserEmailConflictError";
  }
}

function isUsersEmailUniqueViolation(error: unknown) {
  const candidate =
    error && typeof error === "object" && "cause" in error
      ? error.cause
      : error;

  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  return (
    "code" in candidate &&
    candidate.code === "23505" &&
    "constraint" in candidate &&
    candidate.constraint === "users_email_unique"
  );
}

type ProjectSessionInput = {
  user: WorkOSUserProjection;
  organizationId?: string;
  organizationName?: string;
  roleSlug?: string;
  permissions?: string[];
  workosMembershipId?: string;
};

function getDisplayName(user: WorkOSUserProjection) {
  const name = [user.firstName, user.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return name || null;
}

function toUserSummary(user: typeof schema.users.$inferSelect): CurrentUserSummary {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    workosUserId: user.workosUserId,
  };
}

function toAccountSummary(
  account: typeof schema.accounts.$inferSelect,
): AccountSummary {
  return {
    id: account.id,
    name: account.name,
    status: account.status as EntityStatus,
    workosOrgId: account.workosOrgId,
  };
}

export async function upsertUserProjection(user: WorkOSUserProjection) {
  const now = new Date();
  const db = getDb();
  const [emailOwner] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(
      and(
        eq(schema.users.email, user.email),
        ne(schema.users.workosUserId, user.id),
      ),
    )
    .limit(1);

  if (emailOwner) {
    throw new UserEmailConflictError(
      `WorkOS user ${user.id} cannot use email already assigned to another user`,
    );
  }

  try {
    const [row] = await db
      .insert(schema.users)
      .values({
        workosUserId: user.id,
        email: user.email,
        name: getDisplayName(user),
        status: "active",
      })
      .onConflictDoUpdate({
        target: schema.users.workosUserId,
        set: {
          email: user.email,
          name: getDisplayName(user),
          status: "active",
          updatedAt: now,
        },
      })
      .returning();

    if (!row) {
      throw new Error("Failed to project WorkOS user");
    }

    return row;
  } catch (error) {
    if (isUsersEmailUniqueViolation(error)) {
      throw new UserEmailConflictError(
        `WorkOS user ${user.id} cannot use email already assigned to another user`,
      );
    }

    throw error;
  }
}

export async function findAccountByWorkOSOrgId(workosOrgId: string) {
  const db = getDb();
  const [account] = await db
    .select()
    .from(schema.accounts)
    .where(eq(schema.accounts.workosOrgId, workosOrgId))
    .limit(1);

  return account;
}

export async function upsertAccountProjection(input: {
  workosOrgId: string;
  name: string;
}) {
  const now = new Date();
  const db = getDb();
  const [row] = await db
    .insert(schema.accounts)
    .values({
      workosOrgId: input.workosOrgId,
      name: input.name,
      status: "active",
    })
    .onConflictDoUpdate({
      target: schema.accounts.workosOrgId,
      set: {
        name: input.name,
        status: "active",
        updatedAt: now,
      },
    })
    .returning();

  if (!row) {
    throw new Error("Failed to project WorkOS organization");
  }

  return row;
}

async function ensureAccountProjection(input: {
  workosOrgId: string;
  organizationName?: string;
}) {
  if (input.organizationName) {
    return upsertAccountProjection({
      workosOrgId: input.workosOrgId,
      name: input.organizationName,
    });
  }

  const existingAccount = await findAccountByWorkOSOrgId(input.workosOrgId);
  if (existingAccount) {
    return existingAccount;
  }

  const organization = await getWorkOSClient().organizations.getOrganization(
    input.workosOrgId,
  );

  return upsertAccountProjection({
    workosOrgId: organization.id,
    name: organization.name,
  });
}

async function findMembership(input: { accountId: string; userId: string }) {
  return withAccountDb(input.accountId, async (db) => {
    const [membership] = await db
      .select()
      .from(schema.accountMemberships)
      .where(
        and(
          eq(schema.accountMemberships.accountId, input.accountId),
          eq(schema.accountMemberships.userId, input.userId),
        ),
      )
      .limit(1);

    return membership;
  });
}

async function getActiveWorkOSMembership(input: {
  workosOrgId: string;
  workosUserId: string;
}) {
  try {
    const memberships =
      await getWorkOSClient().userManagement.listOrganizationMemberships({
        organizationId: input.workosOrgId,
        userId: input.workosUserId,
        statuses: ["active"],
        limit: 1,
      });

    return memberships.data[0];
  } catch (error) {
    console.warn("[account projection] unable to read WorkOS membership", error);
    return undefined;
  }
}

async function upsertMembershipProjection(input: {
  accountId: string;
  userId: string;
  workosOrgId: string;
  workosUserId: string;
  workosMembershipId?: string;
  roleSlug?: string;
}) {
  const existingMembership = await findMembership(input);
  const needsWorkOSMembership =
    existingMembership?.status !== "active" ||
    (!input.workosMembershipId && !existingMembership?.workosMembershipId);
  const activeWorkOSMembership = needsWorkOSMembership
    ? await getActiveWorkOSMembership({
        workosOrgId: input.workosOrgId,
        workosUserId: input.workosUserId,
      })
    : undefined;

  if (existingMembership?.status !== "active" && !activeWorkOSMembership) {
    return existingMembership;
  }

  const workosMembershipId =
    input.workosMembershipId ??
    existingMembership?.workosMembershipId ??
    activeWorkOSMembership?.id;
  const roleSlug = input.roleSlug ?? activeWorkOSMembership?.role.slug ?? null;
  const now = new Date();
  const membershipValues: typeof schema.accountMemberships.$inferInsert = {
    accountId: input.accountId,
    userId: input.userId,
    workosMembershipId,
    roleSlug,
    status: "active",
  };
  const membershipSet: Partial<typeof schema.accountMemberships.$inferInsert> =
    {
      workosMembershipId,
      roleSlug,
      status: "active",
      updatedAt: now,
    };

  return withAccountDb(input.accountId, async (db) => {
    const [row] = await db
      .insert(schema.accountMemberships)
      .values(membershipValues)
      .onConflictDoUpdate({
        target: [
          schema.accountMemberships.accountId,
          schema.accountMemberships.userId,
        ],
        set: membershipSet,
      })
      .returning();

    if (!row) {
      throw new Error("Failed to project WorkOS membership");
    }

    return row;
  });
}

export async function projectAuthenticatedSession(input: ProjectSessionInput) {
  const user = await upsertUserProjection(input.user);

  if (!input.organizationId) {
    return {
      user: toUserSummary(user),
      account: null,
      context: null,
    };
  }

  const account = await ensureAccountProjection({
    workosOrgId: input.organizationId,
    organizationName: input.organizationName,
  });

  const membership = await upsertMembershipProjection({
    accountId: account.id,
    userId: user.id,
    workosOrgId: account.workosOrgId,
    workosUserId: user.workosUserId,
    workosMembershipId: input.workosMembershipId,
    roleSlug: input.roleSlug,
  });

  if (!membership || membership.status !== "active") {
    return {
      user: toUserSummary(user),
      account: null,
      context: null,
    };
  }

  const context: AccountContext = {
    accountId: account.id,
    workosOrgId: account.workosOrgId,
    userId: user.id,
    workosUserId: user.workosUserId,
    roleSlug: membership.roleSlug ?? undefined,
    permissions: input.permissions ?? [],
  };

  return {
    user: toUserSummary(user),
    account: toAccountSummary(account),
    context,
  };
}
