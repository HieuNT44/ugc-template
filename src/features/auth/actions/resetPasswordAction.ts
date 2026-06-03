"use server";

import { resetPasswordSchema } from "@/features/auth/validations";
import type { ActionResponse } from "@/features/auth/types";

export async function resetPasswordAction(
  input: unknown
): Promise<ActionResponse> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message =
      fieldErrors.password?.[0] ??
      fieldErrors.confirmPassword?.[0] ??
      "Invalid password data";
    return { success: false, error: message };
  }

  return { success: true };
}
