import type { UserRole } from "../types";

export const roleConfig = {
  roles: ["creator", "reader"] as const satisfies readonly UserRole[],
  permissions: {
    creator: ["read", "write:own", "edit:own", "delete:own"],
    reader: ["read"],
  },
} as const;

export const DEFAULT_USER_ROLE: UserRole = "reader";

export const PUBLIC_ROLE = "guest" as const;
