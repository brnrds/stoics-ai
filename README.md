# Stoics AI

Early-stage Next.js app combining [WorkOS AuthKit](https://workos.com/docs/user-management) for authentication with the [Vercel AI SDK](https://ai-sdk.dev) for upcoming AI features.

## What's here so far

### WorkOS AuthKit

User authentication is wired up end to end:

- **Sign in / sign out** — `AuthButton` on the home page triggers AuthKit sign-in or posts to `/auth/signout`
- **Session handling** — `withAuth()` on the server reads the current user; `useAuth()` on the client drives the auth button
- **Auth routes** — `/auth/callback` (OAuth callback) and `/auth/signout`
- **Middleware** — `proxy.ts` runs `authkitProxy()` to manage session cookies on each request
- **Provider** — `AuthKitProvider` wraps the app in `app/layout.tsx`

Signed-in users see a welcome message and basic profile details (id, email, name, verification status).

### Vercel AI SDK

AI dependencies are installed on the **v7 canary** line, ready for implementation:

| Package | Purpose |
|---|---|
| `ai` | Core SDK (`generateText`, `streamText`, agents, tools, etc.) |
| `@ai-sdk/openai` | OpenAI provider |
| `@ai-sdk/anthropic` | Anthropic provider |
| `@ai-sdk/react` | React hooks (`useChat`, etc.) |

No AI routes, agents, or UI are implemented yet — the packages are in place for the next step.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **pnpm**

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- A [WorkOS](https://workos.com) account with AuthKit configured

### Environment variables

Create a `.env.local` with:

```bash
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_COOKIE_PASSWORD=...   # at least 32 characters
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
```

When you add AI features, tenant provider keys (OpenAI, Anthropic) are stored in **WorkOS Vault** per organization — not in `.env.local`. See `docs/vault.md`. Platform env stays WorkOS + database only.

### Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
pnpm lint
pnpm exec tsc --noEmit
```

## Project structure

```
app/
  page.tsx              # Home page (auth-aware welcome)
  layout.tsx            # Root layout with AuthKitProvider
  components/
    auth-button.tsx     # Sign in / sign out button
  auth/
    callback/route.ts   # WorkOS OAuth callback
    signout/route.ts    # Sign-out handler
proxy.ts                # AuthKit session middleware
```

## Updating AI SDK canary versions

All AI packages are pinned to canary releases. To pull the latest:

```bash
pnpm add ai@canary @ai-sdk/openai@canary @ai-sdk/anthropic@canary @ai-sdk/react@canary
```

## Learn more

- [WorkOS AuthKit for Next.js](https://workos.com/docs/user-management)
- [AI SDK documentation](https://ai-sdk.dev)
