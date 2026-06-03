import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/core/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "admin") {
    return (
      <div className='Dashboard p-8 text-center'>
        <p>Access denied. Admin role required.</p>
      </div>
    );
  }

  return (
    <div className='Dashboard p-8'>
      <h1 className='text-2xl font-semibold'>Admin dashboard</h1>
      <p className='text-muted-foreground'>
        Welcome, {session.user?.name ?? session.user?.email}.
      </p>
    </div>
  );
}
