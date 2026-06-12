import { buildPostSlug } from "./post-slug";
import type { UserPost } from "../types/user-post";

type PostHrefInput = Pick<UserPost, "id" | "title" | "author"> & {
  href?: string | null;
};

/** Resolves the canonical URL for a post row (public article or draft editor). */
export function getPostHref(
  post: PostHrefInput,
  options?: { isDraft?: boolean }
): string {
  if (post.href) {
    return post.href;
  }
  if (options?.isDraft) {
    return `/studio/posts`;
  }
  return `/${buildPostSlug(post.title, post.id)}`;
}

/** Public profile URL for a post author. */
export function getAuthorProfileHref(username: string): string {
  return `/@${encodeURIComponent(username)}`;
}
