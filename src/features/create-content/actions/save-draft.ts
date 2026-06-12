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
  type SaveDraftResult,
} from "../lib/content-api";

export async function saveDraftAction(
  raw: SaveDraftInput
): Promise<SaveDraftResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.accessToken) {
    return { error: "認証が必要です" };
  }

  if (session.user.role !== "creator") {
    return { error: "クリエイター権限が必要です" };
  }

  try {
    const result = await apiRequest<ApiContentDetail>({
      path: "/contents/draft",
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

    revalidatePath("/profile");
    revalidatePath("/studio");

    return { success: true, draft: mapApiContentToDocument(result.data) };
  } catch {
    return { error: "接続が切れました。もう一度お試しください" };
  }
}
