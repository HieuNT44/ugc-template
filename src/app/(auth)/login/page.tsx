import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions, LoginForm, AuthPageHeader } from "@/core/auth";
import { getRedirectUrl } from "@/core/auth/lib/authUtils";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(getRedirectUrl(session.user?.role ?? "reader"));
  }

  return (
    <>
      <AuthPageHeader
        title='Sign in'
        description='Enter your credentials to access your account.'
      />
      <LoginForm />
    </>
  );
}
