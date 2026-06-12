"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthGuard } from "@/core/auth/components/AuthGuard";
import type { AppLanguage } from "@/core/api/types/enums";

import { useProfileOverview } from "../../hooks/use-profile-overview";
import type { Profile } from "../../types";
import {
  SettingsProfileSidebar,
  type SettingsSidebarTab,
} from "../SettingsProfileSidebar";

interface SettingsPageShellProps {
  activeTab: SettingsSidebarTab;
  callbackPath: string;
  children: (profile: Profile, language: AppLanguage) => React.ReactNode;
}

function SettingsPageContent({
  activeTab,
  children,
}: {
  activeTab: SettingsSidebarTab;
  children: (profile: Profile, language: AppLanguage) => React.ReactNode;
}) {
  const { profile, isLoading, error, refetch } = useProfileOverview();

  if (isLoading) {
    return (
      <div className='SettingsPageShell space-y-4'>
        <Skeleton className='h-14 w-full md:hidden' />
        <div className='flex flex-col gap-4 md:flex-row'>
          <Skeleton className='h-64 w-full md:w-56' />
          <Skeleton className='h-96 min-w-0 flex-1' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertDescription className='flex flex-col gap-3'>
          <span>{error}</span>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert>
        <AlertDescription>
          プロフィールデータを利用できません。
        </AlertDescription>
      </Alert>
    );
  }

  const language = (profile.settings?.language ?? "en") satisfies AppLanguage;

  return (
    <div className='SettingsPageShell flex flex-col gap-4 md:flex-row md:items-start'>
      <SettingsProfileSidebar
        profile={profile}
        activeTab={activeTab}
        language={language}
      />
      <div className='min-w-0 flex-1'>{children(profile, language)}</div>
    </div>
  );
}

export function SettingsPageShell({
  activeTab,
  callbackPath,
  children,
}: SettingsPageShellProps) {
  return (
    <AuthGuard callbackPath={callbackPath}>
      <SettingsPageContent activeTab={activeTab}>
        {children}
      </SettingsPageContent>
    </AuthGuard>
  );
}
