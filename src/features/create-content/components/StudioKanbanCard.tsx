"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProfilePostListItem } from "@/core/components/post";

import { studioKanbanItemToUserPost } from "../lib/studio-kanban-item-to-user-post";
import { getStudioEditHref } from "../lib/studio-edit-href";
import type { StudioKanbanItem } from "../lib/mock-studio-kanban";

interface StudioKanbanCardProps {
  item: StudioKanbanItem;
}

export function StudioKanbanCard({ item }: StudioKanbanCardProps) {
  const post = studioKanbanItemToUserPost(item);
  const editHref = getStudioEditHref(item);

  return (
    <div className='StudioKanbanCard bg-card text-card-foreground ring-foreground/10 overflow-hidden rounded-xl shadow-sm ring-1'>
      <ProfilePostListItem
        post={post}
        showDraftBadge={item.status === "draft"}
        showSaveButton={false}
        showEngagementStats={false}
        showThumbnail={false}
      />

      {editHref ? (
        <div className='border-border/60 border-t px-4 pb-4'>
          <Button asChild size='sm' variant='outline' className='w-full'>
            <Link href={editHref}>Edit</Link>
          </Button>
        </div>
      ) : null}

      {item.rejectionReason ? (
        <p className='text-destructive border-border/60 border-t px-4 pb-4 text-xs leading-relaxed'>
          {item.rejectionReason}
        </p>
      ) : null}
    </div>
  );
}
