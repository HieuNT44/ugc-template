"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getProfileSettingsClient,
  updateProfileSettingsClient,
} from "../client/profile-client";
import { toClientApiRequestError } from "../lib/client-api-error";
import { queryKeys } from "../query/query-keys";
import type { UserSettingsUpdatePayload } from "../types";
import type { AppLanguage } from "../types/enums";

type UseProfileSettingsQueryOptions = {
  token?: string;
  enabled?: boolean;
  language?: AppLanguage;
};

type UpdateProfileSettingsVariables = {
  token: string;
  payload: UserSettingsUpdatePayload;
  language?: AppLanguage;
};

export function useProfileSettingsQuery({
  token,
  enabled = true,
  language,
}: UseProfileSettingsQueryOptions) {
  return useQuery({
    queryKey: queryKeys.profile.settings(),
    queryFn: async () => {
      const result = await getProfileSettingsClient(token!, language);

      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }

      return result.data;
    },
    enabled: enabled && Boolean(token?.trim()),
  });
}

export function useUpdateProfileSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      payload,
      language,
    }: UpdateProfileSettingsVariables) => {
      const result = await updateProfileSettingsClient(
        token,
        payload,
        language
      );

      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.settings(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.overview(),
      });
    },
  });
}
