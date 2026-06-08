# WorkOS Vault — Tenant API Keys

This project stores **tenant-owned API keys in WorkOS Vault**, not in platform environment variables or Postgres. Follow the same pattern as [ak-marketing-toolkit](file:///Users/bcsantos/Desktop/Kirkpatrick/ak-marketing-toolkit) unless this doc or the user says otherwise.

Reference implementation (copy patterns from here, do not invent new shapes):

```text
ak-marketing-toolkit/
  lib/vault.ts                 # WorkOS Vault SDK wrapper
  lib/vault-account.ts         # upsert + status (no values to client)
  db/vault-secrets.ts          # metadata DAL
  db/schema.ts                 # vault_secrets table
  schemas/vault.ts             # Zod
  types/vault.ts               # inferred types
  app/api/vault/secrets/route.ts
  lib/onboarding-requirements.ts   # key registry
  lib/capabilities/*/access.ts     # read-at-call-time pattern
```

WorkOS docs: [Vault](https://workos.com/docs/vault), [Vault object API](https://workos.com/docs/reference/vault/object).

## What goes where

| Store | Holds | Examples |
|---|---|---|
| **Platform env** (`schemas/env.ts`) | App bootstrap only — never tenant API keys | `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD`, `DATABASE_URL` |
| **WorkOS Vault** | Encrypted secret values, scoped by `organizationId: workosOrgId` | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, future provider keys |
| **Neon `vault_secrets`** | Metadata pointers only — never values | `vault_object_id`, `vault_object_name`, `kind`, `provider` |
| **WorkOS Pipes** | User OAuth tokens (if/when added) — not Vault | Not used for AI provider keys |

Do **not** add `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `AI_GATEWAY_API_KEY` to `schemas/env.ts` as tenant credentials. Platform env is for secrets that belong to the deployment, not to a customer org.

## Two-layer model

```text
Write:  UI/API → upsertVaultKeys → WorkOS Vault (value)
                              → Neon vault_secrets (metadata)

Read:   server capability/route → findVaultSecretMetadata(accountId, provider)
                               → readVaultSecret(vaultObjectId)
                               → use value in provider call (same request/step)
```

Rules:

1. Every Vault create/update uses `context: { organizationId: workosOrgId }` — never local `accountId` as the Vault org id.
2. Postgres stores only Vault object metadata after a successful Vault write.
3. **GET** endpoints return configured/missing status only. Never return secret values to the browser.
4. **POST** endpoints accept values once; clients do not read them back.
5. Read secret values **at call time** inside server code (route handler step, capability, Inngest step) — not at module load, not in events, not in logs, not in assistant persistence.
6. Use `versionCheck` from `readVaultSecret()` when updating to handle concurrent writes.
7. Tenant context comes from `resolveCurrentAccount()` / WorkOS session — never from browser-submitted `accountId` or `workosOrgId` alone.

## Planned keys for Stoics AI

Registry lives in `lib/onboarding-requirements.ts` (or equivalent) once Vault is implemented. Expected tenant keys:

| Key name | Provider slug | Used for |
|---|---|---|
| `OPENAI_API_KEY` | `openai_api_key` | `@ai-sdk/openai` |
| `ANTHROPIC_API_KEY` | `anthropic_api_key` | `@ai-sdk/anthropic` |

Optional later: `AI_GATEWAY_API_KEY` if switching to Vercel AI Gateway per tenant.

Naming (from reference):

```ts
vaultObjectName({ accountId, keyName }) // → acct_{accountId}_{key_name_lower}
vaultKeyProvider(keyName)               // → key name lowercased
```

## DB table (not yet in schema)

Add `vault_secrets` when implementing Vault. Shape matches the reference:

```text
vault_secrets
  id                  uuid PK
  account_id          uuid FK → accounts.id
  workos_org_id       text (org_*)
  vault_object_id     text unique (secret_*)
  vault_object_name   text unique
  kind                text ('api_key')
  provider            text (e.g. openai_api_key)
  created_by_user_id  uuid FK → users.id nullable
  created_at, updated_at

  unique (account_id, kind, provider)
  RLS via app.account_id (withAccountDb)
```

## AI SDK integration

When wiring chat or agents:

1. Resolve `AccountContext` from the authenticated session.
2. Load the provider key from Vault inside the route handler (or a dedicated `lib/capabilities/ai/access.ts`).
3. Pass the key to the provider factory at call time:

```ts
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const apiKey = await getOpenAiApiKey(context);
const openai = createOpenAI({ apiKey });

const result = streamText({
  model: openai('gpt-4o'),
  // ...
});
```

Do not cache decrypted keys in module scope, React state, or Inngest event payloads.

## Agent checklist

Before merging work that touches credentials:

1. Is this a **platform** secret (env) or **tenant** secret (Vault)? If tenant → Vault.
2. Does any code path write a secret value to Postgres, logs, events, or client responses?
3. Does the read path go through metadata lookup + `readVaultSecret`, scoped by resolved account?
4. Are AI routes gated on tenant-ready auth before reading Vault?
5. Does assistant/chat persistence exclude secret values and raw provider payloads?

## Current status

- **Decided:** tenant API keys use WorkOS Vault (this doc).
- **Not yet implemented:** `vault_secrets` table, `lib/vault.ts`, Vault API routes, key registry, capability readers.
- **Do not** implement the quickstart pattern of putting provider keys in `.env.local` for production tenant use. See `docs/examples/nextjs-app-router-chat.md` for chat wiring that assumes Vault.
