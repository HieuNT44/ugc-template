"use client";

import { useQuery } from "@tanstack/react-query";

import { clientApiRequest } from "../client/fetch-api";
import { toClientApiRequestError } from "../lib/client-api-error";
import { mapProfileOverview } from "../mappers/profile.mapper";
import { queryKeys } from "../query/query-keys";
import type { ApiProfile, ApiUser } from "../types";
import type { Profile } from "@/features/profile/types";

async function fetchProfileOverview(token: string): Promise<Profile> {
  const [meResult, profileResult] = await Promise.all([
    clientApiRequest<ApiUser>({ path: "/auth/me", token }),
    clientApiRequest<ApiProfile>({ path: "/profile", token }),
  ]);

  if (!meResult.ok) {
    throw toClientApiRequestError(meResult.error);
  }

  if (!profileResult.ok) {
    throw toClientApiRequestError(profileResult.error);
  }

  return mapProfileOverview({
    apiUser: meResult.data,
    apiProfile: profileResult.data,
  });
}

type UseProfileOverviewQueryOptions = {
  token?: string;
  enabled?: boolean;
};

export function useProfileOverviewQuery({
  token,
  enabled = true,
}: UseProfileOverviewQueryOptions) {
  return useQuery({
    queryKey: queryKeys.profile.overview(),
    queryFn: () => fetchProfileOverview(token!),
    enabled: enabled && Boolean(token?.trim()),
  });
}
