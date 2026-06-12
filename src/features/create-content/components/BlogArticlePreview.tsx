"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  PostArticleAuthorMeta,
  PostArticleBody,
  PostArticleCover,
  PostArticleEngagementProvider,
  PostArticleHeader,
  PostArticleInlineActionBar,
} from "@/features/reading/components";

import { useCreateContentStore } from "../hooks/use-create-content-store";
import { usePreviewAuthorProfile } from "../hooks/use-preview-author-profile";
import { buildBlogPublishPreviewArticle } from "../lib/blog-publish-preview-article";

interface BlogArticlePreviewProps {
  pricingType?: "free" | "paid";
  priceYen?: number | null;
  showHumanWrittenBadge?: boolean;
}

export function BlogArticlePreview({
  pricingType = "free",
  priceYen,
  showHumanWrittenBadge = false,
}: BlogArticlePreviewProps) {
  const store = useCreateContentStore();
  const authorProfileQuery = usePreviewAuthorProfile();

  const article = useMemo(
    () =>
      buildBlogPublishPreviewArticle({
        title: store.title,
        shortDescription: store.shortDescription,
        content: store.content,
        editorMode: store.editorMode,
        coverPreviewUrl: store.coverPreviewUrl ?? store.coverImageUrl,
        draftId: store.draftId,
        showHumanWrittenBadge,
        pricingType,
        priceYen,
        authorProfile: authorProfileQuery.data ?? null,
      }),
    [
      authorProfileQuery.data,
      pricingType,
      priceYen,
      showHumanWrittenBadge,
      store.content,
      store.coverImageUrl,
      store.coverPreviewUrl,
      store.draftId,
      store.editorMode,
      store.shortDescription,
      store.title,
    ]
  );

  const hasContext = Boolean(store.field || store.tags.length > 0);

  return (
    <section
      className='BlogArticlePreview border-border bg-card overflow-hidden rounded-lg border'
      aria-label='Article preview'
    >
      <div className='border-border border-b px-5 py-3'>
        <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
          Preview
        </p>
        <p className='text-muted-foreground mt-1 text-sm'>
          How your draft will appear after publishing.
        </p>
      </div>

      <div className='max-h-[calc(100svh-13rem)] min-h-[520px] flex-1 overflow-y-auto px-6 py-6'>
        <PostArticleEngagementProvider
          postId={article.id}
          postTitle={article.title}
          clapCount={article.likeCount}
          commentCount={article.commentCount}
          repostCount={article.repostCount}
        >
          <article className='mx-auto w-full max-w-[760px] space-y-8'>
            <div className='space-y-5'>
              <PostArticleHeader article={article} />
              {hasContext ? (
                <div className='flex flex-wrap gap-2'>
                  {store.field ? (
                    <Badge variant='outline'>{store.field}</Badge>
                  ) : null}
                  {store.tags.map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <PostArticleAuthorMeta article={article} />
              <div className='pointer-events-none'>
                <PostArticleInlineActionBar />
              </div>
              <PostArticleCover article={article} />
            </div>
            <PostArticleBody article={article} isUnlocked />
          </article>
        </PostArticleEngagementProvider>
      </div>
    </section>
  );
}
