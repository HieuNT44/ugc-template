import type { UserBook } from "../types/user-book";

type BookHrefInput = Pick<UserBook, "id" | "author"> & {
  href?: string | null;
};

/** Resolves the canonical URL for a book detail page. */
export function getBookHref(book: BookHrefInput): string {
  if (book.href) {
    return book.href;
  }
  return `/@${book.author.username}/books/${book.id}`;
}

export function getAuthorProfileHrefFromBook(username: string): string {
  return `/@${encodeURIComponent(username)}`;
}
