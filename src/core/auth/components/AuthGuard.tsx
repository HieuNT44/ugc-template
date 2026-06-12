"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Login redirect target; defaults to current pathname. */
  callbackPath?: string;
}

/**
 * SPA route guard — redirects unauthenticated users to /login on the client.
 */
export function AuthGuard({ children, callbackPath }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, data: session } = useSession();

  const isReady =
    status === "authenticated" && Boolean(session?.accessToken?.trim());

  useEffect(() => {
    if (status !== "unauthenticated") {
      return;
    }

    const target = callbackPath ?? pathname ?? "/";
    const query = `?callbackUrl=${encodeURIComponent(target)}`;
    router.replace(`/login${query}`);
  }, [status, router, callbackPath, pathname]);

  if (status === "loading") {
    return (
      <div className='AuthGuard flex flex-col gap-3 p-6'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-32 w-full' />
      </div>
    );
  }

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
