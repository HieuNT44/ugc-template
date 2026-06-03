"use server";

import {
  getAdminAuth,
  isFirebaseAdminConfigured,
} from "@/core/auth/lib/firebase-admin";
import { ensureUserProfile } from "@/core/auth/lib/user-repository";
import { getRedirectUrl } from "@/core/auth/lib/authUtils";
import { loginSchema } from "@/core/auth/validations";
import type { LoginResponse } from "@/core/auth/types";

export async function loginAction(
  input: unknown,
  idToken?: string
): Promise<LoginResponse> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.flatten().fieldErrors.email?.[0] ??
      parsed.error.flatten().fieldErrors.password?.[0] ??
      "Invalid login credentials";
    return { success: false, error: message };
  }

  if (!idToken) {
    return { success: false, error: "Authentication token is required" };
  }

  if (!isFirebaseAdminConfigured()) {
    return {
      success: false,
      error: "Authentication service is not configured",
    };
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const profile = await ensureUserProfile({
      uid: decoded.uid,
      email: decoded.email ?? parsed.data.email,
      name: decoded.name ?? parsed.data.email.split("@")[0] ?? "User",
      emailVerified: decoded.email_verified ?? false,
    });

    if (profile.status === "banned") {
      return { success: false, error: "Your account has been suspended" };
    }

    return { success: true, redirectTo: getRedirectUrl(profile.role) };
  } catch {
    return { success: false, error: "Invalid email or password" };
  }
}
