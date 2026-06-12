import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { DEFAULT_USER_ROLE } from "../config";
import type { UserRole } from "../types";
import { authOptions } from "./auth-options";
import { getServerJwt, isAuthenticatedJwt } from "./get-server-jwt";

function buildSessionFromJwt(
  token: NonNullable<Awaited<ReturnType<typeof getServerJwt>>>
): Session {
  const userId = (token.id ?? token.sub) as string;

  return {
    user: {
      id: userId,
      email: (token.email as string | undefined) ?? "",
      name: (token.name as string | undefined) ?? null,
      image: (token.picture as string | undefined) ?? null,
      role: (token.role as UserRole | undefined) ?? DEFAULT_USER_ROLE,
    },
    accessToken:
      typeof token.accessToken === "string" ? token.accessToken : undefined,
    expires:
      typeof token.exp === "number"
        ? new Date(token.exp * 1000).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Server Components: require login or redirect to /login with callbackUrl.
 * Uses JWT cookie (same as middleware) to avoid redirect loops.
 */
export async function requireSession(callbackPath?: string): Promise<Session> {
  const token = await getServerJwt();

  if (!isAuthenticatedJwt(token) || !token) {
    const query =
      callbackPath &&
      callbackPath.startsWith("/") &&
      !callbackPath.startsWith("//")
        ? `?callbackUrl=${encodeURIComponent(callbackPath)}`
        : "";
    redirect(`/login${query}`);
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return {
      ...session,
      accessToken:
        session.accessToken ??
        (typeof token.accessToken === "string" ? token.accessToken : undefined),
    };
  }

  return buildSessionFromJwt(token);
}
