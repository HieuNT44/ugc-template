import type { UserRole } from "@/core/auth/types";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    accessToken?: string;
    tokenExpiresAt?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    accessToken?: string;
    tokenExpiresAt?: string | null;
    tokenRefreshedAt?: number;
  }
}
