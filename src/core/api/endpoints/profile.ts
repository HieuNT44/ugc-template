import type { ApiResult } from "../lib/api-result";
import { apiRequest } from "../server";
import type {
  ApiProfile,
  ProfileAccomplishment,
  ProfileAccomplishmentInput,
  ProfileCertification,
  ProfileCertificationInput,
  ProfileEducation,
  ProfileEducationInput,
  ProfileExperience,
  ProfileExperienceInput,
  ProfileUpdatePayload,
  SyncAccomplishmentsPayload,
  SyncCertificationsPayload,
  SyncEducationsPayload,
  SyncExperiencesPayload,
  UserSettings,
  UserSettingsUpdatePayload,
} from "../types";

export async function getProfile(
  token: string
): Promise<ApiResult<ApiProfile>> {
  return apiRequest<ApiProfile>({
    path: "/profile",
    method: "GET",
    token,
  });
}

export async function updateProfile(
  token: string,
  payload: ProfileUpdatePayload
): Promise<ApiResult<ApiProfile>> {
  return apiRequest<ApiProfile>({
    path: "/profile",
    method: "PUT",
    token,
    body: payload,
  });
}

export async function becomeCreator(
  token: string
): Promise<ApiResult<ApiProfile>> {
  return apiRequest<ApiProfile>({
    path: "/profile/become-creator",
    method: "POST",
    token,
  });
}

export async function getProfileSettings(
  token: string
): Promise<ApiResult<UserSettings>> {
  return apiRequest<UserSettings>({
    path: "/profile/settings",
    method: "GET",
    token,
  });
}

export async function updateProfileSettings(
  token: string,
  payload: UserSettingsUpdatePayload
): Promise<ApiResult<UserSettings>> {
  return apiRequest<UserSettings>({
    path: "/profile/settings",
    method: "PUT",
    token,
    body: payload,
  });
}

export async function getExperiences(
  token: string
): Promise<ApiResult<ProfileExperience[]>> {
  return apiRequest<ProfileExperience[]>({
    path: "/profile/experiences",
    method: "GET",
    token,
  });
}

export async function syncExperiences(
  token: string,
  payload: SyncExperiencesPayload
): Promise<ApiResult<ProfileExperience[]>> {
  return apiRequest<ProfileExperience[]>({
    path: "/profile/experiences",
    method: "PUT",
    token,
    body: payload,
  });
}

export async function getEducations(
  token: string
): Promise<ApiResult<ProfileEducation[]>> {
  return apiRequest<ProfileEducation[]>({
    path: "/profile/educations",
    method: "GET",
    token,
  });
}

export async function syncEducations(
  token: string,
  payload: SyncEducationsPayload
): Promise<ApiResult<ProfileEducation[]>> {
  return apiRequest<ProfileEducation[]>({
    path: "/profile/educations",
    method: "PUT",
    token,
    body: payload,
  });
}

export async function getCertifications(
  token: string
): Promise<ApiResult<ProfileCertification[]>> {
  return apiRequest<ProfileCertification[]>({
    path: "/profile/certifications",
    method: "GET",
    token,
  });
}

export async function syncCertifications(
  token: string,
  payload: SyncCertificationsPayload
): Promise<ApiResult<ProfileCertification[]>> {
  return apiRequest<ProfileCertification[]>({
    path: "/profile/certifications",
    method: "PUT",
    token,
    body: payload,
  });
}

export async function getAccomplishments(
  token: string
): Promise<ApiResult<ProfileAccomplishment[]>> {
  return apiRequest<ProfileAccomplishment[]>({
    path: "/profile/accomplishments",
    method: "GET",
    token,
  });
}

export async function syncAccomplishments(
  token: string,
  payload: SyncAccomplishmentsPayload
): Promise<ApiResult<ProfileAccomplishment[]>> {
  return apiRequest<ProfileAccomplishment[]>({
    path: "/profile/accomplishments",
    method: "PUT",
    token,
    body: payload,
  });
}

export type {
  ProfileExperienceInput,
  ProfileEducationInput,
  ProfileCertificationInput,
  ProfileAccomplishmentInput,
};
