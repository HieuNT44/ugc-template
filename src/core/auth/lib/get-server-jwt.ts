import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

type GetTokenRequest = Parameters<typeof getToken>[0]["req"];

export async function getServerJwt(): Promise<JWT | null> {
  const cookieStore = await cookies();
  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])
      ),
      headers: new Headers({ cookie: cookieStore.toString() }),
    } as unknown as GetTokenRequest,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return token;
}

export { isAuthenticatedJwt } from "./jwt-auth";
