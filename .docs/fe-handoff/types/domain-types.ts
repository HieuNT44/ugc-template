/**
 * RealRead API — Domain types for Auth + Profile (Phase 1)
 * Source of truth: OpenAPI schemas + API Resources in BE repo
 * Copy this file into the FE project (e.g. src/types/api/)
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type UserRole = 'admin' | 'creator' | 'reader' | 'staff';

export type UserStatus = 'active' | 'banned';

export type ExpertStatus = 'none' | 'pending' | 'approved' | 'rejected';

export type OnboardingStep = 'account_created' | 'profile_basic' | 'completed';

export type ClientType = 'web' | 'mobile';

export type AccomplishmentType =
  | 'project'
  | 'publication'
  | 'patent'
  | 'award'
  | 'course';

export type UploadType =
  | 'profile_avatar'
  | 'profile_cover'
  | 'profile_certification'
  | 'content_cover'
  | 'general';

export type AppLanguage = 'ja' | 'en';

// ---------------------------------------------------------------------------
// API envelope
// ---------------------------------------------------------------------------

export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationErrorDetail[];
}

export interface ApiErrorResponse {
  error: ApiError;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  expert_status: ExpertStatus;
  email_verified_at: string | null;
}

export interface AuthToken {
  access_token: string;
  expires_at: string | null;
  client_type: ClientType;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  client_type?: ClientType;
  device_name?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirmation: string;
  client_type?: ClientType;
  device_name?: string;
}

export interface GoogleLoginPayload {
  id_token: string;
  role?: Extract<UserRole, 'reader' | 'creator'>;
  client_type?: ClientType;
  device_name?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

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

export type Profile = ReaderCreatorProfile | CreatorProfile | ProfileBase;

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

// ---------------------------------------------------------------------------
// Profile sub-resources (Creator only — id is integer)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Upload (certification / future avatar)
// ---------------------------------------------------------------------------

export interface InitiateUploadPayload {
  upload_type: UploadType;
  name: string;
  mime_type: string;
  size: number;
}

export interface UploadUrlPart {
  part_number: number;
  url: string;
}

export interface UploadFileInitiated {
  upload_file_id: string;
  upload_id: string;
  upload_urls: UploadUrlPart[];
  hash: string;
  name: string;
  expires_at: string;
}

export interface CompleteUploadPart {
  part_number: number;
  etag: string;
}

export interface CompleteUploadPayload {
  upload_id: string;
  parts: CompleteUploadPart[];
}

export interface UploadFileCompleted {
  upload_file_id: string;
  status: string;
  url: string | null;
  cdn_path: string;
  name: string;
}
