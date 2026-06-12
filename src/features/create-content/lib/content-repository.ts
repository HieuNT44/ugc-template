import { FieldValue } from "firebase-admin/firestore";

import {
  getAdminDb,
  isFirebaseAdminConfigured,
} from "@/core/auth/lib/firebase-admin";

import type { ContentDocument } from "../types/content-document";
import type { ContentType } from "../types/content-type";
import type { PostStatus } from "../types/post-status";

const CONTENTS_COLLECTION = "contents";

type SaveContentInput = Partial<
  Omit<ContentDocument, "id" | "authorId" | "createdAt" | "updatedAt">
> & {
  type: ContentType;
};

const memoryStore = new Map<string, ContentDocument>();

function toIsoDate(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return new Date().toISOString();
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function mapDoc(id: string, data: Record<string, unknown>): ContentDocument {
  return {
    id,
    authorId: String(data.authorId ?? ""),
    type: data.type as ContentType,
    status: (data.status as PostStatus) ?? "draft",
    title: String(data.title ?? ""),
    description: asString(data.description),
    field: String(data.field ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    coverImageUrl: asString(data.coverImageUrl),
    templateId: asString(data.templateId),
    editorMode:
      (asString(data.editorMode) as ContentDocument["editorMode"]) ?? null,
    content: asString(data.content),
    pdfUrl: asString(data.pdfUrl),
    pdfFileName: asString(data.pdfFileName),
    previewPages: asNumber(data.previewPages),
    chapters: Array.isArray(data.chapters)
      ? (data.chapters as ContentDocument["chapters"])
      : null,
    previewChapterIndex: asNumber(data.previewChapterIndex),
    sellByChapter: asBoolean(data.sellByChapter),
    pricingType:
      (asString(data.pricingType) as ContentDocument["pricingType"]) ?? "free",
    priceYen: asNumber(data.priceYen),
    humanScore: asNumber(data.humanScore),
    rejectionReason: asString(data.rejectionReason),
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}

function saveToMemory(
  authorId: string,
  draftId: string | null,
  input: SaveContentInput
): ContentDocument {
  const now = new Date().toISOString();
  const id =
    draftId ?? `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const existing = memoryStore.get(id);

  const doc: ContentDocument = {
    id,
    authorId,
    type: input.type,
    status: input.status ?? existing?.status ?? "draft",
    title: input.title ?? existing?.title ?? "",
    description: input.description ?? existing?.description ?? null,
    field: input.field ?? existing?.field ?? "",
    tags: input.tags ?? existing?.tags ?? [],
    coverImageUrl: input.coverImageUrl ?? existing?.coverImageUrl ?? null,
    templateId: input.templateId ?? existing?.templateId ?? null,
    editorMode: input.editorMode ?? existing?.editorMode ?? null,
    content: input.content ?? existing?.content ?? null,
    pdfUrl: input.pdfUrl ?? existing?.pdfUrl ?? null,
    pdfFileName: input.pdfFileName ?? existing?.pdfFileName ?? null,
    previewPages: input.previewPages ?? existing?.previewPages ?? null,
    chapters: input.chapters ?? existing?.chapters ?? null,
    previewChapterIndex:
      input.previewChapterIndex ?? existing?.previewChapterIndex ?? null,
    sellByChapter: input.sellByChapter ?? existing?.sellByChapter ?? null,
    pricingType: input.pricingType ?? existing?.pricingType ?? "free",
    priceYen: input.priceYen ?? existing?.priceYen ?? null,
    humanScore: input.humanScore ?? existing?.humanScore ?? null,
    rejectionReason: input.rejectionReason ?? existing?.rejectionReason ?? null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  memoryStore.set(id, doc);
  return doc;
}

export async function saveContentDraft(
  authorId: string,
  draftId: string | null,
  input: SaveContentInput
): Promise<ContentDocument> {
  if (!isFirebaseAdminConfigured()) {
    return saveToMemory(authorId, draftId, input);
  }

  const db = getAdminDb();
  const now = FieldValue.serverTimestamp();
  const ref = draftId
    ? db.collection(CONTENTS_COLLECTION).doc(draftId)
    : db.collection(CONTENTS_COLLECTION).doc();

  const payload = {
    authorId,
    type: input.type,
    status: input.status ?? "draft",
    title: input.title ?? "",
    description: input.description ?? null,
    field: input.field ?? "",
    tags: input.tags ?? [],
    coverImageUrl: input.coverImageUrl ?? null,
    templateId: input.templateId ?? null,
    editorMode: input.editorMode ?? null,
    content: input.content ?? null,
    pdfUrl: input.pdfUrl ?? null,
    pdfFileName: input.pdfFileName ?? null,
    previewPages: input.previewPages ?? null,
    chapters: input.chapters ?? null,
    previewChapterIndex: input.previewChapterIndex ?? null,
    sellByChapter: input.sellByChapter ?? null,
    pricingType: input.pricingType ?? "free",
    priceYen: input.priceYen ?? null,
    humanScore: input.humanScore ?? null,
    rejectionReason: input.rejectionReason ?? null,
    updatedAt: now,
  };

  if (draftId) {
    const snap = await ref.get();
    if (!snap.exists) {
      throw new Error("下書きが見つかりません");
    }
    const data = snap.data();
    if (data?.authorId !== authorId) {
      throw new Error("認証が必要です");
    }
    await ref.update(payload);
  } else {
    await ref.set({ ...payload, createdAt: now });
  }

  const saved = await ref.get();
  return mapDoc(saved.id, saved.data() ?? {});
}

export async function getContentById(
  authorId: string,
  contentId: string
): Promise<ContentDocument | null> {
  if (!isFirebaseAdminConfigured()) {
    const doc = memoryStore.get(contentId);
    if (!doc || doc.authorId !== authorId) {
      return null;
    }
    return doc;
  }

  const db = getAdminDb();
  const snap = await db.collection(CONTENTS_COLLECTION).doc(contentId).get();
  if (!snap.exists) {
    return null;
  }
  const data = snap.data() ?? {};
  if (data.authorId !== authorId) {
    return null;
  }
  return mapDoc(snap.id, data);
}

export async function listContentsByAuthor(
  authorId: string,
  status?: PostStatus
): Promise<ContentDocument[]> {
  if (!isFirebaseAdminConfigured()) {
    return [...memoryStore.values()]
      .filter((doc) => doc.authorId === authorId)
      .filter((doc) => (status ? doc.status === status : true))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  const db = getAdminDb();
  let query = db
    .collection(CONTENTS_COLLECTION)
    .where("authorId", "==", authorId);

  if (status) {
    query = query.where("status", "==", status);
  }

  const snap = await query.get();
  return snap.docs
    .map((doc) => mapDoc(doc.id, doc.data()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateContentStatus(
  authorId: string,
  contentId: string,
  update: Pick<
    ContentDocument,
    "status" | "humanScore" | "rejectionReason" | "pricingType" | "priceYen"
  >
): Promise<ContentDocument> {
  return saveContentDraft(authorId, contentId, {
    type: (await getContentById(authorId, contentId))?.type ?? "blog",
    ...update,
  });
}
