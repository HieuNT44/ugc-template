import type { ContentType } from "../types/content-type";
import type { PostStatus } from "../types/post-status";

type StudioEditTarget = {
  id: string;
  type: ContentType;
  status: PostStatus;
};

export function getStudioEditHref(item: StudioEditTarget): string | null {
  if (item.status !== "draft" && item.status !== "published") {
    return null;
  }

  if (item.type === "blog") {
    return `/studio/edit/${item.id}`;
  }

  return null;
}
