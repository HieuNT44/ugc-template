import { z } from "zod";

import type { AppLanguage } from "@/core/api/types/enums";

const VALIDATION_MESSAGES = {
  en: {
    required: (field: string) => `${field} is required`,
    max: (field: string, max: number) =>
      `${field} must be ${max} characters or less`,
    maxItems: (max: number) => `You can add up to ${max} entries`,
    url: "Enter a valid URL starting with http:// or https://",
    uploadFileId: "Invalid upload file id",
    fields: {
      company: "Company",
      jobTitle: "Job title",
      description: "Description",
      startDate: "Start date",
      location: "Location",
      school: "School",
      degree: "Degree",
      fieldOfStudy: "Field of study",
      certificationName: "Certification name",
      organization: "Issuing organization",
      credentialId: "Credential ID",
      credentialUrl: "Credential URL",
      title: "Title",
      url: "URL",
    },
  },
  ja: {
    required: (field: string) => `${field}は必須です`,
    max: (field: string, max: number) =>
      `${field}は${max}文字以内で入力してください`,
    maxItems: (max: number) => `${max}件まで追加できます`,
    url: "http:// または https:// で始まる有効なURLを入力してください",
    uploadFileId: "アップロードファイルIDが無効です",
    fields: {
      company: "会社名",
      jobTitle: "役職",
      description: "説明",
      startDate: "開始日",
      location: "勤務地",
      school: "学校名",
      degree: "学位",
      fieldOfStudy: "専攻",
      certificationName: "資格名",
      organization: "発行機関",
      credentialId: "資格 ID",
      credentialUrl: "資格 URL",
      title: "タイトル",
      url: "URL",
    },
  },
} as const;

function messages(language: AppLanguage) {
  return VALIDATION_MESSAGES[language];
}

const requiredString = (field: string, max: number, language: AppLanguage) => {
  const message = messages(language);

  return z
    .string()
    .trim()
    .min(1, message.required(field))
    .max(max, message.max(field, max));
};

const optionalNullableString = (
  field: string,
  max: number,
  language: AppLanguage
) => {
  const message = messages(language);

  return z
    .string()
    .max(max, message.max(field, max))
    .nullable()
    .optional()
    .or(z.literal(""));
};

const optionalUrl = (field: string, language: AppLanguage) => {
  const message = messages(language);

  return z
    .string()
    .max(255, message.max(field, 255))
    .optional()
    .refine(
      (value) => !value?.trim() || /^https?:\/\/.+/i.test(value.trim()),
      message.url
    );
};

const optionalUploadFileId = (language: AppLanguage) =>
  z
    .string()
    .optional()
    .refine(
      (value) =>
        !value?.trim() ||
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          value.trim()
        ),
      messages(language).uploadFileId
    );

export function createExperienceItemSchema(language: AppLanguage = "en") {
  const fields = messages(language).fields;

  return z.object({
    id: z.number().optional(),
    company_name: requiredString(fields.company, 255, language),
    title: requiredString(fields.jobTitle, 255, language),
    description: optionalNullableString(fields.description, 5000, language),
    start_date: z
      .string()
      .min(1, messages(language).required(fields.startDate)),
    end_date: z.string().nullable().optional().or(z.literal("")),
    is_current: z.boolean(),
    location: optionalNullableString(fields.location, 255, language),
    sort_order: z.number().min(0),
  });
}

export function createExperiencesFormSchema(language: AppLanguage = "en") {
  return z.object({
    experiences: z
      .array(createExperienceItemSchema(language))
      .max(50, messages(language).maxItems(50)),
  });
}

export function createEducationItemSchema(language: AppLanguage = "en") {
  const fields = messages(language).fields;

  return z.object({
    id: z.number().optional(),
    school_name: requiredString(fields.school, 255, language),
    degree: optionalNullableString(fields.degree, 100, language),
    field_of_study: optionalNullableString(fields.fieldOfStudy, 255, language),
    start_date: z.string().nullable().optional().or(z.literal("")),
    end_date: z.string().nullable().optional().or(z.literal("")),
    description: optionalNullableString(fields.description, 5000, language),
    sort_order: z.number().min(0),
  });
}

export function createEducationsFormSchema(language: AppLanguage = "en") {
  return z.object({
    educations: z
      .array(createEducationItemSchema(language))
      .max(50, messages(language).maxItems(50)),
  });
}

export function createCertificationItemSchema(language: AppLanguage = "en") {
  const fields = messages(language).fields;

  return z.object({
    id: z.number().optional(),
    name: requiredString(fields.certificationName, 255, language),
    issuing_organization: requiredString(fields.organization, 255, language),
    issue_date: z.string().nullable().optional().or(z.literal("")),
    expiration_date: z.string().nullable().optional().or(z.literal("")),
    credential_id: optionalNullableString(fields.credentialId, 100, language),
    credential_url: optionalUrl(fields.credentialUrl, language),
    upload_file_id: optionalUploadFileId(language),
    image_url: z.string().nullable().optional(),
    sort_order: z.number().min(0),
  });
}

export function createCertificationsFormSchema(language: AppLanguage = "en") {
  return z.object({
    certifications: z
      .array(createCertificationItemSchema(language))
      .max(50, messages(language).maxItems(50)),
  });
}

export function createAccomplishmentItemSchema(language: AppLanguage = "en") {
  const fields = messages(language).fields;

  return z.object({
    id: z.number().optional(),
    type: z.enum(["project", "publication", "patent", "award", "course"]),
    title: requiredString(fields.title, 255, language),
    description: optionalNullableString(fields.description, 5000, language),
    date: z.string().nullable().optional().or(z.literal("")),
    url: optionalUrl(fields.url, language),
    sort_order: z.number().min(0),
  });
}

export function createAccomplishmentsFormSchema(language: AppLanguage = "en") {
  return z.object({
    accomplishments: z
      .array(createAccomplishmentItemSchema(language))
      .max(50, messages(language).maxItems(50)),
  });
}

export const experienceItemSchema = createExperienceItemSchema();
export const experiencesFormSchema = createExperiencesFormSchema();
export const educationItemSchema = createEducationItemSchema();
export const educationsFormSchema = createEducationsFormSchema();
export const certificationItemSchema = createCertificationItemSchema();
export const certificationsFormSchema = createCertificationsFormSchema();
export const accomplishmentItemSchema = createAccomplishmentItemSchema();
export const accomplishmentsFormSchema = createAccomplishmentsFormSchema();

export type ExperiencesFormData = z.infer<typeof experiencesFormSchema>;
export type EducationsFormData = z.infer<typeof educationsFormSchema>;
export type CertificationsFormData = z.infer<typeof certificationsFormSchema>;
export type AccomplishmentsFormData = z.infer<typeof accomplishmentsFormSchema>;
