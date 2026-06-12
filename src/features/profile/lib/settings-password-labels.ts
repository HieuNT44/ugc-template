import type { AppLanguage } from "@/core/api/types/enums";

const LABELS = {
  en: {
    title: "パスワードを変更",
    description: "パスワードを更新します。現在のパスワードが必要です。",
    currentPassword: "現在のパスワード",
    newPassword: "新しいパスワード",
    confirmPassword: "新しいパスワード確認",
    submit: "パスワードを更新",
    submitting: "更新中...",
    success: "パスワードを変更しました",
    unauthorized: "パスワードを変更するにはログインしてください。",
    genericError: "問題が発生しました。もう一度お試しください。",
  },
  ja: {
    title: "パスワード変更",
    description: "パスワードを更新します。現在のパスワードが必要です。",
    currentPassword: "現在のパスワード",
    newPassword: "新しいパスワード",
    confirmPassword: "新しいパスワード（確認）",
    submit: "パスワードを更新",
    submitting: "更新中...",
    success: "パスワードを変更しました",
    unauthorized: "パスワードを変更するにはログインしてください。",
    genericError: "問題が発生しました。もう一度お試しください。",
  },
} as const;

export function getSettingsPasswordLabel(
  key: keyof (typeof LABELS)["en"],
  language: AppLanguage = "en"
): string {
  return LABELS[language][key];
}
