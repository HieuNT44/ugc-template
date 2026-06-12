import type { AppLanguage } from "@/core/api/types/enums";

export type AppUserSettings = {
  darkMode: boolean;
  language: AppLanguage;
  timezone: string;
  emailNotify: boolean;
  inappNotify: boolean;
  privacyHideEmail: boolean;
  updatedAt: string;
};
