"use client";

import { useEffect, useState } from "react";

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

type ThemeMode = "light" | "dark" | "system";
type FontSize = "sm" | "md" | "lg";

const FONT_SIZE_CLASS: Record<FontSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("ugc-theme");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function readStoredFontSize(): FontSize {
  if (typeof window === "undefined") return "md";
  const stored = localStorage.getItem("ugc-font-size");
  if (stored === "sm" || stored === "md" || stored === "lg") {
    return stored;
  }
  return "md";
}

interface AppearanceSettingsProps {
  settings: AppUserSettings;
}

export function AppearanceSettings({ settings }: AppearanceSettingsProps) {
  const [theme, setTheme] = useState<ThemeMode>(
    settings.darkMode ? "dark" : readStoredTheme()
  );
  const [fontSize, setFontSize] = useState<FontSize>(readStoredFontSize);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ugc-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(FONT_SIZE_CLASS[fontSize]);
    localStorage.setItem("ugc-font-size", fontSize);
  }, [fontSize]);

  async function handleSaveTheme() {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    const darkMode = theme === "dark";
    const result = await updateProfileSettingsAction({
      darkMode,
      language: settings.language,
      timezone: settings.timezone,
    });

    setIsLoading(false);
    if (!result.success) {
      setError(result.error ?? "Failed to save appearance settings");
      return;
    }

    setMessage(result.message ?? "Appearance settings saved");
  }

  return (
    <Card className='AppearanceSettings'>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize theme and font size.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
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

        <div className='space-y-2'>
          <Label>Theme</Label>
          <div className='flex flex-wrap gap-2'>
            {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
              <Button
                key={mode}
                type='button'
                variant={theme === mode ? "default" : "outline"}
                size='sm'
                onClick={() => setTheme(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Font size</Label>
          <div className='flex flex-wrap gap-2'>
            {(["sm", "md", "lg"] as FontSize[]).map((size) => (
              <Button
                key={size}
                type='button'
                variant={fontSize === size ? "default" : "outline"}
                size='sm'
                onClick={() => setFontSize(size)}
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <Button type='button' onClick={handleSaveTheme} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save appearance"}
        </Button>
      </CardContent>
    </Card>
  );
}
