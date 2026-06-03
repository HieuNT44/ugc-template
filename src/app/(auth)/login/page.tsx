import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/auth";
import { LoginForm } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

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
