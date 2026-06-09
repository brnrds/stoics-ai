import type { VaultKeyName } from "@/types/vault-keys";
import type { VaultSecretKind } from "@/types/vault";

export const VAULT_SECRET_KIND: VaultSecretKind = "api_key";

export const REQUIRED_VAULT_KEYS: VaultKeyName[] = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
];

export const ALL_VAULT_KEYS: VaultKeyName[] = [...REQUIRED_VAULT_KEYS];

export function isRequiredVaultKey(keyName: VaultKeyName): boolean {
  return REQUIRED_VAULT_KEYS.includes(keyName);
}

export function vaultKeyProvider(keyName: VaultKeyName): string {
  return keyName.toLowerCase();
}

export function vaultObjectName(input: {
  accountId: string;
  keyName: VaultKeyName;
}): string {
  return `acct_${input.accountId}_${input.keyName.toLowerCase()}`;
}

export function isVaultKeySecret(keyName: VaultKeyName): boolean {
  return keyName.endsWith("_API_KEY");
}
