import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isPaidPost } from "@/core/lib/post-labels";

import { extractTocItems } from "../lib/article-block-utils";
import { splitBlocksForPreview } from "../lib/split-blocks-for-preview";
import type { PostArticle } from "../types/post-article";
import {
  PostArticleEngagementProvider,
  PostArticleFloatingActionRail,
  PostArticleInlineActionBar,
} from "./PostArticleActionBar";
import { PostArticleAuthorMeta } from "./PostArticleAuthorMeta";
import { PostArticleBody } from "./PostArticleBody";
import { PostArticleComments } from "./PostArticleComments";
import { PostArticleCover } from "./PostArticleCover";
import { PostArticleHeader } from "./PostArticleHeader";
import { PostArticleRecommended } from "./PostArticleRecommended";
import { PostArticleToc } from "./PostArticleToc";

type ArticleReader = {
  name: string;
  avatarUrl?: string | null;
};

interface PostArticleViewProps {
  article: PostArticle;
  isUnlocked?: boolean;
  stripeCanceled?: boolean;
  purchaseSuccess?: boolean;
  currentReader?: ArticleReader;
  useApiEngagement?: boolean;
  likedByMe?: boolean;
  savedByMe?: boolean;
}

export function PostArticleView({
  article,
  isUnlocked = false,
  stripeCanceled = false,
  purchaseSuccess = false,
  currentReader,
  useApiEngagement = false,
  likedByMe = false,
  savedByMe = false,
}: PostArticleViewProps) {
  const paid = isPaidPost(article.labels);
  const showPaywall = paid && !isUnlocked;
  const { visible } = splitBlocksForPreview(article.blocks);
  const tocItems = extractTocItems(showPaywall ? visible : article.blocks);
  return (
    <PostArticleEngagementProvider
      postId={article.id}
      postTitle={article.title}
      clapCount={article.likeCount}
      commentCount={article.commentCount}
      repostCount={article.repostCount ?? 0}
      likedByMe={likedByMe}
      savedByMe={savedByMe}
      useApiEngagement={useApiEngagement}
    >
      <div className='PostArticleView w-full overflow-visible'>
        <div className='px-4 py-8 lg:px-6 lg:py-10'>
          <div className='PostArticleViewLayout relative mx-auto w-full max-w-[720px] overflow-visible'>
            <div className='PostArticleViewActionSlot pointer-events-none absolute inset-y-0 right-full z-30 mt-8 hidden w-full max-w-fit justify-end pr-8 lg:flex xl:mt-10'>
              <PostArticleFloatingActionRail />
            </div>

            <aside className='PostArticleViewToc absolute inset-y-0 left-full z-10 ml-8 hidden w-[240px] lg:block'>
              <PostArticleToc
                items={tocItems}
                className='pointer-events-auto'
              />
            </aside>

            <article className='PostArticleViewMain min-w-0 space-y-8 pb-24 lg:pb-0'>
              {purchaseSuccess ? (
                <Alert className='PostArticleViewSuccess border-green-500/50 bg-green-500/5'>
                  <AlertTitle>Purchase complete</AlertTitle>
                  <AlertDescription>
                    You now have full access to this story. Enjoy reading.
                  </AlertDescription>
                </Alert>
              ) : null}

              {stripeCanceled ? (
                <Alert
                  variant='destructive'
                  className='PostArticleViewCanceled'
                >
                  <AlertTitle>Checkout canceled</AlertTitle>
                  <AlertDescription>
                    Payment was not completed. You can try again when you are
                    ready.
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className='space-y-5'>
                <PostArticleHeader article={article} />
                <PostArticleAuthorMeta article={article} />
                <PostArticleInlineActionBar />
                <PostArticleCover article={article} />
              </div>

              <PostArticleBody article={article} isUnlocked={isUnlocked} />
            </article>
          </div>
        </div>

        <PostArticleComments
          postId={article.id}
          currentReader={currentReader}
          useApiEngagement={useApiEngagement}
        />

        <PostArticleRecommended currentPostId={article.id} />
      </div>
    </PostArticleEngagementProvider>
  );
}
