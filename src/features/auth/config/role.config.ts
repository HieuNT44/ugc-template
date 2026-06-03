import type { UserRole } from "../types";

export const roleConfig = {
  roles: [
    "admin",
    "creator",
    "reader",
    "staff",
  ] as const satisfies readonly UserRole[],
  permissions: {
    admin: ["*"],
    creator: ["read", "write:own", "edit:own", "delete:own"],
    reader: ["read"],
    staff: ["read", "approve:ai"],
  },
} as const;

export const DEFAULT_USER_ROLE: UserRole = "reader";

export const PUBLIC_ROLE = "guest" as const;
