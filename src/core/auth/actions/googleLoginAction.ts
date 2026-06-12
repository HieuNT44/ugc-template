"use server";

import { loginWithGoogle } from "@/core/api/endpoints/auth";
import type { ApiUserRole } from "@/core/api/types/enums";

import { createAuthSessionSuccess } from "../lib/create-auth-session-result";
import { mapApiAuthFailure } from "../lib/map-api-auth-error";
import type { AuthSessionResponse } from "../types";

export async function googleLoginAction(
  idToken: string,
  role?: ApiUserRole
): Promise<AuthSessionResponse> {
  if (!idToken.trim()) {
    return { success: false, error: "Googleログインに失敗しました" };
  }

  const result = await loginWithGoogle({
    id_token: idToken,
    ...(role ? { role } : {}),
  });

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  return createAuthSessionSuccess(result.data);
}
