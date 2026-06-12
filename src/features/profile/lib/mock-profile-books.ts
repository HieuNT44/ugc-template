import type { UserBook } from "@/core/types";

const AUTHOR_BASE = {
  username: "TOMOSIA-HieuNT",
  avatarUrl: "",
};

const TOMOSIA_BOOKS: UserBook[] = [
  {
    id: "book-1",
    author: {
      username: AUTHOR_BASE.username,
      avatarUrl: AUTHOR_BASE.avatarUrl,
    },
    title: "Next.js App Router in Production",
    subtitle: "Patterns for teams shipping real products",
    description:
      "A structured guide from routing and data fetching to auth boundaries and deployment — chapter by chapter.",
    coverImageUrl: null,
    chapterCount: 14,
    readerCount: 842,
    publishedAt: "Apr 2",
    labels: [
      { type: "paid", amountCents: 1299, currency: "USD" },
      { type: "expert" },
      { type: "human_written" },
    ],
  },
  {
    id: "book-2",
    author: {
      username: AUTHOR_BASE.username,
      avatarUrl: AUTHOR_BASE.avatarUrl,
    },
    title: "RealRead Creator Playbook",
    subtitle: "Monetize long-form without losing trust",
    description:
      "Pricing, bundles, paid posts, and audience building for independent writers on RealRead.",
    coverImageUrl: null,
    chapterCount: 8,
    readerCount: 516,
    publishedAt: "Feb 18",
    labels: [{ type: "human_written" }],
  },
];

const BOOKS_BY_USERNAME: Record<string, UserBook[]> = {
  "TOMOSIA-HieuNT": TOMOSIA_BOOKS,
  "sarah-chen": [
    {
      id: "sarah-book-1",
      author: {
        username: "sarah-chen",
        avatarUrl: "",
      },
      title: "Growth Writing for Media Startups",
      subtitle: "Essays on retention, pricing, and creator tools",
      description:
        "Collected chapters on how modern media products grow readership and revenue sustainably.",
      coverImageUrl: null,
      chapterCount: 11,
      readerCount: 1204,
      publishedAt: "May 10",
      labels: [{ type: "paid", amountCents: 999, currency: "USD" }],
    },
  ],
  "alex-reads": [],
};

function normalizeUsername(username: string): string {
  return decodeURIComponent(username).trim();
}

export function getMockPublicBooks(username: string): UserBook[] {
  const key = normalizeUsername(username);
  return BOOKS_BY_USERNAME[key] ?? [];
}

/** Books for the logged-in creator's own profile tab. */
export function getMockOwnBooks(username: string): UserBook[] {
  return getMockPublicBooks(username);
}

export function getMockBookCount(username: string): number {
  return getMockPublicBooks(username).length;
}
