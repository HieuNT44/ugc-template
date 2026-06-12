"use client";

import { AuthPageHeader } from "./AuthPageHeader";
import { GuestGuard } from "./GuestGuard";
import { RegisterForm } from "./RegisterForm";

export function RegisterPageClient() {
  return (
    <GuestGuard>
      <AuthPageHeader
        title='Create account'
        description='Sign up with email or continue with a social provider.'
      />
      <RegisterForm redirectTo='/onboarding' />
    </GuestGuard>
  );
}
