"use client";

import { Bookmark, Heart, MessageCircle, Repeat2 } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/core/auth/hooks/useSession";
import { PostLabelList, PostThumbnail } from "@/core/components/post";
import { getAuthorProfileHref, getPostHref } from "@/core/lib/post-href";
import { cn } from "@/lib/utils";

import { formatCompactCount } from "../lib/format-count";
import type { FeedPost } from "../types/feed-post";

const feedStatClass =
  "text-muted-foreground inline-flex items-center gap-1.5 text-sm";

const feedActionIconClass =
  "text-muted-foreground hover:text-foreground size-9 rounded-full";

interface FeedPostItemProps {
  post: FeedPost;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  onRequireLogin?: () => void;
}

export function FeedPostItem({
  post,
  isSaved = false,
  onSaveToggle,
  onRequireLogin,
}: FeedPostItemProps) {
  const { isAuthenticated } = useSession();
  const { author } = post;
  const postHref = getPostHref(post);
  const commentsHref = `${postHref}#post-comments-${post.id}`;
  const authorProfileHref = getAuthorProfileHref(author.username);
  const initials = author.username.slice(0, 1).toUpperCase();
  const tagNames = post.tagNames ?? [];

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      onRequireLogin?.();
      return;
    }

    onSaveToggle?.();
  };

  return (
    <article className='FeedPostItem border-border border-b py-8 first:pt-2 last:border-b-0'>
      <div className='flex gap-6'>
        <div className='min-w-0 flex-1'>
          <div className='mb-3 flex items-center gap-2'>
            <Avatar className='border-border bg-background size-5 shrink-0 overflow-hidden rounded-full border after:hidden'>
              <AvatarImage src={author.avatarUrl} alt={author.username} />
              <AvatarFallback className='text-[9px]'>{initials}</AvatarFallback>
            </Avatar>
            <p className='text-foreground min-w-0 truncate text-[13px] leading-none'>
              <Link
                href={authorProfileHref}
                className='focus-visible:ring-ring/50 font-medium no-underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:outline-none'
              >
                {post.authorDisplayName}
              </Link>
            </p>
          </div>

          <Link
            href={postHref}
            className='FeedPostItemLink group focus-visible:ring-ring/50 block cursor-pointer no-underline outline-none focus-visible:ring-3'
          >
            <h2 className='text-foreground font-serif text-xl leading-snug font-bold tracking-tight group-hover:underline group-hover:underline-offset-4 sm:text-[22px]'>
              {post.title}
            </h2>
            <p className='text-muted-foreground mt-2 line-clamp-2 text-base leading-relaxed'>
              {post.snippet}
            </p>
          </Link>

          <div className='text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]'>
            <span>
              {post.publishedAt}
              <span aria-hidden> · </span>
              {post.readTimeMinutes} min read
            </span>
            {post.labels.length > 0 ? (
              <PostLabelList labels={post.labels} className='gap-1' />
            ) : null}
          </div>

          {tagNames.length > 0 ? (
            <div className='FeedPostItemTags mt-3 flex flex-wrap gap-2'>
              {tagNames.map((tagName) => (
                <span
                  key={tagName}
                  className='border-border bg-muted/50 text-muted-foreground rounded-full border px-2.5 py-1 text-[12px] leading-none'
                >
                  #{tagName}
                </span>
              ))}
            </div>
          ) : null}

          <div className='FeedPostItemFooter mt-4 flex items-center justify-between gap-3'>
            <div className='flex flex-wrap items-center gap-4 sm:gap-5'>
              <span
                className={feedStatClass}
                aria-label={`${formatCompactCount(post.likeCount)} likes`}
              >
                <Heart className='size-[18px]' aria-hidden />
                {formatCompactCount(post.likeCount)}
              </span>
              <Link
                href={commentsHref}
                className={feedStatClass}
                aria-label={`${formatCompactCount(post.commentCount ?? 0)} comments`}
              >
                <MessageCircle className='size-[18px]' aria-hidden />
                {formatCompactCount(post.commentCount ?? 0)}
              </Link>
              <span
                className={feedStatClass}
                aria-label={`${formatCompactCount(post.repostCount ?? 0)} reposts`}
              >
                <Repeat2 className='size-[18px]' aria-hidden />
                {formatCompactCount(post.repostCount ?? 0)}
              </span>
            </div>

            <div className='flex shrink-0 items-center gap-0.5'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className={cn(feedActionIconClass, isSaved && "text-amber-500")}
                onClick={handleSaveClick}
                aria-label={isSaved ? "保存から削除" : "記事を保存"}
                aria-pressed={isSaved}
              >
                <Bookmark
                  className={cn(
                    "size-[18px]",
                    isSaved && "fill-amber-400 text-amber-500"
                  )}
                />
              </Button>
            </div>
          </div>
        </div>

        <Link
          href={postHref}
          className='FeedPostItemThumbLink hidden shrink-0 cursor-pointer sm:block'
          aria-label={`Open ${post.title}`}
        >
          <PostThumbnail
            src={post.coverImageUrl}
            alt={post.title}
            className='h-[135px] w-[220px] shrink-0 rounded-sm sm:w-[220px]'
          />
        </Link>
      </div>
    </article>
  );
}
