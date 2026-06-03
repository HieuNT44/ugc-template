import type { Session } from "next-auth";

import { DEFAULT_USER_ROLE, PUBLIC_ROLE } from "../config";
import type { Role, UserRole } from "../types";

export function isAuthenticated(
  session: Session | null | undefined
): session is Session {
  return !!session?.user?.id;
}

export function getSessionRole(session: Session | null | undefined): Role {
  if (!session?.user?.id) {
    return PUBLIC_ROLE;
  }
  return session.user.role ?? DEFAULT_USER_ROLE;
}

export function hasRole(
  session: Session | null | undefined,
  allowedRoles: Role[]
): boolean {
  const currentRole = getSessionRole(session);
  return allowedRoles.includes(currentRole);
}

export function getRedirectUrl(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "creator":
      return "/studio";
    case "staff":
      return "/staff";
    case "reader":
    default:
      return "/";
  }
}
