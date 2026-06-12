"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AppLanguage } from "@/core/api/types/enums";
import { cn } from "@/lib/utils";

import {
  Award,
  BadgeCheck,
  Briefcase,
  ExternalLink,
  GraduationCap,
  KeyRound,
  Settings,
  User,
} from "lucide-react";

import {
  getSettingsNavLabel,
  type SettingsNavLabelKey,
} from "../lib/settings-nav-labels";
import { getUsernameInitials } from "../lib/profile-avatar";
import { getProfileUsername } from "../lib/profile-username";
import type { Profile } from "../types";

export type SettingsSidebarTab =
  | "profile"
  | "experiences"
  | "educations"
  | "certifications"
  | "accomplishments"
  | "password"
  | "system";

const CV_NAV_ITEMS: {
  tab: SettingsSidebarTab;
  href: string;
  labelKey: SettingsNavLabelKey;
  icon: typeof Briefcase;
}[] = [
  {
    tab: "experiences",
    href: "/settings/experiences",
    labelKey: "experiences",
    icon: Briefcase,
  },
  {
    tab: "educations",
    href: "/settings/educations",
    labelKey: "educations",
    icon: GraduationCap,
  },
  {
    tab: "certifications",
    href: "/settings/certifications",
    labelKey: "certifications",
    icon: BadgeCheck,
  },
  {
    tab: "accomplishments",
    href: "/settings/accomplishments",
    labelKey: "accomplishments",
    icon: Award,
  },
];

interface SettingsProfileSidebarProps {
  profile: Profile;
  activeTab?: SettingsSidebarTab;
  language?: AppLanguage;
}

function NavLinkItem({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: typeof User;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className='size-4 shrink-0' aria-hidden />
      {label}
    </Link>
  );
}

export function SettingsProfileSidebar({
  profile,
  activeTab = "profile",
  language = "en",
}: SettingsProfileSidebarProps) {
  const handle = profile.username?.trim() || getProfileUsername(profile);
  const displayName = profile.name?.trim() || handle;
  const avatarSrc = profile.image?.trim() || undefined;
  const initials = getUsernameInitials(handle);
  const publicProfileHref = `/u/${encodeURIComponent(handle)}`;

  return (
    <aside className='SettingsProfileSidebar w-full shrink-0 md:sticky md:top-20 md:w-56 lg:w-60'>
      <Card className='ring-foreground/10 dark:bg-card gap-0 overflow-hidden rounded-2xl bg-white py-0 ring-1'>
        <div className='border-border flex min-h-[68px] shrink-0 items-center gap-3 border-b px-4 py-3'>
          <Avatar className='size-9 shrink-0'>
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt={displayName} />
            ) : null}
            <AvatarFallback className='text-xs font-medium'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm leading-snug font-semibold'>
              {displayName}
            </p>
            <p className='text-muted-foreground truncate text-xs leading-snug'>
              @{handle}
            </p>
          </div>
          <Link
            href={publicProfileHref}
            className='text-muted-foreground hover:text-foreground shrink-0 rounded-md p-1 transition-colors'
            aria-label={getSettingsNavLabel("viewPublicProfile", language)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <ExternalLink className='size-4' aria-hidden />
          </Link>
        </div>

        <nav
          className='flex flex-col gap-0.5 p-2'
          aria-label={getSettingsNavLabel("settingsNav", language)}
        >
          <NavLinkItem
            href='/settings/profile'
            label={getSettingsNavLabel("profile", language)}
            icon={User}
            isActive={activeTab === "profile"}
          />

          {CV_NAV_ITEMS.map((item) => (
            <NavLinkItem
              key={item.tab}
              href={item.href}
              label={getSettingsNavLabel(item.labelKey, language)}
              icon={item.icon}
              isActive={activeTab === item.tab}
            />
          ))}

          <Separator className='my-1.5' />

          <NavLinkItem
            href='/settings/password'
            label={getSettingsNavLabel("password", language)}
            icon={KeyRound}
            isActive={activeTab === "password"}
          />

          <NavLinkItem
            href='/settings/system'
            label={getSettingsNavLabel("system", language)}
            icon={Settings}
            isActive={activeTab === "system"}
          />
        </nav>
      </Card>
    </aside>
  );
}
