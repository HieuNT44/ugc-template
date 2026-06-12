import { FeedPostItem } from "./FeedPostItem";
import type { FeedPost } from "../types/feed-post";

interface FeedPostListProps {
  posts: FeedPost[];
  emptyMessage: string;
  savedIds?: Set<string>;
  onSaveToggle?: (postId: string) => void;
  onRequireLogin?: () => void;
}

export function FeedPostList({
  posts,
  emptyMessage,
  savedIds,
  onSaveToggle,
  onRequireLogin,
}: FeedPostListProps) {
  if (posts.length === 0) {
    return (
      <p className='text-muted-foreground py-16 text-center text-sm leading-relaxed'>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className='FeedPostList'>
      {posts.map((post) => (
        <FeedPostItem
          key={post.id}
          post={post}
          isSaved={savedIds?.has(post.id) ?? false}
          onSaveToggle={onSaveToggle ? () => onSaveToggle(post.id) : undefined}
          onRequireLogin={onRequireLogin}
        />
      ))}
    </div>
  );
}
