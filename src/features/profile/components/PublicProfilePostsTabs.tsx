"use client";

import { useCallback, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBookList } from "@/core/components/book";
import { ProfilePostList } from "@/core/components/post";

import type { UserPost } from "@/core/types";
import type { UserBook } from "@/core/types/user-book";

import {
  PUBLIC_PROFILE_EMPTY_MESSAGES,
  PUBLIC_PROFILE_TAB_LABELS,
  PUBLIC_PROFILE_TABS,
} from "../config/public-profile-tabs";
import { DEFAULT_SAVED_POST_IDS } from "../lib/mock-profile-posts";
import type {
  PublicProfile,
  PublicProfileTabId,
} from "../types/public-profile";
import { ProfileFeaturedPosts } from "./ProfileFeaturedPosts";

interface PublicProfilePostsTabsProps {
  profile: PublicProfile;
  posts: UserPost[];
  books: UserBook[];
  featuredPosts: UserPost[];
}

export function PublicProfilePostsTabs({
  profile,
  posts,
  books,
  featuredPosts,
}: PublicProfilePostsTabsProps) {
  const { role } = profile;
  const isCreator = role === "creator";
  const defaultTab: PublicProfileTabId = "posts";
  const reposts = useMemo(() => [], []);

  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(DEFAULT_SAVED_POST_IDS)
  );

  const handleSaveToggle = useCallback((postId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }, []);

  return (
    <div className='PublicProfilePostsTabs flex flex-col gap-6'>
      {isCreator && featuredPosts.length > 0 ? (
        <ProfileFeaturedPosts
          posts={featuredPosts}
          savedIds={savedIds}
          onSaveToggle={handleSaveToggle}
          showManageLink={false}
        />
      ) : null}

      <Card className='gap-0 py-0'>
        <Tabs defaultValue={defaultTab} className='w-full'>
          <div className='border-border border-b px-4'>
            <TabsList
              variant='line'
              className='h-auto min-h-0 w-full max-w-full justify-start gap-8 overflow-x-auto overflow-y-hidden rounded-none bg-transparent p-0 [-ms-overflow-style:none] [scrollbar-width:none] group-data-horizontal/tabs:!h-auto sm:gap-10 [&::-webkit-scrollbar]:hidden'
            >
              {PUBLIC_PROFILE_TABS.map((tabId) => (
                <TabsTrigger
                  key={tabId}
                  value={tabId}
                  className='text-muted-foreground hover:text-foreground data-active:border-foreground data-active:text-foreground -mb-px inline-flex !h-auto max-w-none !flex-none shrink-0 items-center rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pt-3 pb-3 text-[15px] font-normal whitespace-nowrap shadow-none after:!hidden focus-visible:ring-0 focus-visible:outline-none data-active:bg-transparent data-active:shadow-none'
                >
                  {PUBLIC_PROFILE_TAB_LABELS[tabId]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {PUBLIC_PROFILE_TABS.map((tabId) => (
            <TabsContent key={tabId} value={tabId} className='mt-0'>
              <CardContent className='p-0'>
                {tabId === "books" ? (
                  <ProfileBookList
                    books={books}
                    emptyMessage={PUBLIC_PROFILE_EMPTY_MESSAGES.books}
                  />
                ) : (
                  <ProfilePostList
                    posts={tabId === "posts" ? posts : reposts}
                    emptyMessage={PUBLIC_PROFILE_EMPTY_MESSAGES[tabId]}
                    showSaveButton
                    savedIds={savedIds}
                    onSaveToggle={handleSaveToggle}
                  />
                )}
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
