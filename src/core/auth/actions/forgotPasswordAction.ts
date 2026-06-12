"use server";

import { forgotPassword } from "@/core/api/endpoints/auth";

import { mapApiAuthFailure } from "../lib/map-api-auth-error";
import { forgotPasswordSchema } from "../validations";
import type { ActionResponse } from "../types";

export async function forgotPasswordAction(
  input: unknown
): Promise<ActionResponse> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Invalid email",
    };
  }

  const result = await forgotPassword({ email: parsed.data.email });

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  return { success: true, message: result.message };
}
