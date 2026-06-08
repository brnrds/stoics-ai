import type { accounts, users } from "@/db/schema";
import type { entityStatusSchema } from "@/schemas/accounts";
import type { z } from "zod";

type EntityStatus = z.infer<typeof entityStatusSchema>;

export type { EntityStatus };

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
