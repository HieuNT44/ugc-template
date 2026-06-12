"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  buildStudioKanbanColumns,
  type StudioKanbanColumn,
} from "../lib/mock-studio-kanban";
import type { ContentDocument } from "../types/content-document";
import { StudioKanbanCard } from "./StudioKanbanCard";

const COLUMN_ACCENT: Record<StudioKanbanColumn["id"], string> = {
  draft: "border-t-slate-400",
  review: "border-t-amber-500",
  rejected: "border-t-red-500",
  published: "border-t-emerald-500",
};

interface StudioKanbanBoardProps {
  contents: ContentDocument[];
}

export function StudioKanbanBoard({ contents }: StudioKanbanBoardProps) {
  const columns = buildStudioKanbanColumns(contents);

  return (
    <div className='StudioKanbanBoard'>
      <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='font-serif text-3xl font-bold'>Creator studio</h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            Track your content from draft to published.
          </p>
        </div>
        <Button className='rounded-full' asChild>
          <Link href='/studio/create'>
            <Plus className='size-4' />
            New content
          </Link>
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {columns.map((column) => (
          <section
            key={column.id}
            className={cn(
              "StudioKanbanColumn border-border bg-muted/30 flex min-h-[420px] flex-col rounded-xl border",
              "border-t-4",
              COLUMN_ACCENT[column.id]
            )}
            aria-label={`${column.title} column`}
          >
            <header className='flex items-start justify-between gap-2 px-4 pt-4 pb-3'>
              <div>
                <h2 className='text-sm font-semibold'>{column.title}</h2>
                <p className='text-muted-foreground mt-0.5 text-xs'>
                  {column.description}
                </p>
              </div>
              <Badge variant='secondary'>{column.items.length}</Badge>
            </header>

            <div className='flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-4'>
              {column.items.length === 0 ? (
                <p className='text-muted-foreground rounded-lg border border-dashed px-3 py-8 text-center text-xs'>
                  No items yet
                </p>
              ) : (
                column.items.map((item) => (
                  <StudioKanbanCard key={item.id} item={item} />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
