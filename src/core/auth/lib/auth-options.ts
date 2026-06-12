import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getMe, refreshToken } from "@/core/api/endpoints/auth";
import {
  mapApiRoleToAppRole,
  mapApiUserToDisplayName,
} from "@/core/api/mappers/auth-user.mapper";

import { DEFAULT_USER_ROLE } from "../config";
import type { UserRole } from "../types";

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const TOKEN_REFRESH_COOLDOWN_MS = 60 * 1000;

function shouldRefreshToken(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) {
    return false;
  }

  const expiresMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresMs)) {
    return false;
  }

  return Date.now() >= expiresMs - TOKEN_REFRESH_BUFFER_MS;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "laravel",
      name: "Laravel",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        expiresAt: { label: "Expires At", type: "text" },
      },
      async authorize(credentials) {
        const accessToken = credentials?.accessToken;
        if (!accessToken || typeof accessToken !== "string") {
          return null;
        }

        const me = await getMe(accessToken);
        if (!me.ok) {
          return null;
        }

        if (me.data.status === "banned") {
          return null;
        }

        const expiresAt =
          typeof credentials?.expiresAt === "string" &&
          credentials.expiresAt.length > 0
            ? credentials.expiresAt
            : null;

        return {
          id: me.data.id,
          email: me.data.email,
          name: mapApiUserToDisplayName(me.data),
          role: mapApiRoleToAppRole(me.data.role),
          accessToken,
          tokenExpiresAt: expiresAt,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.tokenExpiresAt = user.tokenExpiresAt ?? null;
        token.tokenRefreshedAt = Date.now();
      }

      const accessToken = token.accessToken;
      const tokenRefreshedAt =
        typeof token.tokenRefreshedAt === "number" ? token.tokenRefreshedAt : 0;
      const recentlyRefreshed =
        Date.now() - tokenRefreshedAt < TOKEN_REFRESH_COOLDOWN_MS;

      if (
        typeof accessToken === "string" &&
        !recentlyRefreshed &&
        shouldRefreshToken(
          typeof token.tokenExpiresAt === "string" ? token.tokenExpiresAt : null
        )
      ) {
        const refreshed = await refreshToken(accessToken);
        if (refreshed.ok) {
          token.accessToken = refreshed.data.access_token;
          token.tokenExpiresAt = refreshed.data.expires_at;
          token.role = mapApiRoleToAppRole(refreshed.data.user.role);
          token.id = refreshed.data.user.id;
          token.tokenRefreshedAt = Date.now();
        } else {
          const me = await getMe(accessToken);
          if (!me.ok) {
            delete token.accessToken;
            delete token.tokenExpiresAt;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as UserRole) ?? DEFAULT_USER_ROLE;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
      }

      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
