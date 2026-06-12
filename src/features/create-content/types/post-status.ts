export type PostStatus = "draft" | "pending_review" | "published" | "rejected";

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: "下書き",
  pending_review: "審査待ち",
  published: "公開済み",
  rejected: "差し戻し済み",
};
