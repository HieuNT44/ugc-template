"use client";

import { AuthGuard } from "@/core/auth/components/AuthGuard";

import { ReaderOnboardingForm } from "./ReaderOnboardingForm";

export function OnboardingPageClient() {
  return (
    <AuthGuard callbackPath='/onboarding'>
      <div className='OnboardingPageClient container py-10'>
        <div className='mx-auto mb-8 max-w-lg text-center'>
          <h1 className='text-2xl font-semibold'>RealReadへようこそ</h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            プロフィールを完成させて、コンテンツの閲覧と探索を始めましょう。
          </p>
        </div>
        <ReaderOnboardingForm />
      </div>
    </AuthGuard>
  );
}
