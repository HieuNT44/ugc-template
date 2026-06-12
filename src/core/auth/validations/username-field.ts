import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(1, "ユーザー名は必須です")
  .max(50, "ユーザー名は50文字以内で入力してください")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "ユーザー名には英数字、ハイフン、アンダースコアのみ使用できます"
  );
