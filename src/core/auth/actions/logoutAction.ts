"use server";

import { logout } from "@/core/api/endpoints/auth";

import { getServerAccessToken } from "../lib/get-server-access-token";

export async function logoutAction(): Promise<{
  success: true;
  redirectTo: string;
}> {
  const accessToken = await getServerAccessToken();

  if (accessToken) {
    await logout(accessToken);
  }

  return {
    success: true,
    redirectTo: "/",
  };
}
