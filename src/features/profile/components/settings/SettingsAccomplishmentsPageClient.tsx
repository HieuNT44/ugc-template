"use client";

import { SettingsPageShell } from "./SettingsPageShell";
import { SettingsCreatorGate } from "./SettingsCreatorGate";
import { AccomplishmentsSettingsForm } from "./AccomplishmentsSettingsForm";

export function SettingsAccomplishmentsPageClient() {
  return (
    <SettingsPageShell
      activeTab='accomplishments'
      callbackPath='/settings/accomplishments'
    >
      {(profile, language) => (
        <SettingsCreatorGate
          section='accomplishments'
          isCreator={profile.role === "creator"}
          language={language}
        >
          <AccomplishmentsSettingsForm language={language} />
        </SettingsCreatorGate>
      )}
    </SettingsPageShell>
  );
}
