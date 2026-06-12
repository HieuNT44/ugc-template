import type { AppLanguage } from "../types/enums";

const MESSAGES = {
  en: {
    not_image: "JPEG、PNG、GIF、WebP形式の画像を選択してください。",
    empty: "選択したファイルが空です。",
    too_large: "画像は10MB以下にしてください。",
    unauthorized: "画像をアップロードするにはログインしてください。",
    s3_failed:
      "ストレージへのアップロードに失敗しました。localhost:3000向けのS3 CORSとETag公開設定を確認してください。",
    upload_expired:
      "アップロードセッションの期限が切れました。画像を選択し直してください。",
    storage_access_denied:
      "アップロードストレージへのアクセスが拒否されました。S3 IAM権限とバケット設定を確認してください。",
    avatar_updated: "プロフィール写真を更新しました。",
    cover_updated: "カバー画像を更新しました。",
    profile_saved: "プロフィールを保存しました。",
    generic: "問題が発生しました。もう一度お試しください。",
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
