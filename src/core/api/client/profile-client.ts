"use client";

import type {
  ApiProfile,
  ProfileUpdatePayload,
  UserSettings,
  UserSettingsUpdatePayload,
} from "../types";

import { clientApiRequest } from "./fetch-api";
import type { AppLanguage } from "../types/enums";

export async function getProfileClient(token: string, language?: AppLanguage) {
  return clientApiRequest<ApiProfile>({
    path: "/profile",
    method: "GET",
    token,
    language,
    redirectOnUnauthorized: false,
  });
}

export async function completeOnboardingClient(
  token: string,
  language?: AppLanguage
) {
  return clientApiRequest<ApiProfile>({
    path: "/profile/onboarding/complete",
    method: "POST",
    token,
    language,
    redirectOnUnauthorized: false,
  });
}

export async function updateProfileClient(
  token: string,
  payload: ProfileUpdatePayload,
  language?: AppLanguage
) {
  return clientApiRequest<ApiProfile>({
    path: "/profile",
    method: "PUT",
    token,
    body: payload,
    language,
  });
}

export async function getProfileSettingsClient(
  token: string,
  language?: AppLanguage
) {
  return clientApiRequest<UserSettings>({
    path: "/profile/settings",
    method: "GET",
    token,
    language,
  });
}

export async function updateProfileSettingsClient(
  token: string,
  payload: UserSettingsUpdatePayload,
  language?: AppLanguage
) {
  return clientApiRequest<UserSettings>({
    path: "/profile/settings",
    method: "PUT",
    token,
    body: payload,
    language,
  });
}
