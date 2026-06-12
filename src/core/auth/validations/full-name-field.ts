import { z } from "zod";

export const fullNameSchema = z
  .string()
  .min(1, "Full name is required")
  .max(100, "Full name must be at most 100 characters");
