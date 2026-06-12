import { z } from "zod";

const websiteSchema = z
  .string()
  .transform((s) => (s ?? "").trim())
  .pipe(
    z
      .string()
      .max(500)
      .refine(
        (v) => !v || /^https?:\/\/[^\s]+$/.test(v),
        "Enter a valid URL (e.g. https://example.com)"
      )
      .optional()
      .or(z.literal(""))
  );

function parseTopics(value: string): string[] {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export const becomeCreatorApplicationSchema = z
  .object({
    name: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(2, "Name is required").max(100, "Name is too long")),
    bio: z
      .string()
      .transform((s) => s.trim())
      .pipe(
        z
          .string()
          .min(20, "Bio must be at least 20 characters")
          .max(500, "Bio is too long")
      ),
    country: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().max(100).optional().or(z.literal(""))),
    website: websiteSchema,
    topics: z
      .string()
      .transform((s) => s.trim())
      .pipe(
        z
          .string()
          .min(2, "Add at least one topic (comma-separated)")
          .refine(
            (v) => parseTopics(v).length >= 1,
            "Add at least one topic (comma-separated)"
          )
          .refine((v) => parseTopics(v).length <= 8, "Maximum 8 topics allowed")
      ),
    publishPosts: z.boolean(),
    publishBooks: z.boolean(),
    publishPaid: z.boolean(),
    motivation: z
      .string()
      .transform((s) => s.trim())
      .pipe(
        z
          .string()
          .max(1000, "Motivation is too long")
          .optional()
          .or(z.literal(""))
      ),
    portfolioUrl: websiteSchema,
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the Creator Terms to continue",
    }),
  })
  .refine((data) => data.publishPosts || data.publishBooks, {
    message: "Select at least one content type (Posts or Books)",
    path: ["publishPosts"],
  });

export type BecomeCreatorFormData = z.infer<
  typeof becomeCreatorApplicationSchema
>;

export const becomeCreatorProfileFields = [
  "name",
  "bio",
  "country",
  "website",
  "topics",
] as const satisfies readonly (keyof BecomeCreatorFormData)[];

export const becomeCreatorIntentFields = [
  "publishPosts",
  "publishBooks",
  "publishPaid",
  "motivation",
  "portfolioUrl",
] as const satisfies readonly (keyof BecomeCreatorFormData)[];

export const becomeCreatorReviewFields = [
  "acceptTerms",
] as const satisfies readonly (keyof BecomeCreatorFormData)[];

export function parseTopicsFromInput(value: string): string[] {
  return parseTopics(value);
}
