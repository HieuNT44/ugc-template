"use client";

import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { getAuthorProfileHref, getPostHref } from "../../lib/post-href";
import type { UserPost } from "../../types/user-post";
import { PostLabelList } from "./post-label-list";
import { PostThumbnail } from "./post-thumbnail";

interface ProfilePostListItemProps {
  post: UserPost;
  showDraftBadge?: boolean;
  showSaveButton?: boolean;
  showEngagementStats?: boolean;
  showThumbnail?: boolean;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export function ProfilePostListItem({
  post,
  showDraftBadge = false,
  showSaveButton = true,
  showEngagementStats = true,
  showThumbnail = true,
  isSaved = false,
  onSaveToggle,
}: ProfilePostListItemProps) {
  const { author } = post;
  const postHref = getPostHref(post, { isDraft: showDraftBadge });
  const authorProfileHref = getAuthorProfileHref(author.username);

  return (
    <article className='ProfilePostListItem px-4 py-5'>
      <div className='flex gap-3'>
        <Avatar className='ring-border mt-0.5 size-6 shrink-0 overflow-hidden rounded-full ring-1 after:hidden'>
          <AvatarImage src={author.avatarUrl} alt={author.username} />
          <AvatarFallback className='text-[10px]'>U</AvatarFallback>
        </Avatar>

        <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4'>
          {post.repostedAt ? (
            <p className='text-muted-foreground w-full min-w-0 basis-full text-xs leading-snug'>
              Reposted · {post.repostedAt}
            </p>
          ) : null}

          <p className='text-muted-foreground w-full min-w-0 basis-full text-xs leading-snug'>
            <Link
              href={authorProfileHref}
              className='text-foreground focus-visible:ring-ring/50 font-medium no-underline hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:outline-none'
            >
              @{author.username}
            </Link>
            <span> · {post.publishedAt}</span>
          </p>

          <Link
            href={postHref}
            className={cn(
              "ProfilePostListItemLink text-foreground focus-visible:ring-ring/50 flex min-w-0 flex-1 cursor-pointer flex-col gap-3 rounded-md no-underline transition-opacity outline-none hover:opacity-90 focus-visible:ring-3",
              showThumbnail && "sm:flex-row sm:gap-4"
            )}
          >
            <div className='min-w-0 flex-1'>
              <PostLabelList labels={post.labels} className='mt-0' />

              <h3 className='text-foreground mt-2 line-clamp-2 text-xl leading-snug font-bold'>
                {post.title}
              </h3>

              <p className='text-muted-foreground mt-1 line-clamp-2 text-base leading-relaxed'>
                {post.snippet}
              </p>

              {showDraftBadge ? (
                <span className='bg-muted text-muted-foreground mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium'>
                  下書き
                </span>
              ) : null}
            </div>

            {showThumbnail ? (
              <PostThumbnail
                src={post.coverImageUrl}
                alt={post.title}
                className='shrink-0'
              />
            ) : null}
          </Link>

          {showEngagementStats ? (
            <div className='ProfilePostMeta text-muted-foreground flex w-full min-w-0 basis-full flex-wrap items-center gap-3'>
              <span className='inline-flex shrink-0 items-center gap-1.5 text-sm'>
                <Heart className='size-4' aria-hidden />
                {post.likeCount}
              </span>
              <span className='inline-flex shrink-0 items-center gap-1.5 text-sm'>
                <MessageCircle className='size-4' aria-hidden />
                {post.commentCount}
              </span>
              {(post.repostCount ?? 0) > 0 ? (
                <span className='inline-flex shrink-0 items-center gap-1.5 text-sm'>
                  <Repeat2 className='size-4' aria-hidden />
                  {post.repostCount}
                </span>
              ) : null}

              <div className='ml-auto flex shrink-0 items-center gap-1'>
                {showSaveButton ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className={cn(
                      "size-8",
                      isSaved
                        ? "text-amber-500 hover:text-amber-500"
                        : "text-muted-foreground"
                    )}
                    onClick={onSaveToggle}
                    aria-label={isSaved ? "保存から削除" : "投稿を保存"}
                    aria-pressed={isSaved}
                  >
                    <Bookmark
                      className={cn(
                        "size-4",
                        isSaved && "fill-amber-400 text-amber-500"
                      )}
                    />
                  </Button>
                ) : null}
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='text-muted-foreground size-8'
                  aria-label='その他の操作'
                >
                  <MoreHorizontal className='size-4' />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
