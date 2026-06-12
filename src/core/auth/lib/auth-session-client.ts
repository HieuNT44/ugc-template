"use client";

import { signIn, signOut } from "next-auth/react";

import type { AuthSessionSuccess } from "../types";

export async function establishLaravelSession(
  result: AuthSessionSuccess
): Promise<{ ok: boolean; error?: string }> {
  const authResult = await signIn("laravel", {
    accessToken: result.accessToken,
    expiresAt: result.expiresAt ?? "",
    redirect: false,
  });

  if (authResult?.error) {
    return {
      ok: false,
      error:
        authResult.error === "CredentialsSignin"
          ? "セッションを開始できませんでした。もう一度お試しください。"
          : authResult.error,
    };
  }

  return { ok: true };
}

export async function signOutClient(): Promise<void> {
  await signOut({ redirect: false });
}
