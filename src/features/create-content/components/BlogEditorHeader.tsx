"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BlogEditorHeaderProps {
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublishSettings: () => void;
  isSavingDraft?: boolean;
  showSaveDraft?: boolean;
  publishSettingsLabel?: string;
}

export function BlogEditorHeader({
  onPreview,
  onSaveDraft,
  onPublishSettings,
  isSavingDraft = false,
  showSaveDraft = true,
  publishSettingsLabel = "公開設定",
}: BlogEditorHeaderProps) {
  return (
    <header className='BlogEditorHeader border-border bg-background sticky top-14 z-40 border-b'>
      <div className='flex items-center justify-between gap-4 px-6 py-2.5'>
        <div className='flex min-w-0 items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground shrink-0 gap-1 px-2'
            asChild
          >
            <Link href='/studio'>
              <ChevronLeft className='size-4' />
              スタジオ
            </Link>
          </Button>
        </div>

        <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='rounded-md'
            onClick={onPreview}
            disabled={isSavingDraft}
          >
            プレビュー
          </Button>
          {showSaveDraft ? (
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='rounded-md'
              onClick={onSaveDraft}
              disabled={isSavingDraft}
            >
              {isSavingDraft ? "保存中..." : "下書きを保存"}
            </Button>
          ) : null}
          <Button
            type='button'
            size='sm'
            className='rounded-md bg-emerald-600 text-white hover:bg-emerald-700'
            onClick={onPublishSettings}
            disabled={isSavingDraft}
          >
            {publishSettingsLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}
