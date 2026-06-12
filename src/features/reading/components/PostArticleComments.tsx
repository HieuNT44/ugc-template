"use client";

import Link from "next/link";
import { Heart, MessageCircle, MoreHorizontal, Shield } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAuthorProfileHref } from "@/core/lib/post-href";
import { cn } from "@/lib/utils";

import {
  createContentCommentAction,
  listContentCommentsAction,
} from "../actions/content-engagement";
import { formatCompactCount } from "../lib/format-count";
import {
  getMockCommentCount,
  getMockCommentsForPost,
} from "../lib/mock-article-comments";
import type { PostComment } from "../types/post-comment";
import { usePostArticleEngagement } from "./post-article-engagement-context";

type CurrentReader = {
  name: string;
  avatarUrl?: string | null;
};

interface PostArticleCommentsProps {
  postId: string;
  currentReader?: CurrentReader;
  useApiEngagement?: boolean;
}

const commentStatClass =
  "text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

function CommentReplyInput({
  currentReader,
  placeholder = "Write a reply…",
}: {
  currentReader: CurrentReader;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const readerInitials = currentReader.name.slice(0, 1).toUpperCase();

  return (
    <div className='CommentReplyInput flex gap-3'>
      <Avatar className='size-8 shrink-0 overflow-hidden rounded-full after:hidden'>
        <AvatarImage
          src={currentReader.avatarUrl ?? undefined}
          alt={currentReader.name}
        />
        <AvatarFallback className='text-[10px]'>
          {readerInitials}
        </AvatarFallback>
      </Avatar>
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        rows={2}
        className='border-border bg-muted/50 min-h-[72px] resize-none text-sm'
        aria-label='Write a reply'
      />
    </div>
  );
}

function CommentItem({
  comment,
  currentReader,
  isReply = false,
}: {
  comment: PostComment;
  currentReader: CurrentReader;
  isReply?: boolean;
}) {
  const { author } = comment;
  const initials = author.displayName.slice(0, 1).toUpperCase();
  const replies = comment.replies ?? [];
  const replyLabelCount = comment.replyCount ?? replies.length;
  const hasReplies = replyLabelCount > 0;
  const [repliesOpen, setRepliesOpen] = useState(false);

  return (
    <li
      className={cn(
        "PostCommentItem border-border border-b py-6 last:border-b-0",
        isReply && "border-b-0 py-4"
      )}
    >
      <div className='flex gap-3'>
        <Link href={getAuthorProfileHref(author.username)} className='shrink-0'>
          <Avatar className='size-9 overflow-hidden rounded-full after:hidden'>
            <AvatarImage
              src={author.avatarUrl || undefined}
              alt={author.displayName}
            />
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
        </Link>

        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex flex-wrap items-center gap-x-2 gap-y-1'>
            <Link
              href={getAuthorProfileHref(author.username)}
              className='text-foreground text-sm font-medium hover:underline'
            >
              {author.displayName}
            </Link>
            <span className='text-muted-foreground text-xs'>
              {comment.publishedAt}
            </span>
          </div>

          <p className='text-foreground text-sm leading-relaxed whitespace-pre-wrap'>
            {comment.body}
          </p>

          <div className='mt-3 flex items-center gap-4'>
            <button
              type='button'
              className={commentStatClass}
              aria-label='Like comment'
            >
              <Heart className='size-4' aria-hidden />
              <span>{formatCompactCount(comment.clapCount)}</span>
            </button>
            <button
              type='button'
              className={commentStatClass}
              aria-label='Reply'
            >
              <MessageCircle className='size-4' aria-hidden />
              <span>Reply</span>
            </button>
            <button
              type='button'
              className='text-muted-foreground hover:text-foreground ml-auto'
              aria-label='More options'
            >
              <MoreHorizontal className='size-4' />
            </button>
          </div>

          <div className='mt-3'>
            {hasReplies && !repliesOpen ? (
              <button
                type='button'
                className='text-muted-foreground hover:text-foreground text-sm font-medium'
                onClick={() => setRepliesOpen(true)}
              >
                {formatCompactCount(replyLabelCount)} repl
                {replyLabelCount === 1 ? "y" : "ies"}
              </button>
            ) : null}
          </div>

          {hasReplies && repliesOpen ? (
            <div
              id={`comment-replies-${comment.id}`}
              className='border-border mt-4 border-l-2 pl-4'
            >
              <CommentReplyInput currentReader={currentReader} />

              {replies.length > 0 ? (
                <ul className='PostCommentReplyList mt-4'>
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentReader={currentReader}
                      isReply
                    />
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function PostArticleComments({
  postId,
  currentReader = { name: "Reader" },
  useApiEngagement = false,
}: PostArticleCommentsProps) {
  const { commentCount, setCommentCount } = usePostArticleEngagement();
  const [comments, setComments] = useState<PostComment[]>(() =>
    useApiEngagement ? [] : getMockCommentsForPost(postId)
  );
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const readerInitials = currentReader.name.slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!useApiEngagement) {
      return;
    }

    let cancelled = false;

    void listContentCommentsAction(postId).then((loaded) => {
      if (!cancelled) {
        setComments(loaded);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [postId, useApiEngagement]);

  const totalCount = useApiEngagement
    ? commentCount
    : getMockCommentCount(postId);

  async function handleSubmit() {
    const trimmed = draft.trim();
    if (!trimmed || isSubmitting) {
      return;
    }

    if (!useApiEngagement) {
      setDraft("");
      return;
    }

    setIsSubmitting(true);

    const result = await createContentCommentAction(postId, trimmed);

    setIsSubmitting(false);

    if (!result.ok) {
      return;
    }

    setComments((prev) => [result.data, ...prev]);
    setCommentCount((count) => count + 1);
    setDraft("");
  }

  return (
    <section
      id={`post-comments-${postId}`}
      className='PostArticleComments border-border mt-16 w-full scroll-mt-24 border-t'
    >
      <div className='mx-auto w-full max-w-[720px] px-4 pt-12 pb-16 lg:px-6'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-foreground font-serif text-xl font-bold tracking-tight'>
            Responses ({totalCount})
          </h2>
          <Shield className='text-muted-foreground size-5' aria-hidden />
        </div>

        <div className='border-border mb-8 flex gap-3 border-b pb-8'>
          <Avatar className='size-9 shrink-0 overflow-hidden rounded-full after:hidden'>
            <AvatarImage
              src={currentReader.avatarUrl ?? undefined}
              alt={currentReader.name}
            />
            <AvatarFallback className='text-xs'>
              {readerInitials}
            </AvatarFallback>
          </Avatar>
          <div className='flex min-w-0 flex-1 flex-col gap-3'>
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder='What are your thoughts?'
              rows={3}
              className='border-border bg-muted/50 min-h-[88px] resize-none text-base'
              aria-label='Write a response'
            />
            <div className='flex justify-end'>
              <Button
                type='button'
                size='sm'
                disabled={!draft.trim() || isSubmitting}
                onClick={() => {
                  void handleSubmit();
                }}
              >
                Respond
              </Button>
            </div>
          </div>
        </div>

        <ul className='PostCommentList'>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentReader={currentReader}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
