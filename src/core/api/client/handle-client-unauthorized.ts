"use client";

import { signOut } from "next-auth/react";

import { isUnauthorizedResponse } from "../lib/is-unauthorized-response";

let isRedirectingToLogin = false;

export function shouldRedirectOnUnauthorized(
  status: number,
  code?: string
): boolean {
  return isUnauthorizedResponse(status, code);
}

/**
 * Clear stale session and redirect to login after a 401 / expired token.
 * Idempotent until the page reloads.
 */
export async function handleClientUnauthorized(): Promise<void> {
  if (typeof window === "undefined" || isRedirectingToLogin) {
    return;
  }

  isRedirectingToLogin = true;

  const callbackUrl = `${window.location.pathname}${window.location.search}`;
  const loginUrl = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  try {
    await signOut({ redirect: false });
  } catch {
    // Continue to login even when sign-out fails
  }

  window.location.replace(loginUrl);
}
