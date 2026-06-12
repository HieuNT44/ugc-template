import { BlogEditor } from "@/features/create-content";
import { requireCreatorSession } from "@/features/create-content/lib/require-creator-session";

export default async function BlogNewPage() {
  await requireCreatorSession();

  return <BlogEditor />;
}
