import { z } from "zod";

import { API_VALIDATION_LIMITS } from "@/core/api/constants/validation-limits";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(
        API_VALIDATION_LIMITS.passwordMinLength,
        `Password must be at least ${API_VALIDATION_LIMITS.passwordMinLength} characters`
      )
      .max(
        API_VALIDATION_LIMITS.passwordMaxLength,
        `Password must be at most ${API_VALIDATION_LIMITS.passwordMaxLength} characters`
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
