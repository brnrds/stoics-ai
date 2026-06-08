import { z } from "zod";

const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_UNPOOLED: optionalNonEmptyString,
  WORKOS_API_KEY: z.string().startsWith("sk_"),
  WORKOS_CLIENT_ID: z.string().startsWith("client_"),
  WORKOS_COOKIE_PASSWORD: z.string().min(32),
  NEXT_PUBLIC_WORKOS_REDIRECT_URI: z.string().url(),
});
