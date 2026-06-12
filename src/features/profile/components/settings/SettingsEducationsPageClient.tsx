"use client";

import { SettingsPageShell } from "./SettingsPageShell";
import { SettingsCreatorGate } from "./SettingsCreatorGate";
import { EducationsSettingsForm } from "./EducationsSettingsForm";

export function SettingsEducationsPageClient() {
  return (
    <SettingsPageShell
      activeTab='educations'
      callbackPath='/settings/educations'
    >
      {(profile, language) => (
        <SettingsCreatorGate
          section='educations'
          isCreator={profile.role === "creator"}
          language={language}
        >
          <EducationsSettingsForm language={language} />
        </SettingsCreatorGate>
      )}
    </SettingsPageShell>
  );
}
