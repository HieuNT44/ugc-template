"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import type { UserRole } from "@/core/auth/types";

import {
  SITE_COPYRIGHT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "../config/site-meta";
import { footerSitemap, type SiteNavLink } from "../config/site-nav";
import { siteLogoLinkClassName } from "../lib/site-font";

const NON_ARTICLE_TOP_LEVEL_ROUTES = new Set([
  "about",
  "contact",
  "explore",
  "onboarding",
  "privacy",
  "profile",
  "settings",
  "studio",
  "terms",
  "u",
]);

function filterFooterLinks(
  links: SiteNavLink[],
  isAuthenticated: boolean,
  role?: UserRole
): SiteNavLink[] {
  return links.filter((link) => {
    if (link.authOnly && !isAuthenticated) return false;
    if (link.creatorOnly && role !== "creator") return false;
    if (
      !isAuthenticated &&
      (link.href === "/profile" || link.href === "/studio")
    ) {
      return false;
    }
    return true;
  });
}

function shouldShowSiteFooter(pathname: string | null): boolean {
  if (!pathname || pathname === "/") {
    return true;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length !== 1) {
    return false;
  }

  return !NON_ARTICLE_TOP_LEVEL_ROUTES.has(segments[0]);
}

export function SiteFooter() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const role = session?.user?.role;

  if (!shouldShowSiteFooter(pathname)) {
    return null;
  }

  return (
    <footer className='SiteFooter bg-background border-t'>
      <div className='mx-auto max-w-7xl px-6 py-12'>
        <div className='grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]'>
          <div className='space-y-3'>
            <Link href='/' className={`${siteLogoLinkClassName} inline-block`}>
              {SITE_NAME}
            </Link>
            <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
              {SITE_TAGLINE}
            </p>
            <p className='text-muted-foreground text-xs leading-relaxed'>
              {SITE_DESCRIPTION}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-8 sm:grid-cols-4'>
            {footerSitemap.map((group) => {
              const links = filterFooterLinks(
                group.links,
                isAuthenticated,
                role
              );

              if (group.title === "Account" && isAuthenticated) {
                return null;
              }

              return (
                <div key={group.title}>
                  <h3 className='text-foreground mb-3 text-sm font-semibold'>
                    {group.title}
                  </h3>
                  <ul className='space-y-2'>
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className='text-muted-foreground mt-10 border-t pt-6 text-xs'>
          {SITE_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
