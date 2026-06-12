import { mapApiRoleToAppRole } from "@/core/api/mappers/auth-user.mapper";
import type { AuthToken } from "@/core/api/types";

import type { AuthSessionSuccess } from "../types";
import { getRedirectUrl } from "./authUtils";

export function createAuthSessionSuccess(auth: AuthToken): AuthSessionSuccess {
  const role = mapApiRoleToAppRole(auth.user.role);

  return {
    success: true,
    accessToken: auth.access_token,
    expiresAt: auth.expires_at,
    redirectTo: getRedirectUrl(role),
  };
}
