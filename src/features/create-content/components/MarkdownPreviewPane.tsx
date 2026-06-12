"use client";

import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

interface MarkdownPreviewPaneProps {
  content: string;
  className?: string;
  emptyMessage?: string;
}

export function MarkdownPreviewPane({
  content,
  className,
  emptyMessage = "Markdownを書き始めるとライブプレビューが表示されます。",
}: MarkdownPreviewPaneProps) {
  const trimmed = content.trim();

  return (
    <div
      className={cn(
        "MarkdownPreviewPane bg-background overflow-y-auto px-6 py-4",
        className
      )}
    >
      {trimmed ? (
        <div className='prose prose-sm dark:prose-invert max-w-none'>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <div className='text-muted-foreground flex h-full min-h-[200px] items-center justify-center text-center text-sm leading-relaxed'>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
