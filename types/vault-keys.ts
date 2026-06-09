import type { z } from "zod";

import type { vaultKeyNameSchema } from "@/schemas/vault-keys";

export type VaultKeyName = z.infer<typeof vaultKeyNameSchema>;
