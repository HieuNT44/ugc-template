"use client";

import { LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { adminNavItems } from "../config/admin-nav";

const DEFAULT_ADMIN_AVATAR = "/image/avatar_men.png";

function getPageTitle(pathname: string): string {
  const match = adminNavItems.find(
    (item) => pathname === item.url || pathname.startsWith(`${item.url}/`)
  );
  if (match) {
    return match.title;
  }
  if (pathname === "/dashboard") {
    return "Dashboard";
  }
  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const pageTitle = getPageTitle(pathname ?? "");

  const name = session?.user?.name ?? "Admin";
  const email = session?.user?.email ?? "";
  const avatarSrc = session?.user?.image ?? DEFAULT_ADMIN_AVATAR;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className='AdminHeader bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center border-b px-4'>
      <div className='flex min-h-16 flex-1 items-center gap-2'>
        <SidebarTrigger size='icon' className='-ml-1 shrink-0' />
        <div
          role='separator'
          aria-orientation='vertical'
          className='bg-border h-4 w-px shrink-0'
        />
        <Breadcrumb className='flex min-w-0 items-center'>
          <BreadcrumbList className='flex-nowrap items-center leading-none'>
            <BreadcrumbItem className='hidden md:inline-flex'>
              <BreadcrumbLink asChild>
                <Link
                  href='/dashboard'
                  className='inline-flex items-center leading-none'
                >
                  Admin
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden items-center md:flex [&>svg]:block' />
            <BreadcrumbItem className='inline-flex items-center'>
              <BreadcrumbPage className='inline-flex items-center leading-none'>
                {pageTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex shrink-0 items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='border-input h-9 w-9 rounded-full border'
              aria-label='User menu'
            >
              <Avatar className='h-9 w-9'>
                <AvatarImage src={avatarSrc} alt={name} />
                <AvatarFallback className='bg-muted p-0'>
                  <Image
                    src={DEFAULT_ADMIN_AVATAR}
                    alt=''
                    width={36}
                    height={36}
                    className='size-full object-cover'
                  />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56' sideOffset={8}>
            <DropdownMenuLabel className='font-normal'>
              <p className='text-sm font-semibold'>{name}</p>
              <p className='text-muted-foreground truncate text-xs'>{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href='/settings'
                className='flex cursor-pointer items-center gap-2'
              >
                <Settings className='size-4' />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className='text-destructive focus:text-destructive cursor-pointer'
            >
              <LogOut className='size-4' />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
