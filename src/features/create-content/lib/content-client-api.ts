"use client";

import { clientApiRequest } from "@/core/api/client/fetch-api";

import {
  buildContentApiPayload,
  mapApiContentToDocument,
  toValidationErrors,
  type ApiContentDetail,
  type SaveDraftInput,
  type SaveDraftResult,
} from "./content-api";

export async function saveDraftClient(
  raw: SaveDraftInput,
  token?: string | null
): Promise<SaveDraftResult> {
  const accessToken = token?.trim();

  if (!accessToken) {
    return { error: "認証が必要です" };
  }

  const result = await clientApiRequest<ApiContentDetail>({
    path: "/contents/draft",
    method: "POST",
    token: accessToken,
    body: buildContentApiPayload(raw),
  });

  if (!result.ok) {
    const validationErrors = toValidationErrors(result.error.details);
    return validationErrors
      ? { errors: validationErrors }
      : { error: result.error.message };
  }

  return { success: true, draft: mapApiContentToDocument(result.data) };
}
