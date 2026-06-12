import type { UserPost } from "@/core/types";

import type { ProfilePostsTabId } from "../config/profile-permissions";

type MockPostsByTab = Record<Exclude<ProfilePostsTabId, "books">, UserPost[]>;

const AUTHOR_BASE = {
  username: "TOMOSIA-HieuNT",
  avatarUrl: "",
  authorDisplayName: "TOMOSIA-HieuNT",
  authorSubtitle: "RealRead Creator",
};

function buildMockPosts(): MockPostsByTab {
  const published: UserPost[] = [
    {
      id: "post-1",
      author: {
        username: AUTHOR_BASE.username,
        avatarUrl: AUTHOR_BASE.avatarUrl,
      },
      authorDisplayName: AUTHOR_BASE.authorDisplayName,
      authorSubtitle: AUTHOR_BASE.authorSubtitle,
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
        username: AUTHOR_BASE.username,
        avatarUrl: AUTHOR_BASE.avatarUrl,
      },
      authorDisplayName: AUTHOR_BASE.authorDisplayName,
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
        username: AUTHOR_BASE.username,
        avatarUrl: AUTHOR_BASE.avatarUrl,
      },
      authorDisplayName: AUTHOR_BASE.authorDisplayName,
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
  ];

  const purchased: UserPost[] = [
    {
      id: "purchased-1",
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
  ];

  const saved: UserPost[] = [
    {
      id: "saved-1",
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
    },
  ];

  const drafts: UserPost[] = [
    {
      id: "draft-1",
      author: {
        username: AUTHOR_BASE.username,
        avatarUrl: AUTHOR_BASE.avatarUrl,
      },
      authorDisplayName: AUTHOR_BASE.authorDisplayName,
      authorSubtitle: AUTHOR_BASE.authorSubtitle,
      publishedAt: "Last edited May 20",
      title: "Draft: UGC platform roadmap Q3",
      snippet:
        "Outline of creator tools, paid posts, and profile tabs for RealRead.",
      coverImageUrl: null,
      likeCount: 0,
      commentCount: 0,
      labels: [],
    },
  ];

  return {
    posts: published,
    purchased,
    saved,
    drafts,
  };
}

const MOCK_BY_TAB = buildMockPosts();

export function getMockPostsForTab(
  tab: Exclude<ProfilePostsTabId, "books">
): UserPost[] {
  return MOCK_BY_TAB[tab] ?? [];
}

/** Own-profile tab data scoped to the logged-in user's username. */
export function getMockPostsForOwnProfileTab(
  tab: Exclude<ProfilePostsTabId, "books">,
  username: string
): UserPost[] {
  const normalized = username.trim();

  if (tab === "posts" || tab === "drafts") {
    return (MOCK_BY_TAB[tab] ?? []).filter(
      (post) => post.author.username === normalized
    );
  }

  return MOCK_BY_TAB[tab] ?? [];
}

export const DEFAULT_PINNED_POST_IDS = ["post-1", "post-2"] as const;

/** Saved post ids for bookmark UI on non-saved tabs (mock). */
export const DEFAULT_SAVED_POST_IDS = ["saved-1"] as const;

export function getFeaturedPostsFromIds(
  pinnedIds: Set<string>,
  username?: string
): UserPost[] {
  const all = [...MOCK_BY_TAB.posts, ...MOCK_BY_TAB.drafts];
  return all.filter((post) => {
    if (!pinnedIds.has(post.id)) {
      return false;
    }
    if (username?.trim()) {
      return post.author.username === username.trim();
    }
    return true;
  });
}
