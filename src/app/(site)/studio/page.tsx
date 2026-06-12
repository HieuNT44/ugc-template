import { StudioPageClient } from "@/features/create-content/components/StudioPageClient";
import { listMyContentsAction } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function StudioPage() {
  await requireCreatorSession();
  const contents = await listMyContentsAction();

  return <StudioPageClient contents={contents} />;
}
