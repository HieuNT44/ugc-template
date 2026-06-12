"use client";

import { useRouter } from "next/navigation";

import { useCreateContentStore } from "../hooks/use-create-content-store";
import { BlogPublishSettings } from "./BlogPublishSettings";

export function BlogPublishFlow() {
  const router = useRouter();
  const store = useCreateContentStore();

  return (
    <BlogPublishSettings
      onBack={() => router.push("/studio/create/blog/new")}
      buildDraftPayload={() => ({
        draftId: store.draftId,
        type: "blog",
        title: store.title,
        shortDescription: store.shortDescription,
        field: store.field,
        tags: store.tags,
        coverImageUrl: store.coverPreviewUrl ?? store.coverImageUrl,
        coverUploadFileId: store.coverUploadFileId,
        templateId: store.templateId,
        editorMode: store.editorMode,
        content: store.content,
        pricingType: store.pricingType,
        priceYen: store.priceYen,
      })}
    />
  );
}
