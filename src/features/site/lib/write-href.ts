import type { UserRole } from "@/core/auth/types";

export const CREATE_CONTENT_PATH = "/studio/create";

function isSafeInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function getWriteHref(options: {
  isAuthenticated: boolean;
  role?: UserRole;
}): string {
  const { isAuthenticated, role } = options;
  const canWrite = role === "creator";

  if (canWrite) {
    return CREATE_CONTENT_PATH;
  }

  if (isAuthenticated) {
    return "/profile/become-creator";
  }

  return `/login?callbackUrl=${encodeURIComponent(CREATE_CONTENT_PATH)}`;
}

export function resolveLoginCallbackUrl(
  callbackUrl: string | undefined,
  fallback: string
): string {
  if (!callbackUrl || !isSafeInternalPath(callbackUrl)) {
    return fallback;
  }
  return callbackUrl;
}
