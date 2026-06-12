import { AuthPageHeader } from "./AuthPageHeader";
import { GuestGuard } from "./GuestGuard";
import { LoginForm } from "./LoginForm";

export function LoginPageClient() {
  return (
    <GuestGuard>
      <AuthPageHeader
        title='ログイン'
        description='アカウントにアクセスするには認証情報を入力してください。'
      />
      <LoginForm redirectTo='/' />
    </GuestGuard>
  );
}
