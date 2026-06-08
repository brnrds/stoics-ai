import "server-only";

import { sql } from "drizzle-orm";

import { getDb } from "@/db";

type Db = ReturnType<typeof getDb>;
type DbTransaction = Parameters<Parameters<Db["transaction"]>[0]>[0];

export async function withAccountDb<T>(
  accountId: string,
  run: (db: DbTransaction) => Promise<T>,
): Promise<T> {
  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.account_id', ${accountId}, true)`,
    );
    return run(tx);
  });
}
