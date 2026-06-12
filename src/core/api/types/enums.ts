/** Roles exposed to the user-facing app (admin/staff use a separate admin SPA). */
export type ApiUserRole = "reader" | "creator";

export type ApiUserStatus = "active" | "banned";

export type ExpertStatus = "none" | "pending" | "approved" | "rejected";

export type OnboardingStep = "account_created" | "profile_basic" | "completed";

export type ClientType = "web" | "mobile";

export type AccomplishmentType =
  | "project"
  | "publication"
  | "patent"
  | "award"
  | "course";

export type UploadType =
  | "profile_avatar"
  | "profile_cover"
  | "profile_certification"
  | "content_cover"
  | "general";

export type AppLanguage = "ja" | "en";
