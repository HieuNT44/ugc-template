"use server";

import type { RegisterResponse } from "@/features/auth/types";
import { registerSchema } from "@/features/auth/validations";

export async function registerAction(
  input: unknown
): Promise<RegisterResponse> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message =
      fieldErrors.email?.[0] ??
      fieldErrors.password?.[0] ??
      fieldErrors.confirmPassword?.[0] ??
      fieldErrors.name?.[0] ??
      "Invalid registration data";
    return { success: false, error: message };
  }

  return { success: true, userId: "" };
}
