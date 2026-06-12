import { calculateReadTime } from "@/core/lib/calculate-read-time";
import { buildPostSlug, extractPostIdFromSlug } from "@/core/lib/post-slug";

import { apiRequest } from "@/core/api/server";

import { mapApiFeedItemToFeedPost, type ApiFeedItem } from "./feed-api";
import { markdownToBlocks } from "./parse-markdown-to-blocks";
import type { ArticleBlock } from "../types/article-block";
import type { PostArticle } from "../types/post-article";

type ApiContentShow = ApiFeedItem & {
  slug?: string | null;
  editor_mode?: "markdown" | "wysiwyg" | null;
};

type ApiContentRead = {
  id: string;
  type: "blog" | "book" | "report";
  title: string | null;
  short_description: string | null;
  excerpt: string | null;
  is_paid: boolean;
  price: number | null;
  access: "full" | "preview";
  content_truncated: boolean;
  content: string | null;
  editor_mode?: "markdown" | "wysiwyg" | null;
};

function detectEditorMode(content: string): "markdown" | "wysiwyg" {
  const trimmed = content.trim();

  if (trimmed.startsWith("<") && trimmed.includes(">")) {
    return "wysiwyg";
  }

  return "markdown";
}

function contentToBlocks(
  content: string,
  editorMode: "markdown" | "wysiwyg"
): ArticleBlock[] {
  if (editorMode === "wysiwyg") {
    return [{ type: "richtext", html: content }];
  }

  return markdownToBlocks(content);
}

type GetPostArticleOptions = {
  /** Bypass Next.js request memoization after purchase fulfillment. */
  fresh?: boolean;
};

export async function getPostArticleFromApi(
  slug: string,
  token?: string | null,
  options?: GetPostArticleOptions
): Promise<{
  article: PostArticle;
  isUnlocked: boolean;
  likedByMe: boolean;
  savedByMe: boolean;
} | null> {
  const contentId = extractPostIdFromSlug(slug);

  if (!contentId) {
    return null;
  }

  const cacheBust = options?.fresh ? { _: Date.now() } : undefined;

  const [showResult, readResult] = await Promise.all([
    apiRequest<ApiContentShow>({
      path: `/contents/${contentId}`,
      method: "GET",
      token: token ?? undefined,
      searchParams: cacheBust,
    }),
    apiRequest<ApiContentRead>({
      path: `/contents/${contentId}/read`,
      method: "GET",
      token: token ?? undefined,
      searchParams: cacheBust,
    }),
  ]);

  if (!showResult.ok || !readResult.ok) {
    return null;
  }

  const show = showResult.data;
  const read = readResult.data;
  const body = read.content?.trim() ?? "";

  if (!body) {
    return null;
  }

  const feedPost = mapApiFeedItemToFeedPost(show);
  const slugValue = buildPostSlug(feedPost.title, feedPost.id);
  const editorMode =
    show.editor_mode ?? read.editor_mode ?? detectEditorMode(body);
  const blocks = contentToBlocks(body, editorMode);
  const isUnlocked = read.access === "full" || !show.is_paid;

  return {
    article: {
      ...feedPost,
      slug: slugValue,
      markdown: editorMode === "markdown" ? body : "",
      blocks,
      readTimeMinutes: calculateReadTime(body),
    },
    isUnlocked,
    likedByMe: show.liked_by_me ?? false,
    savedByMe: show.saved_by_me ?? false,
  };
}
