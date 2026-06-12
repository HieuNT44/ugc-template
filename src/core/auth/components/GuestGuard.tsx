"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { Skeleton } from "@/components/ui/skeleton";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * SPA guard for login/register — redirects authenticated users away.
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { status, data: session } = useSession();

  const isAuthenticated =
    status === "authenticated" && Boolean(session?.accessToken?.trim());

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    router.replace("/");
  }, [isAuthenticated, router]);

  if (status === "loading") {
    return (
      <div className='GuestGuard flex flex-col gap-3'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-24 w-full' />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
