"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/core/auth/components/AuthGuard";

import { useProfileOverview } from "../hooks/use-profile-overview";
import { ProfileOverview } from "./ProfileOverview";

function ProfileOverviewLoader() {
  const { profile, isLoading, error, refetch } = useProfileOverview();

  if (isLoading) {
    return (
      <div className='ProfilePageClient space-y-4 p-6'>
        <Skeleton className='h-10 w-56' />
        <Skeleton className='h-48 w-full max-w-md' />
        <Skeleton className='h-24 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive' className='m-6'>
        <AlertDescription className='flex flex-col gap-3'>
          <span>{error}</span>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert className='m-6'>
        <AlertDescription>
          プロフィールデータを利用できません。
        </AlertDescription>
      </Alert>
    );
  }

  return <ProfileOverview profile={profile} />;
}

export function ProfilePageClient() {
  return (
    <AuthGuard callbackPath='/profile'>
      <ProfileOverviewLoader />
    </AuthGuard>
  );
}
