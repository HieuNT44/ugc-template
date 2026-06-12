export type PostStatus = "draft" | "pending_review" | "published" | "rejected";

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
  rejected: "Rejected",
};
