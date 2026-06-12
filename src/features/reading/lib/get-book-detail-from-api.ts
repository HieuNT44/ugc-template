import { calculateReadTime } from "@/core/lib/calculate-read-time";
import type { PostLabel } from "@/core/types/post-label";
import { apiRequest } from "@/core/api/server";

import { markdownToBlocks } from "./parse-markdown-to-blocks";
import type {
  BookChapter,
  BookCreator,
  BookDetail,
} from "../types/book-detail";
import type { ArticleBlock } from "../types/article-block";

type ApiBookCover = {
  upload_file_id: string;
  url: string | null;
};

type ApiBookCreator = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_certified: boolean;
};

type ApiBookChapter = {
  id: number;
  title: string | null;
  order_number: number | null;
  editor_mode: "markdown" | "wysiwyg" | null;
  is_free_preview: boolean | null;
  price?: number | null;
  content: string | null;
  content_truncated?: boolean | null;
};

type ApiBookDetail = {
  id: string;
  type: "book";
  title: string | null;
  short_description: string | null;
  slug?: string | null;
  excerpt: string | null;
  status: string | null;
  is_paid: boolean;
  price: number | null;
  has_purchased?: boolean;
  is_public: boolean;
  cover: ApiBookCover | null;
  creator: ApiBookCreator | null;
  description: string | null;
  allow_chapter_purchase: boolean | null;
  chapters?: ApiBookChapter[];
  like_count: number;
  comment_count: number;
  share_count: number;
  save_count: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
  published_at: string | null;
};

type ApiBookRead = {
  id: string;
  type: "book";
  title: string | null;
  short_description: string | null;
  excerpt: string | null;
  is_paid: boolean;
  price: number | null;
  cover: ApiBookCover | null;
  access: "full" | "preview";
  content_truncated: boolean;
  preview_percent: number | null;
  content: null;
  chapters: ApiBookChapter[];
};

function buildBookLabels(input: {
  isPaid: boolean;
  price: number | null;
  hasPurchased: boolean;
  isCertified: boolean;
}): PostLabel[] {
  const labels: PostLabel[] = [];

  if (input.hasPurchased) {
    labels.push({ type: "purchased" });
  }

  if (input.isPaid && input.price != null) {
    labels.push({
      type: "paid",
      amountCents: input.price,
      currency: "JPY",
    });
  }

  if (input.isCertified) {
    labels.push({ type: "expert" });
  }

  return labels;
}

function mapCreator(creator: ApiBookCreator | null): BookCreator {
  const username = creator?.username?.trim() || "creator";

  return {
    id: creator?.id ?? "",
    username,
    fullName: creator?.full_name?.trim() || null,
    avatarUrl: creator?.avatar_url ?? null,
    isCertified: creator?.is_certified ?? false,
  };
}

function contentToBlocks(
  content: string,
  editorMode: BookChapter["editorMode"]
): ArticleBlock[] {
  if (editorMode === "wysiwyg") {
    return [{ type: "richtext", html: content }];
  }

  return markdownToBlocks(content);
}

function mapChapter(chapter: ApiBookChapter, index: number): BookChapter {
  const editorMode = chapter.editor_mode ?? "markdown";
  const content = chapter.content?.trim() ?? "";

  return {
    id: chapter.id,
    title: chapter.title?.trim() || `Chapter ${index + 1}`,
    orderNumber: chapter.order_number ?? index + 1,
    editorMode,
    isFreePreview: chapter.is_free_preview ?? false,
    price: chapter.price ?? null,
    content,
    contentTruncated: chapter.content_truncated ?? false,
    blocks: contentToBlocks(content, editorMode),
  };
}

function sortChapters(chapters: BookChapter[]): BookChapter[] {
  return [...chapters].sort((a, b) => a.orderNumber - b.orderNumber);
}

type GetBookDetailOptions = {
  /** Bypass Next.js request memoization after purchase fulfillment. */
  fresh?: boolean;
};

export async function getBookDetailFromApi(
  bookId: string,
  token?: string | null,
  options?: GetBookDetailOptions
): Promise<BookDetail | null> {
  const accessToken = token?.trim() || undefined;
  const cacheBust = options?.fresh ? { _: Date.now() } : undefined;
  const [detailResult, readResult] = await Promise.all([
    apiRequest<ApiBookDetail>({
      path: `/contents/${bookId}`,
      method: "GET",
      token: accessToken,
      searchParams: cacheBust,
    }),
    apiRequest<ApiBookRead>({
      path: `/contents/${bookId}/read`,
      method: "GET",
      token: accessToken,
      searchParams: cacheBust,
    }),
  ]);

  if (!detailResult.ok || !readResult.ok) {
    return null;
  }

  const detail = detailResult.data;
  const read = readResult.data;

  if (detail.type !== "book" || read.type !== "book") {
    return null;
  }

  const creator = mapCreator(detail.creator);
  const chapters = sortChapters(read.chapters.map(mapChapter));
  const readTimeSource = chapters.map((chapter) => chapter.content).join(" ");

  return {
    id: detail.id,
    title: detail.title?.trim() || "無題のブック",
    shortDescription: detail.short_description?.trim() || "",
    description: detail.description?.trim() || detail.excerpt?.trim() || "",
    excerpt: detail.excerpt?.trim() || "",
    slug: detail.slug ?? null,
    coverImageUrl: detail.cover?.url ?? read.cover?.url ?? null,
    creator,
    labels: buildBookLabels({
      isPaid: detail.is_paid,
      price: detail.price,
      hasPurchased: detail.has_purchased ?? false,
      isCertified: creator.isCertified,
    }),
    isPaid: detail.is_paid,
    price: detail.price,
    allowChapterPurchase: detail.allow_chapter_purchase ?? false,
    access: read.access,
    contentTruncated: read.content_truncated,
    previewPercent: read.preview_percent,
    chapters,
    likeCount: detail.like_count,
    commentCount: detail.comment_count,
    shareCount: detail.share_count,
    saveCount: detail.save_count,
    likedByMe: detail.liked_by_me ?? false,
    savedByMe: detail.saved_by_me ?? false,
    publishedAt: detail.published_at,
    readTimeMinutes: calculateReadTime(readTimeSource),
  };
}
