import {
  CreateContentShell,
  ReportPublishFlow,
} from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function ReportPublishPage() {
  await requireCreatorSession();

  return (
    <CreateContentShell
      step={3}
      totalSteps={3}
      title='公開設定'
      backHref='/studio/create/report/edit'
    >
      <ReportPublishFlow />
    </CreateContentShell>
  );
}
