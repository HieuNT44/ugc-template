"use server";

import { getServerSession } from "next-auth";

import { apiRequest } from "@/core/api/server";
import { authOptions } from "@/core/auth";

import {
  mapApiCommentToPostComment,
  type ApiContentComment,
  type LikeResponse,
  type SaveResponse,
  type ShareResponse,
} from "../lib/social-api";
import type { PostComment } from "../types/post-comment";

type EngagementResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.accessToken?.trim() || null;
}

export async function likeContentAction(
  contentId: string
): Promise<EngagementResult<LikeResponse>> {
  const token = await requireAccessToken();
  if (!token) {
    return { ok: false, error: "unauthenticated" };
  }

  const result = await apiRequest<LikeResponse>({
    path: `/contents/${contentId}/like`,
    method: "POST",
    token,
  });

  if (!result.ok) {
    return { ok: false, error: result.error.message };
  }

  return { ok: true, data: result.data };
}

export async function unlikeContentAction(
  contentId: string
): Promise<EngagementResult<LikeResponse>> {
  const token = await requireAccessToken();
  if (!token) {
    return { ok: false, error: "unauthenticated" };
  }

  const result = await apiRequest<LikeResponse>({
    path: `/contents/${contentId}/like`,
    method: "DELETE",
    token,
  });

  if (!result.ok) {
    return { ok: false, error: result.error.message };
  }

  return { ok: true, data: result.data };
}

export async function saveContentAction(
  contentId: string
): Promise<EngagementResult<SaveResponse>> {
  const token = await requireAccessToken();
  if (!token) {
    return { ok: false, error: "unauthenticated" };
  }

  const result = await apiRequest<SaveResponse>({
    path: `/contents/${contentId}/save`,
    method: "POST",
    token,
  });

  if (!result.ok) {
    return { ok: false, error: result.error.message };
  }

  return { ok: true, data: result.data };
}

export async function unsaveContentAction(
  contentId: string
): Promise<EngagementResult<SaveResponse>> {
  const token = await requireAccessToken();
  if (!token) {
    return { ok: false, error: "unauthenticated" };
  }

  const result = await apiRequest<SaveResponse>({
    path: `/contents/${contentId}/save`,
    method: "DELETE",
    token,
  });

  if (!result.ok) {
    return { ok: false, error: result.error.message };
  }

  return { ok: true, data: result.data };
}

export async function recordContentShareAction(
  contentId: string
): Promise<EngagementResult<ShareResponse>> {
  const result = await apiRequest<ShareResponse>({
    path: `/contents/${contentId}/shares`,
    method: "POST",
  });

  if (!result.ok) {
    return { ok: false, error: result.error.message };
  }

  return { ok: true, data: result.data };
}

export async function listContentCommentsAction(
  contentId: string
): Promise<PostComment[]> {
  const result = await apiRequest<ApiContentComment[]>({
    path: `/contents/${contentId}/comments`,
    method: "GET",
    searchParams: { per_page: 50 },
  });

  if (!result.ok) {
    return [];
  }

  return result.data.map(mapApiCommentToPostComment);
}

export async function createContentCommentAction(
  contentId: string,
  body: string
): Promise<EngagementResult<PostComment>> {
  const token = await requireAccessToken();
  if (!token) {
    return { ok: false, error: "unauthenticated" };
  }

  const trimmed = body.trim();
  if (!trimmed) {
    return { ok: false, error: "empty_body" };
  }

  const result = await apiRequest<ApiContentComment>({
    path: `/contents/${contentId}/comments`,
    method: "POST",
    token,
    body: { body: trimmed },
  });

  if (!result.ok) {
    return { ok: false, error: result.error.message };
  }

  return { ok: true, data: mapApiCommentToPostComment(result.data) };
}
