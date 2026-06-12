"use server";

import { apiRequest } from "@/core/api/server";

import {
  FALLBACK_TOP_COMMITTERS,
  mapApiTopCommitter,
  type ApiTopCommitter,
  type FeedTopCommitter,
} from "../lib/top-committers-api";

const DEFAULT_LIMIT = 3;

export async function listTopCommittersAction(
  limit = DEFAULT_LIMIT
): Promise<FeedTopCommitter[]> {
  const result = await apiRequest<ApiTopCommitter[]>({
    path: "/profiles/top-committers",
    method: "GET",
    searchParams: { limit },
  });

  if (!result.ok) {
    return FALLBACK_TOP_COMMITTERS.slice(0, limit);
  }

  const committers = result.data
    .map(mapApiTopCommitter)
    .filter((item): item is FeedTopCommitter => item !== null);

  return committers.length > 0
    ? committers
    : FALLBACK_TOP_COMMITTERS.slice(0, limit);
}
