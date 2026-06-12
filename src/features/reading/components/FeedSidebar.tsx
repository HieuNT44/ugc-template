import Link from "next/link";
import { Crown, Medal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials } from "@/core/lib/avatar-initials";

import type { FeedTopCommitter } from "../lib/top-committers-api";

export type FeedSidebarRankingItem = {
  id: string;
  title: string;
  authorName: string;
  href: string;
};

function FeedSidebarRankingSection({
  title,
  items,
}: {
  title: string;
  items: FeedSidebarRankingItem[];
}) {
  return (
    <section>
      <h2 className='text-foreground mb-4 text-sm font-semibold tracking-wide uppercase'>
        {title}
      </h2>
      <ol className='space-y-4'>
        {items.map((item, index) => (
          <li key={item.id} className='flex items-start gap-3'>
            <span
              className='text-muted-foreground w-5 shrink-0 text-sm font-semibold tabular-nums'
              aria-hidden
            >
              {index + 1}
            </span>
            <div className='min-w-0 flex-1'>
              <Link
                href={item.href}
                className='text-foreground focus-visible:ring-ring/50 line-clamp-2 text-sm leading-snug font-medium no-underline hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:outline-none'
              >
                {item.title}
              </Link>
              <p className='text-muted-foreground mt-1 truncate text-xs'>
                {item.authorName}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TopCommitterBadge({ rank }: { rank: number }) {
  const rankClassName =
    rank === 1
      ? "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25"
      : rank === 2
        ? "bg-slate-100 text-slate-600 ring-slate-300 dark:bg-slate-400/15 dark:text-slate-200 dark:ring-slate-300/25"
        : rank === 3
          ? "bg-orange-100 text-orange-700 ring-orange-300 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-400/25"
          : "bg-muted text-muted-foreground ring-border";
  const Icon = rank === 1 ? Crown : Medal;

  return (
    <span
      className={`inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold ring-1 ${rankClassName}`}
      title={`Top ${rank}`}
      aria-label={`Top ${rank}`}
    >
      <Icon className='size-3.5' aria-hidden />
      {rank}
    </span>
  );
}

export function FeedSidebar({
  latestBooks,
  latestReports,
  topCommitters,
  trendingTags,
}: {
  latestBooks: FeedSidebarRankingItem[];
  latestReports: FeedSidebarRankingItem[];
  topCommitters: FeedTopCommitter[];
  trendingTags: string[];
}) {
  return (
    <aside className='FeedSidebar hidden w-[368px] shrink-0 lg:block'>
      <div className='sticky top-20 space-y-8'>
        <section>
          <h2 className='text-foreground mb-4 text-sm font-semibold tracking-wide uppercase'>
            Topics for you
          </h2>
          <div className='flex flex-wrap gap-2'>
            {trendingTags.map((topic) => (
              <Link
                key={topic}
                href={`/explore?topic=${encodeURIComponent(topic)}`}
                className='border-border bg-background text-foreground hover:bg-muted inline-flex rounded-full border px-3 py-1.5 text-sm no-underline transition-colors'
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className='text-foreground mb-4 text-sm font-semibold tracking-wide uppercase'>
            Top Committers
          </h2>
          <ul className='space-y-4'>
            {topCommitters.map((committer, index) => (
              <li key={committer.id} className='flex items-start gap-3'>
                <Avatar className='size-8 shrink-0 overflow-hidden rounded-full after:hidden'>
                  <AvatarImage src={committer.avatarUrl} alt={committer.name} />
                  <AvatarFallback className='text-xs'>
                    {getAvatarInitials(committer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <Link
                    href={committer.href}
                    className='text-foreground block truncate text-sm font-medium no-underline hover:underline'
                  >
                    {committer.name}
                  </Link>
                  <p className='text-muted-foreground truncate text-xs'>
                    {committer.contentCount} posts published
                  </p>
                </div>
                <TopCommitterBadge rank={index + 1} />
              </li>
            ))}
          </ul>
        </section>

        <FeedSidebarRankingSection title='Top Books' items={latestBooks} />

        <FeedSidebarRankingSection title='Top Reports' items={latestReports} />
      </div>
    </aside>
  );
}
