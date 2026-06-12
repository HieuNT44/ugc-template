import type { FeedPost } from "./feed-post";
import type { ArticleBlock } from "./article-block";

/** Full post for the reading detail page. */
export type PostArticle = FeedPost & {
  slug: string;
  markdown: string;
  blocks: ArticleBlock[];
};

export const PAID_PREVIEW_RATIO = 0.3;
