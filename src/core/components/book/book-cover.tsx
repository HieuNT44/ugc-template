import Image from "next/image";

import { cn } from "@/lib/utils";

import { BOOK_PLACEHOLDER } from "../../constants/book";
import { FallbackBookCover } from "./fallback-book-cover";

interface BookCoverProps {
  src?: string | null;
  alt: string;
  className?: string;
}

function shouldUseFallback(src?: string | null): boolean {
  const trimmed = src?.trim();
  return !trimmed || trimmed === BOOK_PLACEHOLDER;
}

export function BookCover({ src, alt, className }: BookCoverProps) {
  const imageSrc = src?.trim() ?? "";

  if (shouldUseFallback(imageSrc)) {
    return <FallbackBookCover className={className} title={alt} />;
  }

  return (
    <div
      className={cn(
        "BookCover relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-sm shadow-sm sm:h-[140px] sm:w-[93px]",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={93}
        height={140}
        className='size-full object-cover'
      />
    </div>
  );
}
