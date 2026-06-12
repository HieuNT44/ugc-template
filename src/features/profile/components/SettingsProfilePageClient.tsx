"use client";

import { profileToSettingsFormDefaults } from "../lib/profile-form-defaults";
import { SettingsProfileForm } from "./SettingsProfileForm";
import { SettingsPageShell } from "./settings/SettingsPageShell";

export function SettingsProfilePageClient() {
  return (
    <SettingsPageShell activeTab='profile' callbackPath='/settings/profile'>
      {(profile) => (
        <SettingsProfileForm
          profile={profile}
          defaultValues={profileToSettingsFormDefaults(profile)}
        />
      )}
    </SettingsPageShell>
  );
}
