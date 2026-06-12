import { BookPublishFlow, CreateContentShell } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function BookPublishPage() {
  await requireCreatorSession();

  return (
    <CreateContentShell
      step={3}
      totalSteps={3}
      title='Publish settings'
      backHref='/studio/create/book/edit'
      surface='book'
    >
      <BookPublishFlow />
    </CreateContentShell>
  );
}
