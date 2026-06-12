"use client";

import type { AppLanguage } from "@/core/api/types/enums";

import type { Profile } from "../types";

import { ChangePasswordForm } from "./ChangePasswordForm";
import { SettingsProfileSidebar } from "./SettingsProfileSidebar";

interface SettingsPasswordEditorProps {
  profile: Profile;
  language?: AppLanguage;
}

export function SettingsPasswordEditor({
  profile,
  language = "en",
}: SettingsPasswordEditorProps) {
  return (
    <div className='SettingsPasswordEditor flex flex-col gap-4 md:flex-row md:items-start'>
      <SettingsProfileSidebar
        profile={profile}
        activeTab='password'
        language={language}
      />
      <div className='min-w-0 flex-1'>
        <ChangePasswordForm language={language} />
      </div>
    </div>
  );
}
