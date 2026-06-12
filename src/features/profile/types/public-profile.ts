import type { UserRole } from "@/core/auth/types";

/** Public-facing community profile (no private fields). */
export type PublicProfile = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  role: Extract<UserRole, "reader" | "creator">;
  bio?: string | null;
  website?: string | null;
  posts: number;
  books?: number;
  following: number;
  followers: number;
  githubUrl?: string | null;
  facebookUrl?: string | null;
  lineUrl?: string | null;
  verifyExpert?: boolean;
  fields?: string[];
};

export type PublicProfileTabId = "posts" | "books" | "reposts";
