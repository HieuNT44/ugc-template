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
    title: "本番環境のNext.js App Router",
    subtitle: "実プロダクトを出荷するチームのためのパターン",
    description:
      "ルーティング、データ取得、認証境界、デプロイまでを章ごとに整理したガイド。",
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
    title: "RealReadクリエイタープレイブック",
    subtitle: "信頼を失わずに長文コンテンツを収益化する",
    description:
      "RealReadの独立系ライター向けに、価格設定、バンドル、有料投稿、読者づくりを解説。",
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
      title: "メディアスタートアップのためのグロースライティング",
      subtitle: "リテンション、価格設定、クリエイターツールに関するエッセイ",
      description:
        "現代のメディアプロダクトが読者数と収益を持続的に伸ばす方法をまとめた章集。",
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
