import { ForgotPasswordForm } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

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
