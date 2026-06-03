import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/lib/auth";
import { LoginForm } from "@/features/auth";
import { AuthPageHeader } from "@/features/auth/components/AuthPageHeader";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <>
      <AuthPageHeader
        title='Sign in'
        description='Enter your credentials to access your account.'
      />
      <LoginForm redirectTo='/' />
    </>
  );
}
