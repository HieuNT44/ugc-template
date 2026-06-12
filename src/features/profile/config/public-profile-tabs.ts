import type { PublicProfileTabId } from "../types/public-profile";

export const PUBLIC_PROFILE_TAB_LABELS: Record<PublicProfileTabId, string> = {
  posts: "投稿",
  books: "ブック",
  reposts: "リポスト",
};

export const PUBLIC_PROFILE_EMPTY_MESSAGES: Record<PublicProfileTabId, string> =
  {
    posts: "公開済み投稿はまだありません。",
    books: "公開済みブックはまだありません。",
    reposts: "リポストはまだありません。",
  };

export const PUBLIC_PROFILE_TABS: PublicProfileTabId[] = [
  "posts",
  "books",
  "reposts",
];
