import type { Session } from "next-auth";

import { mapApiRoleToAppRole } from "@/core/api/mappers/auth-user.mapper";
import type {
  ApiProfile,
  ApiUser,
  CreatorProfile,
  ProfileUpdatePayload,
  ReaderCreatorProfile,
  UserSettings,
} from "@/core/api/types";
import type { UserRole } from "@/core/auth/types";
import type { Profile } from "@/features/profile/types";
import type { AppUserSettings } from "@/features/profile/types/settings";

function isReaderCreatorProfile(
  profile: ApiProfile
): profile is ReaderCreatorProfile {
  return "onboarding_step" in profile;
}

function isCreatorProfile(profile: ApiProfile): profile is CreatorProfile {
  return (
    isReaderCreatorProfile(profile) &&
    ("experiences" in profile ||
      "educations" in profile ||
      "certifications" in profile ||
      "accomplishments" in profile)
  );
}

export function mapApiSettingsToAppSettings(
  settings: UserSettings
): AppUserSettings {
  return {
    darkMode: settings.dark_mode,
    language: settings.language,
    timezone: settings.timezone,
    emailNotify: settings.email_notify,
    inappNotify: settings.inapp_notify,
    privacyHideEmail: settings.privacy_hide_email,
    updatedAt: settings.updated_at,
  };
}

export function mapAppSettingsToApiPayload(
  settings: Partial<AppUserSettings>
): import("@/core/api/types").UserSettingsUpdatePayload {
  return {
    ...(settings.darkMode !== undefined
      ? { dark_mode: settings.darkMode }
      : {}),
    ...(settings.language !== undefined ? { language: settings.language } : {}),
    ...(settings.timezone !== undefined ? { timezone: settings.timezone } : {}),
    ...(settings.emailNotify !== undefined
      ? { email_notify: settings.emailNotify }
      : {}),
    ...(settings.inappNotify !== undefined
      ? { inapp_notify: settings.inappNotify }
      : {}),
    ...(settings.privacyHideEmail !== undefined
      ? { privacy_hide_email: settings.privacyHideEmail }
      : {}),
  };
}

/** Maps GET /profile + GET /auth/me for the profile overview page. */
export function mapProfileOverview(input: {
  apiProfile: ApiProfile;
  apiUser: ApiUser;
}): Profile {
  const { apiProfile, apiUser } = input;
  const role = mapApiRoleToAppRole(apiUser.role);
  const community = isReaderCreatorProfile(apiProfile);
  const creatorProfile = community ? (apiProfile as CreatorProfile) : null;

  return {
    id: apiProfile.id,
    name: apiProfile.full_name ?? null,
    email: apiUser.email,
    image: apiProfile.avatar_url ?? null,
    coverUrl: community ? (apiProfile.cover_url ?? null) : null,
    role,
    bio: apiProfile.bio ?? null,
    website: community ? (apiProfile.website_url ?? null) : null,
    country: community ? (apiProfile.location ?? null) : null,
    createdAt: apiProfile.created_at ?? null,
    username: apiProfile.username ?? null,
    headline: apiProfile.headline ?? null,
    location: community ? (apiProfile.location ?? null) : null,
    industry: community ? (apiProfile.industry ?? null) : null,
    skills: community ? (apiProfile.skills ?? []) : [],
    isPublic: community ? apiProfile.is_public : undefined,
    onboardingStep: community ? apiProfile.onboarding_step : undefined,
    githubUrl: community ? (apiProfile.github_url ?? null) : null,
    facebookUrl: community ? (apiProfile.facebook_url ?? null) : null,
    lineUrl: community ? (apiProfile.line_url ?? null) : null,
    linkedinUrl: community ? (apiProfile.linkedin_url ?? null) : null,
    xUrl: community ? (apiProfile.x_url ?? null) : null,
    youtubeUrl: community ? (apiProfile.youtube_url ?? null) : null,
    verifyExpert: apiUser.expert_status === "approved",
    fields: community ? (apiProfile.skills ?? []) : [],
    posts: 0,
    following: 0,
    followers: 0,
    likes: 0,
    committed: 0,
    creatorResources:
      role === "creator" && creatorProfile
        ? {
            experiences: creatorProfile.experiences ?? [],
            educations: creatorProfile.educations ?? [],
            certifications: creatorProfile.certifications ?? [],
            accomplishments: creatorProfile.accomplishments ?? [],
          }
        : undefined,
  };
}

export function mapApiProfileToAppProfile(input: {
  apiProfile: ApiProfile;
  session: Session;
  apiUser?: ApiUser | null;
  settings?: AppUserSettings | null;
}): Profile {
  const { apiProfile, session, apiUser, settings } = input;
  const role = (session.user?.role ??
    (apiUser ? mapApiRoleToAppRole(apiUser.role) : "reader")) as UserRole;
  const community = isReaderCreatorProfile(apiProfile);

  return {
    id: apiProfile.id,
    name: apiProfile.full_name ?? session.user?.name ?? null,
    email: session.user?.email ?? apiUser?.email ?? null,
    image: apiProfile.avatar_url ?? session.user?.image ?? null,
    role,
    bio: apiProfile.bio ?? null,
    website: community ? (apiProfile.website_url ?? null) : null,
    country: community ? (apiProfile.location ?? null) : null,
    createdAt: apiProfile.created_at ?? null,
    username: apiProfile.username ?? null,
    headline: apiProfile.headline ?? null,
    location: community ? (apiProfile.location ?? null) : null,
    industry: community ? (apiProfile.industry ?? null) : null,
    skills: community ? (apiProfile.skills ?? []) : [],
    isPublic: community ? apiProfile.is_public : undefined,
    onboardingStep: community ? apiProfile.onboarding_step : undefined,
    githubUrl: community ? (apiProfile.github_url ?? null) : null,
    facebookUrl: community ? (apiProfile.facebook_url ?? null) : null,
    lineUrl: community ? (apiProfile.line_url ?? null) : null,
    linkedinUrl: community ? (apiProfile.linkedin_url ?? null) : null,
    xUrl: community ? (apiProfile.x_url ?? null) : null,
    youtubeUrl: community ? (apiProfile.youtube_url ?? null) : null,
    verifyExpert: apiUser?.expert_status === "approved",
    fields: community ? (apiProfile.skills ?? []) : [],
    settings: settings ?? null,
    posts: 0,
    following: 0,
    followers: 0,
    likes: 0,
    committed: 0,
    creatorResources: isCreatorProfile(apiProfile)
      ? {
          experiences: apiProfile.experiences,
          educations: apiProfile.educations,
          certifications: apiProfile.certifications,
          accomplishments: apiProfile.accomplishments,
        }
      : undefined,
  };
}

export function mapBecomeCreatorFormToUpdatePayload(data: {
  name: string;
  bio: string;
  country?: string;
  website?: string;
  topics: string[];
}): ProfileUpdatePayload {
  return {
    full_name: data.name.trim(),
    bio: data.bio.trim(),
    location: data.country?.trim() || null,
    website_url: data.website?.trim() || null,
    skills: data.topics,
  };
}

export function mapProfileFormToUpdatePayload(data: {
  name?: string;
  username?: string;
  headline?: string;
  bio?: string;
  location?: string;
  country?: string;
  website?: string;
  industry?: string;
  skills?: string[];
  githubUrl?: string;
  facebookUrl?: string;
  lineUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
  youtubeUrl?: string;
  isPublic?: boolean;
}): ProfileUpdatePayload {
  const payload: ProfileUpdatePayload = {};

  if (data.name !== undefined) {
    payload.full_name = data.name.trim() || null;
  }
  if (data.username !== undefined) {
    payload.username = data.username.trim() || null;
  }
  if (data.headline !== undefined) {
    payload.headline = data.headline.trim() || null;
  }
  if (data.bio !== undefined) {
    payload.bio = data.bio.trim() || null;
  }
  const location = data.location ?? data.country;
  if (location !== undefined) {
    payload.location = location.trim() || null;
  }
  if (data.website !== undefined) {
    payload.website_url = data.website.trim() || null;
  }
  if (data.industry !== undefined) {
    payload.industry = data.industry.trim() || null;
  }
  if (data.skills !== undefined) {
    payload.skills = data.skills;
  }
  if (data.githubUrl !== undefined) {
    payload.github_url = data.githubUrl.trim() || null;
  }
  if (data.facebookUrl !== undefined) {
    payload.facebook_url = data.facebookUrl.trim() || null;
  }
  if (data.lineUrl !== undefined) {
    payload.line_url = data.lineUrl.trim() || null;
  }
  if (data.linkedinUrl !== undefined) {
    payload.linkedin_url = data.linkedinUrl.trim() || null;
  }
  if (data.xUrl !== undefined) {
    payload.x_url = data.xUrl.trim() || null;
  }
  if (data.youtubeUrl !== undefined) {
    payload.youtube_url = data.youtubeUrl.trim() || null;
  }
  if (data.isPublic !== undefined) {
    payload.is_public = data.isPublic;
  }

  return payload;
}
