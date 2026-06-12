import { Suspense } from "react";

import { LoginPageClient } from "@/core/auth/components/LoginPageClient";
import { Skeleton } from "@/components/ui/skeleton";

function LoginPageFallback() {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-8 w-40' />
      <Skeleton className='h-24 w-full' />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
