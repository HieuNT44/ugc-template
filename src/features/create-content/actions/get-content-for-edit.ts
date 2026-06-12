"use server";

import { getServerSession } from "next-auth";

import { apiRequest } from "@/core/api/server";
import { authOptions } from "@/core/auth";

import {
  mapApiContentToDocument,
  type ApiContentDetail,
} from "../lib/content-api";
import type { ContentDocument } from "../types/content-document";

export type GetContentForEditResult =
  | { success: true; content: ContentDocument }
  | { error: string };

export async function getContentForEditAction(
  contentId: string
): Promise<GetContentForEditResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.accessToken) {
    return { error: "認証が必要です" };
  }

  if (session.user.role !== "creator") {
    return { error: "クリエイター権限が必要です" };
  }

  try {
    const result = await apiRequest<ApiContentDetail>({
      path: `/contents/${contentId}`,
      method: "GET",
      token: session.accessToken,
    });

    if (!result.ok) {
      return { error: result.error.message };
    }

    const content = mapApiContentToDocument(result.data);

    if (content.status !== "draft" && content.status !== "published") {
      return { error: "このコンテンツはまだ編集できません。" };
    }

    return { success: true, content };
  } catch {
    return { error: "問題が発生しました。時間をおいて再度お試しください" };
  }
}
