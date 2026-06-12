"use server";

import { getServerSession } from "next-auth";

import { apiRequest } from "@/core/api/server";
import { authOptions } from "@/core/auth";

import {
  mapApiContentListItemToDocument,
  toApiStatus,
  type ApiContentListItem,
} from "../lib/content-api";
import type { ContentDocument } from "../types/content-document";
import type { PostStatus } from "../types/post-status";

export async function listMyContentsAction(
  status?: PostStatus
): Promise<ContentDocument[]> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken?.trim();

  if (!token) {
    return [];
  }

  const result = await apiRequest<ApiContentListItem[]>({
    path: "/contents/mine",
    method: "GET",
    token,
    searchParams: status ? { status: toApiStatus(status) } : undefined,
  });

  if (!result.ok) {
    return [];
  }

  return result.data.map(mapApiContentListItemToDocument);
}
