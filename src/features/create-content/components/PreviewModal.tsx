"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  PostArticleAuthorMeta,
  PostArticleBody,
  PostArticleCover,
  PostArticleEngagementProvider,
  PostArticleHeader,
  PostArticleInlineActionBar,
} from "@/features/reading/components";

import { usePreviewAuthorProfile } from "../hooks/use-preview-author-profile";
import { buildBlogPublishPreviewArticle } from "../lib/blog-publish-preview-article";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  shortDescription?: string;
  field?: string;
  tags: string[];
  content: string;
  editorMode: "wysiwyg" | "markdown";
  coverPreviewUrl?: string | null;
}

export function PreviewModal({
  open,
  onOpenChange,
  title,
  shortDescription,
  field,
  tags,
  content,
  editorMode,
  coverPreviewUrl,
}: PreviewModalProps) {
  const authorProfileQuery = usePreviewAuthorProfile();

  const article = useMemo(
    () =>
      buildBlogPublishPreviewArticle({
        title,
        shortDescription,
        content,
        editorMode,
        coverPreviewUrl,
        authorProfile: authorProfileQuery.data ?? null,
      }),
    [
      authorProfileQuery.data,
      content,
      coverPreviewUrl,
      editorMode,
      shortDescription,
      title,
    ]
  );
  const hasContext = Boolean(field || tags.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='PreviewModal w-[80vw] max-w-none gap-0 overflow-hidden p-0 sm:max-w-none'
        style={{ maxWidth: "80vw", width: "80vw" }}
      >
        <SheetHeader className='border-border border-b px-6 py-4'>
          <SheetTitle>記事プレビュー</SheetTitle>
          <SheetDescription>
            Rendered with the same structure as the post detail page.
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto px-6 py-6'>
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
                    {field ? <Badge variant='outline'>{field}</Badge> : null}
                    {tags.map((tag) => (
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
      </SheetContent>
    </Sheet>
  );
}
