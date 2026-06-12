import type { UserRole } from "@/core/auth/types";

import type { ApiUser } from "../types";

export function mapApiRoleToAppRole(role: ApiUser["role"]): UserRole {
  if (role === "creator") {
    return "creator";
  }
  return "reader";
}

export function mapApiUserToDisplayName(user: ApiUser): string {
  return user.email.split("@")[0] ?? "ユーザー";
}
