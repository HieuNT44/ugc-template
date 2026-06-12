"use client";

import { profileToSettingsFormDefaults } from "../lib/profile-form-defaults";
import type { Profile } from "../types";

import { SettingsProfileForm } from "./SettingsProfileForm";
import { SettingsProfileSidebar } from "./SettingsProfileSidebar";

interface SettingsProfileEditorProps {
  profile: Profile;
}

export function SettingsProfileEditor({ profile }: SettingsProfileEditorProps) {
  const defaultValues = profileToSettingsFormDefaults(profile);

  return (
    <div className='SettingsProfileEditor flex flex-col gap-4 md:flex-row md:items-start'>
      <SettingsProfileSidebar profile={profile} activeTab='profile' />
      <div className='min-w-0 flex-1'>
        <SettingsProfileForm profile={profile} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
