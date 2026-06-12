"use client";

import { SettingsPageShell } from "./SettingsPageShell";
import { SettingsCreatorGate } from "./SettingsCreatorGate";
import { ExperiencesSettingsForm } from "./ExperiencesSettingsForm";

export function SettingsExperiencesPageClient() {
  return (
    <SettingsPageShell
      activeTab='experiences'
      callbackPath='/settings/experiences'
    >
      {(profile, language) => (
        <SettingsCreatorGate
          section='experiences'
          isCreator={profile.role === "creator"}
          language={language}
        >
          <ExperiencesSettingsForm language={language} />
        </SettingsCreatorGate>
      )}
    </SettingsPageShell>
  );
}
