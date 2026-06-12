"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  BookmarkPlus,
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/core/auth/hooks/useSession";
import { cn } from "@/lib/utils";

import { formatCompactCount } from "../lib/format-count";
import { usePostArticleEngagement } from "./post-article-engagement-context";

const floatingActionBtnClass =
  "PostArticleFloatingActionBtn flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

const floatingPillClass =
  "PostArticleFloatingActionPill border-actions bg-background pointer-events-auto flex w-fit items-center rounded-[50px] border p-2";

interface PostArticleFloatingActionRailProps {
  className?: string;
}

function FloatingActionIconButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type='button'
      className={cn(floatingActionBtnClass, pressed && "text-foreground")}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function PostArticleFloatingActionRail({
  className,
}: PostArticleFloatingActionRailProps) {
  const { isAuthenticated } = useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const {
    showFloatingBar,
    clapped,
    toggleClapped,
    saved,
    toggleSaved,
    displayClapCount,
    commentCount,
    repostCount,
    commentsHref,
    handleShare,
  } = usePostArticleEngagement();

  const visibilityClass = cn(
    "transition-all duration-300 ease-out motion-reduce:transition-none",
    showFloatingBar
      ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
      : "pointer-events-none translate-y-1 scale-95 opacity-0"
  );

  const mobileBarClass = cn(
    floatingPillClass,
    "w-full max-w-md flex-row justify-around shadow-sm",
    visibilityClass
  );

  const desktopPillClass = cn(floatingPillClass, "flex-col", visibilityClass);

  const requireLogin = () => {
    setLoginDialogOpen(true);
  };

  const handleProtectedAction = (action?: () => void | Promise<void>) => {
    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    void action?.();
  };

  const handleProtectedLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!isAuthenticated) {
      event.preventDefault();
      requireLogin();
    }
  };

  return (
    <>
      <div
        className={cn(
          "PostArticleFloatingActionRail sticky top-24 z-30 hidden w-full max-w-fit justify-end self-start lg:flex",
          className
        )}
        aria-hidden={!showFloatingBar}
        aria-label='記事のフローティング操作'
      >
        <div className={desktopPillClass}>
          <FloatingActionIconButton
            label={clapped ? "いいねを取り消す" : "いいねする"}
            pressed={clapped}
            onClick={() => {
              handleProtectedAction(toggleClapped);
            }}
          >
            <Heart
              className={cn("size-5", clapped && "fill-current text-red-500")}
            />
            <span className='sr-only'>
              {formatCompactCount(displayClapCount)}
            </span>
          </FloatingActionIconButton>

          <Link
            href={commentsHref}
            className={floatingActionBtnClass}
            aria-label={`${formatCompactCount(commentCount)} comments`}
            onClick={handleProtectedLinkClick}
          >
            <MessageCircle className='size-5' aria-hidden />
          </Link>

          <FloatingActionIconButton
            label={`${formatCompactCount(repostCount ?? 0)} reposts`}
            onClick={() => handleProtectedAction()}
          >
            <Repeat2 className='size-5' aria-hidden />
          </FloatingActionIconButton>

          <FloatingActionIconButton
            label={saved ? "リストから削除" : "記事を保存"}
            pressed={saved}
            onClick={() => {
              handleProtectedAction(toggleSaved);
            }}
          >
            <BookmarkPlus className='size-5' />
          </FloatingActionIconButton>

          <FloatingActionIconButton
            label='記事をシェア'
            onClick={() => handleProtectedAction(handleShare)}
          >
            <Share2 className='size-5' />
          </FloatingActionIconButton>
        </div>
      </div>

      <div
        className={cn(
          "PostArticleFloatingActionBar fixed inset-x-4 bottom-6 z-30 mx-auto flex justify-center lg:hidden",
          showFloatingBar
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
        aria-hidden={!showFloatingBar}
      >
        <div className={mobileBarClass} aria-label='記事のフローティング操作'>
          <FloatingActionIconButton
            label={clapped ? "いいねを取り消す" : "いいねする"}
            pressed={clapped}
            onClick={() => {
              handleProtectedAction(toggleClapped);
            }}
          >
            <Heart
              className={cn("size-5", clapped && "fill-current text-red-500")}
            />
          </FloatingActionIconButton>

          <Link
            href={commentsHref}
            className={floatingActionBtnClass}
            aria-label='コメントを見る'
            onClick={handleProtectedLinkClick}
          >
            <MessageCircle className='size-5' />
          </Link>

          <FloatingActionIconButton
            label={saved ? "リストから削除" : "記事を保存"}
            pressed={saved}
            onClick={() => {
              handleProtectedAction(toggleSaved);
            }}
          >
            <BookmarkPlus className='size-5' />
          </FloatingActionIconButton>

          <FloatingActionIconButton
            label='記事をシェア'
            onClick={() => handleProtectedAction(handleShare)}
          >
            <Share2 className='size-5' />
          </FloatingActionIconButton>
        </div>
      </div>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className='PostArticleLoginDialog sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              You need to sign in before interacting with this story.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setLoginDialogOpen(false)}
            >
              Later
            </Button>
            <Button asChild>
              <Link href='/login'>ログイン</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
