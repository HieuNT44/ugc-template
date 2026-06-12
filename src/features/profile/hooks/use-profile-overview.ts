"use client";

import { useSession } from "next-auth/react";

import { useProfileOverviewQuery } from "@/core/api/hooks/use-profile-overview-query";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";

import type { Profile } from "../types";

type UseProfileOverviewState = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useProfileOverview(): UseProfileOverviewState {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const query = useProfileOverviewQuery({
    token,
    enabled: status === "authenticated",
  });

  const errorMessage =
    query.error instanceof ClientApiRequestError
      ? query.error.apiError.message
      : query.error instanceof Error
        ? query.error.message
        : null;

  return {
    profile: query.data ?? null,
    isLoading: status === "loading" || query.isLoading,
    error: errorMessage,
    refetch: async () => {
      await query.refetch();
    },
  };
}
