import type { PostLabel } from "./post-label";

export type BookAuthor = {
  username: string;
  avatarUrl: string;
};

/** Long-form book row in profile lists (distinct from single posts). */
export type UserBook = {
  id: string;
  author: BookAuthor;
  title: string;
  subtitle?: string | null;
  description: string;
  coverImageUrl?: string | null;
  chapterCount: number;
  readerCount?: number;
  publishedAt: string;
  labels?: PostLabel[];
  /** Override link target; defaults to `getBookHref(book)`. */
  href?: string | null;
};
