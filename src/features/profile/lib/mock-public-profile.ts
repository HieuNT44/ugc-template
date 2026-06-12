import type { UserPost } from "@/core/types";

import type { PublicProfile } from "../types/public-profile";
import { getMockPublicBooks } from "./mock-profile-books";

type PublicProfileData = {
  profile: PublicProfile;
  posts: UserPost[];
  reposts: UserPost[];
  featuredIds: string[];
};

const PROFILES: Record<string, PublicProfileData> = {
  "TOMOSIA-HieuNT": {
    profile: {
      id: "user-tomosia",
      username: "TOMOSIA-HieuNT",
      name: "TOMOSIA-HieuNT",
      image: null,
      role: "creator",
      bio: "Building RealRead — thoughtful long-form UGC for readers and creators.",
      website: "https://realread.example",
      posts: 3,
      books: 2,
      following: 128,
      followers: 412,
      githubUrl: "https://github.com",
      verifyExpert: true,
      fields: ["Next.js", "React", "Architecture"],
    },
    featuredIds: ["post-1", "post-2"],
    posts: [
      {
        id: "post-1",
        author: {
          username: "TOMOSIA-HieuNT",
          avatarUrl: "",
        },
        authorDisplayName: "TOMOSIA-HieuNT",
        authorSubtitle: "RealRead Creator",
        publishedAt: "May 19",
        title: "Why clean architecture matters for Next.js App Router",
        snippet:
          "A practical mental model for server and client boundaries without over-engineering your folder structure.",
        coverImageUrl: null,
        likeCount: 154,
        commentCount: 3,
        repostCount: 12,
        labels: [
          { type: "paid", amountCents: 499, currency: "USD" },
          { type: "expert" },
          { type: "human_written" },
        ],
      },
      {
        id: "post-2",
        author: {
          username: "TOMOSIA-HieuNT",
          avatarUrl: "",
        },
        authorDisplayName: "TOMOSIA-HieuNT",
        authorSubtitle: "RealRead Creator",
        publishedAt: "Apr 28",
        title: "Performance tuning checklist for React Server Components",
        snippet:
          "Waterfalls, bundle size, and cache boundaries — a list to run before you ship.",
        coverImageUrl: null,
        likeCount: 89,
        commentCount: 12,
        repostCount: 5,
        labels: [{ type: "expert" }, { type: "human_written" }],
      },
      {
        id: "post-3",
        author: {
          username: "TOMOSIA-HieuNT",
          avatarUrl: "",
        },
        authorDisplayName: "TOMOSIA-HieuNT",
        authorSubtitle: "RealRead Creator",
        publishedAt: "Mar 12",
        title: "Firebase Auth patterns in production apps",
        snippet:
          "Combining Firebase Auth, Firestore profiles, and NextAuth sessions without duplicating user state.",
        coverImageUrl: null,
        likeCount: 41,
        commentCount: 7,
        repostCount: 2,
        labels: [{ type: "paid", amountCents: 299, currency: "USD" }],
      },
    ],
    reposts: [
      {
        id: "repost-1",
        author: {
          username: "sarah-chen",
          avatarUrl: "",
        },
        authorDisplayName: "Sarah Chen",
        authorSubtitle: "Product & Growth",
        publishedAt: "Jun 1",
        repostedAt: "Jun 3",
        title: "Monetizing long-form content in 2026",
        snippet:
          "What paid posts, bundles, and memberships mean for independent writers.",
        coverImageUrl: null,
        likeCount: 320,
        commentCount: 45,
        repostCount: 18,
        labels: [{ type: "paid", amountCents: 799, currency: "USD" }],
      },
      {
        id: "repost-2",
        author: {
          username: "alex-reads",
          avatarUrl: "",
        },
        authorDisplayName: "Alex Reads",
        authorSubtitle: "Editor",
        publishedAt: "May 5",
        repostedAt: "May 18",
        title: "The comeback of thoughtful reading",
        snippet:
          "Why slow media is winning attention again in a feed-first world.",
        coverImageUrl: null,
        likeCount: 210,
        commentCount: 28,
        repostCount: 9,
        labels: [{ type: "human_written" }],
      },
    ],
  },
  "sarah-chen": {
    profile: {
      id: "user-sarah",
      username: "sarah-chen",
      name: "Sarah Chen",
      image: null,
      role: "creator",
      bio: "Product & growth writing on media, monetization, and creator tools.",
      posts: 1,
      books: 1,
      following: 89,
      followers: 1204,
      verifyExpert: true,
      fields: ["Product", "Growth"],
    },
    featuredIds: ["sarah-post-1"],
    posts: [
      {
        id: "sarah-post-1",
        author: {
          username: "sarah-chen",
          avatarUrl: "",
        },
        authorDisplayName: "Sarah Chen",
        authorSubtitle: "Product & Growth",
        publishedAt: "Jun 1",
        title: "Monetizing long-form content in 2026",
        snippet:
          "What paid posts, bundles, and memberships mean for independent writers.",
        coverImageUrl: null,
        likeCount: 320,
        commentCount: 45,
        repostCount: 18,
        labels: [{ type: "paid", amountCents: 799, currency: "USD" }],
      },
    ],
    reposts: [],
  },
  "alex-reads": {
    profile: {
      id: "user-alex",
      username: "alex-reads",
      name: "Alex Reads",
      image: null,
      role: "reader",
      bio: "Editor and slow-media enthusiast. Saving the best essays I find.",
      posts: 0,
      books: 0,
      following: 56,
      followers: 203,
    },
    featuredIds: [],
    posts: [],
    reposts: [
      {
        id: "alex-repost-1",
        author: {
          username: "TOMOSIA-HieuNT",
          avatarUrl: "",
        },
        authorDisplayName: "TOMOSIA-HieuNT",
        authorSubtitle: "RealRead Creator",
        publishedAt: "May 19",
        repostedAt: "May 22",
        title: "Why clean architecture matters for Next.js App Router",
        snippet:
          "A practical mental model for server and client boundaries without over-engineering your folder structure.",
        coverImageUrl: null,
        likeCount: 154,
        commentCount: 3,
        repostCount: 12,
        labels: [
          { type: "paid", amountCents: 499, currency: "USD" },
          { type: "expert" },
        ],
      },
    ],
  },
};

function normalizeUsername(username: string): string {
  return decodeURIComponent(username).trim();
}

export function getMockPublicProfile(username: string): PublicProfile | null {
  const key = normalizeUsername(username);
  return PROFILES[key]?.profile ?? null;
}

export function getMockPublicPosts(username: string): UserPost[] {
  const key = normalizeUsername(username);
  return PROFILES[key]?.posts ?? [];
}

export function getMockPublicReposts(username: string): UserPost[] {
  const key = normalizeUsername(username);
  return PROFILES[key]?.reposts ?? [];
}

export function getMockPublicBooksByUsername(username: string) {
  return getMockPublicBooks(username);
}

export function getMockPublicFeaturedPosts(username: string): UserPost[] {
  const key = normalizeUsername(username);
  const data = PROFILES[key];
  if (!data) {
    return [];
  }
  const idSet = new Set(data.featuredIds);
  return data.posts.filter((post) => idSet.has(post.id));
}

export function listMockPublicUsernames(): string[] {
  return Object.keys(PROFILES);
}
