"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/core/auth/types";
import { Menu } from "lucide-react";

import { SITE_NAME } from "../config/site-meta";
import { siteLogoTitleClassName } from "../lib/site-font";
import { headerNavLinks, type SiteNavLink } from "../config/site-nav";

interface SiteMobileMenuProps {
  isAuthenticated: boolean;
  role?: UserRole;
}

function filterNavLinks(
  links: SiteNavLink[],
  isAuthenticated: boolean,
  role?: UserRole
): SiteNavLink[] {
  return links.filter((link) => {
    if (link.authOnly && !isAuthenticated) return false;
    if (link.creatorOnly && role !== "creator") return false;
    return true;
  });
}

export function SiteMobileMenu({ isAuthenticated, role }: SiteMobileMenuProps) {
  const pathname = usePathname();
  const links = filterNavLinks(headerNavLinks, isAuthenticated, role);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-9 shrink-0 md:hidden'
          aria-label='Open menu'
        >
          <Menu className='size-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='SiteMobileMenu w-72'>
        <SheetHeader>
          <SheetTitle className={siteLogoTitleClassName}>
            {SITE_NAME}
          </SheetTitle>
        </SheetHeader>
        <nav
          className='mt-6 flex flex-col gap-1'
          aria-label='Mobile navigation'
        >
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {Icon ? <Icon className='size-4 shrink-0' /> : null}
                {link.label}
              </Link>
            );
          })}
        </nav>
        {!isAuthenticated && (
          <div className='mt-6 border-t pt-6'>
            <Button className='w-full rounded-full' asChild>
              <Link href='/login'>Login</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
