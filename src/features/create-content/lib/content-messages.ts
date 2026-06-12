import type { AppLanguage } from "@/core/api/types/enums";

import type { SaveDraftResult } from "./content-api";
import type { ContentDocument } from "../types/content-document";

const CONTENT_MESSAGES = {
  draft_saved: {
    en: "Draft saved successfully",
    ja: "下書きを保存しました",
  },
  draft_save_failed: {
    en: "Failed to save draft",
    ja: "下書きの保存に失敗しました",
  },
  validation_failed: {
    en: "Validation failed",
    ja: "入力内容を確認してください",
  },
  published_success: {
    en: "Published successfully",
    ja: "公開しました",
  },
  updated_success: {
    en: "Updated successfully",
    ja: "更新しました",
  },
} as const;

export type ContentMessageKey = keyof typeof CONTENT_MESSAGES;

export function getContentMessage(
  key: ContentMessageKey,
  language: AppLanguage = "en"
): string {
  return CONTENT_MESSAGES[key][language] ?? CONTENT_MESSAGES[key].en;
}

export function getSaveDraftErrorMessage(
  result: Exclude<SaveDraftResult, { success: true; draft: ContentDocument }>,
  language: AppLanguage = "en"
): string {
  if ("error" in result) {
    return result.error;
  }

  if ("errors" in result) {
    return (
      Object.values(result.errors)[0]?.[0] ??
      getContentMessage("validation_failed", language)
    );
  }

  return getContentMessage("draft_save_failed", language);
}
