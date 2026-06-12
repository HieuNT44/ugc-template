"use client";

import { cn } from "@/lib/utils";

import type { ArticleTocItem } from "../types/article-block";

interface PostArticleTocListProps {
  items: ArticleTocItem[];
  activeId?: string | null;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function PostArticleTocList({
  items,
  activeId = null,
  onItemClick,
  className,
}: PostArticleTocListProps) {
  if (items.length === 0) {
    return null;
  }

  const numberedItems = items.reduce<
    Array<{ item: ArticleTocItem; sectionNumber: number | null }>
  >((acc, item) => {
    const previousSection =
      acc.length > 0 ? (acc[acc.length - 1]?.sectionNumber ?? 0) : 0;
    const sectionNumber = item.level === 2 ? previousSection + 1 : null;

    acc.push({ item, sectionNumber });
    return acc;
  }, []);

  return (
    <ol className={cn("space-y-3 text-sm leading-snug", className)}>
      {numberedItems.map(({ item, sectionNumber }) => {
        const isActive = activeId === item.id;

        return (
          <li
            key={item.id}
            className={cn(
              item.level === 2 && "ml-0",
              item.level === 3 && "ml-3",
              item.level === 4 && "ml-6"
            )}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "block no-underline transition-colors",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onItemClick?.(item.id)}
            >
              {sectionNumber !== null ? `${sectionNumber}. ` : ""}
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
