import { z } from "zod";

export const vaultKeyNameSchema = z.enum([
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
]);

export const vaultSecretsSaveRequestSchema = z
  .object({
    keys: z
      .object({
        OPENAI_API_KEY: z.string().max(4096).optional(),
        ANTHROPIC_API_KEY: z.string().max(4096).optional(),
      })
      .partial()
      .optional(),
  })
  .strict();
