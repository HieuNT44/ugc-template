import { OTPVerificationForm } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

export default function OtpPage() {
  return (
    <>
      <AuthPageHeader
        title='Verify code'
        description='Enter the one-time code sent to your email.'
      />
      <OTPVerificationForm email='your@email.com' />
    </>
  );
}
