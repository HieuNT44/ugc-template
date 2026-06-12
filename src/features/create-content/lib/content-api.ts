import type { ValidationErrorDetail } from "@/core/api/types";

import type { ContentDocument } from "../types/content-document";
import type {
  ContentType,
  EditorMode,
  PricingType,
} from "../types/content-type";
import type { PostStatus } from "../types/post-status";

export type SaveDraftResult =
  | { success: true; draft: ContentDocument }
  | { error: string }
  | { errors: Record<string, string[]> };

export type SaveDraftInput = {
  draftId?: string | null;
  type: ContentType;
  title?: string;
  shortDescription?: string;
  description?: string;
  field?: string;
  tags?: string[];
  coverImageUrl?: string | null;
  coverUploadFileId?: string | null;
  templateId?: string | null;
  editorMode?: "wysiwyg" | "markdown";
  content?: string;
  pdfUrl?: string | null;
  pdfFileName?: string | null;
  previewPages?: number;
  chapters?: ContentDocument["chapters"];
  previewChapterIndex?: number | null;
  sellByChapter?: boolean;
  pricingType?: "free" | "paid";
  priceYen?: number | null;
};

type ApiTag = {
  name: string;
};

type ApiCover = {
  upload_file_id: string;
  url: string | null;
};

type ApiContentStatus = "draft" | "pending" | "published" | "rejected";

export type ApiContentDetail = {
  id: string;
  type: ContentType;
  status: ApiContentStatus;
  title: string | null;
  short_description?: string | null;
  description?: string | null;
  editor_mode?: EditorMode | null;
  content?: string | null;
  cover?: ApiCover | null;
  tags?: ApiTag[];
  is_paid: boolean;
  price: number | null;
  human_score?: number | null;
  created_at: string;
  updated_at: string;
};

export type ApiContentListItem = {
  id: string;
  type: ContentType;
  status: ApiContentStatus;
  title: string | null;
  short_description?: string | null;
  excerpt?: string | null;
  is_paid: boolean;
  price: number | null;
  is_public: boolean;
  cover?: ApiCover | null;
  tags?: ApiTag[];
  rejection_reason?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

type ContentApiPayload = {
  id?: string;
  type?: ContentType;
  title?: string;
  short_description?: string;
  description?: string;
  tags?: string[];
  cover_upload_file_id?: string | null;
  editor_mode?: EditorMode;
  content?: string;
  is_paid?: boolean;
  price?: number | null;
  is_public?: boolean;
};

function toPostStatus(status: ApiContentDetail["status"]): PostStatus {
  return status === "pending" ? "pending_review" : status;
}

export function toApiStatus(status: PostStatus): ApiContentStatus {
  return status === "pending_review" ? "pending" : status;
}

function toPricingType(isPaid: boolean): PricingType {
  return isPaid ? "paid" : "free";
}

export function mapApiContentToDocument(
  content: ApiContentDetail
): ContentDocument {
  return {
    id: content.id,
    authorId: "",
    type: content.type,
    status: toPostStatus(content.status),
    title: content.title ?? "",
    shortDescription: content.short_description ?? "",
    description: content.description ?? null,
    field: "",
    tags: content.tags?.map((tag) => tag.name) ?? [],
    coverImageUrl: content.cover?.url ?? null,
    coverUploadFileId: content.cover?.upload_file_id ?? null,
    templateId: null,
    editorMode: content.editor_mode ?? null,
    content: content.content ?? null,
    pdfUrl: null,
    pdfFileName: null,
    previewPages: null,
    chapters: null,
    previewChapterIndex: null,
    sellByChapter: null,
    pricingType: toPricingType(content.is_paid),
    priceYen: content.price,
    humanScore: content.human_score ?? null,
    rejectionReason: null,
    createdAt: content.created_at,
    updatedAt: content.updated_at,
  };
}

export function mapApiContentListItemToDocument(
  content: ApiContentListItem
): ContentDocument {
  return {
    id: content.id,
    authorId: "",
    type: content.type,
    status: toPostStatus(content.status),
    title: content.title ?? "",
    shortDescription: content.short_description ?? "",
    description: content.short_description ?? content.excerpt ?? null,
    field: "",
    tags: content.tags?.map((tag) => tag.name) ?? [],
    coverImageUrl: content.cover?.url ?? null,
    coverUploadFileId: content.cover?.upload_file_id ?? null,
    templateId: null,
    editorMode: null,
    content: null,
    pdfUrl: null,
    pdfFileName: null,
    previewPages: null,
    chapters: null,
    previewChapterIndex: null,
    sellByChapter: null,
    pricingType: toPricingType(content.is_paid),
    priceYen: content.price,
    humanScore: null,
    rejectionReason: content.rejection_reason ?? null,
    createdAt: content.created_at,
    updatedAt: content.updated_at,
  };
}

export function toValidationErrors(
  details?: ValidationErrorDetail[]
): Record<string, string[]> | null {
  if (!details?.length) {
    return null;
  }

  return details.reduce<Record<string, string[]>>((errors, detail) => {
    errors[detail.field] = [...(errors[detail.field] ?? []), detail.message];
    return errors;
  }, {});
}

export function buildContentApiPayload(
  raw: SaveDraftInput,
  options?: { publish?: boolean }
): ContentApiPayload {
  const payload: ContentApiPayload = {
    id: raw.draftId ?? undefined,
    type: raw.draftId ? undefined : raw.type,
    title: raw.title,
    short_description: raw.shortDescription,
    description: raw.description,
    tags: raw.tags,
    cover_upload_file_id: raw.coverUploadFileId,
    editor_mode: raw.editorMode,
    content: raw.content,
  };

  if (raw.pricingType) {
    payload.is_paid = raw.pricingType === "paid";
    payload.price = raw.pricingType === "paid" ? (raw.priceYen ?? null) : null;
  }

  if (options?.publish) {
    payload.is_public = true;
  }

  return payload;
}
