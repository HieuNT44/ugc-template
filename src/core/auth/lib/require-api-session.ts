import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

import { authOptions } from "./auth-options";
import { getServerAccessToken } from "./get-server-access-token";

export interface ApiSessionContext {
  session: Session;
  accessToken: string;
}

export async function requireApiSession(): Promise<ApiSessionContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const accessToken = await getServerAccessToken();
  if (!accessToken) {
    return null;
  }

  return { session, accessToken };
}
