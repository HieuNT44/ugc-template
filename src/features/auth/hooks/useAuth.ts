"use client";

import { getSessionRole, isAuthenticated } from "@/features/auth/lib/authUtils";
import type { Role } from "@/features/auth/types";

import { useSession } from "./useSession";

export function useAuth() {
  const { session, isLoading, isAuthenticated: authenticated } = useSession();

  const role: Role = getSessionRole(session);
  const user = authenticated
    ? {
        id: session?.user?.id ?? "",
        email: session?.user?.email ?? "",
        name: session?.user?.name ?? "",
        avatar: session?.user?.image ?? undefined,
        role,
        status: "active" as const,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : null;

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(session),
    role,
  };
}
