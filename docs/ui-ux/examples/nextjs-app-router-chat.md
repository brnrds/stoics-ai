# Next.js App Router Chat — Remaining Steps

Implementation guide for the [AI SDK Next.js App Router quickstart](https://ai-sdk.dev/docs/getting-started/nextjs-app-router), scoped to **what this repo still needs**. Follow bundled v7 docs in `node_modules/ai/docs/` when in doubt.

## Already done

Skip these sections from the official guide:

| Quickstart step | Status in this repo |
|---|---|
| Create Next.js app (App Router + Tailwind) | Done |
| Install `ai`, `@ai-sdk/react`, `zod` | Done (`ai@7` canary, `@ai-sdk/openai`, `@ai-sdk/anthropic`) |
| Run dev server | Done (`pnpm dev`) |
| WorkOS auth shell | Done — home page is auth-aware, not chat |

## 1. Provider API keys (Vault)

The official guide uses platform env or **Vercel AI Gateway**. **This project does not.** Tenant-owned keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) are stored in **WorkOS Vault** per organization — see `docs/vault.md`.

Before wiring chat:

1. Port the Vault stack from `ak-marketing-toolkit` (`lib/vault.ts`, `db/vault-secrets.ts`, `lib/vault-account.ts`, `lib/onboarding-requirements.ts`).
2. Add `lib/capabilities/ai/access.ts` using the accessor shape from `ak-marketing-toolkit/lib/capabilities/lusha/access.ts` (metadata → `readVaultSecret` → trimmed key).
3. Do **not** add provider keys to `schemas/env.ts` or `.env.local` for tenant use.

There is **no** `app/api/chat/route.ts` in `ak-marketing-toolkit`. For auth gating in API routes, copy `ak-marketing-toolkit/app/api/vault/secrets/route.ts` (`resolveCurrentAccountContext` → 401 / 428).

Platform env stays WorkOS + database only (`WORKOS_*`, `DATABASE_URL`).

## 2. Chat API route

Create `app/api/chat/route.ts`. Compose from `ak-marketing-toolkit/app/api/vault/secrets/route.ts` (auth gate) plus the AI accessor above. Load the provider key from Vault at call time — see `docs/vault.md`.

```tsx
import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { getAnthropicApiKey } from '@/lib/capabilities/ai/access';
import { resolveCurrentAccountContext } from '@/lib/account-context';

export async function POST(req: Request) {
  const context = await resolveCurrentAccountContext();
  const apiKey = await getAnthropicApiKey(context);
  const anthropic = createAnthropic({ apiKey });

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
```

Notes:

- v7 uses `createUIMessageStreamResponse` + `toUIMessageStream` (not `result.toUIMessageStreamResponse()`).
- Default endpoint is `POST /api/chat` — matches `useChat()` defaults.
- Protect with `withAuth()` before implementing for real users; the quickstart omits auth.

## 3. Chat UI

The quickstart replaces `app/page.tsx`. **Do not do that here** — the home page is the WorkOS welcome screen.

Add a client chat component instead, e.g. `app/components/chat.tsx`, and mount it on a new route (`app/chat/page.tsx`) or behind the signed-in branch on the home page.

Minimal client component (from the guide, v7-compatible):

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

`useChat` no longer manages input state — local `useState` is required.

## 4. Tools (weather example)

Add to the route handler:

```tsx
import { tool } from 'ai';
import { z } from 'zod';

// inside streamText({ ... })
tools: {
  weather: tool({
    description: 'Get the weather in a location (fahrenheit)',
    inputSchema: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }) => {
      const temperature = Math.round(Math.random() * (90 - 32) + 32);
      return { location, temperature };
    },
  }),
},
```

Render tool parts in the UI — part type is `tool-{toolName}`:

```tsx
case 'tool-weather':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

Without this, tool-only responses look blank in the UI.

## 5. Multi-step tool calls

By default generation stops after one step when tools run. Allow follow-up text with `stopWhen`:

```tsx
import { isStepCount } from 'ai';

const result = streamText({
  // ...
  stopWhen: isStepCount(5),
  tools: { /* ... */ },
  onStepFinish: ({ toolResults }) => {
    console.log(toolResults);
  },
});
```

Use `isStepCount`, not deprecated `stepCountIs`.

## 6. Second tool (temperature conversion)

Add `convertFahrenheitToCelsius` to `tools` and handle `tool-convertFahrenheitToCelsius` in the UI switch.

Test prompt: *"What's the weather in New York in celsius?"* — expect weather tool → conversion tool → natural language answer.

## Verify

1. Signed-in user can open the chat route.
2. Message streams back in real time.
3. Weather question shows tool JSON, then a text answer (after step 5).
4. Celsius question chains both tools.

```bash
pnpm exec tsc --noEmit
pnpm lint
```

## Next after the quickstart

- [assistant-ui chat UI](assistant-ui.md) — Thread components on top of the same `/api/chat` route
- [RAG chatbot cookbook](https://ai-sdk.dev/cookbook/guides/rag-chatbot)
- [Multi-modal chatbot](https://ai-sdk.dev/cookbook/guides/multi-modal-chatbot)
- Project harness tutorial under `docs/examples/ai-sdk-harness/`
