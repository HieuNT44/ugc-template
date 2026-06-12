"use client";

import Link from "next/link";
import { Pin, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfilePostListItem } from "@/core/components/post";
import type { UserPost } from "@/core/types";

interface ProfileFeaturedPostsProps {
  posts: UserPost[];
  savedIds: Set<string>;
  onSaveToggle: (postId: string) => void;
  showManageLink?: boolean;
}

export function ProfileFeaturedPosts({
  posts,
  savedIds,
  onSaveToggle,
  showManageLink = true,
}: ProfileFeaturedPostsProps) {
  return (
    <Card className='ProfileFeaturedPosts gap-0 py-0'>
      <CardHeader className='flex flex-row items-center justify-between gap-4 border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Pin className='text-muted-foreground size-4 shrink-0' />
          <h2 className='text-base font-semibold'>Featured posts</h2>
        </div>
        {showManageLink ? (
          <Button
            variant='ghost'
            size='icon'
            className='size-8 shrink-0'
            asChild
          >
            <Link href='/settings/profile' aria-label='Manage featured posts'>
              <Settings className='size-4' />
            </Link>
          </Button>
        ) : null}
      </CardHeader>

      <CardContent className='p-0'>
        {posts.length === 0 ? (
          <p className='text-muted-foreground px-4 py-8 text-center text-sm'>
            Pin posts from your list to highlight them here (max 3).
          </p>
        ) : (
          posts.map((post, index) => (
            <div key={post.id}>
              <ProfilePostListItem
                post={post}
                isSaved={savedIds.has(post.id)}
                onSaveToggle={() => onSaveToggle(post.id)}
              />
              {index < posts.length - 1 ? <Separator /> : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
