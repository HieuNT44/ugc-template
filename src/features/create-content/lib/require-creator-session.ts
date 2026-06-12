import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/auth";

export async function requireCreatorSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/studio/create");
  }

  const role = session.user.role;
  if (role !== "creator") {
    redirect("/profile/become-creator");
  }

  return session;
}
