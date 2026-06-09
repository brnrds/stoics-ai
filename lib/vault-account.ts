import "server-only";

import {
  findVaultSecretMetadata,
  listVaultSecretMetadata,
  persistVaultSecretMetadataBatch,
} from "@/db/vault-secrets";
import {
  ALL_VAULT_KEYS,
  VAULT_SECRET_KIND,
  vaultKeyProvider,
  vaultObjectName,
} from "@/lib/vault-requirements";
import {
  createVaultSecret,
  readVaultSecret,
  updateVaultSecret,
} from "@/lib/vault";
import type { AccountContext } from "@/types/auth";
import type { VaultKeyName } from "@/types/vault-keys";
import type { VaultSecretStatus } from "@/types/vault";

export async function getVaultKeyStatuses(
  accountId: string,
): Promise<VaultSecretStatus[]> {
  const rows = await listVaultSecretMetadata(accountId);
  const configured = new Set(
    rows
      .filter((row) => row.kind === VAULT_SECRET_KIND)
      .map((row) => row.provider),
  );

  return ALL_VAULT_KEYS.map((keyName) => {
    const provider = vaultKeyProvider(keyName);
    return {
      keyName,
      provider,
      kind: VAULT_SECRET_KIND,
      configured: configured.has(provider),
    };
  });
}

async function updateExistingVaultSecret(input: {
  vaultObjectId: string;
  value: string;
}) {
  const current = await readVaultSecret({ vaultObjectId: input.vaultObjectId });

  await updateVaultSecret({
    vaultObjectId: input.vaultObjectId,
    value: input.value,
    versionCheck: current.metadata?.versionId ?? undefined,
  });
}

export async function upsertVaultKeys(input: {
  context: AccountContext;
  keys: Partial<Record<VaultKeyName, string>>;
}) {
  const metadataWrites: Array<{
    keyName: VaultKeyName;
    accountId: string;
    workosOrgId: string;
    vaultObjectId: string;
    vaultObjectName: string;
    kind: typeof VAULT_SECRET_KIND;
    provider: string;
    createdByUserId?: string;
    isCreate: boolean;
    trimmed: string;
  }> = [];

  for (const [keyName, value] of Object.entries(input.keys) as [
    VaultKeyName,
    string | undefined,
  ][]) {
    const trimmed = value?.trim();
    if (!trimmed) {
      continue;
    }

    const provider = vaultKeyProvider(keyName);
    const objectName = vaultObjectName({
      accountId: input.context.accountId,
      keyName,
    });
    const existing = await findVaultSecretMetadata({
      accountId: input.context.accountId,
      kind: VAULT_SECRET_KIND,
      provider,
    });

    if (existing) {
      await updateExistingVaultSecret({
        vaultObjectId: existing.vaultObjectId,
        value: trimmed,
      });

      metadataWrites.push({
        keyName,
        accountId: input.context.accountId,
        workosOrgId: input.context.workosOrgId,
        vaultObjectId: existing.vaultObjectId,
        vaultObjectName: objectName,
        kind: VAULT_SECRET_KIND,
        provider,
        createdByUserId: input.context.userId,
        isCreate: false,
        trimmed,
      });
      continue;
    }

    const created = await createVaultSecret({
      context: input.context,
      name: objectName,
      value: trimmed,
    });

    metadataWrites.push({
      keyName,
      accountId: input.context.accountId,
      workosOrgId: input.context.workosOrgId,
      vaultObjectId: created.id,
      vaultObjectName: objectName,
      kind: VAULT_SECRET_KIND,
      provider,
      createdByUserId: input.context.userId,
      isCreate: true,
      trimmed,
    });
  }

  const batchResults = await persistVaultSecretMetadataBatch(metadataWrites);

  for (const result of batchResults) {
    if (result.inserted) {
      continue;
    }

    const write = metadataWrites.find((item) => item.provider === result.provider);
    if (!write) {
      throw new Error(`Missing vault metadata write for provider ${result.provider}`);
    }

    const existing = await findVaultSecretMetadata({
      accountId: input.context.accountId,
      kind: VAULT_SECRET_KIND,
      provider: write.provider,
    });

    if (!existing) {
      throw new Error(`Failed to store vault key ${write.keyName}`);
    }

    await updateExistingVaultSecret({
      vaultObjectId: existing.vaultObjectId,
      value: write.trimmed,
    });
  }

  return {
    saved: metadataWrites.map((item) => item.keyName),
  };
}
