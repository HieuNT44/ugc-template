"use server";

import { z } from "zod";

import type { ActionResponse } from "@/core/auth/types";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "確認トークンは必須です"),
});

export async function verifyEmailAction(
  input: unknown
): Promise<ActionResponse> {
  const parsed = verifyEmailSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.flatten().fieldErrors.token?.[0] ?? "トークンが無効です",
    };
  }

  return { success: true };
}
