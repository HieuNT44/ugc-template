import Link from "next/link";
import {
  BookmarkPlus,
  Heart,
  MessageCircle,
  MinusCircle,
  Repeat2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostThumbnail } from "@/core/components/post";
import { getAuthorProfileHref, getPostHref } from "@/core/lib/post-href";
import { listLatestFeedContentsAction } from "../actions/list-feed-contents";
import { formatCompactCount } from "../lib/format-count";
import type { FeedPost } from "../types/feed-post";

const recommendedStatClass =
  "text-muted-foreground inline-flex items-center gap-1.5 text-sm";

const recommendedActionIconClass =
  "text-muted-foreground hover:text-foreground size-9 rounded-full";

interface PostArticleRecommendedProps {
  currentPostId: string;
}

function RecommendedCard({ post }: { post: FeedPost }) {
  const { author } = post;
  const initials = author.username.slice(0, 1).toUpperCase();

  return (
    <article className='RecommendedCard flex flex-col'>
      <Link
        href={getPostHref(post)}
        className='focus-visible:ring-ring/50 mb-3 block overflow-hidden rounded-sm focus-visible:ring-3 focus-visible:outline-none'
      >
        <PostThumbnail
          src={post.coverImageUrl}
          alt={post.title}
          className='aspect-[16/10] h-auto w-full sm:w-full'
        />
      </Link>

      <div className='mb-2 flex min-w-0 items-center gap-2'>
        <Avatar className='size-5 shrink-0 overflow-hidden rounded-full after:hidden'>
          <AvatarImage src={author.avatarUrl} alt={author.username} />
          <AvatarFallback className='text-[9px]'>{initials}</AvatarFallback>
        </Avatar>
        <p className='text-muted-foreground min-w-0 truncate text-[13px]'>
          <Link
            href={getAuthorProfileHref(author.username)}
            className='text-foreground font-medium no-underline hover:underline'
          >
            {post.authorDisplayName}
          </Link>
          <span aria-hidden> · </span>
          {post.publishedAt}
        </p>
      </div>

      <Link
        href={getPostHref(post)}
        className='group focus-visible:ring-ring/50 block no-underline focus-visible:ring-3 focus-visible:outline-none'
      >
        <h3 className='text-foreground group-hover:text-primary line-clamp-2 font-serif text-lg leading-snug font-bold transition-colors'>
          {post.title}
        </h3>
        <p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed'>
          {post.snippet}
        </p>
      </Link>

      <div className='RecommendedCardActions mt-4 flex items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-4 sm:gap-5'>
          <span
            className={recommendedStatClass}
            aria-label={`${formatCompactCount(post.likeCount)} likes`}
          >
            <Heart className='size-[18px]' aria-hidden />
            {formatCompactCount(post.likeCount)}
          </span>
          <span
            className={recommendedStatClass}
            aria-label={`${formatCompactCount(post.commentCount ?? 0)} comments`}
          >
            <MessageCircle className='size-[18px]' aria-hidden />
            {formatCompactCount(post.commentCount ?? 0)}
          </span>
          <span
            className={recommendedStatClass}
            aria-label={`${formatCompactCount(post.repostCount ?? 0)} reposts`}
          >
            <Repeat2 className='size-[18px]' aria-hidden />
            {formatCompactCount(post.repostCount ?? 0)}
          </span>
        </div>

        <div className='flex items-center gap-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className={recommendedActionIconClass}
            aria-label='記事を保存'
          >
            <BookmarkPlus className='size-[18px]' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className={recommendedActionIconClass}
            aria-label='このような記事を減らす'
          >
            <MinusCircle className='size-[18px]' />
          </Button>
        </div>
      </div>
    </article>
  );
}

export async function PostArticleRecommended({
  currentPostId,
}: PostArticleRecommendedProps) {
  const recommended = await listLatestFeedContentsAction({
    excludeId: currentPostId,
    perPage: 4,
  });

  if (recommended.length === 0) {
    return null;
  }

  return (
    <section className='PostArticleRecommended border-border w-full border-t'>
      <div className='mx-auto w-full max-w-[720px] px-4 pt-12 pb-16 lg:px-6'>
        <h2 className='text-foreground mb-8 font-serif text-xl font-bold tracking-tight'>
          あなたへのおすすめ
        </h2>
        <div className='grid gap-10 sm:grid-cols-2'>
          {recommended.map((post) => (
            <RecommendedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
