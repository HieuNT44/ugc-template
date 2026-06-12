"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { apiRequest } from "@/core/api/server";
import { authOptions } from "@/core/auth";

import {
  buildContentApiPayload,
  mapApiContentToDocument,
  toValidationErrors,
  type ApiContentDetail,
  type SaveDraftInput,
} from "../lib/content-api";

export type UpdatePublishedContentResult =
  | {
      success: true;
      contentId: string;
    }
  | { error: string }
  | { errors: Record<string, string[]> };

export type UpdatePublishedContentInput = {
  draftId: string;
  type: SaveDraftInput["type"];
  title?: string;
  shortDescription?: string;
  description?: string;
  field?: string;
  tags?: string[];
  coverImageUrl?: string | null;
  coverUploadFileId?: string | null;
  templateId?: string | null;
  editorMode?: SaveDraftInput["editorMode"];
  content?: string;
  chapters?: SaveDraftInput["chapters"];
  pricingType: "free" | "paid";
  priceYen?: number | null;
};

export async function updatePublishedContentAction(
  raw: UpdatePublishedContentInput
): Promise<UpdatePublishedContentResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.accessToken) {
    return { error: "Unauthorized" };
  }

  if (session.user.role !== "creator") {
    return { error: "Creator role required" };
  }

  try {
    const result = await apiRequest<ApiContentDetail>({
      path: "/contents/update-published",
      method: "POST",
      token: session.accessToken,
      body: buildContentApiPayload(raw),
    });

    if (!result.ok) {
      const validationErrors = toValidationErrors(result.error.details);
      return validationErrors
        ? { errors: validationErrors }
        : { error: result.error.message };
    }

    const updated = mapApiContentToDocument(result.data);

    revalidatePath("/profile");
    revalidatePath("/studio");

    return {
      success: true,
      contentId: updated.id,
    };
  } catch {
    return { error: "Something went wrong, please try again later" };
  }
}
