import { getServerJwt } from "./get-server-jwt";

export async function getServerAccessToken(): Promise<string | null> {
  const token = await getServerJwt();
  return typeof token?.accessToken === "string" ? token.accessToken : null;
}
