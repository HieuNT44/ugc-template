import type { PostLabel } from "./post-label";

export type FeaturedPostAuthor = {
  id?: string;
  username: string;
  avatarUrl: string;
};

export type FeaturedPost = {
  id: string;
  author: FeaturedPostAuthor;
  publishedAt: string;
  title: string;
  snippet: string;
  coverImageUrl?: string | null;
  likeCount: number;
  commentCount: number;
  labels: PostLabel[];
  tagNames?: string[];
};
