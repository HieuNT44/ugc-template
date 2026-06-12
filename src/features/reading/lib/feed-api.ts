import { calculateReadTime } from "@/core/lib/calculate-read-time";
import { buildPostSlug } from "@/core/lib/post-slug";
import type { PostLabel } from "@/core/types/post-label";

import type { ApiContentSocial } from "./social-api";
import type { FeedPost } from "../types/feed-post";

export type FeedContentType = "blog" | "book" | "report";

export type ApiFeedCreator = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_certified: boolean;
};

export type ApiFeedCover = {
  upload_file_id: string;
  url: string | null;
};

export type ApiFeedTag = {
  name: string;
};

export type ApiFeedItem = {
  id: string;
  type: FeedContentType;
  title: string | null;
  short_description: string | null;
  excerpt: string | null;
  is_paid: boolean;
  price: number | null;
  is_human_written: boolean | null;
  cover: ApiFeedCover | null;
  tags?: ApiFeedTag[];
  creator: ApiFeedCreator | null;
  has_purchased: boolean;
  published_at: string | null;
} & ApiContentSocial;

function formatPublishedAt(iso: string | null): string {
  if (!iso) {
    return "";
  }

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function buildFeedLabels(item: ApiFeedItem): PostLabel[] {
  const labels: PostLabel[] = [];

  if (item.has_purchased) {
    labels.push({ type: "purchased" });
  }

  if (item.is_paid && item.price != null) {
    labels.push({
      type: "paid",
      amountCents: item.price,
      currency: "JPY",
    });
  }

  if (item.creator?.is_certified) {
    labels.push({ type: "expert" });
  }

  if (item.is_human_written) {
    labels.push({ type: "human_written" });
  }

  return labels;
}

export function mapApiFeedItemToFeedPost(item: ApiFeedItem): FeedPost {
  const title = item.title?.trim() || "Untitled";
  const snippet = item.short_description?.trim() || item.excerpt?.trim() || "";
  const username = item.creator?.username?.trim() || "creator";
  const authorDisplayName = item.creator?.full_name?.trim() || username;
  const href =
    item.type === "book"
      ? `/@${encodeURIComponent(username)}/books/${item.id}`
      : `/${buildPostSlug(title, item.id)}`;

  return {
    id: item.id,
    author: {
      id: item.creator?.id,
      username,
      avatarUrl: item.creator?.avatar_url ?? "",
    },
    authorDisplayName,
    publishedAt: formatPublishedAt(item.published_at),
    title,
    snippet,
    coverImageUrl: item.cover?.url ?? null,
    likeCount: item.like_count ?? 0,
    commentCount: item.comment_count ?? 0,
    repostCount: item.share_count ?? 0,
    labels: buildFeedLabels(item),
    tagNames: item.tags?.map((tag) => tag.name).filter(Boolean) ?? [],
    href,
    readTimeMinutes: calculateReadTime(snippet),
  };
}
