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
        "有効なURLを入力してください（例: https://example.com）"
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
      .pipe(z.string().min(2, "氏名は必須です").max(100, "氏名が長すぎます")),
    bio: z
      .string()
      .transform((s) => s.trim())
      .pipe(
        z
          .string()
          .min(20, "自己紹介は20文字以上で入力してください")
          .max(500, "自己紹介が長すぎます")
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
          .min(2, "トピックを1つ以上追加してください（カンマ区切り）")
          .refine(
            (v) => parseTopics(v).length >= 1,
            "トピックを1つ以上追加してください（カンマ区切り）"
          )
          .refine(
            (v) => parseTopics(v).length <= 8,
            "トピックは最大8個までです"
          )
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
          .max(1000, "応募理由が長すぎます")
          .optional()
          .or(z.literal(""))
      ),
    portfolioUrl: websiteSchema,
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "続行するにはクリエイター規約への同意が必要です",
    }),
  })
  .refine((data) => data.publishPosts || data.publishBooks, {
    message: "コンテンツ種別を1つ以上選択してください（投稿またはブック）",
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
