import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BlogEditor } from "@/features/create-content";
import { getContentForEditAction } from "@/features/create-content/actions/get-content-for-edit";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

type StudioEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudioEditPage({ params }: StudioEditPageProps) {
  await requireCreatorSession();

  const { id } = await params;
  const result = await getContentForEditAction(id);

  if (!("success" in result) || !result.success) {
    notFound();
  }

  const content = result.content;

  if (content.type !== "blog") {
    return (
      <div className='StudioEditPage mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
        <h1 className='font-serif text-2xl font-bold'>
          Editing not available yet
        </h1>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Blog editing is supported today. {content.type} editing will be added
          in a future update.
        </p>
        <Button asChild variant='outline'>
          <Link href='/studio'>Back to Studio</Link>
        </Button>
      </div>
    );
  }

  return <BlogEditor initialDocument={content} />;
}
