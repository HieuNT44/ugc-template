"use client";

import { useState, type MouseEvent } from "react";
import {
  BookmarkPlus,
  Heart,
  MessageCircle,
  MoreHorizontal,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/core/auth/hooks/useSession";
import { cn } from "@/lib/utils";

import { formatCompactCount } from "../lib/format-count";
import { usePostArticleEngagement } from "./post-article-engagement-context";

export {
  PostArticleEngagementProvider,
  usePostArticleEngagement,
} from "./post-article-engagement-context";

const actionIconClass =
  "text-muted-foreground hover:text-foreground size-9 rounded-full";

const statButtonClass =
  "text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-sm px-0.5 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function PostArticleInlineActionBar() {
  const { isAuthenticated } = useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const {
    registerInlineBar,
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

  const handleProtectedLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      event.preventDefault();
      requireLogin();
    }
  };

  const handleProtectedMenuTriggerClick = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    if (!isAuthenticated) {
      event.preventDefault();
      requireLogin();
    }
  };

  return (
    <>
      <div
        ref={registerInlineBar}
        className='PostArticleActionBar border-border flex flex-wrap items-center justify-between gap-3 border-y py-3'
        aria-label='記事エンゲージメント'
      >
        <div className='flex flex-wrap items-center gap-4 sm:gap-5'>
          <button
            type='button'
            className={cn(statButtonClass, clapped && "text-foreground")}
            aria-label={clapped ? "いいねを取り消す" : "いいねする"}
            aria-pressed={clapped}
            onClick={() => {
              handleProtectedAction(toggleClapped);
            }}
          >
            <Heart
              className={cn(
                "size-[18px]",
                clapped && "fill-current text-red-500"
              )}
            />
            <span>{formatCompactCount(displayClapCount)}</span>
          </button>

          <Link
            href={commentsHref}
            className={statButtonClass}
            onClick={handleProtectedLinkClick}
          >
            <MessageCircle className='size-[18px]' aria-hidden />
            <span>{formatCompactCount(commentCount)}</span>
            <span className='sr-only'>comments</span>
          </Link>

          <button
            type='button'
            className={statButtonClass}
            aria-label={`${formatCompactCount(repostCount ?? 0)} reposts`}
            onClick={() => handleProtectedAction()}
          >
            <Repeat2 className='size-[18px]' aria-hidden />
            <span>{formatCompactCount(repostCount ?? 0)}</span>
          </button>
        </div>

        <div className='flex items-center gap-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className={cn(actionIconClass, saved && "text-foreground")}
            aria-label={saved ? "リストから削除" : "記事を保存"}
            aria-pressed={saved}
            onClick={() => {
              handleProtectedAction(toggleSaved);
            }}
          >
            <BookmarkPlus className='size-[18px]' />
          </Button>

          <Button
            type='button'
            variant='ghost'
            size='icon'
            className={actionIconClass}
            aria-label='記事をシェア'
            onClick={() => handleProtectedAction(handleShare)}
          >
            <Share2 className='size-[18px]' />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className={actionIconClass}
                aria-label='その他の操作'
                onClick={handleProtectedMenuTriggerClick}
              >
                <MoreHorizontal className='size-[18px]' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => handleProtectedAction(handleShare)}
              >
                リンクをコピー
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProtectedAction()}>
                このような記事を減らす
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProtectedAction()}>
                Report story
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className='PostArticleInlineLoginDialog sm:max-w-[420px]'>
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
