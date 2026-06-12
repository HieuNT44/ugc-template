"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { EditorMode } from "../types/content-type";

interface EditorModeTabsProps {
  value: EditorMode;
  onChange: (mode: EditorMode) => void;
  className?: string;
  listClassName?: string;
}

export function EditorModeTabs({
  value,
  onChange,
  className,
  listClassName,
}: EditorModeTabsProps) {
  return (
    <Tabs
      className={cn("EditorModeTabs", className)}
      value={value}
      onValueChange={(v) => onChange(v as EditorMode)}
    >
      <TabsList className={listClassName}>
        <TabsTrigger value='markdown'>Markdown</TabsTrigger>
        <TabsTrigger value='wysiwyg'>Text Editor</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
