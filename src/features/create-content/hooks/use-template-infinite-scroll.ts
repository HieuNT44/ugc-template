"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  BLOG_TEMPLATES,
  TEMPLATE_PAGE_SIZE,
  type BlogTemplate,
} from "../lib/blog-templates";

export function useTemplateInfiniteScroll(pageSize = TEMPLATE_PAGE_SIZE) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleTemplates = BLOG_TEMPLATES.slice(0, visibleCount);
  const hasMore = visibleCount < BLOG_TEMPLATES.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + pageSize, BLOG_TEMPLATES.length)
      );
      setIsLoadingMore(false);
    }, 400);
  }, [hasMore, isLoadingMore, pageSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore, visibleCount]);

  return {
    visibleTemplates,
    hasMore,
    isLoadingMore,
    sentinelRef,
    totalCount: BLOG_TEMPLATES.length,
  };
}

export type { BlogTemplate };
