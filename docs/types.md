# Type Organization

TypeScript types should make contracts easy to find without turning `types/` into a junk drawer.

## Rule

Pages, components, hooks, and route handlers should not define shared contracts inline.

Use local `type` aliases for local implementation shapes. Put public or cross-layer contracts in `types/`.

Do not use `interface` unless there is a concrete TypeScript reason, such as module augmentation or a library requiring interface extension. Default to `type`.

## Local Types

Local types stay next to the code that owns them.

Good local uses:

- component props
- private helper return values
- narrow state shapes
- one-file form state
- values not imported elsewhere

Example:

```tsx
type Props = {
  title: string;
  onClose?: () => void;
};

export function DialogTitle({ title, onClose }: Props) {
  return <button onClick={onClose}>{title}</button>;
}
```

Do not move a type to `types/` just because it is tidy. Move it when it is a contract.

## Shared Contracts

Shared contracts live in `types/`.

A contract belongs in `types/` when it is:

- used across layers, such as UI to API to lib
- an API request or response shape
- a persisted domain model
- an external service payload after normalization
- an event or job payload
- imported by more than one ownership area

Example:

```ts
// types/tasks.ts
export type TaskCreatedEvent = {
  id: string;
  title?: string;
  userId: string;
};

export type CreateTaskResponse = {
  message: string;
  eventIds: string[];
  task: TaskCreatedEvent;
};
```

Then import it:

```ts
import type { TaskCreatedEvent } from "@/types/tasks";
```

## Runtime Validation

Types do not validate input. Runtime validation policy lives in `docs/validation.md`.

Schemas are runtime values. They do not live in `types/`.

When a shared contract is backed by a schema, infer the TypeScript type from the schema instead of duplicating it manually.

## `types/` Layout

One domain per file:

```text
types/
  users.ts
  tasks.ts
  billing.ts
```

Rules:

- named exports only
- type-only imports use `import type`
- type-only exports use `export type`
- no runtime functions, constants, side effects, or schema objects in `types/`
- no catch-all `types/index.ts` unless explicitly approved

## Naming

Use names that reveal boundary and direction.

Good:

- `CreateTaskRequest`
- `CreateTaskResponse`
- `TaskCreatedEvent`
- `UserSummary`
- `ExternalCompanyPayload`

Avoid:

- `Data`
- `Payload`
- `Result`
- `Props` in `types/`
- `ApiResponse`

`Props` is fine as a local component type.

## Boundaries

Boundary code should import exported contracts when those shapes are part of app behavior.

Boundaries include:

- route handlers
- server actions
- webhook handlers
- event producers
- background jobs
- third-party service adapters
- persistence adapters

Do not define public contracts inline in boundary files.

Allowed inline:

- local parser intermediate shapes
- private helper return types
- narrow `unknown` handling

Not allowed inline:

```ts
type CreateTaskResponse = {
  message: string;
  eventIds: string[];
};
```

Move that to `types/tasks.ts`.

## Components

Components should not own domain contracts.

Components may own local presentation props:

```tsx
type Props = {
  task: TaskSummary;
};
```

The domain type comes from `types/`:

```tsx
import type { TaskSummary } from "@/types/tasks";
```

## Runtime Definitions

Runtime definitions are not types.

Schemas, event definitions, route handlers, SDK clients, DB clients, and service clients live in runtime modules, not `types/`.

Use `types/` for the contract shape only.

Good:

```ts
// types/tasks.ts
export type TaskCreatedEvent = {
  id: string;
  title?: string;
  userId: string;
};
```

```ts
// runtime module
import type { TaskCreatedEvent } from "@/types/tasks";

const payload: TaskCreatedEvent = {
  id,
  userId,
};
```

## External SDKs

SDK ownership and normalization policy lives in `docs/external-sdks.md`.

## No `any`

Do not use `any`.

Use `unknown` at untrusted boundaries, then narrow. Use generics only when the caller truly controls the type.

## When In Doubt

Keep type local unless moving it improves a real contract boundary.

Ask before adding new type architecture, schema architecture, barrels, generated types, or shared abstraction layers.
