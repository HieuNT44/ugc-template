/** Routes that require an authenticated session (middleware + server layouts). */
export const PROTECTED_ROUTE_PREFIXES = [
  "/settings",
  "/profile",
  "/studio",
] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function buildLoginRedirectUrl(
  requestUrl: string,
  callbackPath: string
): URL {
  const loginUrl = new URL("/login", requestUrl);
  loginUrl.searchParams.set("callbackUrl", callbackPath);
  return loginUrl;
}
