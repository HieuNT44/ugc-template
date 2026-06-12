"use client";

import { Bookmark, Heart, Link2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostArticleActionsProps {
  postTitle: string;
  className?: string;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden
      className={cn("size-4 fill-current", className)}
    >
      <path d='M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z' />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden
      className={cn("size-4 fill-current", className)}
    >
      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden
      className={cn("size-4 fill-current", className)}
    >
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  );
}

export function PostArticleActions({
  postTitle,
  className,
}: PostArticleActionsProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const actionButtonClass =
    "text-muted-foreground hover:text-foreground size-10 rounded-full";

  return (
    <aside
      className={cn("PostArticleActions", className)}
      aria-label='記事の操作'
    >
      <div className='border-border bg-background flex flex-row items-center justify-center gap-1 rounded-full border px-2 py-1 shadow-sm lg:flex-col lg:px-1 lg:py-2'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={cn(actionButtonClass, liked && "text-red-500")}
          aria-label={liked ? "いいねを取り消す" : "いいねする"}
          aria-pressed={liked}
          onClick={() => setLiked((value) => !value)}
        >
          <Heart className={cn("size-4", liked && "fill-red-500")} />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={cn(actionButtonClass, saved && "text-amber-500")}
          aria-label={saved ? "ブックマークを削除" : "記事をブックマーク"}
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          <Bookmark className={cn("size-4", saved && "fill-amber-400")} />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={actionButtonClass}
          aria-label='Facebookでシェア'
          asChild
        >
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FacebookIcon />
          </a>
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={actionButtonClass}
          aria-label='Xでシェア'
          asChild
        >
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(getShareUrl())}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <XIcon />
          </a>
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={actionButtonClass}
          aria-label='LinkedInでシェア'
          asChild
        >
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <LinkedinIcon />
          </a>
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={actionButtonClass}
          aria-label={copied ? "リンクをコピーしました" : "リンクをコピー"}
          onClick={handleCopyLink}
        >
          <Link2 className='size-4' />
        </Button>
      </div>
    </aside>
  );
}
