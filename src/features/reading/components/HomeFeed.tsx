"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { listFeedContentsPageAction } from "../actions/list-feed-contents";
import type { FeedPost, FeedTabId } from "../types/feed-post";
import { FeedLoadingSplash } from "./FeedLoadingSplash";
import type { FeedTopCommitter } from "../lib/top-committers-api";
import { FeedPostList } from "./FeedPostList";
import { FeedSidebar, type FeedSidebarRankingItem } from "./FeedSidebar";

const TAB_LABELS: Record<FeedTabId, string> = {
  blog: "Blog",
  book: "Book",
  report: "Report",
};

const EMPTY_MESSAGES: Record<FeedTabId, string> = {
  blog: "No blog posts yet.",
  book: "No books yet.",
  report: "No reports yet.",
};

export type FeedPostsByTab = Record<FeedTabId, FeedPost[]>;
type FeedPaginationByTab = Record<
  FeedTabId,
  {
    hasNext: boolean;
    nextCursor: string | null;
  }
>;

interface HomeFeedProps {
  initialPostsByTab: FeedPostsByTab;
  initialPaginationByTab: FeedPaginationByTab;
  topCommitters: FeedTopCommitter[];
  trendingTags: string[];
}

function mapPostsToRankingItems(posts: FeedPost[]): FeedSidebarRankingItem[] {
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    authorName: post.authorDisplayName,
    href: post.href ?? "#",
  }));
}

export function HomeFeed({
  initialPostsByTab,
  initialPaginationByTab,
  topCommitters,
  trendingTags,
}: HomeFeedProps) {
  const [postsByTab, setPostsByTab] =
    useState<FeedPostsByTab>(initialPostsByTab);
  const [paginationByTab, setPaginationByTab] = useState<FeedPaginationByTab>(
    initialPaginationByTab
  );
  const [loadingTab, setLoadingTab] = useState<FeedTabId | null>(null);
  const latestBooks = useMemo(
    () => mapPostsToRankingItems(postsByTab.book.slice(0, 5)),
    [postsByTab]
  );
  const latestReports = useMemo(
    () => mapPostsToRankingItems(postsByTab.report.slice(0, 10)),
    [postsByTab]
  );

  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [showLoadingSplash, setShowLoadingSplash] = useState(true);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

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

  const handleRequireLogin = useCallback(() => {
    setLoginDialogOpen(true);
  }, []);

  const handleLoadMore = useCallback(
    async (tabId: FeedTabId) => {
      const pagination = paginationByTab[tabId];

      if (!pagination.hasNext || !pagination.nextCursor || loadingTab) {
        return;
      }

      setLoadingTab(tabId);

      try {
        const page = await listFeedContentsPageAction(tabId, {
          cursor: pagination.nextCursor,
        });

        setPostsByTab((prev) => {
          const existingIds = new Set(prev[tabId].map((post) => post.id));
          const nextPosts = page.posts.filter(
            (post) => !existingIds.has(post.id)
          );

          return {
            ...prev,
            [tabId]: [...prev[tabId], ...nextPosts],
          };
        });
        setPaginationByTab((prev) => ({
          ...prev,
          [tabId]: {
            hasNext: page.hasNext,
            nextCursor: page.nextCursor,
          },
        }));
      } catch (error) {
        console.error("Failed to load more feed posts:", error);
      } finally {
        setLoadingTab(null);
      }
    },
    [loadingTab, paginationByTab]
  );

  return (
    <>
      {showLoadingSplash ? (
        <FeedLoadingSplash onDismiss={() => setShowLoadingSplash(false)} />
      ) : null}

      <div
        className='HomeFeed mx-auto flex w-full max-w-6xl flex-1 gap-12 px-6 py-8 lg:px-8'
        aria-hidden={showLoadingSplash}
      >
        <div className='min-w-0 flex-1 lg:max-w-[728px]'>
          <Tabs defaultValue='blog' className='w-full'>
            <div className='border-border bg-site-main sticky top-14 z-10 -mx-6 border-b px-6 pt-2 lg:-mx-0 lg:px-0'>
              <TabsList
                variant='line'
                className='h-auto min-h-0 w-full justify-start gap-8 rounded-none bg-transparent p-0 group-data-horizontal/tabs:!h-auto'
              >
                {(Object.keys(TAB_LABELS) as FeedTabId[]).map((tabId) => (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className='text-muted-foreground hover:text-foreground data-active:border-foreground data-active:text-foreground -mb-px inline-flex !h-auto !flex-none shrink-0 items-center rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pt-2 pb-3 text-[15px] font-normal shadow-none after:!hidden focus-visible:ring-0 focus-visible:outline-none data-active:bg-transparent data-active:shadow-none'
                  >
                    {TAB_LABELS[tabId]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {(Object.keys(TAB_LABELS) as FeedTabId[]).map((tabId) => (
              <TabsContent key={tabId} value={tabId} className='mt-0'>
                <FeedPostList
                  posts={postsByTab[tabId]}
                  emptyMessage={EMPTY_MESSAGES[tabId]}
                  savedIds={savedIds}
                  onSaveToggle={handleSaveToggle}
                  onRequireLogin={handleRequireLogin}
                />
                {paginationByTab[tabId].hasNext ? (
                  <div className='HomeFeedLoadMore flex justify-center py-8'>
                    <Button
                      type='button'
                      variant='outline'
                      className='rounded-full px-6'
                      disabled={loadingTab !== null}
                      onClick={() => {
                        void handleLoadMore(tabId);
                      }}
                    >
                      {loadingTab === tabId ? "Loading..." : "Load more"}
                    </Button>
                  </div>
                ) : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <FeedSidebar
          latestBooks={latestBooks}
          latestReports={latestReports}
          topCommitters={topCommitters}
          trendingTags={trendingTags}
        />
      </div>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className='HomeFeedLoginDialog sm:max-w-[420px]'>
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              You need to sign in before saving stories to your list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setLoginDialogOpen(false)}
            >
              Later
            </Button>
            <Button asChild>
              <Link href='/login'>Login</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
