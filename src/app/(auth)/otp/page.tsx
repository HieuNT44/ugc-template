import { OTPVerificationForm } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

export default function OtpPage() {
  return (
    <>
      <AuthPageHeader
        title='コードを確認'
        description='メールに送信されたワンタイムコードを入力してください。'
      />
      <OTPVerificationForm email='your@email.com' />
    </>
  );
}
