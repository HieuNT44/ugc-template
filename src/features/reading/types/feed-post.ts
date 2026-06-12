import type { UserPost } from "@/core/types";

/** Story row in the home reading feed (Medium-style). */
export type FeedPost = UserPost & {
  readTimeMinutes: number;
};

export type FeedTabId = "blog" | "book" | "report";
