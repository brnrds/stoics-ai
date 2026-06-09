# assistant-ui — Remaining Steps

Implementation guide for the [assistant-ui installation tutorial](https://www.assistant-ui.com/docs/installation), scoped to **what this repo still needs**. Use standard project commands (`pnpm add`, `npx assistant-ui@latest init --use-pnpm`). If a command fails, stop and ask — do not invent workarounds.

For the raw AI SDK quickstart (no assistant-ui), see `docs/ui-ux/examples/nextjs-app-router-chat.md`.

## Already done

Skip these sections from the official guide:

| Tutorial step | Status in this repo |
|---|---|
| Install core packages | Done — `@assistant-ui/react`, `@assistant-ui/react-ai-sdk`, `@assistant-ui/react-markdown`, `class-variance-authority`, `radix-ui`, `remark-gfm`, `zustand` |
| Install `ai`, `@ai-sdk/react`, provider SDKs | Done — `ai@7` canary, `@ai-sdk/anthropic`, `@ai-sdk/openai` |
| Next.js App Router + Tailwind | Done |
| WorkOS auth shell | Done — chat mounts inside signed-in `(app)` routes, not on the public home page |

## 1. UI components

Packages alone are not enough. assistant-ui expects shadcn-style components under `components/assistant-ui/`.

**Preferred** — run the official init in the repo root:

```bash
npx assistant-ui@latest init --use-pnpm
```

This installs any missing deps, runs `shadcn add` for thread components, and wires imports.

**Manual** — if init is not an option, follow the [manual setup](https://www.assistant-ui.com/docs/installation#manual-setup):

```bash
npx shadcn@latest add https://r.assistant-ui.com/thread.json https://r.assistant-ui.com/thread-list.json
```

Or copy the source files listed in the official doc into `components/assistant-ui/`.

Notes:

- This repo has no `components.json` yet. Init or shadcn setup must happen before the Thread UI will compile.
- assistant-ui defaults assume shadcn tokens. Reconcile with project theme tokens in `docs/theme.md` when styling — do not blindly replace the existing theme system.

## 2. Provider API keys (Vault)

The official tutorial adds `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to `.env`. **This project does not.** Tenant-owned keys live in **WorkOS Vault** per organization — see `docs/vault.md`.

**Reference (`ak-marketing-toolkit`)** — Vault is implemented there, but there is **no** `app/api/chat/route.ts` and **no** `getOpenAiApiKey` / `getAnthropicApiKey` yet. Copy these instead:

| Piece | Reference file |
|---|---|
| Vault SDK wrapper | `ak-marketing-toolkit/lib/vault.ts` |
| Metadata DAL | `ak-marketing-toolkit/db/vault-secrets.ts` (`findVaultSecretMetadata`) |
| Upsert + status | `ak-marketing-toolkit/lib/vault-account.ts` |
| Key registry | `ak-marketing-toolkit/lib/onboarding-requirements.ts` (`OPENAI_API_KEY` listed; add `ANTHROPIC_API_KEY` for Stoics) |
| Auth-gated API route | `ak-marketing-toolkit/app/api/vault/secrets/route.ts` (`resolveCurrentAccountContext` → 401 / 428) |
| Read key at call time | `ak-marketing-toolkit/lib/capabilities/lusha/access.ts` or `.../companies-house/access.ts` |

Before wiring chat:

1. Port the Vault stack above into this repo.
2. Add `lib/capabilities/ai/access.ts` using the Lusha accessor shape — metadata lookup → `readVaultSecret` → trimmed string → capability error if missing.
3. Do **not** add provider keys to `schemas/env.ts` or `.env.local` for tenant use.

Example accessor to add (template from `lib/capabilities/lusha/access.ts`):

```tsx
import "server-only";

import { findVaultSecretMetadata } from "@/db/vault-secrets";
import {
  VAULT_SECRET_KIND,
  vaultKeyProvider,
} from "@/lib/onboarding-requirements";
import { readVaultSecret } from "@/lib/vault";
import type { AccountContext } from "@/types/auth";

import { AiCapabilityError } from "./errors";

const ANTHROPIC_VAULT_KEY = "ANTHROPIC_API_KEY" as const;

export async function getAnthropicApiKey(context: AccountContext) {
  const provider = vaultKeyProvider(ANTHROPIC_VAULT_KEY);
  const metadata = await findVaultSecretMetadata({
    accountId: context.accountId,
    kind: VAULT_SECRET_KIND,
    provider,
  });

  if (!metadata) {
    throw new AiCapabilityError("anthropic_not_configured");
  }

  const secret = await readVaultSecret({ vaultObjectId: metadata.vaultObjectId });
  const apiKey = secret.value?.trim();

  if (!apiKey) {
    throw new AiCapabilityError("anthropic_not_configured");
  }

  return apiKey;
}
```

## 3. Chat API route

Create `app/api/chat/route.ts`. The route must match what `AssistantChatTransport` sends: `{ messages, system, tools }`.

There is no chat route in `ak-marketing-toolkit` to copy verbatim. Compose it from:

1. **Auth gate** — `ak-marketing-toolkit/app/api/vault/secrets/route.ts` (`resolveCurrentAccountContext`, 401 / 428).
2. **Key read** — `getAnthropicApiKey(result.account)` from the accessor above.
3. **Stream** — assistant-ui transport contract below.

```tsx
import { createAnthropic } from '@ai-sdk/anthropic';
import { frontendTools } from '@assistant-ui/react-ai-sdk';
import {
  convertToModelMessages,
  streamText,
} from 'ai';

import { getAnthropicApiKey } from '@/lib/capabilities/ai/access';
import { resolveCurrentAccountContext } from '@/lib/account-context';

export const maxDuration = 30;

export async function POST(req: Request) {
  const result = await resolveCurrentAccountContext();

  if (result.status === 'unauthenticated') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (result.status === 'account_required') {
    return Response.json({ error: 'Account required' }, { status: 428 });
  }

  const apiKey = await getAnthropicApiKey(result.account);
  const anthropic = createAnthropic({ apiKey });

  const { messages, system, tools } = await req.json();

  const streamResult = streamText({
    model: anthropic('claude-sonnet-4-6'),
    instructions: system, // assistant-ui sends `system`; v7 uses `instructions`
    messages: await convertToModelMessages(messages),
    tools: frontendTools(tools),
  });

  return streamResult.toUIMessageStreamResponse();
}
```

Notes:

- `frontendTools(tools)` is required when using assistant-ui frontend tool definitions.
- `AssistantChatTransport` defaults to `POST /api/chat`.
- The official tutorial uses `result.toUIMessageStreamResponse()`. That still works on AI SDK v7 (deprecated). For the v7-forward streaming shape, see `docs/ui-ux/examples/nextjs-app-router-chat.md` — confirm assistant-ui transport compatibility before switching.
- `getAnthropicApiKey` and the Vault stack are not implemented in either repo yet for AI; the accessor template comes from `ak-marketing-toolkit/lib/capabilities/lusha/access.ts`.

## 4. Client runtime + Thread

Add a client component, e.g. `app/components/assistant-chat.tsx`:

```tsx
'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import {
  AssistantChatTransport,
  useChatRuntime,
} from '@assistant-ui/react-ai-sdk';

import { ThreadList } from '@/components/assistant-ui/thread-list';
import { Thread } from '@/components/assistant-ui/thread';

export function AssistantChat() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full min-h-0">
        <ThreadList />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}
```

Alternative: `AssistantModal` instead of full-page Thread — see [official docs](https://www.assistant-ui.com/docs/installation#use-it-in-your-app).

## 5. Mount in the app shell

**Do not** replace `app/(app)/page.tsx` with the tutorial's standalone page. The home page is the WorkOS workspace shell.

Mount `AssistantChat` on a dedicated route instead, e.g. `app/(app)/chat/page.tsx`, inside the existing `(app)` layout so auth and account resolution already apply.

## Verify

1. Signed-in user with a configured Vault key can open the chat route.
2. Thread renders with assistant-ui components (composer, messages, markdown).
3. Messages stream in real time.
4. Frontend tools round-trip if enabled.

```bash
pnpm exec tsc --noEmit
pnpm lint
```

## Next after the tutorial

- [assistant-ui AI SDK runtime](https://www.assistant-ui.com/docs/runtimes/ai-sdk)
- [Generative UI](https://www.assistant-ui.com/docs/guides/generative-ui)
- Raw AI SDK quickstart (tools, multi-step): `docs/ui-ux/examples/nextjs-app-router-chat.md`
- Agent harness tutorial: `docs/examples/ai-sdk-harness/`
