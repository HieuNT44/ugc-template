"use server";

import { z } from "zod";

import type { ActionResponse } from "@/features/auth/types";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export async function verifyEmailAction(
  input: unknown
): Promise<ActionResponse> {
  const parsed = verifyEmailSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.token?.[0] ?? "Invalid token",
    };
  }

  return { success: true };
}
