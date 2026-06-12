import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiQueryProvider } from "@/core/api/providers/ApiQueryProvider";
import { AuthSessionProvider } from "@/core/auth";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RealRead",
    template: "%s | RealRead",
  },
  description:
    "世界中のクリエイターからストーリー、アイデア、知識を見つけましょう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ja'
      className={`${outfit.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className='flex min-h-full flex-col' suppressHydrationWarning>
        <AuthSessionProvider>
          <ApiQueryProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors position='top-right' />
            </TooltipProvider>
          </ApiQueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
