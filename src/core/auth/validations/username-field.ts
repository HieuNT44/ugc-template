import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .max(50, "Username must be at most 50 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, dashes and underscores"
  );
