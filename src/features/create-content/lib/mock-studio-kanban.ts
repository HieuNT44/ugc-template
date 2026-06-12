import type { ContentType } from "../types/content-type";
import type { ContentDocument } from "../types/content-document";
import type { PostStatus } from "../types/post-status";

export type StudioKanbanColumnId =
  | "draft"
  | "review"
  | "rejected"
  | "published";

export type StudioKanbanItem = {
  id: string;
  title: string;
  type: ContentType;
  status: PostStatus;
  updatedAt: string;
  snippet?: string | null;
  coverImageUrl?: string | null;
  rejectionReason?: string | null;
};

export type StudioKanbanColumn = {
  id: StudioKanbanColumnId;
  title: string;
  description: string;
  items: StudioKanbanItem[];
};

type StudioKanbanColumnConfig = Omit<StudioKanbanColumn, "items"> & {
  statuses: PostStatus[];
};

const STUDIO_KANBAN_COLUMNS: StudioKanbanColumnConfig[] = [
  {
    id: "draft",
    title: "下書き",
    description: "作成中",
    statuses: ["draft"],
  },
  {
    id: "review",
    title: "審査",
    description: "AIまたは管理者の承認待ち",
    statuses: ["pending_review"],
  },
  {
    id: "rejected",
    title: "差し戻し",
    description: "再提出前に修正が必要です",
    statuses: ["rejected"],
  },
  {
    id: "published",
    title: "公開済み",
    description: "RealReadで公開中",
    statuses: ["published"],
  },
];

function toStudioKanbanItem(content: ContentDocument): StudioKanbanItem {
  return {
    id: content.id,
    title: content.title,
    type: content.type,
    status: content.status,
    updatedAt: content.updatedAt,
    snippet: content.shortDescription ?? content.description ?? null,
    coverImageUrl: content.coverImageUrl ?? null,
    rejectionReason: content.rejectionReason ?? null,
  };
}

export function buildStudioKanbanColumns(
  contents: ContentDocument[]
): StudioKanbanColumn[] {
  return STUDIO_KANBAN_COLUMNS.map((column) => ({
    id: column.id,
    title: column.title,
    description: column.description,
    items: contents
      .filter((content) => column.statuses.includes(content.status))
      .map(toStudioKanbanItem),
  }));
}
