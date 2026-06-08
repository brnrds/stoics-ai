import { z } from "zod";

export const entityStatusSchema = z.enum(["active", "inactive", "pending"]);
