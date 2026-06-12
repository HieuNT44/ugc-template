"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/core/api/hooks/useUploadImage";
import { cn } from "@/lib/utils";

interface CoverUploaderProps {
  previewUrl: string | null;
  onChange: (previewUrl: string | null, uploadFileId?: string | null) => void;
  className?: string;
  /** Compact drag-and-drop zone for editor headers. */
  compact?: boolean;
}

export function CoverUploader({
  previewUrl,
  onChange,
  className,
  compact = false,
}: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { upload, isUploading } = useUploadImage("content_cover");

  async function onFileSelect(file: File | undefined) {
    if (!file?.type.startsWith("image/")) {
      return;
    }

    setUploadError(null);

    try {
      const completed = await upload(file);
      onChange(completed.url, completed.upload_file_id);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "アップロードに失敗しました"
      );
    }
  }

  function onDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    onFileSelect(file);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  const hiddenInput = (
    <input
      ref={inputRef}
      type='file'
      accept='image/*'
      className='sr-only'
      onChange={(e) => onFileSelect(e.target.files?.[0])}
      aria-label='カバー画像をアップロード'
    />
  );

  if (compact) {
    return (
      <div className={cn("CoverUploader w-full", className)}>
        <div
          role='button'
          tabIndex={0}
          className={cn(
            "flex min-h-[72px] w-full cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 py-3 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-muted/40"
          )}
          aria-busy={isUploading}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFilePicker();
            }
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          aria-label='ドラッグ＆ドロップまたはクリックでカバー画像をアップロード'
        >
          {previewUrl ? (
            <>
              <div className='ring-foreground/10 relative size-12 shrink-0 overflow-hidden rounded-md ring-1'>
                <Image
                  src={previewUrl}
                  alt='カバープレビュー'
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>カバー画像</p>
                <p className='text-muted-foreground text-xs'>
                  Drop a new image or click to replace
                </p>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='text-muted-foreground shrink-0'
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null, null);
                }}
                aria-label='カバー画像を削除'
              >
                <Trash2 className='size-4' />
                削除
              </Button>
            </>
          ) : (
            <>
              <div className='bg-muted flex size-10 shrink-0 items-center justify-center rounded-md'>
                <ImagePlus className='text-muted-foreground size-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>カバー画像</p>
                <p className='text-muted-foreground text-xs'>
                  {isUploading
                    ? "カバー画像をアップロード中..."
                    : "ここに画像をドラッグ＆ドロップ、またはクリックして選択（任意）"}
                </p>
              </div>
            </>
          )}
        </div>
        {uploadError ? (
          <p className='text-destructive mt-2 text-xs'>{uploadError}</p>
        ) : null}
        {hiddenInput}
      </div>
    );
  }

  return (
    <div className={cn("CoverUploader flex flex-col gap-3", className)}>
      {previewUrl ? (
        <div className='ring-foreground/10 relative aspect-[16/9] w-full overflow-hidden rounded-lg ring-1'>
          <Image
            src={previewUrl}
            alt='カバープレビュー'
            fill
            className='object-cover'
            unoptimized
          />
          <Button
            type='button'
            variant='destructive'
            size='sm'
            className='absolute top-2 right-2'
            onClick={() => onChange(null)}
            aria-label='カバー画像を削除'
          >
            <Trash2 className='size-4' />
            削除
          </Button>
        </div>
      ) : (
        <button
          type='button'
          className={cn(
            "text-muted-foreground flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-muted/50"
          )}
          aria-busy={isUploading}
          onClick={openFilePicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          aria-label='カバー画像をアップロード'
        >
          <ImagePlus className='size-8 opacity-60' />
          {isUploading
            ? "カバー画像をアップロード中..."
            : "ドラッグ＆ドロップまたはクリックでカバー画像をアップロード（任意）"}
        </button>
      )}
      {uploadError ? (
        <p className='text-destructive text-xs'>{uploadError}</p>
      ) : null}
      {hiddenInput}
    </div>
  );
}
