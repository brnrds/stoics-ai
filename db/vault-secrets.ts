import "server-only";

import { and, eq } from "drizzle-orm";

import { schema } from "@/db";
import { withAccountDb } from "@/db/tenant";
import type { VaultSecretKind } from "@/types/vault";

type VaultSecretMetadataWrite = {
  accountId: string;
  workosOrgId: string;
  vaultObjectId: string;
  vaultObjectName: string;
  kind: VaultSecretKind;
  provider: string;
  createdByUserId?: string;
  isCreate: boolean;
};

export async function listVaultSecretMetadata(accountId: string) {
  return withAccountDb(accountId, (db) =>
    db
      .select()
      .from(schema.vaultSecrets)
      .where(eq(schema.vaultSecrets.accountId, accountId)),
  );
}

export async function findVaultSecretMetadata(input: {
  accountId: string;
  kind: VaultSecretKind;
  provider: string;
}) {
  return withAccountDb(input.accountId, async (db) => {
    const [row] = await db
      .select()
      .from(schema.vaultSecrets)
      .where(
        and(
          eq(schema.vaultSecrets.accountId, input.accountId),
          eq(schema.vaultSecrets.kind, input.kind),
          eq(schema.vaultSecrets.provider, input.provider),
        ),
      )
      .limit(1);

    return row;
  });
}

export async function persistVaultSecretMetadataBatch(
  items: VaultSecretMetadataWrite[],
): Promise<Array<{ provider: string; inserted: boolean }>> {
  if (items.length === 0) {
    return [];
  }

  const accountId = items[0]?.accountId;
  if (!accountId || items.some((item) => item.accountId !== accountId)) {
    throw new Error("Vault secret metadata batch must be scoped to one account");
  }

  return withAccountDb(accountId, async (db) => {
    const results: Array<{ provider: string; inserted: boolean }> = [];

    for (const item of items) {
      if (item.isCreate) {
        const [row] = await db
          .insert(schema.vaultSecrets)
          .values({
            accountId: item.accountId,
            workosOrgId: item.workosOrgId,
            vaultObjectId: item.vaultObjectId,
            vaultObjectName: item.vaultObjectName,
            kind: item.kind,
            provider: item.provider,
            createdByUserId: item.createdByUserId,
          })
          .onConflictDoNothing({
            target: [
              schema.vaultSecrets.accountId,
              schema.vaultSecrets.kind,
              schema.vaultSecrets.provider,
            ],
          })
          .returning();

        results.push({ provider: item.provider, inserted: Boolean(row) });
        continue;
      }

      const now = new Date();
      const [row] = await db
        .insert(schema.vaultSecrets)
        .values({
          accountId: item.accountId,
          workosOrgId: item.workosOrgId,
          vaultObjectId: item.vaultObjectId,
          vaultObjectName: item.vaultObjectName,
          kind: item.kind,
          provider: item.provider,
          createdByUserId: item.createdByUserId,
        })
        .onConflictDoUpdate({
          target: [
            schema.vaultSecrets.accountId,
            schema.vaultSecrets.kind,
            schema.vaultSecrets.provider,
          ],
          set: {
            vaultObjectId: item.vaultObjectId,
            vaultObjectName: item.vaultObjectName,
            workosOrgId: item.workosOrgId,
            updatedAt: now,
          },
        })
        .returning();

      if (!row) {
        throw new Error("Failed to upsert vault secret metadata");
      }

      results.push({ provider: item.provider, inserted: true });
    }

    return results;
  });
}
