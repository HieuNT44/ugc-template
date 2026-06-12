"use client";

import { useCreateContentStore } from "../hooks/use-create-content-store";
import { reportPublishSchema } from "../validations/report.schema";
import { PublishSettings } from "./PublishSettings";

export function ReportPublishFlow() {
  const store = useCreateContentStore();

  return (
    <PublishSettings
      contentType='report'
      backHref='/studio/create/report/edit'
      editHref='/studio/create/report/edit'
      publishSchema={reportPublishSchema}
      buildDraftPayload={() => ({
        draftId: store.draftId,
        type: "report",
        title: store.title,
        description: store.description,
        field: store.field,
        coverImageUrl: store.coverPreviewUrl ?? store.coverImageUrl,
        coverUploadFileId: store.coverUploadFileId,
        pdfUrl: store.pdfUrl,
        pdfFileName: store.pdfFileName,
        previewPages: store.previewPages,
        pricingType: store.pricingType,
        priceYen: store.priceYen,
      })}
    />
  );
}
