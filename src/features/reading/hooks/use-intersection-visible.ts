"use client";

import { useEffect, useState } from "react";

type UseIntersectionVisibleOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * Returns true while the observed element intersects the viewport.
 */
export function useIntersectionVisible(
  element: HTMLElement | null,
  options: UseIntersectionVisibleOptions = {}
): boolean {
  const { rootMargin = "0px", threshold = 0 } = options;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? false);
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, rootMargin, threshold]);

  return isVisible;
}
