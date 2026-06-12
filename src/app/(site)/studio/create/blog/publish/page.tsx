import { CreateContentShell } from "@/features/create-content";
import { BlogPublishFlow } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function BlogPublishPage() {
  await requireCreatorSession();

  return (
    <CreateContentShell showHeader={false}>
      <BlogPublishFlow />
    </CreateContentShell>
  );
}
