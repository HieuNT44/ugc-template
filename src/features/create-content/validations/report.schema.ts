import { z } from "zod";

import { fieldSchema, descriptionSchema, titleSchema } from "./shared.schema";

export const reportEditSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  field: fieldSchema,
  coverImageUrl: z.string().nullable().optional(),
  pdfUrl: z.string().min(1, "Please upload a PDF file"),
  pdfFileName: z.string().min(1).optional(),
  previewPages: z
    .number()
    .int()
    .min(5, "Preview pages must be between 5 and 10")
    .max(10, "Preview pages must be between 5 and 10"),
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
    { message: "Please select a price", path: ["priceYen"] }
  )
  .refine(
    (data) =>
      data.pricingType === "free" ||
      (data.priceYen != null && data.priceYen <= 5000),
    {
      message: "Report price must be between ¥1,000 and ¥5,000",
      path: ["priceYen"],
    }
  );

export type ReportEditFormData = z.infer<typeof reportEditSchema>;
export type ReportPublishFormData = z.infer<typeof reportPublishSchema>;
