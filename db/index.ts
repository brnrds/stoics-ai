import "server-only";

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { getServerEnv } from "@/lib/env";
import * as schema from "./schema";

let database: ReturnType<typeof createDatabase> | undefined;

function createDatabase() {
  const pool = new Pool({ connectionString: getServerEnv().DATABASE_URL });
  return drizzle(pool, { schema });
}

export function getDb() {
  database ??= createDatabase();
  return database;
}

export { schema };
