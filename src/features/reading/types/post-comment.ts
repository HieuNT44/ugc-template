export type PostCommentAuthor = {
  username: string;
  displayName: string;
  avatarUrl: string;
};

/** Comment row on the article detail page. */
export type PostComment = {
  id: string;
  author: PostCommentAuthor;
  publishedAt: string;
  body: string;
  clapCount: number;
  replyCount?: number;
  replies?: PostComment[];
};
