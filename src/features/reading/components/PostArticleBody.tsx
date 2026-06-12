import { isPaidPost } from "@/core/lib/post-labels";

import { splitBlocksForPreview } from "../lib/split-blocks-for-preview";
import type { PostArticle } from "../types/post-article";
import { PostArticleContent } from "./PostArticleContent";
import { PostArticlePaywallSection } from "./PostArticlePaywallSection";

interface PostArticleBodyProps {
  article: PostArticle;
  isUnlocked?: boolean;
}

export function PostArticleBody({
  article,
  isUnlocked = false,
}: PostArticleBodyProps) {
  const paid = isPaidPost(article.labels);
  const showPaywall = paid && !isUnlocked;
  const { visible, hidden } = splitBlocksForPreview(article.blocks);

  return (
    <div className='PostArticleBody'>
      <PostArticleContent blocks={visible} />

      {showPaywall && hidden.length > 0 ? (
        <PostArticlePaywallSection
          hiddenBlocks={hidden}
          postId={article.id}
          postSlug={article.slug}
          postTitle={article.title}
          labels={article.labels}
        />
      ) : null}

      {!showPaywall && hidden.length > 0 ? (
        <PostArticleContent blocks={hidden} />
      ) : null}
    </div>
  );
}
