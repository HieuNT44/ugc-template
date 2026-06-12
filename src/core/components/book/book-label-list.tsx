import { cn } from "@/lib/utils";

import { sortPostLabels } from "../../lib/post-labels";
import type { PostLabel } from "../../types/post-label";
import { PostLabelBadge } from "../post/post-label-badge";

interface BookLabelListProps {
  labels?: PostLabel[];
  className?: string;
}

export function BookLabelList({ labels = [], className }: BookLabelListProps) {
  const sorted = sortPostLabels(labels);

  if (sorted.length === 0) {
    return (
      <span className='BookLabelBadge bg-muted text-muted-foreground inline-flex w-fit shrink-0 items-center rounded-full border px-2 py-0.5 text-xs leading-none font-medium'>
        ブック
      </span>
    );
  }

  return (
    <div
      className={cn(
        "BookLabelList flex shrink-0 flex-wrap items-center gap-1.5",
        className
      )}
    >
      <span className='BookLabelBadge bg-muted text-muted-foreground inline-flex w-fit shrink-0 items-center rounded-full border px-2 py-0.5 text-xs leading-none font-medium'>
        ブック
      </span>
      {sorted.map((label) => (
        <PostLabelBadge
          key={`${label.type}-${label.type === "paid" ? label.amountCents : ""}`}
          label={label}
        />
      ))}
    </div>
  );
}
