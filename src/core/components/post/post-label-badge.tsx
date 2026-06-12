import { cn } from "@/lib/utils";

import { getPostLabelText, POST_LABEL_CLASS } from "../../lib/post-labels";
import type { PostLabel } from "../../types/post-label";

interface PostLabelBadgeProps {
  label: PostLabel;
  className?: string;
}

export function PostLabelBadge({ label, className }: PostLabelBadgeProps) {
  const text = getPostLabelText(label);

  return (
    <span
      className={cn(
        "PostLabelBadge inline-flex w-fit shrink-0 items-center rounded-full border px-2 py-0.5 text-xs leading-none font-medium",
        POST_LABEL_CLASS[label.type],
        className
      )}
    >
      {text}
    </span>
  );
}
