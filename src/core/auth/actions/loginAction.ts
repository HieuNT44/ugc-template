"use server";

import { login } from "@/core/api/endpoints/auth";

import { createAuthSessionSuccess } from "../lib/create-auth-session-result";
import { mapApiAuthFailure } from "../lib/map-api-auth-error";
import { loginSchema } from "../validations";
import type { LoginResponse } from "../types";

export async function loginAction(input: unknown): Promise<LoginResponse> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message =
      fieldErrors.email?.[0] ??
      fieldErrors.password?.[0] ??
      "Invalid login credentials";
    return { success: false, error: message, fieldErrors };
  }

  const result = await login({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  return createAuthSessionSuccess(result.data);
}
