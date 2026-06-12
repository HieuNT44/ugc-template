"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type BookChapterMenuItem = {
  id: number;
  title: string;
  orderNumber: number;
  isFreePreview: boolean;
};

interface BookChapterMenuDrawerProps {
  chapters: BookChapterMenuItem[];
  bookPath: string;
  selectedChapterId?: string | null;
}

function getChapterPath(
  bookPath: string,
  chapter: BookChapterMenuItem
): string {
  return `${bookPath}?chapter=${chapter.id}`;
}

export function BookChapterMenuDrawer({
  chapters,
  bookPath,
  selectedChapterId,
}: BookChapterMenuDrawerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className='rounded-full border-[#2A2A2A] bg-[#F8F3E7]/70 text-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#F8F3E7]'
        >
          <Menu className='size-4' aria-hidden />
          Chapters
        </Button>
      </DialogTrigger>
      <DialogContent className='top-0 right-0 left-auto h-svh max-w-[360px] translate-x-0 translate-y-0 content-start rounded-none border-l border-[#2A2A2A]/20 bg-[#F8F3E7] p-5 text-[#2A2A2A]'>
        <DialogHeader className='text-left'>
          <DialogTitle className='font-serif text-2xl text-[#2A2A2A]'>
            Chapters
          </DialogTitle>
        </DialogHeader>

        <ol className='BookChapterMenuDrawer mt-4 divide-y divide-[#2A2A2A]/20 border-y border-[#2A2A2A]'>
          {chapters.map((chapter) => {
            const active = String(chapter.id) === selectedChapterId;

            return (
              <li key={chapter.id}>
                <Link
                  href={getChapterPath(bookPath, chapter)}
                  className={cn(
                    "flex min-h-14 items-center gap-4 px-1 py-3 text-[#2A2A2A] no-underline transition-colors hover:bg-[#2A2A2A]/5 focus-visible:ring-3 focus-visible:ring-[#2A2A2A]/30 focus-visible:outline-none",
                    active && "bg-[#2A2A2A] px-3 text-[#F8F3E7]"
                  )}
                >
                  <span
                    className={cn(
                      "w-9 shrink-0 font-mono text-2xl leading-none font-bold tracking-[-0.08em] text-[#2A2A2A]/80",
                      active && "text-[#F8F3E7]"
                    )}
                  >
                    {String(chapter.orderNumber).padStart(2, "0")}
                  </span>
                  <span className='min-w-0'>
                    <span className='block truncate font-mono text-xs leading-snug font-bold tracking-[0.06em] uppercase'>
                      {chapter.title}
                    </span>
                    {chapter.isFreePreview ? (
                      <span
                        className={cn(
                          "mt-1 block font-mono text-[10px] leading-none tracking-[0.12em] text-[#2A2A2A]/45 uppercase",
                          active && "text-[#F8F3E7]/65"
                        )}
                      >
                        Free preview
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
