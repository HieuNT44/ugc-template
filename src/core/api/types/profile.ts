import type { AccomplishmentType, AppLanguage, OnboardingStep } from "./enums";

export interface ProfileBase {
  id: string;
  full_name: string | null;
  username: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReaderCreatorProfile extends ProfileBase {
  cover_url: string | null;
  industry: string | null;
  skills: string[];
  website_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  line_url: string | null;
  youtube_url: string | null;
  onboarding_step: OnboardingStep;
  onboarding_completed_at: string | null;
  is_public: boolean;
}

export interface CreatorProfile extends ReaderCreatorProfile {
  experiences?: ProfileExperience[];
  educations?: ProfileEducation[];
  certifications?: ProfileCertification[];
  accomplishments?: ProfileAccomplishment[];
}

export type ApiProfile = ReaderCreatorProfile | CreatorProfile | ProfileBase;

export interface ProfileUpdatePayload {
  full_name?: string | null;
  username?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  industry?: string | null;
  skills?: string[];
  website_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  x_url?: string | null;
  facebook_url?: string | null;
  line_url?: string | null;
  youtube_url?: string | null;
  is_public?: boolean;
  avatar_upload_file_id?: string | null;
  cover_upload_file_id?: string | null;
}

export interface UserSettings {
  dark_mode: boolean;
  language: AppLanguage;
  timezone: string;
  email_notify: boolean;
  inapp_notify: boolean;
  privacy_hide_email: boolean;
  updated_at: string;
}

export interface UserSettingsUpdatePayload {
  dark_mode?: boolean;
  language?: AppLanguage;
  timezone?: string;
  email_notify?: boolean;
  inapp_notify?: boolean;
  privacy_hide_email?: boolean;
}

export interface ProfileExperience {
  id: number;
  company_name: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  sort_order: number;
}

export interface ProfileExperienceInput {
  id?: number;
  company_name: string;
  title: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean;
  location?: string | null;
  sort_order: number;
}

export interface ProfileEducation {
  id: number;
  school_name: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
}

export interface ProfileEducationInput {
  id?: number;
  school_name: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  sort_order: number;
}

export interface ProfileCertification {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  upload_file_id: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface ProfileCertificationInput {
  id?: number;
  name: string;
  issuing_organization: string;
  issue_date?: string | null;
  expiration_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  upload_file_id?: string | null;
  sort_order: number;
}

export interface ProfileAccomplishment {
  id: number;
  type: AccomplishmentType;
  title: string;
  description: string | null;
  date: string | null;
  url: string | null;
  sort_order: number;
}

export interface ProfileAccomplishmentInput {
  id?: number;
  type: AccomplishmentType;
  title: string;
  description?: string | null;
  date?: string | null;
  url?: string | null;
  sort_order: number;
}

export interface SyncExperiencesPayload {
  experiences: ProfileExperienceInput[];
}

export interface SyncEducationsPayload {
  educations: ProfileEducationInput[];
}

export interface SyncCertificationsPayload {
  certifications: ProfileCertificationInput[];
}

export interface SyncAccomplishmentsPayload {
  accomplishments: ProfileAccomplishmentInput[];
}
