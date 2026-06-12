"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { GithubIcon } from "@/core/auth/components/icons/GithubIcon";

interface ProfileSocialSummaryProps {
  posts?: number;
  following?: number;
  followers?: number;
  websiteUrl?: string | null;
  githubUrl?: string | null;
  facebookUrl?: string | null;
  lineUrl?: string | null;
  /** When set, empty slots link here (own profile). Omit on public profiles. */
  settingsProfileHref?: string;
}

function SocialIconLink({
  href,
  label,
  settingsProfileHref,
  children,
}: {
  href?: string | null;
  label: string;
  settingsProfileHref?: string;
  children: React.ReactNode;
}) {
  const hasUrl = Boolean(href?.trim());
  const className = cn(
    "group relative inline-flex size-8 items-center justify-center rounded-full transition-colors",
    hasUrl
      ? "text-foreground hover:bg-muted"
      : "text-muted-foreground opacity-40 hover:bg-muted hover:opacity-100"
  );

  if (hasUrl) {
    return (
      <a
        href={href ?? undefined}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={label}
        className={className}
      >
        {children}
      </a>
    );
  }

  const emptyContent = (
    <>
      <span className='transition-opacity group-hover:opacity-0'>
        {children}
      </span>
      <Plus
        className='absolute inset-0 m-auto size-4 opacity-0 transition-opacity group-hover:opacity-100'
        aria-hidden
      />
    </>
  );

  if (settingsProfileHref) {
    return (
      <Link
        href={settingsProfileHref}
        aria-label={`Add ${label}`}
        className={className}
      >
        {emptyContent}
      </Link>
    );
  }

  return (
    <span
      aria-label={`${label} (not set)`}
      className={cn(className, "cursor-default")}
    >
      {children}
    </span>
  );
}

export function ProfileSocialSummary({
  posts = 0,
  following = 0,
  followers = 0,
  websiteUrl,
  githubUrl,
  facebookUrl,
  lineUrl,
  settingsProfileHref,
}: ProfileSocialSummaryProps) {
  return (
    <div className='ProfileSocialSummary mt-3 space-y-2.5'>
      <div className='flex items-center justify-center gap-2'>
        <SocialIconLink
          href={websiteUrl}
          label='Website'
          settingsProfileHref={settingsProfileHref}
        >
          <Globe className='size-5' />
        </SocialIconLink>
        <SocialIconLink
          href={githubUrl}
          label='GitHub'
          settingsProfileHref={settingsProfileHref}
        >
          <GithubIcon className='size-5' />
        </SocialIconLink>
        <SocialIconLink
          href={facebookUrl}
          label='Facebook'
          settingsProfileHref={settingsProfileHref}
        >
          <Image
            src='/image/facebook.svg'
            alt=''
            width={20}
            height={20}
            className='size-5'
          />
        </SocialIconLink>
        <SocialIconLink
          href={lineUrl}
          label='LINE'
          settingsProfileHref={settingsProfileHref}
        >
          <Image
            src='/image/line.svg'
            alt=''
            width={20}
            height={20}
            className='size-5'
          />
        </SocialIconLink>
      </div>

      <div className='border-border mt-2 overflow-hidden rounded-lg border'>
        <div className='divide-border grid min-h-16 grid-cols-3 divide-x'>
          <StatCell label='Posts' value={posts} />
          <StatCell label='Following' value={following} />
          <StatCell label='Followers' value={followers} />
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className='flex min-h-16 flex-col items-center justify-center px-2 py-3 text-center'>
      <p className='text-foreground text-xl leading-none font-semibold'>
        {value}
      </p>
      <p className='text-muted-foreground mt-1 text-xs leading-none'>{label}</p>
    </div>
  );
}
