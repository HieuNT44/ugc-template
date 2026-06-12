"use client";

import { ChangePasswordForm } from "./ChangePasswordForm";
import { SettingsPageShell } from "./settings/SettingsPageShell";

export function SettingsPasswordPageClient() {
  return (
    <SettingsPageShell activeTab='password' callbackPath='/settings/password'>
      {(_profile, language) => <ChangePasswordForm language={language} />}
    </SettingsPageShell>
  );
}
