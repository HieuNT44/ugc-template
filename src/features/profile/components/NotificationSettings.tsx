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
import { updateProfileSettingsAction } from "@/features/profile/actions/settings";

import type { AppUserSettings } from "../types/settings";

interface NotificationSettingsProps {
  settings: AppUserSettings;
}

export function NotificationSettings({ settings }: NotificationSettingsProps) {
  const [emailNotify, setEmailNotify] = useState(settings.emailNotify);
  const [inappNotify, setInappNotify] = useState(settings.inappNotify);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    const result = await updateProfileSettingsAction({
      emailNotify,
      inappNotify,
    });

    setIsLoading(false);
    if (!result.success) {
      setError(result.error ?? "通知設定の更新に失敗しました");
      return;
    }

    setMessage(result.message ?? "通知設定を保存しました");
  }

  return (
    <Card className='NotificationSettings'>
      <CardHeader>
        <CardTitle>Notification preferences</CardTitle>
        <CardDescription>
          Manage email and in-app notifications from your account.
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
          <Label className='font-normal'>メール通知</Label>
          <input
            type='checkbox'
            checked={emailNotify}
            onChange={(event) => setEmailNotify(event.target.checked)}
            aria-label='メール通知'
          />
        </label>

        <label className='flex items-center justify-between gap-4'>
          <Label className='font-normal'>アプリ内通知</Label>
          <input
            type='checkbox'
            checked={inappNotify}
            onChange={(event) => setInappNotify(event.target.checked)}
            aria-label='アプリ内通知'
          />
        </label>

        <Button type='button' onClick={handleSave} disabled={isLoading}>
          {isLoading ? "保存中..." : "設定を保存"}
        </Button>
      </CardContent>
    </Card>
  );
}
