"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { profileCvClient } from "../client/profile-cv-client";
import { toClientApiRequestError } from "../lib/client-api-error";
import { queryKeys } from "../query/query-keys";
import type {
  ProfileAccomplishmentInput,
  ProfileCertificationInput,
  ProfileEducationInput,
  ProfileExperienceInput,
} from "../types";
import type { AppLanguage } from "../types/enums";

type CvQueryOptions = {
  token?: string;
  enabled?: boolean;
  language?: AppLanguage;
};

function invalidateCvQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.profile.overview(),
  });
}

export function useExperiencesQuery({
  token,
  enabled = true,
  language,
}: CvQueryOptions) {
  return useQuery({
    queryKey: queryKeys.profile.experiences(),
    queryFn: async () => {
      const result = await profileCvClient.getExperiences(token!, language);
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    enabled: enabled && Boolean(token?.trim()),
  });
}

export function useSyncExperiencesMutation(language?: AppLanguage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      experiences,
    }: {
      token: string;
      experiences: ProfileExperienceInput[];
    }) => {
      const result = await profileCvClient.syncExperiences(
        token,
        { experiences },
        language
      );
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.experiences(),
      });
      invalidateCvQueries(queryClient);
    },
  });
}

export function useEducationsQuery({
  token,
  enabled = true,
  language,
}: CvQueryOptions) {
  return useQuery({
    queryKey: queryKeys.profile.educations(),
    queryFn: async () => {
      const result = await profileCvClient.getEducations(token!, language);
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    enabled: enabled && Boolean(token?.trim()),
  });
}

export function useSyncEducationsMutation(language?: AppLanguage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      educations,
    }: {
      token: string;
      educations: ProfileEducationInput[];
    }) => {
      const result = await profileCvClient.syncEducations(
        token,
        { educations },
        language
      );
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.educations(),
      });
      invalidateCvQueries(queryClient);
    },
  });
}

export function useCertificationsQuery({
  token,
  enabled = true,
  language,
}: CvQueryOptions) {
  return useQuery({
    queryKey: queryKeys.profile.certifications(),
    queryFn: async () => {
      const result = await profileCvClient.getCertifications(token!, language);
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    enabled: enabled && Boolean(token?.trim()),
  });
}

export function useSyncCertificationsMutation(language?: AppLanguage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      certifications,
    }: {
      token: string;
      certifications: ProfileCertificationInput[];
    }) => {
      const result = await profileCvClient.syncCertifications(
        token,
        { certifications },
        language
      );
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.certifications(),
      });
      invalidateCvQueries(queryClient);
    },
  });
}

export function useAccomplishmentsQuery({
  token,
  enabled = true,
  language,
}: CvQueryOptions) {
  return useQuery({
    queryKey: queryKeys.profile.accomplishments(),
    queryFn: async () => {
      const result = await profileCvClient.getAccomplishments(token!, language);
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    enabled: enabled && Boolean(token?.trim()),
  });
}

export function useSyncAccomplishmentsMutation(language?: AppLanguage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      accomplishments,
    }: {
      token: string;
      accomplishments: ProfileAccomplishmentInput[];
    }) => {
      const result = await profileCvClient.syncAccomplishments(
        token,
        { accomplishments },
        language
      );
      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.accomplishments(),
      });
      invalidateCvQueries(queryClient);
    },
  });
}
