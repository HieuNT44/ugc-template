"use server";

import { resetPassword } from "@/core/api/endpoints/auth";

import { mapApiAuthFailure } from "../lib/map-api-auth-error";
import { resetPasswordSchema } from "../validations";
import type { ActionResponse } from "../types";

export async function resetPasswordAction(
  input: unknown,
  token: string
): Promise<ActionResponse> {
  if (!token.trim()) {
    return {
      success: false,
      error: "リセットリンクが無効、または期限切れです",
    };
  }

  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message =
      fieldErrors.password?.[0] ??
      fieldErrors.confirmPassword?.[0] ??
      "パスワード情報が正しくありません";
    return { success: false, error: message, fieldErrors };
  }

  const result = await resetPassword({
    token,
    password: parsed.data.password,
    password_confirmation: parsed.data.confirmPassword,
  });

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  return { success: true, message: result.message };
}
