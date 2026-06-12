import type { PostLabel } from "@/core/types/post-label";

import type { ArticleBlock } from "./article-block";

export type BookCreator = {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  isCertified: boolean;
};

export type BookChapter = {
  id: number;
  title: string;
  orderNumber: number;
  editorMode: "markdown" | "wysiwyg";
  isFreePreview: boolean;
  price: number | null;
  content: string;
  contentTruncated: boolean;
  blocks: ArticleBlock[];
};

export type BookDetail = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  excerpt: string;
  slug: string | null;
  coverImageUrl: string | null;
  creator: BookCreator;
  labels: PostLabel[];
  isPaid: boolean;
  price: number | null;
  allowChapterPurchase: boolean;
  access: "full" | "preview";
  contentTruncated: boolean;
  previewPercent: number | null;
  chapters: BookChapter[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  publishedAt: string | null;
  readTimeMinutes: number;
};
