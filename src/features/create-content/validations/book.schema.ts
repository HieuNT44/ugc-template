import { z } from "zod";

import { fieldSchema, descriptionSchema, titleSchema } from "./shared.schema";

const chapterSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "Chapter title is required").max(200)),
  content: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "Chapter content is required")),
});

export const bookEditSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    field: fieldSchema,
    coverImageUrl: z.string().nullable().optional(),
    chapters: z.array(chapterSchema).min(2, "Please add at least 2 chapters"),
    previewChapterIndex: z.number().int().min(0).nullable().optional(),
    sellByChapter: z.boolean().default(false),
  })
  .refine(
    (data) =>
      data.previewChapterIndex == null ||
      data.previewChapterIndex < data.chapters.length,
    { message: "Invalid preview chapter", path: ["previewChapterIndex"] }
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
    { message: "Please select a price", path: ["priceYen"] }
  )
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen <= 3000),
    {
      message: "Book price must be between ¥500 and ¥3,000",
      path: ["priceYen"],
    }
  );

export type BookEditFormData = z.infer<typeof bookEditSchema>;
export type BookPublishFormData = z.infer<typeof bookPublishSchema>;
