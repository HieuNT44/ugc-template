import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/lib/auth";

export default async function StudioPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "creator" && session.user?.role !== "admin") {
    return (
      <div className='Studio p-8 text-center'>
        <p>Access denied. Creator role required.</p>
      </div>
    );
  }

  return (
    <div className='Studio p-8'>
      <h1 className='text-2xl font-semibold'>Creator studio</h1>
    </div>
  );
}
