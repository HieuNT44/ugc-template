export function getAvatarInitials(value?: string | null): string {
  const normalized = value?.trim();

  if (!normalized) {
    return "U";
  }

  const nameParts = normalized
    .replace(/@/g, " ")
    .split(/[\s._-]+/)
    .filter(Boolean);

  if (nameParts.length === 0) {
    return normalized[0]?.toUpperCase() ?? "U";
  }

  return nameParts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
