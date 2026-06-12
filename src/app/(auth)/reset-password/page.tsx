import { Suspense } from "react";

import { ResetPasswordForm } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <>
      <AuthPageHeader
        title='パスワードをリセット'
        description='アカウント用の新しいパスワードを設定してください。'
      />
      <Suspense
        fallback={<div className='bg-muted h-48 animate-pulse rounded-lg' />}
      >
        <ResetPasswordContent />
      </Suspense>
    </>
  );
}
