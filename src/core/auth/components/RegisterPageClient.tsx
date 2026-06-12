"use client";

import { AuthPageHeader } from "./AuthPageHeader";
import { GuestGuard } from "./GuestGuard";
import { RegisterForm } from "./RegisterForm";

export function RegisterPageClient() {
  return (
    <GuestGuard>
      <AuthPageHeader
        title='アカウント作成'
        description='メールアドレスで登録するか、ソーシャルアカウントで続行してください。'
      />
      <RegisterForm redirectTo='/onboarding' />
    </GuestGuard>
  );
}
