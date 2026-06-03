import { OTPVerificationForm } from "@/features/auth";
import { AuthPageHeader } from "@/features/auth/components/AuthPageHeader";

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
