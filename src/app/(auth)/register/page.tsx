import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/lib/auth";
import { RegisterForm } from "@/features/auth";
import { AuthPageHeader } from "@/features/auth/components/AuthPageHeader";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <>
      <AuthPageHeader
        title='Create account'
        description='Sign up with email or continue with a social provider.'
      />
      <RegisterForm redirectTo='/' />
    </>
  );
}
