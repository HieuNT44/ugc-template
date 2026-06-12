import { SiteShell } from "@/features/site";
import { siteLogoFont, siteSerifFont } from "@/features/site/lib/site-font";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${siteSerifFont.variable} ${siteLogoFont.variable} flex min-h-svh flex-col`}
    >
      <SiteShell>{children}</SiteShell>
    </div>
  );
}
