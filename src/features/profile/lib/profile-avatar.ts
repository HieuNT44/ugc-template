/** Derive 1–2 letter initials from a username handle. */
export function getUsernameInitials(username: string): string {
  const normalized = username.trim().replace(/^@/, "");
  if (!normalized) {
    return "U";
  }

  const parts = normalized.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }

  return normalized.slice(0, 2).toUpperCase();
}
