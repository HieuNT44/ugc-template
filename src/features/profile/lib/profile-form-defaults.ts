import type {
  CommunityProfileFormData,
  SettingsProfileFormData,
} from "../validations";
import type { Profile } from "../types";

export function profileToEditFormDefaults(
  profile: Profile
): CommunityProfileFormData {
  return {
    name: profile.name ?? "",
    username: profile.username ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? profile.country ?? "",
    website: profile.website ?? "",
    githubUrl: profile.githubUrl ?? "",
    facebookUrl: profile.facebookUrl ?? "",
    lineUrl: profile.lineUrl ?? "",
  };
}

export function profileToSettingsFormDefaults(
  profile: Profile
): SettingsProfileFormData {
  return {
    name: profile.name ?? "",
    username: profile.username ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    industry: profile.industry ?? "",
    skills: profile.skills?.length ? profile.skills : [""],
    location: profile.location ?? profile.country ?? "",
    website: profile.website ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    githubUrl: profile.githubUrl ?? "",
    xUrl: profile.xUrl ?? "",
    facebookUrl: profile.facebookUrl ?? "",
    lineUrl: profile.lineUrl ?? "",
    youtubeUrl: profile.youtubeUrl ?? "",
  };
}
