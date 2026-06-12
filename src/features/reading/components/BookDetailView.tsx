import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookCover, BookLabelList } from "@/core/components/book";
import { getAuthorProfileHrefFromBook } from "@/core/lib/book-href";
import { cn } from "@/lib/utils";

import { markdownToBlocks } from "../lib/parse-markdown-to-blocks";
import type { ArticleBlock } from "../types/article-block";
import type { BookChapter, BookDetail } from "../types/book-detail";
import { PostArticleContent } from "./PostArticleContent";
import { BookPaywall } from "./BookPaywall";
import { BookChapterMenuDrawer } from "./BookChapterMenuDrawer";

interface BookDetailViewProps {
  book: BookDetail;
  username: string;
  selectedChapterId?: string | null;
  purchaseSuccess?: boolean;
  stripeCanceled?: boolean;
}

function formatBookDate(iso: string | null): string {
  if (!iso) {
    return "";
  }

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getChapterPath(bookPath: string, chapter: BookChapter): string {
  return `${bookPath}?chapter=${chapter.id}`;
}

function getCreatorDisplayName(book: BookDetail): string {
  return book.creator.fullName ?? book.creator.username;
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateTextByPercent(text: string, percent: number): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  const safePercent = Math.min(Math.max(percent, 1), 100);
  const limit = Math.ceil((trimmed.length * safePercent) / 100);
  const preview = trimmed.slice(0, limit);
  const lastSpaceIndex = preview.lastIndexOf(" ");

  return lastSpaceIndex > 80 ? preview.slice(0, lastSpaceIndex) : preview;
}

function getBookPreviewBlocks(
  chapter: BookChapter,
  previewPercent: number | null
): ArticleBlock[] {
  if (chapter.contentTruncated) {
    return chapter.blocks;
  }

  const percent = previewPercent ?? 30;
  const source =
    chapter.editorMode === "wysiwyg"
      ? stripHtml(chapter.content)
      : chapter.content;
  const previewContent = truncateTextByPercent(source, percent);

  if (!previewContent) {
    return [];
  }

  if (chapter.editorMode === "wysiwyg") {
    return [{ type: "paragraph", text: previewContent }];
  }

  return markdownToBlocks(previewContent);
}

function BookAuthorLine({ book }: { book: BookDetail }) {
  const displayName = getCreatorDisplayName(book);
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <Link
      href={getAuthorProfileHrefFromBook(book.creator.username)}
      className='inline-flex items-center gap-2 rounded-full no-underline focus-visible:ring-3 focus-visible:ring-[#2A2A2A]/30 focus-visible:outline-none'
    >
      <Avatar className='size-7 overflow-hidden rounded-full border border-[#2A2A2A]/15 after:hidden'>
        <AvatarImage src={book.creator.avatarUrl ?? ""} alt={displayName} />
        <AvatarFallback className='bg-[#2A2A2A] text-[10px] text-[#F8F3E7]'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className='text-sm font-medium text-[#2A2A2A]'>{displayName}</span>
    </Link>
  );
}

function BookChapterIndex({
  book,
  bookPath,
  selectedChapterId,
  compact = false,
}: {
  book: BookDetail;
  bookPath: string;
  selectedChapterId?: string | null;
  compact?: boolean;
}) {
  if (book.chapters.length === 0) {
    return (
      <p className='text-sm leading-relaxed text-[#2A2A2A]/65'>
        No chapters are available yet.
      </p>
    );
  }

  if (!compact) {
    return (
      <ol className='BookChapterIndex border-y border-[#2A2A2A]'>
        {book.chapters.map((chapter) => {
          const active = String(chapter.id) === selectedChapterId;
          return (
            <li
              key={chapter.id}
              className='border-b border-[#2A2A2A] last:border-b-0'
            >
              <Link
                href={getChapterPath(bookPath, chapter)}
                className={cn(
                  "group flex min-h-14 items-center gap-6 py-3 text-[#2A2A2A] no-underline transition-colors hover:bg-[#2A2A2A]/5 focus-visible:ring-3 focus-visible:ring-[#2A2A2A]/30 focus-visible:outline-none",
                  active &&
                    "bg-[#2A2A2A] px-3 text-[#F8F3E7] hover:bg-[#2A2A2A]"
                )}
              >
                <span
                  className={cn(
                    "w-11 shrink-0 font-mono text-[28px] leading-none font-bold tracking-[-0.08em] text-[#2A2A2A]/90",
                    active && "text-[#F8F3E7]"
                  )}
                >
                  {String(chapter.orderNumber).padStart(2, "0")}
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='block truncate font-mono text-sm leading-none font-bold tracking-[0.08em] uppercase'>
                    {chapter.title}
                  </span>
                  {chapter.isFreePreview ? (
                    <span
                      className={cn(
                        "mt-1 block font-mono text-[10px] leading-none tracking-[0.12em] text-[#2A2A2A]/45 uppercase",
                        active && "text-[#F8F3E7]/65"
                      )}
                    >
                      Free preview
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className='BookChapterIndex grid gap-2'>
      {book.chapters.map((chapter) => {
        const active = String(chapter.id) === selectedChapterId;
        return (
          <li key={chapter.id}>
            <Link
              href={getChapterPath(bookPath, chapter)}
              className={cn(
                "group flex min-h-12 items-center gap-3 border-b border-[#2A2A2A]/25 px-1 py-2 text-[#2A2A2A] no-underline transition hover:border-[#2A2A2A] hover:bg-[#2A2A2A]/5",
                active && "border-[#2A2A2A] bg-[#2A2A2A]/8"
              )}
            >
              <span
                className={cn(
                  "shrink-0 font-mono text-xl leading-none font-bold tracking-[-0.08em] text-[#2A2A2A]/75",
                  active && "text-[#2A2A2A]"
                )}
              >
                {String(chapter.orderNumber).padStart(2, "0")}
              </span>
              <span className='min-w-0'>
                <span className='block truncate font-mono text-xs leading-snug font-bold tracking-[0.06em] uppercase'>
                  {chapter.title}
                </span>
                {chapter.isFreePreview ? (
                  <span
                    className={cn(
                      "mt-1 block font-mono text-[10px] leading-none tracking-[0.12em] text-[#2A2A2A]/45 uppercase",
                      active && "text-[#2A2A2A]/60"
                    )}
                  >
                    Free preview
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function BookOverview({
  book,
  bookPath,
}: {
  book: BookDetail;
  bookPath: string;
}) {
  const publishedAt = formatBookDate(book.publishedAt);

  return (
    <div className='BookOverview mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16'>
      <section className='grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-end'>
        <div className='flex justify-center lg:justify-start'>
          <BookCover
            src={book.coverImageUrl}
            alt={book.title}
            className='h-[300px] w-[200px] rounded-md shadow-2xl shadow-[#2A2A2A]/20 sm:h-[300px] sm:w-[200px] lg:h-[292px] lg:w-[195px]'
          />
        </div>

        <div className='min-w-0'>
          <BookLabelList labels={book.labels} className='mb-5' />
          <h1 className='max-w-4xl font-serif text-[clamp(2.75rem,6.6vw,5.8rem)] leading-[0.92] font-bold tracking-[-0.055em] text-[#2A2A2A]'>
            {book.title}
          </h1>
          <div className='mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#2A2A2A]/70'>
            <BookAuthorLine book={book} />
            {publishedAt ? (
              <>
                <span aria-hidden>·</span>
                <span>{publishedAt}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>{book.readTimeMinutes} min read</span>
          </div>
        </div>
      </section>

      <section
        id='overview'
        className='BookOverviewSection mt-16 border-t border-[#2A2A2A]/15 pt-10'
      >
        <p className='mb-4 font-mono text-xs tracking-[0.18em] text-[#2A2A2A]/55 uppercase'>
          What it covers
        </p>
        <p className='max-w-4xl font-serif text-[clamp(1.75rem,3.5vw,3.25rem)] leading-[1.05] text-[#2A2A2A]'>
          {book.description || book.shortDescription || book.excerpt}
        </p>
      </section>

      <section id='toc' className='BookOverviewToc mt-16'>
        <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='mb-2 font-mono text-xs tracking-[0.18em] text-[#2A2A2A]/55 uppercase'>
              目次
            </p>
            <h2 className='font-serif text-3xl font-bold text-[#2A2A2A]'>
              Chapters
            </h2>
          </div>
          {book.chapters[0] ? (
            <Button
              asChild
              className='rounded-full bg-[#2A2A2A] px-6 text-[#F8F3E7] hover:bg-[#111111]'
            >
              <Link href={getChapterPath(bookPath, book.chapters[0])}>
                Start reading
              </Link>
            </Button>
          ) : null}
        </div>
        <BookChapterIndex book={book} bookPath={bookPath} />
      </section>
    </div>
  );
}

function BookReader({
  book,
  bookPath,
  selectedChapter,
}: {
  book: BookDetail;
  bookPath: string;
  selectedChapter: BookChapter;
}) {
  const showPaywall = book.access === "preview";
  const chapterBlocks = showPaywall
    ? getBookPreviewBlocks(selectedChapter, book.previewPercent)
    : selectedChapter.blocks;

  return (
    <div className='BookReader mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 lg:px-8'>
      <aside className='BookReaderSidebar lg:sticky lg:top-24 lg:self-start'>
        <Link
          href={bookPath}
          className='mb-5 hidden text-sm font-medium text-[#2A2A2A]/70 underline underline-offset-4 lg:inline-block'
        >
          Back to overview
        </Link>

        <div className='BookReaderMobileMenu flex items-center justify-between gap-3 lg:hidden'>
          <Link
            href={bookPath}
            className='text-sm font-medium text-[#2A2A2A]/70 underline underline-offset-4'
          >
            Back to overview
          </Link>
          <BookChapterMenuDrawer
            chapters={book.chapters.map((chapter) => ({
              id: chapter.id,
              title: chapter.title,
              orderNumber: chapter.orderNumber,
              isFreePreview: chapter.isFreePreview,
            }))}
            bookPath={bookPath}
            selectedChapterId={String(selectedChapter.id)}
          />
        </div>

        <nav className='BookReaderChapterMenu hidden lg:block'>
          <p className='mb-3 font-mono text-xs tracking-[0.18em] text-[#2A2A2A]/50 uppercase'>
            Chapters
          </p>
          <BookChapterIndex
            book={book}
            bookPath={bookPath}
            selectedChapterId={String(selectedChapter.id)}
            compact
          />
        </nav>
      </aside>

      <article className='BookReaderChapter min-w-0 px-0 sm:px-4 lg:px-8'>
        <p className='font-mono text-xs tracking-[0.18em] text-[#2A2A2A]/50 uppercase'>
          Chapter {selectedChapter.orderNumber}
        </p>
        <h1 className='mt-3 font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.05em] text-[#2A2A2A]'>
          {selectedChapter.title}
        </h1>

        <div
          className={cn(
            "mt-10",
            showPaywall && "relative overflow-hidden pb-8"
          )}
        >
          <PostArticleContent
            blocks={chapterBlocks}
            className='[&_h2]:text-[#2A2A2A] [&_h3]:text-[#2A2A2A]'
            tone='book'
          />
          {showPaywall ? (
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#FFFDF7]' />
          ) : null}
        </div>

        {showPaywall ? (
          <div className='mt-6'>
            <BookPaywall
              bookId={book.id}
              bookPath={bookPath}
              bookTitle={book.title}
              labels={book.labels}
              previewPercent={book.previewPercent}
            />
          </div>
        ) : null}
      </article>
    </div>
  );
}

export function BookDetailView({
  book,
  username,
  selectedChapterId,
  purchaseSuccess = false,
  stripeCanceled = false,
}: BookDetailViewProps) {
  const bookPath = `/u/${encodeURIComponent(username)}/books/${book.id}`;
  const selectedChapter = selectedChapterId
    ? book.chapters.find((chapter) => String(chapter.id) === selectedChapterId)
    : null;

  return (
    <main className="BookDetailView min-h-[calc(100svh-3.5rem)] bg-[url('/image/book-texture-light.png')] bg-auto bg-repeat text-[#2A2A2A] [--foreground:#2A2A2A] [--muted-foreground:#2A2A2A]">
      {purchaseSuccess || stripeCanceled ? (
        <div className='mx-auto w-full max-w-6xl px-5 pt-6 lg:px-8'>
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              purchaseSuccess
                ? "border-green-700/25 bg-green-50 text-green-900"
                : "border-red-700/20 bg-red-50 text-red-900"
            )}
          >
            {purchaseSuccess
              ? "購入が完了しました。このブックをすべて読めます。"
              : "チェックアウトはキャンセルされました。プレビューを引き続き読めます。"}
          </div>
        </div>
      ) : null}

      {selectedChapter ? (
        <BookReader
          book={book}
          bookPath={bookPath}
          selectedChapter={selectedChapter}
        />
      ) : (
        <BookOverview book={book} bookPath={bookPath} />
      )}
    </main>
  );
}
