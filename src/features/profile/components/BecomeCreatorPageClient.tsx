"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/core/auth/components/AuthGuard";

import { useProfileOverview } from "../hooks/use-profile-overview";
import { BecomeCreatorWizard } from "./BecomeCreatorWizard";

function BecomeCreatorContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const { profile, isLoading, error } = useProfileOverview();

  useEffect(() => {
    if (session?.user?.role === "creator") {
      router.replace("/studio");
    }
  }, [session?.user?.role, router]);

  if (isLoading) {
    return (
      <div className='BecomeCreatorPageClient mx-auto w-full max-w-2xl space-y-4'>
        <Skeleton className='h-10 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Alert variant='destructive' className='mx-auto max-w-2xl'>
        <AlertDescription>
          {error ?? "Profile data is unavailable."}
        </AlertDescription>
      </Alert>
    );
  }

  if (session?.user?.role !== "reader") {
    return null;
  }

  return (
    <div className='BecomeCreatorPage mx-auto w-full max-w-2xl'>
      <BecomeCreatorWizard
        defaultValues={{
          name: profile.name ?? "",
          bio: profile.bio ?? "",
          country: profile.country ?? "",
          website: profile.website ?? "",
          topics: (profile.skills ?? profile.fields ?? []).join(", "),
        }}
      />
    </div>
  );
}

export function BecomeCreatorPageClient() {
  return (
    <AuthGuard callbackPath='/profile/become-creator'>
      <BecomeCreatorContent />
    </AuthGuard>
  );
}
