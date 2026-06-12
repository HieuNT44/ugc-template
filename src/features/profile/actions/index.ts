"use server";

import { revalidatePath } from "next/cache";

import {
  becomeCreator,
  syncAccomplishments,
  syncCertifications,
  syncEducations,
  syncExperiences,
  updateProfile,
} from "@/core/api/endpoints/profile";
import {
  mapBecomeCreatorFormToUpdatePayload,
  mapProfileFormToUpdatePayload,
} from "@/core/api/mappers/profile.mapper";
import { changePasswordAction as changePasswordApiAction } from "@/core/auth/actions/changePasswordAction";
import { mapApiAuthFailure } from "@/core/auth/lib/map-api-auth-error";
import { requireApiSession } from "@/core/auth/lib/require-api-session";
import { hasProfileFeature } from "../config/profile-permissions";
import type { ActionState } from "../types";
import {
  becomeCreatorApplicationSchema,
  communityProfileSchema,
  parseTopicsFromInput,
  parseSkillsInput,
  settingsProfileSchema,
} from "../validations";

function getStr(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return value === null || value === "" ? undefined : String(value);
}

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (!hasProfileFeature(apiSession.session.user.role, "editProfile")) {
    return { error: "You do not have permission to edit this profile" };
  }

  const raw = {
    name: getStr(formData, "name") ?? "",
    username: getStr(formData, "username") ?? "",
    headline: getStr(formData, "headline") ?? "",
    bio: getStr(formData, "bio") ?? "",
    location: getStr(formData, "location") ?? getStr(formData, "country") ?? "",
    website: getStr(formData, "website") ?? "",
    githubUrl: getStr(formData, "githubUrl") ?? "",
    facebookUrl: getStr(formData, "facebookUrl") ?? "",
    lineUrl: getStr(formData, "lineUrl") ?? "",
  };

  const validated = communityProfileSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const payload = mapProfileFormToUpdatePayload({
    name: validated.data.name,
    username: validated.data.username,
    headline: validated.data.headline,
    bio: validated.data.bio,
    location: validated.data.location,
    website: validated.data.website,
    githubUrl: validated.data.githubUrl,
    facebookUrl: validated.data.facebookUrl,
    lineUrl: validated.data.lineUrl,
  });

  const result = await updateProfile(apiSession.accessToken, payload);

  if (!result.ok) {
    const failure = mapApiAuthFailure(result.error);
    return {
      success: false,
      error: failure.error,
      errors: failure.fieldErrors,
    };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/settings");
  revalidatePath("/settings/profile");
  return { success: true, message: "Profile updated successfully" };
}

export async function updateSettingsProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (!hasProfileFeature(apiSession.session.user.role, "editProfile")) {
    return { error: "You do not have permission to edit this profile" };
  }

  const skillsRaw = getStr(formData, "skills");
  let skills: string[] = [""];
  if (skillsRaw) {
    try {
      const parsed = JSON.parse(skillsRaw) as unknown;
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === "string")
      ) {
        skills = parsed;
      }
    } catch {
      skills = parseSkillsInput(skillsRaw);
    }
  }

  const raw = {
    name: getStr(formData, "name") ?? "",
    username: getStr(formData, "username") ?? "",
    headline: getStr(formData, "headline") ?? "",
    bio: getStr(formData, "bio") ?? "",
    industry: getStr(formData, "industry") ?? "",
    skills,
    location: getStr(formData, "location") ?? "",
    website: getStr(formData, "website") ?? "",
    linkedinUrl: getStr(formData, "linkedinUrl") ?? "",
    githubUrl: getStr(formData, "githubUrl") ?? "",
    xUrl: getStr(formData, "xUrl") ?? "",
    facebookUrl: getStr(formData, "facebookUrl") ?? "",
    lineUrl: getStr(formData, "lineUrl") ?? "",
    youtubeUrl: getStr(formData, "youtubeUrl") ?? "",
  };

  const validated = settingsProfileSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const payload = mapProfileFormToUpdatePayload({
    name: validated.data.name,
    username: validated.data.username,
    headline: validated.data.headline,
    bio: validated.data.bio,
    industry: validated.data.industry,
    skills: validated.data.skills.map((item) => item.trim()).filter(Boolean),
    location: validated.data.location,
    website: validated.data.website,
    linkedinUrl: validated.data.linkedinUrl,
    githubUrl: validated.data.githubUrl,
    xUrl: validated.data.xUrl,
    facebookUrl: validated.data.facebookUrl,
    lineUrl: validated.data.lineUrl,
    youtubeUrl: validated.data.youtubeUrl,
  });

  const result = await updateProfile(apiSession.accessToken, payload);

  if (!result.ok) {
    const failure = mapApiAuthFailure(result.error);
    return {
      success: false,
      error: failure.error,
      errors: failure.fieldErrors,
    };
  }

  revalidatePath("/profile");
  revalidatePath("/settings/profile");
  revalidatePath("/profile/settings");
  return { success: true, message: "Profile saved successfully" };
}

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (!hasProfileFeature(apiSession.session.user.role, "changePassword")) {
    return { error: "You do not have permission to change password" };
  }

  const { changePasswordSchema } = await import("../validations");
  const validated = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  return changePasswordApiAction({
    currentPassword: validated.data.currentPassword,
    newPassword: validated.data.newPassword,
    confirmPassword: validated.data.confirmPassword,
  });
}

export async function deleteAccountAction(): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (!hasProfileFeature(apiSession.session.user.role, "deleteAccount")) {
    return { error: "Account deletion is not available for your role" };
  }

  return {
    error: "Account deletion will be available in a future release",
  };
}

export type SubmitCreatorApplicationResult = ActionState & {
  redirectTo?: string;
  needsSessionRefresh?: boolean;
};

export async function submitCreatorApplicationAction(
  raw: unknown
): Promise<SubmitCreatorApplicationResult> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (apiSession.session.user.role !== "reader") {
    return { error: "Only Reader accounts can apply to become a Creator" };
  }

  const validated = becomeCreatorApplicationSchema.safeParse(raw);
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = validated.data;
  const topics = parseTopicsFromInput(data.topics);

  const profilePayload = mapBecomeCreatorFormToUpdatePayload({
    name: data.name,
    bio: data.bio,
    country: data.country,
    website: data.website,
    topics,
  });

  const profileResult = await updateProfile(
    apiSession.accessToken,
    profilePayload
  );

  if (!profileResult.ok) {
    const failure = mapApiAuthFailure(profileResult.error);
    if (failure.fieldErrors) {
      return { errors: failure.fieldErrors };
    }
    return { error: failure.error };
  }

  const upgradeResult = await becomeCreator(apiSession.accessToken);

  if (!upgradeResult.ok) {
    const failure = mapApiAuthFailure(upgradeResult.error);
    if (failure.fieldErrors) {
      return { errors: failure.fieldErrors };
    }
    return { error: failure.error };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/become-creator");
  revalidatePath("/studio");

  return {
    success: true,
    message: "Welcome to RealRead Creators! Your account has been upgraded.",
    redirectTo: "/studio",
    needsSessionRefresh: true,
  };
}

export async function syncCreatorExperiencesAction(
  experiences: Parameters<typeof syncExperiences>[1]["experiences"]
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (apiSession.session.user.role !== "creator") {
    return { error: "Only creators can update work experience" };
  }

  const result = await syncExperiences(apiSession.accessToken, { experiences });
  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  revalidatePath("/profile");
  return { success: true, message: "Work experience updated" };
}

export async function syncCreatorEducationsAction(
  educations: Parameters<typeof syncEducations>[1]["educations"]
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (apiSession.session.user.role !== "creator") {
    return { error: "Only creators can update education" };
  }

  const result = await syncEducations(apiSession.accessToken, { educations });
  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  revalidatePath("/profile");
  return { success: true, message: "Education updated" };
}

export async function syncCreatorCertificationsAction(
  certifications: Parameters<typeof syncCertifications>[1]["certifications"]
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (apiSession.session.user.role !== "creator") {
    return { error: "Only creators can update certifications" };
  }

  const result = await syncCertifications(apiSession.accessToken, {
    certifications,
  });
  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  revalidatePath("/profile");
  return { success: true, message: "Certifications updated" };
}

export async function syncCreatorAccomplishmentsAction(
  accomplishments: Parameters<typeof syncAccomplishments>[1]["accomplishments"]
): Promise<ActionState> {
  const apiSession = await requireApiSession();
  if (!apiSession) {
    return { error: "Unauthorized" };
  }

  if (apiSession.session.user.role !== "creator") {
    return { error: "Only creators can update accomplishments" };
  }

  const result = await syncAccomplishments(apiSession.accessToken, {
    accomplishments,
  });
  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  revalidatePath("/profile");
  return { success: true, message: "Accomplishments updated" };
}
