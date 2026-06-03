import { ForgotPasswordForm } from "@/features/auth";
import { AuthPageHeader } from "@/features/auth/components/AuthPageHeader";

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthPageHeader
        title='Forgot password'
        description='We will email you a link to reset your password.'
      />
      <ForgotPasswordForm />
    </>
  );
}
