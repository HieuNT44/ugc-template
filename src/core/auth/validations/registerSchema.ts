import { z } from "zod";

import { fullNameSchema } from "./full-name-field";
import { apiPasswordSchema } from "./password-field";
import { usernameSchema } from "./username-field";

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: usernameSchema,
    full_name: fullNameSchema,
    password: apiPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
