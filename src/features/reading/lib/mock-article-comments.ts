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
    body: "同感です。新入社員向けのオンボーディング資料にもリンクしました。",
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
    body: "APIルートにも同じパターンが使えます。続編記事で触れる価値があります。",
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
    body: "Server Actionsにはどのバリデーションライブラリを組み合わせていますか？",
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
    body: "ストーリー性のある投稿でも同じ傾向でした。短いプレビューの方が維持率が高かったです。",
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
    body: "モバイルは別にテストしましたか？私たちのモバイル層は異なる動きをしました。",
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
    body: "はい。私たちの場合、モバイルは30%に近く、デスクトップでは短いプレビューが好まれました。",
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
    body: "良いデータですね。実験ログに追加します。",
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
    body: "サーバー/クライアント境界の説明は、このテーマで読んだ中で最も分かりやすいです。チームWiki用に保存します。",
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
    body: "複数チームが同じアプリを触る場合のfeatureフォルダ構成について、続編を読みたいです。",
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
    body: "前四半期に似た構成を採用しました。境界でZodを使うパターンだけでも、2回の悪いデプロイを防げました。",
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
      body: "プレビュー長は過小評価されています。25%と35%をA/Bテストしたところ、短い方が実際にコンバージョンしました。",
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
      body: "ペイウォール付近で価格を明確にしたことで、サポート問い合わせが大幅に減りました。",
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
