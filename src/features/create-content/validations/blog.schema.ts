import { z } from "zod";

import { tagsSchema, titleSchema } from "./shared.schema";

const MIN_BLOG_CONTENT_CHARS = 100;

export const blogEditSchema = z.object({
  title: titleSchema,
  shortDescription: z
    .string()
    .max(500, "短い説明は500文字以内で入力してください")
    .optional(),
  field: z.string().optional(),
  tags: tagsSchema,
  coverImageUrl: z.string().nullable().optional(),
  editorMode: z.enum(["wysiwyg", "markdown"]),
  content: z
    .string()
    .min(1, "本文を入力してください")
    .refine(
      (value) => value.trim().length >= MIN_BLOG_CONTENT_CHARS,
      `Content must be at least ${MIN_BLOG_CONTENT_CHARS} characters`
    ),
  templateId: z.string().nullable().optional(),
});

export const blogPublishSchema = z
  .object({
    pricingType: z.enum(["free", "paid"]),
    priceYen: z.number().int().positive().nullable().optional(),
  })
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen >= 100),
    { message: "価格を選択してください", path: ["priceYen"] }
  )
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen <= 500),
    { message: "ブログ価格は¥100〜¥500で設定してください", path: ["priceYen"] }
  );

export type BlogEditFormData = z.infer<typeof blogEditSchema>;
export type BlogPublishFormData = z.infer<typeof blogPublishSchema>;
