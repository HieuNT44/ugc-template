import { calculateReadTime } from "@/core/lib/calculate-read-time";
import { buildPostSlug, extractPostIdFromSlug } from "@/core/lib/post-slug";
import { getMockPostsForTab } from "@/features/profile/lib/mock-profile-posts";

import {
  DEFAULT_ARTICLE_MARKDOWN,
  MOCK_ARTICLE_MARKDOWN_BY_ID,
} from "./mock-article-markdown";
import { markdownToBlocks } from "./parse-markdown-to-blocks";
import { getMockFeedPosts } from "./mock-feed-posts";
import type { PostArticle } from "../types/post-article";
import type { FeedPost } from "../types/feed-post";

/** Alias profile post ids to feed markdown where titles match. */
const BODY_ALIASES: Record<string, string> = {
  "post-1": "feed-1",
  "post-2": "feed-3",
  "post-3": "feed-5",
  "purchased-1": "feed-2",
  "saved-1": "feed-4",
};

function resolveMarkdown(postId: string): string {
  const alias = BODY_ALIASES[postId];
  const sourceId = alias ?? postId;

  return MOCK_ARTICLE_MARKDOWN_BY_ID[sourceId] ?? DEFAULT_ARTICLE_MARKDOWN;
}

function toPostArticle(post: FeedPost): PostArticle {
  const markdown = resolveMarkdown(post.id);
  return {
    ...post,
    slug: buildPostSlug(post.title, post.id),
    markdown,
    blocks: markdownToBlocks(markdown),
    readTimeMinutes: calculateReadTime(markdown),
  };
}

function getProfilePostsForArticles(): FeedPost[] {
  const tabs = ["posts", "purchased", "saved"] as const;
  const posts: FeedPost[] = [];

  for (const tab of tabs) {
    for (const post of getMockPostsForTab(tab)) {
      const markdown = resolveMarkdown(post.id);
      posts.push({
        ...post,
        readTimeMinutes: calculateReadTime(markdown),
      });
    }
  }

  return posts;
}

function buildArticleIndex(): Map<string, PostArticle> {
  const index = new Map<string, PostArticle>();
  const seenIds = new Set<string>();

  for (const post of [...getMockFeedPosts(), ...getProfilePostsForArticles()]) {
    if (seenIds.has(post.id)) {
      continue;
    }
    seenIds.add(post.id);

    const article = toPostArticle(post);
    index.set(article.slug, article);
  }

  return index;
}

const ARTICLE_BY_SLUG = buildArticleIndex();

export function getPostArticleBySlug(slug: string): PostArticle | null {
  const direct = ARTICLE_BY_SLUG.get(slug);
  if (direct) {
    return direct;
  }

  const postId = extractPostIdFromSlug(slug);
  if (!postId) {
    return null;
  }

  for (const article of ARTICLE_BY_SLUG.values()) {
    if (article.id === postId) {
      return article;
    }
  }

  return null;
}

export function getPostArticleById(postId: string): PostArticle | null {
  for (const article of ARTICLE_BY_SLUG.values()) {
    if (article.id === postId) {
      return article;
    }
  }

  return null;
}

export function getAllPostArticleSlugs(): string[] {
  return [...ARTICLE_BY_SLUG.keys()];
}
