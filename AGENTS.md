This project has a defined architecture, rules and patterns. Make sure you are aware of them before implementing anything that touches more than a single file. These are not set in stone, they may evolve if it benefits the quality of the product. If you spot something, bring it up with the user. Engineering excellence is encouraged. Over-engineering is not.

Think about design, discuss it with the user, but do *NOT* make design decisions on the spot and apply them to the codebase.

If task requires choosing names, defaults, contracts, flow, architecture, abstractions, or cross-system wiring not already specified by human or vendor docs, stop and ask.
Do not invent. Do not "improve." Do not generalize.
Do not refactor adjacent code because you find it unaesthetic.
Do not introduce a helper, a wrapper, an interface, or a base class without being told to. If an approved doc explicitly names a helper, resolver, or DAL module, that counts as being told.
Explain what you are about to do and why.

No legacy compatibility. Do not create `scripts/` or add ad hoc repo scripts.

Use standard project commands (`pnpm add`, `pnpm lint`, etc.). If a command fails, stop and ask — do not invent workarounds (custom `TMPDIR`, alternate package managers, etc.) without user approval.

Docs live in `docs/`. Do not write docs or create folders in `docs/` without user approval. Keep `AGENTS.md` short. Put task-specific agent rules in `.cursor/rules/`.

WorkOS is auth core. Do not add alternate auth.

Tenant API keys (OpenAI, Anthropic, etc.) go in **WorkOS Vault**, not platform env or Postgres. See `docs/vault.md`. Reference: `ak-marketing-toolkit` (`lib/vault.ts`, `lib/vault-account.ts`, `db/vault-secrets.ts`).

## AI SDK (v7 canary)

This project targets AI SDK v7 (`ai@canary`). Use the official `ai-sdk` skill (`.agents/skills/ai-sdk`; refresh with `npx skills add vercel/ai -y -a cursor`). Treat `node_modules/ai/docs/` as source of truth — especially `08-migration-guides/23-migration-guide-7-0.mdx`. Skill reference files may lag; prefer bundled docs over skill memory. Key v7 patterns: `instructions` (not `system`), `isStepCount` (not `stepCountIs`), `createUIMessageStreamResponse` + `toUIMessageStream` for chat routes.
