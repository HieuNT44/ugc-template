import { Heart, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { FeaturedPost } from "../../types/featured-post";
import { PostLabelList } from "./post-label-list";
import { PostThumbnail } from "./post-thumbnail";

interface FeaturedPostItemProps {
  post: FeaturedPost;
}

export function FeaturedPostItem({ post }: FeaturedPostItemProps) {
  const { author } = post;

  return (
    <article className='FeaturedPostItem px-4 py-5'>
      <div className='flex gap-3'>
        <Avatar className='ring-border mt-0.5 size-6 shrink-0 overflow-hidden rounded-full ring-1 after:hidden'>
          <AvatarImage src={author.avatarUrl} alt={author.username} />
          <AvatarFallback className='text-[10px]'>U</AvatarFallback>
        </Avatar>

        <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4'>
          <div className='min-w-0 flex-1 sm:order-1'>
            <p className='text-muted-foreground text-xs leading-snug'>
              <span className='text-foreground font-medium'>
                @{author.username}
              </span>
              {" posted on "}
              {post.publishedAt}
            </p>

            <h3 className='text-foreground mt-2 line-clamp-2 text-lg leading-snug font-bold'>
              {post.title}
            </h3>

            <p className='text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed'>
              {post.snippet}
            </p>
          </div>

          <PostThumbnail
            src={post.coverImageUrl}
            alt={post.title}
            className='sm:order-2'
          />

          <div className='FeaturedPostMeta text-muted-foreground flex w-full min-w-0 basis-full items-center gap-4 sm:order-3'>
            <span className='inline-flex shrink-0 items-center gap-1.5 text-sm'>
              <Heart className='size-4' aria-hidden />
              {post.likeCount}
            </span>
            <span className='inline-flex shrink-0 items-center gap-1.5 text-sm'>
              <MessageCircle className='size-4' aria-hidden />
              {post.commentCount}
            </span>
            <PostLabelList labels={post.labels} className='ml-auto' />
          </div>
        </div>
      </div>
    </article>
  );
}
