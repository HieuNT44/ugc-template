"use client";

import type { Role } from "@/core/auth/types";

import { useAuth } from "../hooks/useAuth";

interface RoleGuardProps {
  allowedRoles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  fallback = null,
  children,
}: RoleGuardProps) {
  const { isLoading, role } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
