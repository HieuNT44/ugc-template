"use client";

import { SettingsPageShell } from "./SettingsPageShell";
import { SystemSettingsForm } from "./SystemSettingsForm";

export function SettingsSystemPageClient() {
  return (
    <SettingsPageShell activeTab='system' callbackPath='/settings/system'>
      {(_profile, language) => <SystemSettingsForm language={language} />}
    </SettingsPageShell>
  );
}
