"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfileClient } from "../client/profile-client";
import { toClientApiRequestError } from "../lib/client-api-error";
import { queryKeys } from "../query/query-keys";
import type { ProfileUpdatePayload } from "../types";
import type { AppLanguage } from "../types/enums";

type UpdateProfileVariables = {
  token: string;
  payload: ProfileUpdatePayload;
  language?: AppLanguage;
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      payload,
      language,
    }: UpdateProfileVariables) => {
      const result = await updateProfileClient(token, payload, language);

      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.overview(),
      });
    },
  });
}
