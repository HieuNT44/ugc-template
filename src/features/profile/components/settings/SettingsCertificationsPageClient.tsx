"use client";

import { SettingsPageShell } from "./SettingsPageShell";
import { SettingsCreatorGate } from "./SettingsCreatorGate";
import { CertificationsSettingsForm } from "./CertificationsSettingsForm";

export function SettingsCertificationsPageClient() {
  return (
    <SettingsPageShell
      activeTab='certifications'
      callbackPath='/settings/certifications'
    >
      {(profile, language) => (
        <SettingsCreatorGate
          section='certifications'
          isCreator={profile.role === "creator"}
          language={language}
        >
          <CertificationsSettingsForm language={language} />
        </SettingsCreatorGate>
      )}
    </SettingsPageShell>
  );
}
