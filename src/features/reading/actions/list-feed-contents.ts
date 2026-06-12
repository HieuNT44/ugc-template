"use server";

import { getServerSession } from "next-auth";

import { apiRequest } from "@/core/api/server";
import { authOptions } from "@/core/auth";
import {
  getApiBaseUrl,
  getDefaultApiHeaders,
} from "@/core/api/config/api.config";

import {
  mapApiFeedItemToFeedPost,
  type ApiFeedItem,
  type FeedContentType,
} from "../lib/feed-api";
import type { FeedPost } from "../types/feed-post";

const DEFAULT_PER_PAGE = 20;

export type FeedContentsPage = {
  posts: FeedPost[];
  hasNext: boolean;
  nextCursor: string | null;
};

type FeedContentsResponse = {
  data: ApiFeedItem[];
  meta?: {
    has_next?: boolean;
    next_cursor?: string | null;
  };
};

function isFeedContentsResponse(value: unknown): value is FeedContentsResponse {
  if (typeof value !== "object" || value === null || !("data" in value)) {
    return false;
  }

  return Array.isArray((value as FeedContentsResponse).data);
}

export async function listFeedContentsPageAction(
  type: FeedContentType,
  options?: { perPage?: number; cursor?: string | null }
): Promise<FeedContentsPage> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken?.trim();
  const url = new URL(`${getApiBaseUrl()}/contents`);

  url.searchParams.set("type", type);
  url.searchParams.set("sort", "-published_at");
  url.searchParams.set(
    "per_page",
    String(options?.perPage ?? DEFAULT_PER_PAGE)
  );

  if (options?.cursor) {
    url.searchParams.set("cursor", options.cursor);
  }

  const headers = new Headers(getDefaultApiHeaders());

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const body: unknown = await response.json();

    if (!response.ok || !isFeedContentsResponse(body)) {
      return {
        posts: [],
        hasNext: false,
        nextCursor: null,
      };
    }

    return {
      posts: body.data.map(mapApiFeedItemToFeedPost),
      hasNext: body.meta?.has_next ?? false,
      nextCursor: body.meta?.next_cursor ?? null,
    };
  } catch (error) {
    console.error("Failed to list feed contents:", error);

    return {
      posts: [],
      hasNext: false,
      nextCursor: null,
    };
  }
}

export async function listFeedContentsAction(
  type: FeedContentType,
  options?: { perPage?: number }
): Promise<FeedPost[]> {
  const page = await listFeedContentsPageAction(type, options);

  return page.posts;
}

export async function listLatestFeedContentsAction(options?: {
  perPage?: number;
  excludeId?: string;
}): Promise<FeedPost[]> {
  const perPage = options?.perPage ?? 4;
  const session = await getServerSession(authOptions);
  const token = session?.accessToken?.trim();

  const result = await apiRequest<ApiFeedItem[]>({
    path: "/contents",
    method: "GET",
    token: token || undefined,
    searchParams: {
      sort: "-published_at",
      per_page: Math.min(perPage + 1, 50),
    },
  });

  if (!result.ok) {
    return [];
  }

  return result.data
    .filter((item) => item.id !== options?.excludeId)
    .map(mapApiFeedItemToFeedPost)
    .slice(0, perPage);
}
