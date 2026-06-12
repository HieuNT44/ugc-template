"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getProfileClient } from "@/core/api/client/profile-client";

import { shouldRequireOnboarding } from "../lib/authUtils";

const BYPASS_PREFIXES = [
  "/onboarding",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

function shouldBypassOnboardingCheck(pathname: string): boolean {
  return BYPASS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

interface OnboardingGateProps {
  children: React.ReactNode;
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const { data: session, status } = useSession();
  const bypass = shouldBypassOnboardingCheck(pathname);
  const isAuthenticated =
    status === "authenticated" && Boolean(session?.accessToken?.trim());
  const [isReady, setIsReady] = useState(!isAuthenticated || bypass);

  useEffect(() => {
    if (bypass || !isAuthenticated) {
      return;
    }

    let cancelled = false;
    const token = session?.accessToken;
    const role = session?.user?.role;

    async function verifyOnboarding() {
      if (!token) {
        return;
      }

      const profileResult = await getProfileClient(token);

      if (cancelled) {
        return;
      }

      if (
        role &&
        profileResult.ok &&
        "onboarding_step" in profileResult.data &&
        shouldRequireOnboarding(role, profileResult.data.onboarding_step)
      ) {
        router.replace("/onboarding");
        return;
      }

      setIsReady(true);
    }

    void verifyOnboarding();

    return () => {
      cancelled = true;
    };
  }, [
    bypass,
    isAuthenticated,
    router,
    session?.accessToken,
    session?.user?.role,
  ]);

  if (!isReady && isAuthenticated) {
    return (
      <div className='OnboardingGate flex flex-col gap-3 p-6'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-32 w-full' />
      </div>
    );
  }

  return <>{children}</>;
}
