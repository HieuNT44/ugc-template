import { SiteShell } from "@/features/site";
import { siteSerifFont } from "@/features/site/lib/site-font";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={siteSerifFont.variable}>
      <SiteShell>
        <div className='mx-auto w-full max-w-6xl flex-1 px-6 py-6 lg:py-8'>
          {children}
        </div>
      </SiteShell>
    </div>
  );
}
