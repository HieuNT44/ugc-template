import { PostLabelList } from "@/core/components/post";

import type { PostArticle } from "../types/post-article";

interface PostArticleHeaderProps {
  article: PostArticle;
}

export function PostArticleHeader({ article }: PostArticleHeaderProps) {
  const hasLabels = article.labels.length > 0;

  return (
    <header className='PostArticleHeader'>
      {hasLabels ? (
        <PostLabelList
          labels={article.labels}
          badgeClassName='px-3 py-1.5 text-sm'
        />
      ) : null}

      <h1
        className={`text-foreground font-serif text-[clamp(1.875rem,4.5vw,2.75rem)] leading-[1.15] font-bold tracking-tight ${hasLabels ? "mt-5" : ""}`}
      >
        {article.title}
      </h1>

      {article.snippet ? (
        <p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
          {article.snippet}
        </p>
      ) : null}
    </header>
  );
}
