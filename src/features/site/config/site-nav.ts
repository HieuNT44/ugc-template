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
  { label: "ホーム", href: "/", icon: Home },
  { label: "探索", href: "/explore", icon: BookOpen },
  {
    label: "スタジオ",
    href: "/studio",
    icon: PenLine,
    authOnly: true,
    creatorOnly: true,
  },
  { label: "プロフィール", href: "/profile", icon: User, authOnly: true },
];

export const footerSitemap: SiteFooterGroup[] = [
  {
    title: "プラットフォーム",
    links: [
      { label: "ホーム", href: "/" },
      { label: "探索", href: "/explore" },
      { label: "スタジオ", href: "/studio", authOnly: true, creatorOnly: true },
      { label: "プロフィール", href: "/profile", authOnly: true },
    ],
  },
  {
    title: "アカウント",
    links: [
      { label: "ログイン", href: "/login", icon: LogIn },
      { label: "アカウント作成", href: "/register" },
    ],
  },
  {
    title: "会社",
    links: [
      { label: "RealReadについて", href: "/about", icon: Info },
      { label: "お問い合わせ", href: "/contact" },
    ],
  },
  {
    title: "法務",
    links: [
      { label: "利用規約", href: "/terms" },
      { label: "プライバシーポリシー", href: "/privacy", icon: Shield },
    ],
  },
];
