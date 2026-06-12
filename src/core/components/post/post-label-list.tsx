import { cn } from "@/lib/utils";

import { sortPostLabels } from "../../lib/post-labels";
import type { PostLabel } from "../../types/post-label";
import { PostLabelBadge } from "./post-label-badge";

interface PostLabelListProps {
  labels: PostLabel[];
  className?: string;
  badgeClassName?: string;
}

export function PostLabelList({
  labels,
  className,
  badgeClassName,
}: PostLabelListProps) {
  if (labels.length === 0) {
    return null;
  }

  const sorted = sortPostLabels(labels);

  return (
    <div
      className={cn(
        "PostLabelList flex shrink-0 flex-wrap items-center gap-2",
        className
      )}
    >
      {sorted.map((label) => (
        <PostLabelBadge
          key={`${label.type}-${label.type === "paid" ? label.amountCents : ""}`}
          label={label}
          className={badgeClassName}
        />
      ))}
    </div>
  );
}
