import "server-only";

import { findVaultSecretMetadata } from "@/db/vault-secrets";
import {
  VAULT_SECRET_KIND,
  vaultKeyProvider,
} from "@/lib/vault-requirements";
import { readVaultSecret } from "@/lib/vault";
import type { AccountContext } from "@/types/auth";
import type { VaultKeyName } from "@/types/vault-keys";

import { AiCapabilityError } from "./errors";

async function getVaultApiKey(
  context: AccountContext,
  keyName: VaultKeyName,
  errorCode: "anthropic_not_configured" | "openai_not_configured",
) {
  const provider = vaultKeyProvider(keyName);
  const metadata = await findVaultSecretMetadata({
    accountId: context.accountId,
    kind: VAULT_SECRET_KIND,
    provider,
  });

  if (!metadata) {
    throw new AiCapabilityError(errorCode);
  }

  const secret = await readVaultSecret({ vaultObjectId: metadata.vaultObjectId });
  const apiKey = secret.value?.trim();

  if (!apiKey) {
    throw new AiCapabilityError(errorCode);
  }

  return apiKey;
}

export async function getAnthropicApiKey(context: AccountContext) {
  return getVaultApiKey(context, "ANTHROPIC_API_KEY", "anthropic_not_configured");
}

export async function getOpenAiApiKey(context: AccountContext) {
  return getVaultApiKey(context, "OPENAI_API_KEY", "openai_not_configured");
}
