"use server";

import { apiRequest } from "@/core/api/server";

import { FEED_SUGGESTED_TOPICS } from "../lib/mock-feed-posts";

type ApiTrendingTag = {
  name: string;
  total_usage_count: number;
  weekly_usage_count: number;
};

const DEFAULT_LIMIT = 6;

export async function listTrendingTagsAction(
  limit = DEFAULT_LIMIT
): Promise<string[]> {
  const result = await apiRequest<ApiTrendingTag[]>({
    path: "/tags/trending",
    method: "GET",
  });

  if (!result.ok) {
    return [...FEED_SUGGESTED_TOPICS].slice(0, limit);
  }

  const tags = result.data
    .map((tag) => tag.name.trim())
    .filter(Boolean)
    .slice(0, limit);

  return tags.length > 0 ? tags : [...FEED_SUGGESTED_TOPICS].slice(0, limit);
}
