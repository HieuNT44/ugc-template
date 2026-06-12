"use client";

import Image from "next/image";
import { useState } from "react";

import { getAvatarInitials } from "@/core/lib/avatar-initials";
import { cn } from "@/lib/utils";

function isUsableImageUrl(url?: string | null): url is string {
  const trimmed = url?.trim();
  return Boolean(
    trimmed &&
      (trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("/"))
  );
}

interface SiteUserAvatarProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
}

export function SiteUserAvatar({
  name,
  imageUrl,
  className,
}: SiteUserAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const hasImage = isUsableImageUrl(imageUrl);
  const displaySrc = hasImage && !hasError ? imageUrl.trim() : null;

  return (
    <span
      className={cn(
        "SiteUserAvatar ring-border relative inline-flex size-9 shrink-0 overflow-hidden rounded-full ring-1",
        className
      )}
    >
      {displaySrc ? (
        <Image
          src={displaySrc}
          alt={name}
          width={36}
          height={36}
          sizes='36px'
          className='size-full object-cover object-center'
          onError={() => setHasError(true)}
        />
      ) : (
        <span className='bg-muted text-muted-foreground flex size-full items-center justify-center text-sm font-semibold uppercase'>
          {getAvatarInitials(name)}
        </span>
      )}
    </span>
  );
}
