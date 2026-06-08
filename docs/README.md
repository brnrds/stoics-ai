# Project Architecture Docs

These docs define the current development contract for **stoics-ai**.

## Read Order

1. `types.md`
2. `validation.md`
3. `vault.md` — tenant API keys (WorkOS Vault)
4. `theme.md`

## Source Of Truth Files

- `AGENTS.md` — agent entry point and hard rules
- `db/schema.ts` — database shape
- `schemas/env.ts` — platform env validation only

## Current Decisions

- WorkOS AuthKit is auth core.
- Tenant-owned API keys (OpenAI, Anthropic, etc.) go in **WorkOS Vault**, not platform env or Postgres. See `vault.md`.
- AI SDK v7 canary. See `AGENTS.md`.

## Hard Prohibitions

- No plaintext tenant secrets in Postgres, env, Inngest events, logs, or client responses.
- No alternate auth system.
- No ad hoc `scripts/` folder.
