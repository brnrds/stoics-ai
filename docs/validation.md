# Runtime Validation

Use Zod for runtime validation.

Types describe trusted values. Schemas validate untrusted values. Do not use a TypeScript type as proof that runtime input is valid.

## Untrusted Boundaries

Validate input at every untrusted boundary:

- `request.json()`
- URL params when shape matters
- server action input
- webhook payloads
- third-party API responses
- environment variables
- uploaded files
- event or job payloads crossing process boundaries

## Schema Location

Schemas live in `schemas/`.

One domain per file:

```text
schemas/
  users.ts
  tasks.ts
  billing.ts
```

Do not define schemas inline in pages, components, route handlers, server actions, or background jobs.

Do not put schemas in `types/`. Schemas are runtime values.

## Naming

Schema names use a `Schema` suffix:

```ts
export const createTaskBodySchema = z.object({
  title: z.string().min(1),
});
```

Use boundary-specific names when the shape belongs to a boundary:

- `createTaskBodySchema`
- `taskCreatedEventSchema`
- `externalCompanyResponseSchema`
- `envSchema`

Avoid vague names:

- `schema`
- `dataSchema`
- `payloadSchema`
- `responseSchema`

## Types From Schemas

When a shared contract is schema-backed, infer the TypeScript type from the schema. Do not duplicate it manually.

```ts
// types/tasks.ts
import type { z } from "zod";
import type { createTaskBodySchema } from "@/schemas/tasks";

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
```

Local-only inferred types may stay local:

```ts
type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
```

## Boundary Parsing

Use `safeParse` at request, webhook, form, third-party API, and event boundaries.

```ts
const result = createTaskBodySchema.safeParse(await request.json());

if (!result.success) {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

const body = result.data;
```

Use `parse` only for fail-fast startup code, such as environment parsing.

```ts
export const env = envSchema.parse(process.env);
```

## Error Responses

Do not expose raw Zod errors by default.

Return stable app-owned errors:

```ts
return NextResponse.json({ error: "Invalid request" }, { status: 400 });
```

Field-level validation errors are allowed when building user-facing form flows. Shape those errors intentionally; do not leak raw internals.

## Transforms

Do not use Zod transforms in shared boundary schemas unless explicitly approved.

Validate first. Normalize afterward in ordinary runtime code.

```ts
const result = createTaskBodySchema.safeParse(input);

if (!result.success) {
  return invalidRequest();
}

const title = result.data.title.trim();
```

Event schemas must not use transforms.

## Inngest

Use Zod schemas with Inngest event definitions.

```ts
// schemas/tasks.ts
import { z } from "zod";

export const taskCreatedEventSchema = z.object({
  id: z.string().min(1),
});
```

```ts
// inngest/client.ts
import { eventType } from "inngest";
import { taskCreatedEventSchema } from "@/schemas/tasks";

export const taskCreated = eventType("app/task.created", {
  schema: taskCreatedEventSchema,
});
```

Use `staticSchema()` only when explicitly approved. It is type-only and does not validate at runtime.

## External APIs

Validate third-party responses before normalizing them into app-owned types.

SDK types may describe the SDK surface, but external data is still runtime input.

## No Manual Narrowing For Contracts

Manual `unknown` narrowing is allowed for tiny local checks. Public contracts should use Zod schemas.

Do not hand-roll validators for request bodies, webhooks, third-party responses, env, or event payloads.

## References

- Zod: https://zod.dev/
- Inngest trigger schemas: https://www.inngest.com/docs/reference/typescript/functions/triggers
