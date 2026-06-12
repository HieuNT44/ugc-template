"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { getProfileClient } from "@/core/api/client/profile-client";
import { toClientApiRequestError } from "@/core/api/lib/client-api-error";
import { queryKeys } from "@/core/api/query/query-keys";
import type { ApiProfile } from "@/core/api/types";

export function usePreviewAuthorProfile() {
  const { data: session, status } = useSession();
  const token = session?.accessToken?.trim();

  return useQuery<ApiProfile>({
    queryKey: queryKeys.profile.detail(),
    queryFn: async () => {
      const result = await getProfileClient(token!);

      if (!result.ok) {
        throw toClientApiRequestError(result.error);
      }

      return result.data;
    },
    enabled: status === "authenticated" && Boolean(token),
  });
}
