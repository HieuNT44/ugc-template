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
      bio: "RealReadを構築中。読者とクリエイターのための思慮深い長文UGC。",
      website: "https://realread.example",
      posts: 3,
      books: 2,
      following: 128,
      followers: 412,
      githubUrl: "https://github.com",
      verifyExpert: true,
      fields: ["Next.js", "React", "アーキテクチャ"],
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
        authorSubtitle: "RealReadクリエイター",
        publishedAt: "May 19",
        title: "Next.js App Routerでクリーンアーキテクチャが重要な理由",
        snippet:
          "フォルダ構成を過剰設計せず、サーバーとクライアントの境界を理解するための実践的な考え方。",
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
        authorSubtitle: "RealReadクリエイター",
        publishedAt: "Apr 28",
        title: "React Server Componentsのパフォーマンス調整チェックリスト",
        snippet:
          "ウォーターフォール、バンドルサイズ、キャッシュ境界など、リリース前に確認したいチェックリスト。",
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
        authorSubtitle: "RealReadクリエイター",
        publishedAt: "Mar 12",
        title: "本番アプリのFirebase Authパターン",
        snippet:
          "ユーザー状態を重複させずにFirebase Auth、Firestoreプロフィール、NextAuthセッションを組み合わせる方法。",
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
        authorSubtitle: "プロダクト＆グロース",
        publishedAt: "Jun 1",
        repostedAt: "Jun 3",
        title: "2026年の長文コンテンツ収益化",
        snippet:
          "有料投稿、バンドル、メンバーシップが独立系ライターにもたらす意味。",
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
        authorSubtitle: "エディター",
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
        authorSubtitle: "プロダクト＆グロース",
        publishedAt: "Jun 1",
        title: "2026年の長文コンテンツ収益化",
        snippet:
          "有料投稿、バンドル、メンバーシップが独立系ライターにもたらす意味。",
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
        authorSubtitle: "RealReadクリエイター",
        publishedAt: "May 19",
        repostedAt: "May 22",
        title: "Next.js App Routerでクリーンアーキテクチャが重要な理由",
        snippet:
          "フォルダ構成を過剰設計せず、サーバーとクライアントの境界を理解するための実践的な考え方。",
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
