import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthFormCard } from "@/features/auth/components/AuthFormCard";
import { AuthPageHeader } from "@/features/auth/components/AuthPageHeader";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <>
      <AuthPageHeader
        title='Verify email'
        description='Complete verification using the link from your inbox.'
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
