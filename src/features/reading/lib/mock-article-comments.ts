import type { PostComment } from "../types/post-comment";

const REPLIES_C1: PostComment[] = [
  {
    id: "c-1-r1",
    author: {
      username: "sarah-chen",
      displayName: "Sarah Chen",
      avatarUrl: "",
    },
    publishedAt: "May 20",
    body: "Agreed — we linked this in our onboarding doc for new hires.",
    clapCount: 12,
  },
  {
    id: "c-1-r2",
    author: {
      username: "dev-north",
      displayName: "Dev North",
      avatarUrl: "",
    },
    publishedAt: "May 20",
    body: "Same pattern for API routes; worth calling out in a follow-up post.",
    clapCount: 7,
  },
];

const REPLIES_C3: PostComment[] = [
  {
    id: "c-3-r1",
    author: {
      username: "alex-reads",
      displayName: "Alex Reads",
      avatarUrl: "",
    },
    publishedAt: "May 18",
    body: "Which validation library are you pairing with server actions?",
    clapCount: 5,
  },
];

const REPLIES_C_F2_1: PostComment[] = [
  {
    id: "c-f2-1-r1",
    author: {
      username: "dev-north",
      displayName: "Dev North",
      avatarUrl: "",
    },
    publishedAt: "Jun 2",
    body: "We saw the same on narrative posts — shorter previews held better.",
    clapCount: 9,
  },
  {
    id: "c-f2-1-r2",
    author: {
      username: "sarah-chen",
      displayName: "Sarah Chen",
      avatarUrl: "",
    },
    publishedAt: "Jun 2",
    body: "Did you test mobile separately? Our mobile cohort behaved differently.",
    clapCount: 6,
  },
  {
    id: "c-f2-1-r3",
    author: {
      username: "TOMOSIA-HieuNT",
      displayName: "TOMOSIA-HieuNT",
      avatarUrl: "",
    },
    publishedAt: "Jun 3",
    body: "Yes — mobile was closer to 30% for us. Desktop favored the shorter cut.",
    clapCount: 14,
  },
  {
    id: "c-f2-1-r4",
    author: {
      username: "alex-reads",
      displayName: "Alex Reads",
      avatarUrl: "",
    },
    publishedAt: "Jun 3",
    body: "Great data point. Adding this to our experiment log.",
    clapCount: 3,
  },
];

const DEFAULT_COMMENTS: PostComment[] = [
  {
    id: "c-1",
    author: {
      username: "alex-reads",
      displayName: "Alex Reads",
      avatarUrl: "",
    },
    publishedAt: "May 20",
    body: "The server/client boundary section is the clearest explanation I have read on this topic. Saving for the team wiki.",
    clapCount: 124,
    replyCount: 2,
    replies: REPLIES_C1,
  },
  {
    id: "c-2",
    author: {
      username: "sarah-chen",
      displayName: "Sarah Chen",
      avatarUrl: "",
    },
    publishedAt: "May 19",
    body: "Would love a follow-up on how you structure feature folders when multiple teams touch the same app.",
    clapCount: 41,
  },
  {
    id: "c-3",
    author: {
      username: "dev-north",
      displayName: "Dev North",
      avatarUrl: "",
    },
    publishedAt: "May 18",
    body: "We adopted a similar layout last quarter. The Zod-at-the-boundary pattern alone saved us from two bad deploys.",
    clapCount: 18,
    replyCount: 1,
    replies: REPLIES_C3,
  },
];

const COMMENTS_BY_POST_ID: Record<string, PostComment[]> = {
  "feed-1": DEFAULT_COMMENTS,
  "post-1": DEFAULT_COMMENTS,
  "feed-2": [
    {
      id: "c-f2-1",
      author: {
        username: "TOMOSIA-HieuNT",
        displayName: "TOMOSIA-HieuNT",
        avatarUrl: "",
      },
      publishedAt: "Jun 2",
      body: "Preview length is underrated. We A/B tested 25% vs 35% and the shorter preview actually converted better.",
      clapCount: 89,
      replyCount: 4,
      replies: REPLIES_C_F2_1,
    },
    {
      id: "c-f2-2",
      author: {
        username: "alex-reads",
        displayName: "Alex Reads",
        avatarUrl: "",
      },
      publishedAt: "Jun 1",
      body: "Transparent pricing near the paywall reduced our support tickets significantly.",
      clapCount: 52,
    },
  ],
};

export function getMockCommentsForPost(postId: string): PostComment[] {
  return COMMENTS_BY_POST_ID[postId] ?? DEFAULT_COMMENTS;
}

export function getMockCommentCount(postId: string): number {
  const comments = getMockCommentsForPost(postId);
  const replyTotal = comments.reduce(
    (sum, comment) =>
      sum + (comment.replies?.length ?? comment.replyCount ?? 0),
    0
  );
  const base = 112;
  return base + comments.length + replyTotal;
}
