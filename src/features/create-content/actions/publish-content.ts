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

export type PublishContentResult =
  | {
      success: true;
      status: "published" | "pending_review";
      humanScore: number;
      contentId: string;
    }
  | { error: string }
  | { errors: Record<string, string[]> };

export type PublishContentInput = {
  draftId?: string | null;
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

export async function publishContentAction(
  raw: PublishContentInput
): Promise<PublishContentResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.accessToken) {
    return { error: "Unauthorized" };
  }

  if (session.user.role !== "creator") {
    return { error: "Creator role required" };
  }

  try {
    const result = await apiRequest<ApiContentDetail>({
      path: "/contents/publish",
      method: "POST",
      token: session.accessToken,
      body: buildContentApiPayload(raw, { publish: true }),
    });

    if (!result.ok) {
      const validationErrors = toValidationErrors(result.error.details);
      return validationErrors
        ? { errors: validationErrors }
        : { error: result.error.message };
    }

    const published = mapApiContentToDocument(result.data);

    revalidatePath("/profile");
    revalidatePath("/studio");

    return {
      success: true,
      status: "published",
      humanScore: published.humanScore ?? 0,
      contentId: published.id,
    };
  } catch {
    return { error: "Something went wrong, please try again later" };
  }
}
