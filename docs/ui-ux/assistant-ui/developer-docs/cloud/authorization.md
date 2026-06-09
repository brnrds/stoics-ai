# User Authorization
URL: /docs/cloud/authorization

Configure workspace auth tokens and integrate with auth providers.

The Assistant Cloud API is accessed directly from your frontend. This eliminates the need for a backend server for most operations—except for authorizing your users.

This guide explains how to set up user authentication and authorization for Assistant Cloud.

## [Workspaces](#workspaces)

Authorization is granted to a **workspace**. A workspace is a scope that contains threads and messages. Most commonly:

- Use a `userId` as the workspace for personal chats
- Use `orgId + userId` for organization-scoped conversations
- Use `projectId + userId` for project-based apps

## [Authentication Approaches](#authentication-approaches)

Choose the approach that fits your app:

| Approach                             | Best For                                                     | Complexity |
| ------------------------------------ | ------------------------------------------------------------ | ---------- |
| **Direct auth provider integration** | Supported providers (Clerk, Auth0, Supabase, etc.)           | Low        |
| **Backend server**                   | Custom auth, multi-user workspaces, or self-hosted solutions | Medium     |
| **Anonymous mode**                   | Demos, prototypes, or testing                                | None       |

### [Direct Integration with Auth Provider](#direct-integration-with-auth-provider)

In the Assistant Cloud dashboard, go to **Auth Integrations** and add your provider. This sets up automatic workspace assignment based on the user's ID from your auth provider.

Then pass an `authToken` function that returns your provider's ID token:

`import { AssistantCloud } from "@assistant-ui/react"; const cloud = new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: () => getTokenFromYourProvider(), // Returns JWT });`

### [Backend Server Approach](#backend-server-approach)

Use this when you need custom workspace logic or unsupported auth providers.

#### [Create an API Key](#create-an-api-key)

In the Assistant Cloud dashboard, go to **API Keys** and create a key. Add it to your environment:

`ASSISTANT_API_KEY=your_key_here`

#### [Create the Token Endpoint](#create-the-token-endpoint)

- title

  /app/api/assistant-ui-token/route.ts

``import { AssistantCloud } from "assistant-cloud"; import { auth } from "@clerk/nextjs/server"; // Or your auth provider export const POST = async (req: Request) => { const { userId, orgId } = await auth(); if (!userId) return new Response("Unauthorized", { status: 401 }); // Define your workspace ID based on your app's structure const workspaceId = orgId ? `${orgId}_${userId}` : userId; const assistantCloud = new AssistantCloud({ apiKey: process.env.ASSISTANT_API_KEY!, userId, workspaceId, }); const { token } = await assistantCloud.auth.tokens.create(); return new Response(token); };``

#### [Use the Token on the Frontend](#use-the-token-on-the-frontend)

- title

  app/chat/page.tsx

`const cloud = new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: () => fetch("/api/assistant-ui-token", { method: "POST" }).then((r) => r.text()), }); const runtime = useChatRuntime({ cloud, });`

### [Anonymous Mode (No Auth)](#anonymous-mode-no-auth)

For demos or testing, use anonymous mode to create browser-session-based users:

`import { AssistantCloud } from "@assistant-ui/react"; const cloud = new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, anonymous: true, });`

Anonymous mode creates a new user for each browser session. Threads won't persist across sessions or devices. Use this only for prototyping.

## [Auth Provider Examples](#auth-provider-examples)

### [Clerk](#clerk)

#### [Configure the JWT Template](#configure-the-jwt-template)

In the Clerk dashboard, go to **Configure → JWT Templates**. Create a new blank template named "assistant-ui":

`{ "aud": "assistant-ui" }`

The `aud` claim ensures the JWT is only valid for Assistant Cloud.

Note the **Issuer** and **JWKS Endpoint** values.

#### [Add Auth Integration in Assistant Cloud](#add-auth-integration-in-assistant-cloud)

In the Assistant Cloud dashboard, go to **Auth Rules** and create a new rule:

- **Provider**: Clerk
- **Issuer**: Paste from Clerk JWT Template
- **JWKS Endpoint**: Paste from Clerk JWT Template
- **Audience**: `assistant-ui`

#### [Use in Your App](#use-in-your-app)

`import { useAuth } from "@clerk/nextjs"; import { AssistantCloud } from "@assistant-ui/react"; function Chat() { const { getToken } = useAuth(); const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: () => getToken({ template: "assistant-ui" }), }), [getToken], ); // Use with your runtime... }`

### [Auth0](#auth0)

`import { useAuth0 } from "@auth0/auth0-react"; import { AssistantCloud } from "@assistant-ui/react"; function Chat() { const { getAccessTokenSilently } = useAuth0(); const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: () => getAccessTokenSilently(), }), [getAccessTokenSilently], ); // Use with your runtime... }`

Configure the Auth0 integration in the Assistant Cloud dashboard with your Auth0 domain and audience.

### [Supabase Auth](#supabase-auth)

`import { useSupabaseClient } from "@supabase/auth-helpers-react"; import { AssistantCloud } from "@assistant-ui/react"; function Chat() { const supabase = useSupabaseClient(); const cloud = useMemo( () => new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: async () => { const { data } = await supabase.auth.getSession(); return data.session?.access_token ?? ""; }, }), [supabase], ); // Use with your runtime... }`

### [Firebase Auth](#firebase-auth)

`import { getAuth, getIdToken } from "firebase/auth"; import { AssistantCloud } from "@assistant-ui/react"; function Chat() { const cloud = useMemo(() => { const auth = getAuth(); return new AssistantCloud({ baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!, authToken: () => getIdToken(auth.currentUser!, true), }); }, []); // Use with your runtime... }`