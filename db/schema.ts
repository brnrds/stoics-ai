import { sql } from "drizzle-orm";
import {
  check,
  customType,
  index,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const citext = customType<{ data: string; driverData: string }>({
  dataType() {
    return "citext";
  },
});

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workosOrgId: text("workos_org_id").notNull().unique(),
    name: text("name").notNull(),
    status: text("status").notNull().default("active"),
    onboardingSkippedAt: timestamp("onboarding_skipped_at", {
      withTimezone: true,
    }),
    ...timestamps,
  },
  (table) => [
    check(
      "accounts_workos_org_id_format",
      sql`${table.workosOrgId} like 'org_%'`,
    ),
    check(
      "accounts_status_check",
      sql`${table.status} in ('active', 'inactive', 'pending')`,
    ),
    index("accounts_status_idx").on(table.status),
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workosUserId: text("workos_user_id").notNull().unique(),
    email: citext("email").notNull().unique(),
    name: text("name"),
    status: text("status").notNull().default("active"),
    ...timestamps,
  },
  (table) => [
    check(
      "users_workos_user_id_format",
      sql`${table.workosUserId} like 'user_%'`,
    ),
    check(
      "users_status_check",
      sql`${table.status} in ('active', 'inactive', 'pending')`,
    ),
    index("users_status_idx").on(table.status),
  ],
);

export const accountMemberships = pgTable(
  "account_memberships",
  {
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workosMembershipId: text("workos_membership_id").unique(),
    roleSlug: text("role_slug"),
    status: text("status").notNull().default("active"),
    ...timestamps,
  },
  (table) => [
    primaryKey({
      name: "account_memberships_account_id_user_id_pk",
      columns: [table.accountId, table.userId],
    }),
    check(
      "account_memberships_workos_membership_id_format",
      sql`${table.workosMembershipId} is null or ${table.workosMembershipId} like 'om_%'`,
    ),
    check(
      "account_memberships_status_check",
      sql`${table.status} in ('active', 'inactive', 'pending')`,
    ),
    index("account_memberships_user_id_idx").on(table.userId),
    index("account_memberships_status_idx").on(table.status),
    pgPolicy("account_memberships_account_isolation", {
      for: "all",
      using: sql`${table.accountId}::text = current_setting('app.account_id', true)`,
      withCheck: sql`${table.accountId}::text = current_setting('app.account_id', true)`,
    }),
  ],
).enableRLS();
