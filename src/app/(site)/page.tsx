import { listFeedContentsPageAction } from "@/features/reading/actions/list-feed-contents";
import { listTopCommittersAction } from "@/features/reading/actions/list-top-committers";
import { listTrendingTagsAction } from "@/features/reading/actions/list-trending-tags";
import { HomeFeed } from "@/features/reading/components/HomeFeed";

export default async function HomePage() {
  const [blogPosts, bookPosts, reportPosts, topCommitters, trendingTags] =
    await Promise.all([
      listFeedContentsPageAction("blog"),
      listFeedContentsPageAction("book"),
      listFeedContentsPageAction("report"),
      listTopCommittersAction(3),
      listTrendingTagsAction(6),
    ]);

  return (
    <HomeFeed
      initialPostsByTab={{
        blog: blogPosts.posts,
        book: bookPosts.posts,
        report: reportPosts.posts,
      }}
      initialPaginationByTab={{
        blog: {
          hasNext: blogPosts.hasNext,
          nextCursor: blogPosts.nextCursor,
        },
        book: {
          hasNext: bookPosts.hasNext,
          nextCursor: bookPosts.nextCursor,
        },
        report: {
          hasNext: reportPosts.hasNext,
          nextCursor: reportPosts.nextCursor,
        },
      }}
      topCommitters={topCommitters}
      trendingTags={trendingTags}
    />
  );
}
