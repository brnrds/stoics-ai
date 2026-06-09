import "server-only";

import { getWorkOSClient } from "@/lib/workos";
import type { AccountContext } from "@/types/auth";

export async function createVaultSecret(input: {
  context: AccountContext;
  name: string;
  value: string;
}) {
  return getWorkOSClient().vault.createObject({
    name: input.name,
    value: input.value,
    context: { organizationId: input.context.workosOrgId },
  });
}

export async function readVaultSecret(input: { vaultObjectId: string }) {
  return getWorkOSClient().vault.readObject({ id: input.vaultObjectId });
}

export async function updateVaultSecret(input: {
  vaultObjectId: string;
  value: string;
  versionCheck?: string;
}) {
  return getWorkOSClient().vault.updateObject({
    id: input.vaultObjectId,
    value: input.value,
    versionCheck: input.versionCheck,
  });
}

export async function deleteVaultSecret(input: {
  vaultObjectId: string;
  versionCheck?: string;
}) {
  return getWorkOSClient().vault.deleteObject({
    id: input.vaultObjectId,
    versionCheck: input.versionCheck,
  });
}
