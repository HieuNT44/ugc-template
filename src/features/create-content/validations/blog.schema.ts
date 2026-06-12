import { z } from "zod";

import { tagsSchema, titleSchema } from "./shared.schema";

const MIN_BLOG_CONTENT_CHARS = 100;

export const blogEditSchema = z.object({
  title: titleSchema,
  shortDescription: z
    .string()
    .max(500, "Short description must be 500 characters or less")
    .optional(),
  field: z.string().optional(),
  tags: tagsSchema,
  coverImageUrl: z.string().nullable().optional(),
  editorMode: z.enum(["wysiwyg", "markdown"]),
  content: z
    .string()
    .min(1, "Please write your content")
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
    { message: "Please select a price", path: ["priceYen"] }
  )
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen <= 500),
    { message: "Blog price must be between ¥100 and ¥500", path: ["priceYen"] }
  );

export type BlogEditFormData = z.infer<typeof blogEditSchema>;
export type BlogPublishFormData = z.infer<typeof blogPublishSchema>;
