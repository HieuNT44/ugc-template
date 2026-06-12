"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  likeContentAction,
  recordContentShareAction,
  saveContentAction,
  unlikeContentAction,
  unsaveContentAction,
} from "../actions/content-engagement";
import { useIntersectionVisible } from "../hooks/use-intersection-visible";

export type PostArticleEngagementInput = {
  postId: string;
  postTitle: string;
  clapCount: number;
  commentCount: number;
  repostCount?: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  useApiEngagement?: boolean;
};

type PostArticleEngagementContextValue = PostArticleEngagementInput & {
  registerInlineBar: (element: HTMLDivElement | null) => void;
  isInlineBarVisible: boolean;
  showFloatingBar: boolean;
  clapped: boolean;
  toggleClapped: () => Promise<void>;
  saved: boolean;
  toggleSaved: () => Promise<void>;
  displayClapCount: number;
  commentCount: number;
  setCommentCount: (value: number | ((prev: number) => number)) => void;
  commentsHref: string;
  handleShare: () => Promise<void>;
};

const PostArticleEngagementContext =
  createContext<PostArticleEngagementContextValue | null>(null);

export function usePostArticleEngagement(): PostArticleEngagementContextValue {
  const context = useContext(PostArticleEngagementContext);
  if (!context) {
    throw new Error(
      "Post article engagement must be used within PostArticleEngagementProvider"
    );
  }
  return context;
}

export function PostArticleEngagementProvider({
  postId,
  postTitle,
  clapCount,
  commentCount: initialCommentCount,
  repostCount = 0,
  likedByMe = false,
  savedByMe = false,
  useApiEngagement = false,
  children,
}: PostArticleEngagementInput & { children: ReactNode }) {
  const [inlineBarElement, setInlineBarElement] =
    useState<HTMLDivElement | null>(null);
  const [clapped, setClapped] = useState(likedByMe);
  const [saved, setSaved] = useState(savedByMe);
  const [likeCount, setLikeCount] = useState(clapCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const getPageUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const isInlineBarVisible = useIntersectionVisible(inlineBarElement, {
    rootMargin: "-56px 0px 0px 0px",
    threshold: 0,
  });

  const showFloatingBar = !isInlineBarVisible;
  const displayClapCount = likeCount;
  const commentsHref = `#post-comments-${postId}`;

  const toggleClapped = useCallback(async () => {
    const next = !clapped;

    if (!useApiEngagement) {
      setClapped(next);
      setLikeCount((count) => count + (next ? 1 : -1));
      return;
    }

    setClapped(next);
    setLikeCount((count) => count + (next ? 1 : -1));

    const result = next
      ? await likeContentAction(postId)
      : await unlikeContentAction(postId);

    if (!result.ok) {
      setClapped(!next);
      setLikeCount((count) => count + (next ? -1 : 1));
      return;
    }

    setLikeCount(result.data.like_count);
    setClapped(result.data.liked);
  }, [clapped, postId, useApiEngagement]);

  const toggleSaved = useCallback(async () => {
    const next = !saved;

    if (!useApiEngagement) {
      setSaved(next);
      return;
    }

    setSaved(next);

    const result = next
      ? await saveContentAction(postId)
      : await unsaveContentAction(postId);

    if (!result.ok) {
      setSaved(!next);
      return;
    }

    setSaved(result.data.saved);
  }, [postId, saved, useApiEngagement]);

  const handleShare = useCallback(async () => {
    const url = getPageUrl();
    let shared = false;

    if (navigator.share) {
      try {
        await navigator.share({ title: postTitle, url });
        shared = true;
      } catch {
        // fall through to copy
      }
    }

    if (!shared) {
      try {
        await navigator.clipboard.writeText(url);
        shared = true;
      } catch {
        // clipboard unavailable
      }
    }

    if (shared && useApiEngagement) {
      await recordContentShareAction(postId);
    }
  }, [postId, postTitle, useApiEngagement]);

  const value = useMemo<PostArticleEngagementContextValue>(
    () => ({
      postId,
      postTitle,
      clapCount: likeCount,
      commentCount,
      repostCount,
      registerInlineBar: setInlineBarElement,
      isInlineBarVisible,
      showFloatingBar,
      clapped,
      toggleClapped,
      saved,
      toggleSaved,
      displayClapCount,
      setCommentCount,
      commentsHref,
      handleShare,
    }),
    [
      postId,
      postTitle,
      likeCount,
      commentCount,
      repostCount,
      isInlineBarVisible,
      showFloatingBar,
      clapped,
      toggleClapped,
      saved,
      toggleSaved,
      displayClapCount,
      commentsHref,
      handleShare,
    ]
  );

  return (
    <PostArticleEngagementContext.Provider value={value}>
      {children}
    </PostArticleEngagementContext.Provider>
  );
}
