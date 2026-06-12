import type { UserPost } from "@/core/types";

import type { StudioKanbanItem } from "./mock-studio-kanban";
import { getStudioEditHref } from "./studio-edit-href";

const STUDIO_OWNER = {
  username: "TOMOSIA-HieuNT",
  avatarUrl: "",
  authorDisplayName: "TOMOSIA-HieuNT",
} as const;

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getStudioKanbanItemHref(item: StudioKanbanItem): string {
  return getStudioEditHref(item) ?? "/studio";
}

export function studioKanbanItemToUserPost(item: StudioKanbanItem): UserPost {
  return {
    id: item.id,
    author: {
      username: STUDIO_OWNER.username,
      avatarUrl: STUDIO_OWNER.avatarUrl,
    },
    authorDisplayName: STUDIO_OWNER.authorDisplayName,
    publishedAt: formatUpdatedAt(item.updatedAt),
    title: item.title,
    snippet: item.snippet ?? "",
    coverImageUrl: item.coverImageUrl ?? null,
    likeCount: 0,
    commentCount: 0,
    labels: [],
    href: getStudioKanbanItemHref(item),
  };
}
