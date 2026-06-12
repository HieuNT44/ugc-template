import { PostThumbnail } from "@/core/components/post";

import type { PostArticle } from "../types/post-article";

interface PostArticleCoverProps {
  article: PostArticle;
}

export function PostArticleCover({ article }: PostArticleCoverProps) {
  const coverImageUrl = article.coverImageUrl?.trim();
  const heroClassName =
    "aspect-[16/9] h-auto min-h-[220px] w-full rounded-sm sm:w-full";

  if (!coverImageUrl) {
    return null;
  }

  return (
    <div className='PostArticleCover overflow-hidden'>
      <PostThumbnail
        src={coverImageUrl}
        alt={article.title}
        className={heroClassName}
      />
    </div>
  );
}
