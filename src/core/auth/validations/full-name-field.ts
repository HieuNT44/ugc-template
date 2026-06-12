import { z } from "zod";

export const fullNameSchema = z
  .string()
  .min(1, "氏名は必須です")
  .max(100, "氏名は100文字以内で入力してください");
