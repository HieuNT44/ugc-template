import { z } from "zod";

import { fieldSchema, descriptionSchema, titleSchema } from "./shared.schema";

const chapterSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "章タイトルは必須です").max(200)),
  content: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "章の本文は必須です")),
});

export const bookEditSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    field: fieldSchema,
    coverImageUrl: z.string().nullable().optional(),
    chapters: z.array(chapterSchema).min(2, "章を2つ以上追加してください"),
    previewChapterIndex: z.number().int().min(0).nullable().optional(),
    sellByChapter: z.boolean().default(false),
  })
  .refine(
    (data) =>
      data.previewChapterIndex == null ||
      data.previewChapterIndex < data.chapters.length,
    { message: "プレビュー章が無効です", path: ["previewChapterIndex"] }
  );

export const bookPublishSchema = z
  .object({
    pricingType: z.enum(["free", "paid"]),
    priceYen: z.number().int().positive().nullable().optional(),
  })
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen >= 500),
    { message: "価格を選択してください", path: ["priceYen"] }
  )
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen <= 3000),
    {
      message: "ブック価格は¥500〜¥3,000で設定してください",
      path: ["priceYen"],
    }
  );

export type BookEditFormData = z.infer<typeof bookEditSchema>;
export type BookPublishFormData = z.infer<typeof bookPublishSchema>;
