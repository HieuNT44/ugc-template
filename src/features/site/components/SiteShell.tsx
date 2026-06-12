import { OnboardingGate } from "@/core/auth/components/OnboardingGate";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface SiteShellProps {
  children: React.ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className='SiteShell flex min-h-svh flex-col'>
      <SiteHeader />
      <main className='SiteMain bg-site-main flex flex-1 flex-col pt-14'>
        <OnboardingGate>{children}</OnboardingGate>
      </main>
      <SiteFooter />
    </div>
  );
}
