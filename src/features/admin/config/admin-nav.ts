import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Settings } from "lucide-react";

export interface AdminNavItem {
  name: string;
  title: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  {
    name: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "settings",
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
