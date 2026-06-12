import { z } from "zod";

import { API_VALIDATION_LIMITS } from "@/core/api/constants/validation-limits";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードは必須です"),
    newPassword: z
      .string()
      .min(1, "新しいパスワードは必須です")
      .min(
        API_VALIDATION_LIMITS.passwordMinLength,
        `Password must be at least ${API_VALIDATION_LIMITS.passwordMinLength} characters`
      )
      .max(
        API_VALIDATION_LIMITS.passwordMaxLength,
        `Password must be at most ${API_VALIDATION_LIMITS.passwordMaxLength} characters`
      ),
    confirmPassword: z.string().min(1, "新しいパスワードを再入力してください"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
