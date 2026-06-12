import { AuthPageHeader } from "./AuthPageHeader";
import { GuestGuard } from "./GuestGuard";
import { LoginForm } from "./LoginForm";

export function LoginPageClient() {
  return (
    <GuestGuard>
      <AuthPageHeader
        title='Sign in'
        description='Enter your credentials to access your account.'
      />
      <LoginForm redirectTo='/' />
    </GuestGuard>
  );
}
