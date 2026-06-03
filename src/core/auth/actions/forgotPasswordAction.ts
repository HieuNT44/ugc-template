"use server";

import type { ActionResponse } from "@/core/auth/types";
import { forgotPasswordSchema } from "@/core/auth/validations";

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

  return { success: true };
}
