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
    title: "Draft",
    description: "Works in progress",
    statuses: ["draft"],
  },
  {
    id: "review",
    title: "Review",
    description: "Awaiting AI or admin approval",
    statuses: ["pending_review"],
  },
  {
    id: "rejected",
    title: "Reject",
    description: "Needs revision before resubmitting",
    statuses: ["rejected"],
  },
  {
    id: "published",
    title: "Published",
    description: "Live on RealRead",
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
