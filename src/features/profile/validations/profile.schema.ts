import { z } from "zod";

import { API_VALIDATION_LIMITS } from "@/core/api/constants/validation-limits";

function optionalString(max: number) {
  return z
    .string()
    .transform((s) => (s ?? "").trim())
    .pipe(z.string().max(max).optional().or(z.literal("")));
}

const websiteSchema = z
  .string()
  .transform((s) => (s ?? "").trim())
  .pipe(
    z
      .string()
      .max(API_VALIDATION_LIMITS.urlMaxLength)
      .refine(
        (v) => !v || /^https?:\/\/[^\s]+$/.test(v),
        "Enter a valid URL (e.g. https://example.com)"
      )
      .optional()
      .or(z.literal(""))
  );

export const internalProfileSchema = z.object({
  name: z
    .string()
    .transform((s) => (s ?? "").trim())
    .pipe(
      z
        .string()
        .min(1, "Name is required")
        .max(API_VALIDATION_LIMITS.fullNameMaxLength, "Name is too long")
    ),
  location: optionalString(100),
  website: websiteSchema,
});

export function parseSkillsInput(value: string): string[] {
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const skillsArraySchema = z
  .array(
    z
      .string()
      .max(API_VALIDATION_LIMITS.skillItemMaxLength, "Skill is too long")
  )
  .max(
    API_VALIDATION_LIMITS.skillsMaxCount,
    `You can add up to ${API_VALIDATION_LIMITS.skillsMaxCount} skills`
  )
  .superRefine((items, ctx) => {
    const nonEmpty = items.map((item) => item.trim()).filter(Boolean);
    if (nonEmpty.length > API_VALIDATION_LIMITS.skillsMaxCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `You can add up to ${API_VALIDATION_LIMITS.skillsMaxCount} skills`,
      });
    }
  });

export const settingsProfileSchema = z.object({
  name: z
    .string()
    .transform((s) => (s ?? "").trim())
    .pipe(
      z
        .string()
        .max(API_VALIDATION_LIMITS.fullNameMaxLength, "Name is too long")
    ),
  location: optionalString(100),
  website: websiteSchema,
  username: z
    .string()
    .transform((s) => (s ?? "").trim())
    .pipe(
      z
        .string()
        .max(API_VALIDATION_LIMITS.usernameMaxLength, "Username is too long")
        .regex(
          /^[a-zA-Z0-9_-]*$/,
          "Username may only contain letters, numbers, dashes and underscores"
        )
        .optional()
        .or(z.literal(""))
    ),
  headline: optionalString(API_VALIDATION_LIMITS.headlineMaxLength),
  bio: optionalString(API_VALIDATION_LIMITS.settingsProfileBioMaxLength),
  industry: optionalString(API_VALIDATION_LIMITS.industryMaxLength),
  skills: skillsArraySchema,
  linkedinUrl: websiteSchema,
  githubUrl: websiteSchema,
  xUrl: websiteSchema,
  facebookUrl: websiteSchema,
  lineUrl: websiteSchema,
  youtubeUrl: websiteSchema,
});

export const communityProfileSchema = internalProfileSchema.extend({
  username: z
    .string()
    .transform((s) => (s ?? "").trim())
    .pipe(
      z
        .string()
        .max(API_VALIDATION_LIMITS.usernameMaxLength, "Username is too long")
        .regex(
          /^[a-zA-Z0-9_-]*$/,
          "Username may only contain letters, numbers, dashes and underscores"
        )
        .optional()
        .or(z.literal(""))
    ),
  headline: optionalString(API_VALIDATION_LIMITS.headlineMaxLength),
  bio: optionalString(API_VALIDATION_LIMITS.bioMaxLength),
  githubUrl: websiteSchema,
  facebookUrl: websiteSchema,
  lineUrl: websiteSchema,
});

export type InternalProfileFormData = z.infer<typeof internalProfileSchema>;
export type CommunityProfileFormData = z.infer<typeof communityProfileSchema>;
export type SettingsProfileFormData = z.infer<typeof settingsProfileSchema>;
