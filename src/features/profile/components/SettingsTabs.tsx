"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/core/auth/types";

import {
  getSettingsTabsForRole,
  type SettingsTabId,
} from "../config/profile-permissions";
import { profileToEditFormDefaults } from "../lib/profile-form-defaults";
import type { Profile } from "../types";
import type { AppUserSettings } from "../types/settings";
import { AppearanceSettings } from "./AppearanceSettings";
import { ChangeAvatarSection } from "./ChangeAvatarSection";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { EditProfileForm } from "./EditProfileForm";
import { NotificationSettings } from "./NotificationSettings";
import { PrivacySettings } from "./PrivacySettings";
import { SecuritySettings } from "./SecuritySettings";

const TAB_LABELS: Record<SettingsTabId, string> = {
  edit: "プロフィールを編集",
  avatar: "アバター",
  password: "パスワード",
  security: "セキュリティ",
  notifications: "通知",
  privacy: "プライバシー",
  appearance: "外観",
  delete: "アカウント削除",
};

const DEFAULT_SETTINGS: AppUserSettings = {
  darkMode: false,
  language: "en",
  timezone: "UTC",
  emailNotify: true,
  inappNotify: true,
  privacyHideEmail: false,
  updatedAt: "",
};

function isValidTab(id: string, allowed: SettingsTabId[]): id is SettingsTabId {
  return allowed.includes(id as SettingsTabId);
}

interface SettingsTabsProps {
  profile: Profile;
  role: UserRole;
}

export function SettingsTabs({ profile, role }: SettingsTabsProps) {
  const searchParams = useSearchParams();
  const allowedTabs = getSettingsTabsForRole(role);
  const tabParam = searchParams.get("tab") ?? "";
  const currentTab: SettingsTabId = isValidTab(tabParam, allowedTabs)
    ? tabParam
    : (allowedTabs[0] ?? "edit");
  const settings = profile.settings ?? DEFAULT_SETTINGS;

  return (
    <div className='SettingsTabs space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Profile settings</h1>
        <p className='text-muted-foreground'>
          Manage your account preferences and security.
        </p>
      </div>

      <div className='flex flex-wrap gap-1 border-b'>
        {allowedTabs.map((id) => (
          <Button
            key={id}
            variant='ghost'
            size='sm'
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              currentTab === id && "border-primary"
            )}
            asChild
          >
            <Link href={`/profile/settings?tab=${id}`}>{TAB_LABELS[id]}</Link>
          </Button>
        ))}
      </div>

      <div className='min-h-[200px]'>
        {currentTab === "edit" && (
          <EditProfileForm defaultValues={profileToEditFormDefaults(profile)} />
        )}
        {currentTab === "avatar" && (
          <ChangeAvatarSection
            currentImageUrl={profile.image ?? undefined}
            displayName={profile.name ?? profile.email}
          />
        )}
        {currentTab === "password" && <ChangePasswordForm />}
        {currentTab === "security" && <SecuritySettings />}
        {currentTab === "notifications" && (
          <NotificationSettings settings={settings} />
        )}
        {currentTab === "privacy" && (
          <PrivacySettings profile={profile} settings={settings} />
        )}
        {currentTab === "appearance" && (
          <AppearanceSettings settings={settings} />
        )}
        {currentTab === "delete" && <DeleteAccountSection />}
      </div>
    </div>
  );
}
