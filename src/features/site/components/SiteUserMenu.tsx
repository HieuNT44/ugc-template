"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientLogout } from "@/core/api/client/auth-client";
import { useProfileOverviewQuery } from "@/core/api/hooks/use-profile-overview-query";
import { useSession } from "@/core/auth/hooks/useSession";
import { signOutClient } from "@/core/auth/lib/auth-session-client";

import { SiteUserAvatar } from "./SiteUserAvatar";

export function SiteUserMenu() {
  const router = useRouter();
  const { session, isLoading, isAuthenticated } = useSession();
  const profileQuery = useProfileOverviewQuery({
    token: session?.accessToken,
    enabled: isAuthenticated,
  });

  if (isLoading || (isAuthenticated && profileQuery.isLoading)) {
    return (
      <div className='SiteUserMenu flex items-center'>
        <div
          className='bg-muted ring-border size-9 animate-pulse rounded-full ring-1'
          aria-label='ユーザーメニューを読み込み中'
          role='status'
        />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className='SiteUserMenu flex items-center'>
        <Button size='sm' className='rounded-full' asChild>
          <Link href='/login'>ログイン</Link>
        </Button>
      </div>
    );
  }

  const profile = profileQuery.data;
  const name = profile?.name ?? session.user.name ?? "ユーザー";
  const email = profile?.email ?? session.user.email ?? "";
  const imageUrl = profile?.image ?? session.user.image;

  const handleSignOut = async () => {
    const token = session.accessToken;
    if (token) {
      await clientLogout(token);
    }
    await signOutClient();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='SiteUserMenu size-9 rounded-full p-0'
          aria-label='ユーザーメニュー'
        >
          <SiteUserAvatar
            key={imageUrl ?? "default"}
            name={name}
            imageUrl={imageUrl}
          />
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
            href='/profile'
            className='flex cursor-pointer items-center gap-2'
          >
            <User className='size-4' />
            プロフィール
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href='/settings/profile'
            className='flex cursor-pointer items-center gap-2'
          >
            <Settings className='size-4' />
            設定
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className='text-destructive focus:text-destructive cursor-pointer'
        >
          <LogOut className='size-4' />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
