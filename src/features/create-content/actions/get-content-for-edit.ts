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
    return { error: "Unauthorized" };
  }

  if (session.user.role !== "creator") {
    return { error: "Creator role required" };
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
      return { error: "This content cannot be edited yet." };
    }

    return { success: true, content };
  } catch {
    return { error: "Something went wrong, please try again later" };
  }
}
