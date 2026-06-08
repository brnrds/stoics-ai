import type { accounts, users } from "@/db/schema";
import type { entityStatusSchema } from "@/schemas/accounts";
import type { z } from "zod";

type EntityStatus = z.infer<typeof entityStatusSchema>;

export type { EntityStatus };

export type AccountContext = {
  accountId: string;
  workosOrgId: string;
  userId: string;
  workosUserId: string;
  roleSlug?: string;
  permissions: string[];
};

export type AccountSummary = Pick<
  typeof accounts.$inferSelect,
  "id" | "name" | "workosOrgId"
> & {
  status: EntityStatus;
};

export type CurrentUserSummary = Pick<
  typeof users.$inferSelect,
  "id" | "email" | "name" | "workosUserId"
>;

export type AccountReadyState = {
  status: "ready";
  account: AccountSummary;
  user: CurrentUserSummary;
  context: AccountContext;
};

export type AccountRequiredState = {
  status: "account_required";
  user: CurrentUserSummary;
  selfServeEnabled: boolean;
};

export type AccountResolution = AccountReadyState | AccountRequiredState;
