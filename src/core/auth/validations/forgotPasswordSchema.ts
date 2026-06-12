import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
