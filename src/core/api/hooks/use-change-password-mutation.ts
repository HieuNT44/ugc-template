"use client";

import { useMutation } from "@tanstack/react-query";

import { clientChangePassword } from "../client/auth-client";
import { toClientApiRequestError } from "../lib/client-api-error";
import type { ChangePasswordPayload } from "../types";

type ChangePasswordVariables = {
  token: string;
  payload: ChangePasswordPayload;
};

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async ({ token, payload }: ChangePasswordVariables) => {
      const result = await clientChangePassword(token, payload);

      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }

      return result.message;
    },
  });
}
