import "server-only";

import type { z } from "zod";

import { envSchema } from "@/schemas/env";

type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  cachedEnv ??= envSchema.parse(process.env);
  return cachedEnv;
}
