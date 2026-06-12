import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthFormCard } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <>
      <AuthPageHeader
        title='メールアドレスを確認'
        description='受信トレイのリンクから確認を完了してください。'
      />
      <AuthFormCard>
        <Alert>
          <AlertCircle className='size-4' />
          <AlertDescription>
            Open the verification link in your email. Token reference:{" "}
            {token.slice(0, 8)}...
          </AlertDescription>
        </Alert>
      </AuthFormCard>
    </>
  );
}
