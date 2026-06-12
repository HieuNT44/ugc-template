import { z } from "zod";

import { apiPasswordSchema } from "./password-field";

export const resetPasswordSchema = z
  .object({
    password: apiPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
