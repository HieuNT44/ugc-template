import type { PublishContentResult } from "../actions/publish-content";
import type { UpdatePublishedContentResult } from "../actions/update-published-content";
import type { SaveDraftResult } from "./content-api";

export function isSaveDraftSuccess(result: SaveDraftResult): result is {
  success: true;
  draft: import("../types/content-document").ContentDocument;
} {
  return "success" in result && result.success === true;
}

export function isPublishSuccess(result: PublishContentResult): result is {
  success: true;
  status: "published" | "pending_review";
  humanScore: number;
  contentId: string;
} {
  return "success" in result && result.success === true;
}

export function isUpdatePublishedSuccess(
  result: UpdatePublishedContentResult
): result is {
  success: true;
  contentId: string;
} {
  return "success" in result && result.success === true;
}
