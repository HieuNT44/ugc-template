import { BookEditor, CreateContentShell } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function BookEditPage() {
  await requireCreatorSession();

  return (
    <CreateContentShell
      step={2}
      totalSteps={3}
      title='Write your book'
      backHref='/studio/create'
      surface='book'
    >
      <BookEditor />
    </CreateContentShell>
  );
}
