import { ConflictException } from "@workos-inc/node";

import { resolveCurrentAccountContext } from "@/lib/account-context";
import { getVaultKeyStatuses, upsertVaultKeys } from "@/lib/vault-account";
import { vaultSecretsSaveRequestSchema } from "@/schemas/vault-keys";

export const runtime = "nodejs";

export async function GET() {
  const result = await resolveCurrentAccountContext();

  if (result.status === "unauthenticated") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (result.status === "account_required") {
    return Response.json({ error: "Account required" }, { status: 428 });
  }

  try {
    const keys = await getVaultKeyStatuses(result.account.accountId);
    return Response.json({ keys });
  } catch {
    return Response.json(
      { error: "Unable to load vault secret status" },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const result = await resolveCurrentAccountContext();

  if (result.status === "unauthenticated") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (result.status === "account_required") {
    return Response.json({ error: "Account required" }, { status: 428 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = vaultSecretsSaveRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    if (!parsed.data.keys || Object.keys(parsed.data.keys).length === 0) {
      const keys = await getVaultKeyStatuses(result.account.accountId);
      return Response.json({ keys, saved: [] });
    }

    const { saved } = await upsertVaultKeys({
      context: result.account,
      keys: parsed.data.keys,
    });
    const keys = await getVaultKeyStatuses(result.account.accountId);
    return Response.json({ keys, saved });
  } catch (error) {
    if (error instanceof ConflictException) {
      return Response.json({ error: "conflict" }, { status: 409 });
    }

    return Response.json(
      { error: "Unable to save vault secrets" },
      { status: 502 },
    );
  }
}
