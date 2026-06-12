import type { AppLanguage } from "@/core/api/types/enums";

const LABELS = {
  en: {
    profile: "Profile",
    experiences: "Work experience",
    educations: "Education",
    certifications: "Certifications",
    accomplishments: "Accomplishments",
    password: "Change password",
    system: "Settings",
    settingsNav: "Settings navigation",
    viewPublicProfile: "View public profile",
    backToProfile: "Back to profile",
  },
  ja: {
    profile: "プロフィール",
    experiences: "職歴",
    educations: "学歴",
    certifications: "資格・認定",
    accomplishments: "実績",
    password: "パスワード変更",
    system: "設定",
    settingsNav: "設定ナビゲーション",
    viewPublicProfile: "公開プロフィールを見る",
    backToProfile: "プロフィールに戻る",
  },
} as const;

export type SettingsNavLabelKey = keyof (typeof LABELS)["en"];

export function getSettingsNavLabel(
  key: SettingsNavLabelKey,
  language: AppLanguage = "en"
): string {
  return LABELS[language][key];
}
