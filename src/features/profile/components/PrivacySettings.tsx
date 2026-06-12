"use client";

import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  updateProfileSettingsAction,
  updateProfileVisibilityAction,
} from "@/features/profile/actions/settings";

import type { Profile } from "../types";
import type { AppUserSettings } from "../types/settings";

interface PrivacySettingsProps {
  profile: Profile;
  settings: AppUserSettings;
}

export function PrivacySettings({ profile, settings }: PrivacySettingsProps) {
  const [isPublic, setIsPublic] = useState(profile.isPublic ?? true);
  const [privacyHideEmail, setPrivacyHideEmail] = useState(
    settings.privacyHideEmail
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    const [visibilityResult, settingsResult] = await Promise.all([
      updateProfileVisibilityAction(isPublic),
      updateProfileSettingsAction({ privacyHideEmail }),
    ]);

    setIsLoading(false);

    if (!visibilityResult.success) {
      setError(visibilityResult.error ?? "Failed to update privacy settings");
      return;
    }

    if (!settingsResult.success) {
      setError(settingsResult.error ?? "Failed to update privacy settings");
      return;
    }

    setMessage("Privacy settings updated");
  }

  return (
    <Card className='PrivacySettings'>
      <CardHeader>
        <CardTitle>Privacy settings</CardTitle>
        <CardDescription>
          Control who can see your profile and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error ? (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {message ? (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <label className='flex items-center justify-between gap-4'>
          <Label className='font-normal'>Public profile</Label>
          <input
            type='checkbox'
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
            aria-label='Public profile'
          />
        </label>

        <label className='flex items-center justify-between gap-4'>
          <Label className='font-normal'>Hide email on public profile</Label>
          <input
            type='checkbox'
            checked={privacyHideEmail}
            onChange={(event) => setPrivacyHideEmail(event.target.checked)}
            aria-label='Hide email on public profile'
          />
        </label>

        <Button type='button' onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save privacy settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
