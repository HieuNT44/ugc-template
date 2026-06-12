import { calculateReadTime } from "@/core/lib/calculate-read-time";

import type { FeedPost } from "../types/feed-post";

type FeedPostDraft = Omit<FeedPost, "readTimeMinutes">;

function withReadTime(post: FeedPostDraft): FeedPost {
  return {
    ...post,
    readTimeMinutes: calculateReadTime(post.snippet),
  };
}

/** Curated home feed — mock until Reading API exists. */
export function getMockFeedPosts(): FeedPost[] {
  return [
    withReadTime({
      id: "feed-1",
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
    }),
    withReadTime({
      id: "feed-2",
      author: {
        username: "sarah-chen",
        avatarUrl: "",
      },
      authorDisplayName: "Sarah Chen",
      authorSubtitle: "プロダクト＆グロース",
      publishedAt: "Jun 1",
      title: "2026年の長文コンテンツ収益化",
      snippet:
        "有料投稿、バンドル、メンバーシップがRealReadの独立系ライターにもたらす意味。",
      coverImageUrl: null,
      likeCount: 320,
      commentCount: 45,
      repostCount: 18,
      labels: [{ type: "paid", amountCents: 799, currency: "USD" }],
    }),
    withReadTime({
      id: "feed-3",
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
    }),
    withReadTime({
      id: "feed-4",
      author: {
        username: "alex-reads",
        avatarUrl: "",
      },
      authorDisplayName: "Alex Reads",
      authorSubtitle: "エディター",
      publishedAt: "May 5",
      title: "The comeback of thoughtful reading",
      snippet:
        "Why slow media is winning attention again in a feed-first world.",
      coverImageUrl: null,
      likeCount: 210,
      commentCount: 28,
      repostCount: 9,
      labels: [{ type: "human_written" }],
    }),
    withReadTime({
      id: "feed-5",
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
    }),
    withReadTime({
      id: "feed-6",
      author: {
        username: "sarah-chen",
        avatarUrl: "",
      },
      authorDisplayName: "Sarah Chen",
      authorSubtitle: "プロダクト＆グロース",
      publishedAt: "Apr 14",
      title: "Designing paywalls readers actually trust",
      snippet:
        "Transparency, previews, and fair pricing — lessons from early RealRead creators.",
      coverImageUrl: null,
      likeCount: 178,
      commentCount: 22,
      labels: [{ type: "expert" }],
    }),
  ];
}

/** Subset for the Following tab (mock). */
export function getMockFollowingFeedPosts(): FeedPost[] {
  return getMockFeedPosts().filter((post) =>
    ["TOMOSIA-HieuNT", "sarah-chen"].includes(post.author.username)
  );
}

export const FEED_SUGGESTED_TOPICS = [
  "テクノロジー",
  "Product",
  "Writing",
  "Next.js",
  "Startups",
  "カルチャー",
] as const;

export const FEED_SUGGESTED_AUTHORS = [
  {
    username: "TOMOSIA-HieuNT",
    name: "TOMOSIA-HieuNT",
    avatarUrl: "",
    bio: "Next.js & architecture",
  },
  {
    username: "sarah-chen",
    name: "Sarah Chen",
    avatarUrl: "",
    bio: "Product & growth writing",
  },
  {
    username: "alex-reads",
    name: "Alex Reads",
    avatarUrl: "",
    bio: "Slow media & essays",
  },
] as const;
