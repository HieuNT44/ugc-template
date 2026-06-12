"use client";

import { BookOpen, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { getAuthorProfileHrefFromBook, getBookHref } from "../../lib/book-href";
import type { UserBook } from "../../types/user-book";
import { BookCover } from "./book-cover";
import { BookLabelList } from "./book-label-list";

interface ProfileBookListItemProps {
  book: UserBook;
}

export function ProfileBookListItem({ book }: ProfileBookListItemProps) {
  const { author } = book;
  const bookHref = getBookHref(book);
  const authorProfileHref = getAuthorProfileHrefFromBook(author.username);

  return (
    <article className='ProfileBookListItem px-4 py-5'>
      <div className='flex gap-3'>
        <Avatar className='ring-border mt-0.5 size-6 shrink-0 overflow-hidden rounded-full ring-1 after:hidden'>
          <AvatarImage src={author.avatarUrl} alt={author.username} />
          <AvatarFallback className='text-[10px]'>U</AvatarFallback>
        </Avatar>

        <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4'>
          <p className='text-muted-foreground w-full min-w-0 basis-full text-xs leading-snug'>
            <Link
              href={authorProfileHref}
              className='text-foreground focus-visible:ring-ring/50 font-medium no-underline hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:outline-none'
            >
              @{author.username}
            </Link>
            <span> · {book.publishedAt}</span>
          </p>

          <Link
            href={bookHref}
            className='ProfileBookListItemLink text-foreground focus-visible:ring-ring/50 flex min-w-0 flex-1 cursor-pointer flex-col gap-3 rounded-md no-underline transition-opacity outline-none hover:opacity-90 focus-visible:ring-3 sm:flex-row sm:gap-4'
          >
            <div className='min-w-0 flex-1'>
              <BookLabelList labels={book.labels} className='mt-0' />

              <h3 className='text-foreground mt-2 line-clamp-2 text-xl leading-snug font-bold'>
                {book.title}
              </h3>

              {book.subtitle?.trim() ? (
                <p className='text-muted-foreground mt-1 line-clamp-1 text-sm leading-snug'>
                  {book.subtitle}
                </p>
              ) : null}

              <p className='text-muted-foreground mt-1 line-clamp-2 text-base leading-relaxed'>
                {book.description}
              </p>
            </div>

            <BookCover
              src={book.coverImageUrl}
              alt={book.title}
              className='shrink-0'
            />
          </Link>

          <div className='ProfileBookMeta text-muted-foreground flex w-full min-w-0 basis-full flex-wrap items-center gap-3'>
            <span className='inline-flex shrink-0 items-center gap-1.5 text-sm'>
              <BookOpen className='size-4' aria-hidden />
              {book.chapterCount}{" "}
              {book.chapterCount === 1 ? "chapter" : "chapters"}
            </span>
            {(book.readerCount ?? 0) > 0 ? (
              <span className='inline-flex shrink-0 items-center gap-1.5 text-sm'>
                <Users className='size-4' aria-hidden />
                {book.readerCount}
              </span>
            ) : null}

            <div className='ml-auto flex shrink-0 items-center gap-1'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='text-muted-foreground size-8'
                aria-label='その他の操作'
              >
                <MoreHorizontal className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
