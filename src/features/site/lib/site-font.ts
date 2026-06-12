import { Audiowide, Lora } from "next/font/google";

export const siteSerifFont = Lora({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-serif",
  display: "swap",
});

export const siteLogoFont = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-logo",
  display: "swap",
});

/** Apply directly on logo text — avoids Tailwind font-logo variable resolution issues */
export const siteLogoLinkClassName = `${siteLogoFont.className} text-foreground shrink-0 text-2xl tracking-tight`;

export const siteLogoTitleClassName = `${siteLogoFont.className} text-xl`;
