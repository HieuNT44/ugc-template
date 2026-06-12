"use client";

import { useCallback, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBookList } from "@/core/components/book";
import { ProfilePostList } from "@/core/components/post";
import type { UserRole } from "@/core/auth/types";

import {
  getMockPostsForOwnProfileTab,
  getFeaturedPostsFromIds,
  DEFAULT_PINNED_POST_IDS,
  DEFAULT_SAVED_POST_IDS,
} from "../lib/mock-profile-posts";
import { getMockOwnBooks } from "../lib/mock-profile-books";
import {
  getDefaultProfilePostsTab,
  getProfilePostsTabsForRole,
  hasProfileFeature,
  isProfilePostsTabAllowed,
  PROFILE_POSTS_TAB_LABELS,
  type ProfilePostsTabId,
} from "../config/profile-permissions";
import { ProfileFeaturedPosts } from "./ProfileFeaturedPosts";
import { ReaderCreatorUpgradeCta } from "./ReaderCreatorUpgradeCta";

const EMPTY_MESSAGES: Record<ProfilePostsTabId, string> = {
  posts: "You have not published any posts yet.",
  books: "You have not published any books yet.",
  purchased: "No purchased posts yet.",
  saved: "No saved posts in your archive.",
  drafts: "No drafts yet. Start writing in Studio or create new content.",
};

interface ProfilePostsTabsProps {
  role: UserRole;
  username: string;
}

export function ProfilePostsTabs({ role, username }: ProfilePostsTabsProps) {
  const tabs = getProfilePostsTabsForRole(role);
  const defaultTab = getDefaultProfilePostsTab(role) ?? "purchased";
  const showFeatured = hasProfileFeature(role, "manageFeaturedPosts");
  const isReader = role === "reader";

  const featuredPosts = useMemo(
    () => getFeaturedPostsFromIds(new Set(DEFAULT_PINNED_POST_IDS), username),
    [username]
  );

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

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className='ProfilePostsTabs flex flex-col gap-6'>
      {isReader ? <ReaderCreatorUpgradeCta /> : null}

      {showFeatured && featuredPosts.length > 0 ? (
        <ProfileFeaturedPosts
          posts={featuredPosts}
          savedIds={savedIds}
          onSaveToggle={handleSaveToggle}
        />
      ) : null}

      <Card className='gap-0 py-0'>
        <Tabs defaultValue={defaultTab} className='w-full'>
          <div className='border-border border-b px-4'>
            <TabsList
              variant='line'
              className='h-auto min-h-0 w-full max-w-full justify-start gap-8 overflow-x-auto overflow-y-hidden rounded-none bg-transparent p-0 [-ms-overflow-style:none] [scrollbar-width:none] group-data-horizontal/tabs:!h-auto sm:gap-10 [&::-webkit-scrollbar]:hidden'
            >
              {tabs.map((tabId) => (
                <TabsTrigger
                  key={tabId}
                  value={tabId}
                  className='text-muted-foreground hover:text-foreground data-active:border-foreground data-active:text-foreground -mb-px inline-flex !h-auto max-w-none !flex-none shrink-0 items-center rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pt-3 pb-3 text-[15px] font-normal whitespace-nowrap shadow-none after:!hidden focus-visible:ring-0 focus-visible:outline-none data-active:bg-transparent data-active:shadow-none'
                >
                  {PROFILE_POSTS_TAB_LABELS[tabId]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((tabId) => {
            if (!isProfilePostsTabAllowed(role, tabId)) {
              return null;
            }

            return (
              <TabsContent key={tabId} value={tabId} className='mt-0'>
                <CardContent className='p-0'>
                  {tabId === "books" ? (
                    <ProfileBookList
                      books={getMockOwnBooks(username)}
                      emptyMessage={EMPTY_MESSAGES.books}
                    />
                  ) : (
                    <ProfilePostList
                      posts={getMockPostsForOwnProfileTab(tabId, username)}
                      emptyMessage={EMPTY_MESSAGES[tabId]}
                      showDraftBadge={tabId === "drafts"}
                      showSaveButton={tabId !== "saved"}
                      savedIds={savedIds}
                      onSaveToggle={handleSaveToggle}
                    />
                  )}
                </CardContent>
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>
    </div>
  );
}
