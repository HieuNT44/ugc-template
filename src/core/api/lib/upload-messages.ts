import type { AppLanguage } from "../types/enums";

const MESSAGES = {
  en: {
    not_image: "Please select an image file (JPEG, PNG, GIF, or WebP).",
    empty: "The selected file is empty.",
    too_large: "Image must be 10 MB or smaller.",
    unauthorized: "Please sign in to upload images.",
    s3_failed:
      "Failed to upload to storage. Check S3 CORS and ETag exposure for localhost:3000.",
    upload_expired: "Upload session expired. Please select the image again.",
    storage_access_denied:
      "Upload storage access denied. Check S3 IAM permissions and bucket configuration.",
    avatar_updated: "Profile photo updated successfully.",
    cover_updated: "Cover image updated successfully.",
    profile_saved: "Profile saved successfully.",
    generic: "Something went wrong. Please try again.",
  },
  ja: {
    not_image: "JPEG、PNG、GIF、WebP 形式の画像を選択してください。",
    empty: "選択したファイルが空です。",
    too_large: "画像は 10MB 以下にしてください。",
    unauthorized: "画像をアップロードするにはログインしてください。",
    s3_failed:
      "ストレージへのアップロードに失敗しました。S3 の CORS と ETag の公開設定を確認してください。",
    upload_expired:
      "アップロードの有効期限が切れました。もう一度画像を選択してください。",
    storage_access_denied:
      "アップロードストレージへのアクセスが拒否されました。S3 IAM 権限とバケット設定を確認してください。",
    avatar_updated: "プロフィール写真を更新しました。",
    cover_updated: "カバー画像を更新しました。",
    profile_saved: "プロフィールを保存しました。",
    generic: "エラーが発生しました。もう一度お試しください。",
  },
} as const;

type MessageKey = keyof (typeof MESSAGES)["en"];

export function getUploadMessage(
  key: MessageKey,
  language: AppLanguage = "en"
): string {
  return MESSAGES[language][key] ?? MESSAGES.en[key];
}
