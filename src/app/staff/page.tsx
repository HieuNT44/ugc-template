import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/auth";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "staff" && session.user?.role !== "admin") {
    return (
      <div className='Staff p-8 text-center'>
        <p>Access denied. Staff role required.</p>
      </div>
    );
  }

  return (
    <div className='Staff p-8'>
      <h1 className='text-2xl font-semibold'>Staff workspace</h1>
    </div>
  );
}
