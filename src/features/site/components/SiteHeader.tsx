"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/core/auth/hooks/useSession";

import { SITE_NAME } from "../config/site-meta";
import { siteLogoLinkClassName } from "../lib/site-font";
import { getWriteHref } from "../lib/write-href";
import { NotificationBellIcon } from "./NotificationBellIcon";
import { SiteMobileMenu } from "./SiteMobileMenu";
import { SiteUserMenu } from "./SiteUserMenu";
import { WriteIcon } from "./WriteIcon";

export function SiteHeader() {
  const { session, isAuthenticated } = useSession();
  const role = session?.user?.role;
  const writeHref = getWriteHref({ isAuthenticated, role });

  return (
    <header className='SiteHeader bg-background fixed top-0 z-50 flex h-14 w-full items-center gap-4 border-b px-6'>
      <SiteMobileMenu isAuthenticated={isAuthenticated} role={role} />

      <Link
        href='/'
        className={siteLogoLinkClassName}
        aria-label={`${SITE_NAME} home`}
      >
        {SITE_NAME}
      </Link>

      <form
        className='hidden min-w-0 flex-1 md:flex md:max-w-sm lg:max-w-md'
        role='search'
        onSubmit={(event) => event.preventDefault()}
      >
        <div className='relative w-full'>
          <Search
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            aria-hidden
          />
          <Input
            type='search'
            name='q'
            placeholder='検索'
            className='bg-muted/60 h-9 rounded-full border-0 pl-9'
            aria-label='RealReadを検索'
          />
        </div>
      </form>

      <div className='ml-auto flex shrink-0 items-center gap-1 sm:gap-2'>
        <Button
          variant='ghost'
          size='sm'
          className='text-foreground hidden gap-2 px-2 sm:inline-flex'
          asChild
        >
          <Link href={writeHref} aria-label='記事を書く'>
            <WriteIcon />
            <span className='text-sm'>投稿する</span>
          </Link>
        </Button>

        {isAuthenticated ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-9'
                aria-label='通知'
              >
                <NotificationBellIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>通知機能は近日公開予定です</TooltipContent>
          </Tooltip>
        ) : null}

        <SiteUserMenu />
      </div>
    </header>
  );
}
