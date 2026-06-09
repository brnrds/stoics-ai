import { z } from "zod";

export const vaultSecretKindSchema = z.enum(["api_key"]);

export const vaultSecretMetadataSchema = z
  .object({
    id: z.uuid(),
    accountId: z.uuid(),
    workosOrgId: z.string().startsWith("org_"),
    vaultObjectId: z.string(),
    vaultObjectName: z.string(),
    kind: vaultSecretKindSchema,
    provider: z.string(),
    createdByUserId: z.uuid().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();

export const vaultSecretStatusSchema = z.object({
  provider: z.string(),
  keyName: z.string(),
  configured: z.boolean(),
  kind: vaultSecretKindSchema,
  required: z.boolean().optional(),
});
