export const CONTENT_FIELD_OPTIONS = [
  "テクノロジー",
  "ビジネス",
  "サイエンス",
  "ヘルス",
  "学歴",
  "カルチャー",
  "ファイナンス",
  "デザイン",
  "マーケティング",
  "ライフスタイル",
] as const;

export type ContentField = (typeof CONTENT_FIELD_OPTIONS)[number];
