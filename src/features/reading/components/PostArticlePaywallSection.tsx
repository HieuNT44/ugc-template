import type { ArticleBlock } from "../types/article-block";
import type { PostLabel } from "@/core/types/post-label";
import { PostArticleContent } from "./PostArticleContent";
import { PostPaywall } from "./PostPaywall";

interface PostArticlePaywallSectionProps {
  hiddenBlocks: ArticleBlock[];
  postId: string;
  postSlug: string;
  postTitle: string;
  labels: PostLabel[];
}

/** Medium-style fade from preview into paywall CTA. */
export function PostArticlePaywallSection({
  hiddenBlocks,
  postId,
  postSlug,
  postTitle,
  labels,
}: PostArticlePaywallSectionProps) {
  return (
    <section className='PostArticlePaywallSection relative mt-6'>
      <div
        className='pointer-events-none relative max-h-[300px] overflow-hidden select-none'
        aria-hidden
      >
        <div
          className='text-foreground/20 blur-[2px]'
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 40%, transparent 78%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 40%, transparent 78%)",
          }}
        >
          <PostArticleContent blocks={hiddenBlocks} />
        </div>
        <div className='from-background/0 via-background/80 to-background pointer-events-none absolute inset-0 bg-gradient-to-b' />
      </div>

      <div className='bg-background relative -mt-2 px-2 pt-10 pb-6 sm:px-0'>
        <PostPaywall
          postId={postId}
          postSlug={postSlug}
          postTitle={postTitle}
          labels={labels}
        />
      </div>
    </section>
  );
}
