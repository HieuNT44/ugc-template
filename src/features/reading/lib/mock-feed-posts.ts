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
    }),
    withReadTime({
      id: "feed-2",
      author: {
        username: "sarah-chen",
        avatarUrl: "",
      },
      authorDisplayName: "Sarah Chen",
      authorSubtitle: "Product & Growth",
      publishedAt: "Jun 1",
      title: "Monetizing long-form content in 2026",
      snippet:
        "What paid posts, bundles, and memberships mean for independent writers on RealRead.",
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
    }),
    withReadTime({
      id: "feed-4",
      author: {
        username: "alex-reads",
        avatarUrl: "",
      },
      authorDisplayName: "Alex Reads",
      authorSubtitle: "Editor",
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
    }),
    withReadTime({
      id: "feed-6",
      author: {
        username: "sarah-chen",
        avatarUrl: "",
      },
      authorDisplayName: "Sarah Chen",
      authorSubtitle: "Product & Growth",
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
  "Technology",
  "Product",
  "Writing",
  "Next.js",
  "Startups",
  "Culture",
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
