import { CreateContentShell, ReportEditor } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function ReportEditPage() {
  await requireCreatorSession();

  return (
    <CreateContentShell
      step={2}
      totalSteps={3}
      title='レポートをアップロード'
      backHref='/studio/create'
    >
      <ReportEditor />
    </CreateContentShell>
  );
}
