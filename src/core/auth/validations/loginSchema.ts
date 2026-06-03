import { z } from "zod";

import { authConfig } from "../config/auth.config";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      authConfig.passwordMinLength,
      `Password must be at least ${authConfig.passwordMinLength} characters`
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
