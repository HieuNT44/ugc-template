import type { FeaturedPost } from "./featured-post";

/** Post row in profile lists (Medium-style feed). */
export type UserPost = FeaturedPost & {
  authorDisplayName: string;
  authorSubtitle?: string | null;
  repostCount?: number;
  /** When set, row is shown in a repost feed with this date label. */
  repostedAt?: string | null;
  /** When true, hide the save action (post is already in the user's archive). */
  isSaved?: boolean;
  /** Override link target; defaults to `getPostHref(post)`. */
  href?: string | null;
};
