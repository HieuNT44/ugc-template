import { Suspense } from "react";

import { ResetPasswordForm } from "@/features/auth";
import { AuthPageHeader } from "@/features/auth/components/AuthPageHeader";

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <>
      <AuthPageHeader
        title='Reset password'
        description='Choose a new password for your account.'
      />
      <Suspense
        fallback={<div className='bg-muted h-48 animate-pulse rounded-lg' />}
      >
        <ResetPasswordContent />
      </Suspense>
    </>
  );
}
