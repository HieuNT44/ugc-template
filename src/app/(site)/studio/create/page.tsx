import { CreateTypeSelector } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function CreateContentPage() {
  await requireCreatorSession();

  return <CreateTypeSelector />;
}
