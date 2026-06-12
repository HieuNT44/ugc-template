import { Separator } from "@/components/ui/separator";

import type { UserPost } from "../../types/user-post";
import { ProfilePostListItem } from "./profile-post-list-item";

interface ProfilePostListProps {
  posts: UserPost[];
  emptyMessage: string;
  showDraftBadge?: boolean;
  showSaveButton?: boolean;
  savedIds?: Set<string>;
  onSaveToggle?: (postId: string) => void;
}

export function ProfilePostList({
  posts,
  emptyMessage,
  showDraftBadge = false,
  showSaveButton = true,
  savedIds,
  onSaveToggle,
}: ProfilePostListProps) {
  if (posts.length === 0) {
    return (
      <p className='text-muted-foreground px-4 py-10 text-center text-sm'>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className='ProfilePostList'>
      {posts.map((post, index) => (
        <div key={post.id}>
          <ProfilePostListItem
            post={post}
            showDraftBadge={showDraftBadge}
            showSaveButton={showSaveButton}
            isSaved={savedIds?.has(post.id) ?? false}
            onSaveToggle={
              onSaveToggle ? () => onSaveToggle(post.id) : undefined
            }
          />
          {index < posts.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </div>
  );
}
