"use client";

import type {
  ProfileAccomplishment,
  ProfileAccomplishmentInput,
  ProfileCertification,
  ProfileCertificationInput,
  ProfileEducation,
  ProfileEducationInput,
  ProfileExperience,
  ProfileExperienceInput,
  SyncAccomplishmentsPayload,
  SyncCertificationsPayload,
  SyncEducationsPayload,
  SyncExperiencesPayload,
} from "../types";
import type { AppLanguage } from "../types/enums";

import { clientApiRequest } from "./fetch-api";

function getExperiences(token: string, language?: AppLanguage) {
  return clientApiRequest<ProfileExperience[]>({
    path: "/profile/experiences",
    method: "GET",
    token,
    language,
  });
}

function syncExperiences(
  token: string,
  payload: SyncExperiencesPayload,
  language?: AppLanguage
) {
  return clientApiRequest<ProfileExperience[]>({
    path: "/profile/experiences",
    method: "PUT",
    token,
    body: payload,
    language,
  });
}

function getEducations(token: string, language?: AppLanguage) {
  return clientApiRequest<ProfileEducation[]>({
    path: "/profile/educations",
    method: "GET",
    token,
    language,
  });
}

function syncEducations(
  token: string,
  payload: SyncEducationsPayload,
  language?: AppLanguage
) {
  return clientApiRequest<ProfileEducation[]>({
    path: "/profile/educations",
    method: "PUT",
    token,
    body: payload,
    language,
  });
}

function getCertifications(token: string, language?: AppLanguage) {
  return clientApiRequest<ProfileCertification[]>({
    path: "/profile/certifications",
    method: "GET",
    token,
    language,
  });
}

function syncCertifications(
  token: string,
  payload: SyncCertificationsPayload,
  language?: AppLanguage
) {
  return clientApiRequest<ProfileCertification[]>({
    path: "/profile/certifications",
    method: "PUT",
    token,
    body: payload,
    language,
  });
}

function getAccomplishments(token: string, language?: AppLanguage) {
  return clientApiRequest<ProfileAccomplishment[]>({
    path: "/profile/accomplishments",
    method: "GET",
    token,
    language,
  });
}

function syncAccomplishments(
  token: string,
  payload: SyncAccomplishmentsPayload,
  language?: AppLanguage
) {
  return clientApiRequest<ProfileAccomplishment[]>({
    path: "/profile/accomplishments",
    method: "PUT",
    token,
    body: payload,
    language,
  });
}

export const profileCvClient = {
  getExperiences,
  syncExperiences,
  getEducations,
  syncEducations,
  getCertifications,
  syncCertifications,
  getAccomplishments,
  syncAccomplishments,
};

export type {
  ProfileExperienceInput,
  ProfileEducationInput,
  ProfileCertificationInput,
  ProfileAccomplishmentInput,
};
