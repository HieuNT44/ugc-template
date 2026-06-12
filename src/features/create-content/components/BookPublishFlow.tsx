"use client";

import { useCreateContentStore } from "../hooks/use-create-content-store";
import { bookPublishSchema } from "../validations/book.schema";
import { PublishSettings } from "./PublishSettings";

export function BookPublishFlow() {
  const store = useCreateContentStore();

  return (
    <PublishSettings
      contentType='book'
      backHref='/studio/create/book/edit'
      editHref='/studio/create/book/edit'
      publishSchema={bookPublishSchema}
      buildDraftPayload={() => ({
        draftId: store.draftId,
        type: "book",
        title: store.title,
        description: store.description,
        field: store.field,
        coverImageUrl: store.coverPreviewUrl ?? store.coverImageUrl,
        coverUploadFileId: store.coverUploadFileId,
        chapters: store.chapters,
        previewChapterIndex: store.previewChapterIndex,
        sellByChapter: store.sellByChapter,
        pricingType: store.pricingType,
        priceYen: store.priceYen,
      })}
    />
  );
}
