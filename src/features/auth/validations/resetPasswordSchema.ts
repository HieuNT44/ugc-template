import { z } from "zod";

import { authConfig } from "../config/auth.config";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        authConfig.passwordMinLength,
        `Password must be at least ${authConfig.passwordMinLength} characters`
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
