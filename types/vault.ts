import type { z } from "zod";

import type {
  vaultSecretKindSchema,
  vaultSecretMetadataSchema,
  vaultSecretStatusSchema,
} from "@/schemas/vault";

export type VaultSecretKind = z.infer<typeof vaultSecretKindSchema>;

export type VaultSecretMetadata = z.infer<typeof vaultSecretMetadataSchema>;

export type VaultSecretStatus = z.infer<typeof vaultSecretStatusSchema>;
