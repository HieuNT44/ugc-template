import type { Session } from "next-auth";

import { getMe } from "@/core/api/endpoints/auth";
import {
  getAccomplishments,
  getCertifications,
  getEducations,
  getExperiences,
  getProfile,
  getProfileSettings,
} from "@/core/api/endpoints/profile";
import {
  mapApiProfileToAppProfile,
  mapApiSettingsToAppSettings,
  mapProfileOverview,
} from "@/core/api/mappers/profile.mapper";
import { mapApiRoleToAppRole } from "@/core/api/mappers/auth-user.mapper";
import type { CreatorProfile } from "@/core/api/types";
import { requireApiSession } from "@/core/auth/lib/require-api-session";

import type { Profile, ProfileCreatorResources } from "../types";
import { getMockPublicProfile } from "./mock-public-profile";
import { getProfileUsername } from "./profile-username";

function getCommunitySocialStats(
  profile: Pick<Profile, "name" | "email" | "role" | "username">
): Pick<Profile, "posts" | "following" | "followers"> {
  if (profile.role !== "creator") {
    return { posts: 0, following: 0, followers: 0 };
  }

  const username =
    profile.username ??
    getProfileUsername({ name: profile.name, email: profile.email });
  const publicProfile = getMockPublicProfile(username);

  return {
    posts: publicProfile?.posts ?? 0,
    following: publicProfile?.following ?? 0,
    followers: publicProfile?.followers ?? 0,
  };
}

async function loadCreatorResources(
  accessToken: string,
  apiProfile: CreatorProfile
): Promise<ProfileCreatorResources> {
  const hasNested =
    apiProfile.experiences !== undefined ||
    apiProfile.educations !== undefined ||
    apiProfile.certifications !== undefined ||
    apiProfile.accomplishments !== undefined;

  if (hasNested) {
    return {
      experiences: apiProfile.experiences,
      educations: apiProfile.educations,
      certifications: apiProfile.certifications,
      accomplishments: apiProfile.accomplishments,
    };
  }

  const [experiences, educations, certifications, accomplishments] =
    await Promise.all([
      getExperiences(accessToken),
      getEducations(accessToken),
      getCertifications(accessToken),
      getAccomplishments(accessToken),
    ]);

  return {
    experiences: experiences.ok ? experiences.data : [],
    educations: educations.ok ? educations.data : [],
    certifications: certifications.ok ? certifications.data : [],
    accomplishments: accomplishments.ok ? accomplishments.data : [],
  };
}

/** Profile overview page: GET /auth/me + GET /profile only. */
export async function getProfileOverviewFromSession(
  _session: Session
): Promise<Profile | null> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return null;
  }

  const { accessToken } = apiSession;

  const [profileResult, meResult] = await Promise.all([
    getProfile(accessToken),
    getMe(accessToken),
  ]);

  if (!meResult.ok) {
    return null;
  }

  if (!profileResult.ok) {
    const role = mapApiRoleToAppRole(meResult.data.role);

    return {
      id: meResult.data.id,
      name: null,
      email: meResult.data.email,
      image: null,
      role,
      bio: null,
      country: null,
      website: null,
      createdAt: null,
      username: null,
      posts: 0,
      following: 0,
      followers: 0,
      likes: 0,
      committed: 0,
      githubUrl: null,
      facebookUrl: null,
      lineUrl: null,
      verifyExpert: meResult.data.expert_status === "approved",
      fields: [],
    };
  }

  return mapProfileOverview({
    apiProfile: profileResult.data,
    apiUser: meResult.data,
  });
}

export async function getProfileFromSession(
  session: Session
): Promise<Profile | null> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return null;
  }

  const { accessToken } = apiSession;

  const [profileResult, meResult, settingsResult] = await Promise.all([
    getProfile(accessToken),
    getMe(accessToken),
    getProfileSettings(accessToken),
  ]);

  if (!profileResult.ok) {
    const role = session.user?.role ?? "reader";
    const identity = {
      name: session.user?.name ?? null,
      email: session.user?.email ?? null,
      role,
      username: null,
    };

    return {
      id: session.user?.id ?? "",
      name: identity.name,
      email: identity.email,
      image: session.user?.image ?? null,
      role,
      bio: null,
      country: null,
      website: null,
      createdAt: null,
      ...getCommunitySocialStats(identity),
      likes: 0,
      committed: 0,
      githubUrl: null,
      facebookUrl: null,
      lineUrl: null,
      verifyExpert: false,
      fields: [],
    };
  }

  const settings = settingsResult.ok
    ? mapApiSettingsToAppSettings(settingsResult.data)
    : null;

  let creatorResources: ProfileCreatorResources | undefined;
  if (session.user?.role === "creator") {
    creatorResources = await loadCreatorResources(
      accessToken,
      profileResult.data as CreatorProfile
    );
  }

  const profile = mapApiProfileToAppProfile({
    apiProfile: profileResult.data,
    session,
    apiUser: meResult.ok ? meResult.data : null,
    settings,
  });

  profile.creatorResources = creatorResources;
  Object.assign(profile, getCommunitySocialStats(profile));

  return profile;
}
