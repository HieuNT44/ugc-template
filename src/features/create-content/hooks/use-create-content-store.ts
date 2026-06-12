"use client";

import { create } from "zustand";

import type { BookChapter } from "../types/book-chapter";
import type {
  ContentType,
  EditorMode,
  PricingType,
} from "../types/content-type";

type CreateContentState = {
  contentType: ContentType | null;
  templateId: string | null;
  draftId: string | null;
  title: string;
  shortDescription: string;
  description: string;
  field: string;
  tags: string[];
  coverImageUrl: string | null;
  coverUploadFileId: string | null;
  coverPreviewUrl: string | null;
  editorMode: EditorMode;
  content: string;
  pdfUrl: string | null;
  pdfFileName: string | null;
  previewPages: number;
  chapters: BookChapter[];
  previewChapterIndex: number | null;
  sellByChapter: boolean;
  pricingType: PricingType;
  priceYen: number | null;
  setContentType: (type: ContentType) => void;
  setTemplateId: (id: string | null) => void;
  setDraftId: (id: string | null) => void;
  patch: (
    partial: Partial<
      Omit<
        CreateContentState,
        "patch" | "reset" | "setContentType" | "setTemplateId" | "setDraftId"
      >
    >
  ) => void;
  reset: () => void;
};

const INITIAL_STATE = {
  contentType: null as ContentType | null,
  templateId: null as string | null,
  draftId: null as string | null,
  title: "",
  shortDescription: "",
  description: "",
  field: "",
  tags: [] as string[],
  coverImageUrl: null as string | null,
  coverUploadFileId: null as string | null,
  coverPreviewUrl: null as string | null,
  editorMode: "wysiwyg" as EditorMode,
  content: "",
  pdfUrl: null as string | null,
  pdfFileName: null as string | null,
  previewPages: 5,
  chapters: [] as BookChapter[],
  previewChapterIndex: null as number | null,
  sellByChapter: false,
  pricingType: "free" as PricingType,
  priceYen: null as number | null,
};

export const useCreateContentStore = create<CreateContentState>()((set) => ({
  ...INITIAL_STATE,
  setContentType: (type) => set({ contentType: type }),
  setTemplateId: (id) => set({ templateId: id }),
  setDraftId: (id) => set({ draftId: id }),
  patch: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () => set({ ...INITIAL_STATE }),
}));
