import { ForgotPasswordForm } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthPageHeader
        title='パスワードをお忘れですか'
        description='パスワードをリセットするリンクをメールで送信します。'
      />
      <ForgotPasswordForm />
    </>
  );
}
