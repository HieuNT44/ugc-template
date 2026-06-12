"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { ArticleTocItem } from "../types/article-block";
import { PostArticleTocList } from "./PostArticleTocList";

interface PostArticleTocProps {
  items: ArticleTocItem[];
  className?: string;
}

export function PostArticleToc({ items, className }: PostArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headingElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const nextId = visible[0]?.target.id;
        if (nextId) {
          setActiveId(nextId);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    for (const element of headingElements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn("PostArticleToc sticky top-20 self-start", className)}
      aria-label='目次'
    >
      <h2 className='text-foreground mb-4 text-base font-bold'>目次</h2>
      <PostArticleTocList
        items={items}
        activeId={activeId}
        onItemClick={setActiveId}
      />
    </nav>
  );
}
