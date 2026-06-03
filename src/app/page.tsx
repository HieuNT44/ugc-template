import Link from "next/link";
import { getServerSession } from "next-auth";

import { Button } from "@/components/ui/button";
import { authOptions } from "@/core/auth";
import { RoleGuard } from "@/core/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className='Home flex flex-1 flex-col items-center justify-center gap-6 px-6'>
      <h1 className='text-3xl font-semibold'>UGC Template</h1>
      <p className='text-muted-foreground max-w-lg text-center'>
        {session
          ? `Signed in as ${session.user?.email} (${session.user?.role})`
          : "Browse as a guest or sign in to access role-based features."}
      </p>
      <div className='flex flex-wrap gap-3'>
        {!session && (
          <Button asChild>
            <Link href='/login'>Sign in</Link>
          </Button>
        )}
        <RoleGuard
          allowedRoles={["guest", "reader", "creator", "staff", "admin"]}
        >
          <Button variant='outline' asChild>
            <Link href='/'>Public content</Link>
          </Button>
        </RoleGuard>
        <RoleGuard
          allowedRoles={["admin"]}
          fallback={
            <Button variant='outline' disabled>
              Admin only
            </Button>
          }
        >
          <Button variant='outline' asChild>
            <Link href='/dashboard'>Admin area</Link>
          </Button>
        </RoleGuard>
      </div>
    </div>
  );
}
