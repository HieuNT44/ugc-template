"use server";

import { registerCreator, registerReader } from "@/core/api/endpoints/auth";

import { createAuthSessionSuccess } from "../lib/create-auth-session-result";
import { mapApiAuthFailure } from "../lib/map-api-auth-error";
import { registerSchema } from "../validations";
import type { RegisterResponse } from "../types";

interface RegisterActionOptions {
  asCreator?: boolean;
}

export async function registerAction(
  input: unknown,
  options?: RegisterActionOptions
): Promise<RegisterResponse> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message =
      fieldErrors.email?.[0] ??
      fieldErrors.password?.[0] ??
      fieldErrors.confirmPassword?.[0] ??
      fieldErrors.full_name?.[0] ??
      fieldErrors.username?.[0] ??
      "登録内容が正しくありません";
    return { success: false, error: message, fieldErrors };
  }

  const payload = {
    email: parsed.data.email,
    username: parsed.data.username,
    full_name: parsed.data.full_name,
    password: parsed.data.password,
    password_confirmation: parsed.data.confirmPassword,
  };

  const result = options?.asCreator
    ? await registerCreator(payload)
    : await registerReader(payload);

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  return createAuthSessionSuccess(result.data);
}
