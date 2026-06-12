import type { PostComment, PostCommentAuthor } from "../types/post-comment";

export type ApiContentSocial = {
  like_count: number;
  comment_count: number;
  share_count: number;
  save_count: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
};

export type ApiCommentAuthor = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type ApiContentComment = {
  id: string;
  body: string;
  created_at: string;
  author: ApiCommentAuthor;
  replies: ApiContentComment[];
};

export type LikeResponse = {
  liked: boolean;
  like_count: number;
};

export type SaveResponse = {
  saved: boolean;
  save_count: number;
};

export type ShareResponse = {
  share_count: number;
};

function formatCommentDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function mapCommentAuthor(author: ApiCommentAuthor): PostCommentAuthor {
  const username = author.username?.trim() || "reader";

  return {
    username,
    displayName: author.full_name?.trim() || username,
    avatarUrl: author.avatar_url ?? "",
  };
}

export function mapApiCommentToPostComment(
  comment: ApiContentComment
): PostComment {
  const replies = comment.replies?.map(mapApiCommentToPostComment) ?? [];

  return {
    id: comment.id,
    author: mapCommentAuthor(comment.author),
    publishedAt: formatCommentDate(comment.created_at),
    body: comment.body,
    clapCount: 0,
    replyCount: replies.length,
    replies,
  };
}
