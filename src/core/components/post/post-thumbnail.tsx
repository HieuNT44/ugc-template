"use client";

import Image from "next/image";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { POST_PLACEHOLDER } from "../../constants/post";
import { FallbackPostImage } from "../fallback/fallback-post-image";

interface PostThumbnailProps {
  src?: string | null;
  alt: string;
  className?: string;
}

function shouldUseFallback(src?: string | null): boolean {
  const trimmed = src?.trim();
  return !trimmed || trimmed === POST_PLACEHOLDER;
}

const THUMBNAIL_SIZE_CLASS =
  "h-[107px] w-full shrink-0 overflow-hidden rounded-sm sm:w-40";

interface LoadedPostThumbnailProps {
  imageSrc: string;
  alt: string;
  sizeClassName: string;
}

function LoadedPostThumbnail({
  imageSrc,
  alt,
  sizeClassName,
}: LoadedPostThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("PostThumbnail relative", sizeClassName)}>
      {isLoading ? (
        <Skeleton className='absolute inset-0 z-10 size-full rounded-sm' />
      ) : null}
      <Image
        src={imageSrc}
        alt={alt}
        width={160}
        height={107}
        className='size-full object-cover'
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}

export function PostThumbnail({ src, alt, className }: PostThumbnailProps) {
  const imageSrc = src?.trim() ?? "";
  const sizeClassName = cn(THUMBNAIL_SIZE_CLASS, className);

  if (shouldUseFallback(imageSrc)) {
    return <FallbackPostImage className={sizeClassName} title={alt} />;
  }

  return (
    <LoadedPostThumbnail
      key={imageSrc}
      imageSrc={imageSrc}
      alt={alt}
      sizeClassName={sizeClassName}
    />
  );
}
