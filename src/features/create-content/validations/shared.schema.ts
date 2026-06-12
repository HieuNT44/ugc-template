import { z } from "zod";

import { CONTENT_FIELD_OPTIONS } from "../lib/field-options";

export const titleSchema = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "タイトルを入力してください")
      .min(10, "タイトルは10文字以上で入力してください")
      .max(150, "タイトルは150文字以内で入力してください")
  );

export const fieldSchema = z
  .string()
  .min(1, "分野を選択してください")
  .refine(
    (v) =>
      CONTENT_FIELD_OPTIONS.includes(
        v as (typeof CONTENT_FIELD_OPTIONS)[number]
      ),
    "分野を選択してください"
  );

export const tagsSchema = z
  .array(z.string().trim().min(1).max(30))
  .min(1, "タグを1つ以上追加してください")
  .max(5, "タグは最大5個までです")
  .default([]);

export const descriptionSchema = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "説明を入力してください")
      .min(20, "説明は20文字以上で入力してください")
      .max(2000, "説明が長すぎます")
  );
