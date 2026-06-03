import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import {
  getAdminAuth,
  isFirebaseAdminConfigured,
} from "@/core/lib/firebase-admin";
import { ensureUserProfile, getUserById } from "@/core/lib/user-repository";
import { DEFAULT_USER_ROLE } from "@/features/auth/config";
import type { UserRole } from "@/features/auth/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "firebase",
      name: "Firebase",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        const idToken = credentials?.idToken;
        if (!idToken || typeof idToken !== "string") {
          return null;
        }

        if (!isFirebaseAdminConfigured()) {
          throw new Error("Firebase Admin is not configured");
        }

        const decoded = await getAdminAuth().verifyIdToken(idToken);
        const profile = await ensureUserProfile({
          uid: decoded.uid,
          email: decoded.email ?? "",
          name: decoded.name ?? decoded.email?.split("@")[0] ?? "User",
          emailVerified: decoded.email_verified ?? false,
        });

        if (profile.status === "banned") {
          return null;
        }

        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          image: profile.avatar ?? null,
          role: profile.role,
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
      }

      if (token.id && isFirebaseAdminConfigured()) {
        const profile = await getUserById(token.id as string);
        if (profile) {
          token.role = profile.role;
          token.name = profile.name;
          token.email = profile.email;
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
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
