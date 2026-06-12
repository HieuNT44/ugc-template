"use client";

import { Tag, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

const MAX_TAGS = 5;

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagInput({ tags, onChange, className }: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef(tags);
  const skipBlurCommitRef = useRef(false);

  useEffect(() => {
    tagsRef.current = tags;
  }, [tags]);

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase();
    const currentTags = tagsRef.current;

    if (!tag || currentTags.includes(tag) || currentTags.length >= MAX_TAGS) {
      setInput("");
      return;
    }

    const nextTags = [...currentTags, tag];
    tagsRef.current = nextTags;
    onChange(nextTags);
    setInput("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      skipBlurCommitRef.current = true;
      addTag(input);
    }
    if (event.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  const isFull = tags.length >= MAX_TAGS;

  return (
    <div
      className={cn(
        "TagInput border-input bg-background focus-within:border-ring focus-within:ring-ring/50 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2 transition-colors focus-within:ring-3",
        isFull && "opacity-80",
        className
      )}
      onClick={() => inputRef.current?.focus()}
      role='group'
      aria-label='Tags'
    >
      <Tag className='text-muted-foreground size-4 shrink-0' aria-hidden />

      {tags.map((tag) => (
        <span
          key={tag}
          className='inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
        >
          {tag}
          <button
            type='button'
            className='rounded-full p-0.5 hover:bg-emerald-200/80 dark:hover:bg-emerald-900/60'
            onClick={(e) => {
              e.stopPropagation();
              onChange(tags.filter((t) => t !== tag));
            }}
            aria-label={`Remove tag ${tag}`}
          >
            <X className='size-3' />
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (skipBlurCommitRef.current) {
            skipBlurCommitRef.current = false;
            return;
          }

          addTag(input);
        }}
        placeholder={
          isFull
            ? ""
            : tags.length === 0
              ? "Add tags (space-separated, up to 5)"
              : ""
        }
        disabled={isFull}
        className='placeholder:text-muted-foreground min-w-[140px] flex-1 border-0 bg-transparent text-sm outline-none disabled:cursor-not-allowed'
        aria-label='Add tag'
      />
    </div>
  );
}
