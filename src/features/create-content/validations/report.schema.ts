import { z } from "zod";

import { fieldSchema, descriptionSchema, titleSchema } from "./shared.schema";

export const reportEditSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  field: fieldSchema,
  coverImageUrl: z.string().nullable().optional(),
  pdfUrl: z.string().min(1, "PDFファイルをアップロードしてください"),
  pdfFileName: z.string().min(1).optional(),
  previewPages: z
    .number()
    .int()
    .min(5, "プレビューページは5〜10ページで指定してください")
    .max(10, "プレビューページは5〜10ページで指定してください"),
});

export const reportPublishSchema = z
  .object({
    pricingType: z.enum(["free", "paid"]),
    priceYen: z.number().int().positive().nullable().optional(),
  })
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen >= 1000),
    { message: "価格を選択してください", path: ["priceYen"] }
  )
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen <= 5000),
    {
      message: "レポート価格は¥1,000〜¥5,000で設定してください",
      path: ["priceYen"],
    }
  );

export type ReportEditFormData = z.infer<typeof reportEditSchema>;
export type ReportPublishFormData = z.infer<typeof reportPublishSchema>;
