import Link from "next/link";

import { Button } from "@/components/ui/button";
import { listMyContentsAction } from "@/features/create-content";
import { MyContentsList } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function StudioPostsPage() {
  await requireCreatorSession();
  const contents = await listMyContentsAction();

  return (
    <div className='StudioPosts mx-auto w-full max-w-3xl px-4 py-10'>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <div>
          <h1 className='font-serif text-3xl font-bold'>My posts</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Drafts, published content, and items awaiting review.
          </p>
        </div>
        <Button className='rounded-full' asChild>
          <Link href='/studio/create'>Create</Link>
        </Button>
      </div>
      <MyContentsList contents={contents} />
    </div>
  );
}
