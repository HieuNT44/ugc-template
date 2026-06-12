import type { PublicProfileTabId } from "../types/public-profile";

export const PUBLIC_PROFILE_TAB_LABELS: Record<PublicProfileTabId, string> = {
  posts: "Posts",
  books: "Books",
  reposts: "Reposts",
};

export const PUBLIC_PROFILE_EMPTY_MESSAGES: Record<PublicProfileTabId, string> =
  {
    posts: "No published posts yet.",
    books: "No books published yet.",
    reposts: "No reposts yet.",
  };

export const PUBLIC_PROFILE_TABS: PublicProfileTabId[] = [
  "posts",
  "books",
  "reposts",
];
