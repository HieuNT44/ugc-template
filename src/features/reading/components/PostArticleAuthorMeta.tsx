"use client";

import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getAuthorProfileHref } from "@/core/lib/post-href";

import type { PostArticle } from "../types/post-article";

interface PostArticleAuthorMetaProps {
  article: PostArticle;
}

export function PostArticleAuthorMeta({ article }: PostArticleAuthorMetaProps) {
  const { isAuthenticated, session } = useSession();
  const { author } = article;
  const authorProfileHref = getAuthorProfileHref(author.username);
  const authorLine = article.authorSubtitle
    ? `${article.authorDisplayName} — ${article.authorSubtitle}`
    : article.authorDisplayName;
  const initials = article.authorDisplayName.slice(0, 1).toUpperCase();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const isOwnArticle =
    Boolean(session?.user?.id) && session?.user?.id === author.id;

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setIsFollowing((value) => !value);
  };

  return (
    <>
      <div className='PostArticleAuthorMeta flex flex-wrap items-center gap-x-3 gap-y-3'>
        <Link
          href={authorProfileHref}
          className='focus-visible:ring-ring/50 flex min-w-0 items-center gap-2.5 no-underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:outline-none'
        >
          <Avatar className='size-6 shrink-0 overflow-hidden rounded-full after:hidden'>
            <AvatarImage
              src={author.avatarUrl}
              alt={article.authorDisplayName}
            />
            <AvatarFallback className='text-[10px]'>{initials}</AvatarFallback>
          </Avatar>
          <span className='text-foreground text-sm font-medium'>
            {authorLine}
          </span>
        </Link>

        {!isOwnArticle ? (
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 rounded-full px-4 text-sm font-medium'
            aria-pressed={isFollowing}
            onClick={handleFollowClick}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        ) : null}

        <p className='text-muted-foreground text-sm'>
          {article.readTimeMinutes} min read
          <span aria-hidden> · </span>
          {article.publishedAt}
        </p>
      </div>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className='PostArticleFollowLoginDialog sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              You need to sign in before following this creator.
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
              <Link href='/login'>Login</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
