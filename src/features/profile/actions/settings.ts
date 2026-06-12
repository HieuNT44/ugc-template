"use server";

import { revalidatePath } from "next/cache";

import {
  getProfileSettings,
  updateProfile,
  updateProfileSettings,
} from "@/core/api/endpoints/profile";
import {
  mapApiSettingsToAppSettings,
  mapAppSettingsToApiPayload,
  mapProfileFormToUpdatePayload,
} from "@/core/api/mappers/profile.mapper";
import { mapApiAuthFailure } from "@/core/auth/lib/map-api-auth-error";
import { requireApiSession } from "@/core/auth/lib/require-api-session";

import type { ActionState } from "../types";
import type { AppUserSettings } from "../types/settings";

export async function getProfileSettingsAction(): Promise<AppUserSettings | null> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return null;
  }

  const result = await getProfileSettings(apiSession.accessToken);
  if (!result.ok) {
    return null;
  }

  return mapApiSettingsToAppSettings(result.data);
}

export async function updateProfileSettingsAction(
  input: Partial<AppUserSettings>
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  const result = await updateProfileSettings(
    apiSession.accessToken,
    mapAppSettingsToApiPayload(input)
  );

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  revalidatePath("/profile/settings");
  return { success: true, message: "Settings updated successfully" };
}

export async function updateProfileVisibilityAction(
  isPublic: boolean
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  const result = await updateProfile(
    apiSession.accessToken,
    mapProfileFormToUpdatePayload({ isPublic })
  );

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/settings");
  return { success: true, message: "Privacy settings updated" };
}
