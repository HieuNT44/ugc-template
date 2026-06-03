"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();

  return {
    session,
    status,
    update,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
