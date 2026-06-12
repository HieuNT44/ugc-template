import { getAuthorProfileHref } from "@/core/lib/post-href";

import { FEED_SUGGESTED_AUTHORS } from "./mock-feed-posts";

export type ApiTopCommitter = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  content_count: number;
  is_certified: boolean;
};

export type FeedTopCommitter = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  contentCount: number;
  href: string;
};

export const FALLBACK_TOP_COMMITTERS: FeedTopCommitter[] =
  FEED_SUGGESTED_AUTHORS.map((author, index) => ({
    id: author.username,
    username: author.username,
    name: author.name,
    avatarUrl: author.avatarUrl,
    bio: author.bio,
    contentCount: [12, 8, 5][index] ?? 1,
    href: getAuthorProfileHref(author.username),
  }));

export function mapApiTopCommitter(
  item: ApiTopCommitter
): FeedTopCommitter | null {
  const username = item.username?.trim();
  if (!username) {
    return null;
  }

  const name = item.full_name?.trim() || username;

  return {
    id: item.id,
    username,
    name,
    avatarUrl: item.avatar_url ?? "",
    bio: item.bio?.trim() || "RealReadクリエイター",
    contentCount: item.content_count,
    href: getAuthorProfileHref(username),
  };
}
