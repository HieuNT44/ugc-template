"use server";

import { changePassword } from "@/core/api/endpoints/auth";
import { getServerSession } from "next-auth";

import { authOptions } from "../lib/auth-options";
import { getServerAccessToken } from "../lib/get-server-access-token";
import { mapApiAuthFailure } from "../lib/map-api-auth-error";
import type { ActionResponse } from "../types";

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const accessToken = await getServerAccessToken();
  if (!accessToken) {
    return { success: false, error: "Session expired. Please sign in again." };
  }

  const result = await changePassword(accessToken, {
    current_password: input.currentPassword,
    password: input.newPassword,
    password_confirmation: input.confirmPassword,
  });

  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  return { success: true, message: result.message };
}
