import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function BlogTemplatePage() {
  await requireCreatorSession();

  return (
    <div className='BlogTemplatePage mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-10 lg:max-w-7xl lg:py-14'>
      <div className='mb-10 w-full'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='max-w-2xl'>
            <h1 className='font-serif text-3xl font-bold lg:text-4xl'>
              Choose a blog template
            </h1>
            <p className='text-muted-foreground mt-3 text-sm leading-relaxed lg:text-base'>
              Start from a proven structure or skip to write freely.
            </p>
          </div>
          <div className='flex shrink-0 items-center gap-2'>
            <Button variant='ghost' className='rounded-full' asChild>
              <Link href='/studio/create'>Back</Link>
            </Button>
            <Button variant='outline' className='rounded-full' asChild>
              <Link href='/studio/create/blog/new'>Skip</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className='border-border bg-card w-full max-w-3xl rounded-2xl border px-8 py-10 text-center shadow-sm'>
        <h2 className='font-serif text-3xl font-bold'>
          This feature will be implemented later.
        </h2>
      </div>
    </div>
  );
}
