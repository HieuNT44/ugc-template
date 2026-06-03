import { getServerSession } from "next-auth";

import { authOptions } from "@/core/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className='Dashboard'>
      <h1 className='text-2xl font-semibold'>Admin dashboard</h1>
      <p className='text-muted-foreground mt-2'>
        Welcome, {session?.user?.name ?? session?.user?.email}.
      </p>
    </div>
  );
}
