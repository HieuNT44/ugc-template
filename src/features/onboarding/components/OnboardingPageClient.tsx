"use client";

import { AuthGuard } from "@/core/auth/components/AuthGuard";

import { ReaderOnboardingForm } from "./ReaderOnboardingForm";

export function OnboardingPageClient() {
  return (
    <AuthGuard callbackPath='/onboarding'>
      <div className='OnboardingPageClient container py-10'>
        <div className='mx-auto mb-8 max-w-lg text-center'>
          <h1 className='text-2xl font-semibold'>Welcome to RealRead</h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            Complete your profile to start reading and discovering content.
          </p>
        </div>
        <ReaderOnboardingForm />
      </div>
    </AuthGuard>
  );
}
