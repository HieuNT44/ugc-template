import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/auth";
import { RegisterForm } from "@/core/auth";
import { AuthPageHeader } from "@/core/auth";

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
