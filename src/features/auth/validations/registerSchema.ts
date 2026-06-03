import { z } from "zod";

import { authConfig } from "../config/auth.config";

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(
        authConfig.passwordMinLength,
        `Password must be at least ${authConfig.passwordMinLength} characters`
      ),
    confirmPassword: z.string(),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
