import { Separator } from "@/components/ui/separator";

import type { UserBook } from "../../types/user-book";
import { ProfileBookListItem } from "./profile-book-list-item";

interface ProfileBookListProps {
  books: UserBook[];
  emptyMessage: string;
}

export function ProfileBookList({ books, emptyMessage }: ProfileBookListProps) {
  if (books.length === 0) {
    return (
      <p className='text-muted-foreground px-4 py-10 text-center text-sm'>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className='ProfileBookList'>
      {books.map((book, index) => (
        <div key={book.id}>
          <ProfileBookListItem book={book} />
          {index < books.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </div>
  );
}
