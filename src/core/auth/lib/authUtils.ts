import type { Session } from "next-auth";

import type { OnboardingStep } from "@/core/api/types/enums";

import { DEFAULT_USER_ROLE, PUBLIC_ROLE } from "../config";
import type { Role, UserRole } from "../types";

export function needsOnboarding(step: OnboardingStep | undefined): boolean {
  return step !== undefined && step !== "completed";
}

export function shouldRequireOnboarding(
  role: UserRole,
  step: OnboardingStep | undefined
): boolean {
  if (role === "creator") {
    return false;
  }

  return needsOnboarding(step);
}

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

export function getRedirectUrl(_role: UserRole): string {
  return "/";
}
