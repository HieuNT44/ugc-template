import type { Profile } from "../types";

/** Derive @handle from profile username, name, or email. */
export function getProfileUsername(
  profile: Pick<Profile, "name" | "email" | "username">
): string {
  const fromUsername = profile.username?.trim();
  if (fromUsername) {
    return fromUsername;
  }

  const fromName = profile.name?.trim().replace(/\s+/g, "");
  if (fromName) {
    return fromName;
  }
  return profile.email?.split("@")[0] ?? "user";
}
