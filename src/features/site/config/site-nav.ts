import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Home,
  Info,
  LogIn,
  PenLine,
  Shield,
  User,
} from "lucide-react";

export interface SiteNavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
  /** Hide from guest users when true */
  authOnly?: boolean;
  /** Show only for creator role */
  creatorOnly?: boolean;
}

export interface SiteFooterGroup {
  title: string;
  links: SiteNavLink[];
}

export const headerNavLinks: SiteNavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: BookOpen },
  {
    label: "Studio",
    href: "/studio",
    icon: PenLine,
    authOnly: true,
    creatorOnly: true,
  },
  { label: "Profile", href: "/profile", icon: User, authOnly: true },
];

export const footerSitemap: SiteFooterGroup[] = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Explore", href: "/explore" },
      { label: "Studio", href: "/studio", authOnly: true, creatorOnly: true },
      { label: "Profile", href: "/profile", authOnly: true },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login", icon: LogIn },
      { label: "Create account", href: "/register" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About RealRead", href: "/about", icon: Info },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy", icon: Shield },
    ],
  },
];
