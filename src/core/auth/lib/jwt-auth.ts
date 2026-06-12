import type { JWT } from "next-auth/jwt";

/** Shared JWT session check for middleware and server components. */
export function isAuthenticatedJwt(token: JWT | null): boolean {
  if (!token) {
    return false;
  }

  const userId = token.id ?? token.sub;
  return (
    typeof userId === "string" &&
    userId.length > 0 &&
    typeof token.accessToken === "string" &&
    token.accessToken.length > 0
  );
}
