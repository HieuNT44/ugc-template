import { z } from "zod";

import { fullNameSchema } from "./full-name-field";
import { apiPasswordSchema } from "./password-field";
import { usernameSchema } from "./username-field";

export const registerSchema = z
  .object({
    email: z.string().email("有効なメールアドレスを入力してください"),
    username: usernameSchema,
    full_name: fullNameSchema,
    password: apiPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
