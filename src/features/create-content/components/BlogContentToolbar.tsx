"use client";

import {
  CircleHelp,
  Columns2,
  Eye,
  FileText,
  ImageIcon,
  Lightbulb,
  Pencil,
  Search,
  Smile,
  SpellCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EditorViewMode = "edit" | "split" | "preview";

const CONTENT_ACTIONS = [
  { id: "image", label: "画像を挿入", icon: ImageIcon },
  { id: "emoji", label: "絵文字を挿入", icon: Smile },
  { id: "search", label: "本文内を検索", icon: Search },
  { id: "spellcheck", label: "スペルチェック", icon: SpellCheck },
  { id: "help", label: "ヘルプ", icon: CircleHelp },
  { id: "tips", label: "執筆のヒント", icon: Lightbulb },
  { id: "template", label: "コンテンツテンプレート", icon: FileText },
] as const;

const VIEW_MODES: {
  id: EditorViewMode;
  label: string;
  icon: typeof Pencil;
}[] = [
  { id: "edit", label: "編集", icon: Pencil },
  { id: "split", label: "分割表示", icon: Columns2 },
  { id: "preview", label: "プレビュー", icon: Eye },
];

const TOOLBAR_ICON_CLASS = "size-5";
const TOOLBAR_BUTTON_CLASS = "size-9";

interface BlogContentToolbarProps {
  viewMode: EditorViewMode;
  onViewModeChange: (mode: EditorViewMode) => void;
  showViewModes?: boolean;
}

export function BlogContentToolbar({
  viewMode,
  onViewModeChange,
  showViewModes = true,
}: BlogContentToolbarProps) {
  return (
    <div className='BlogContentToolbar border-border bg-muted/20 flex items-center justify-between border-b px-3 py-2'>
      <div className='flex min-w-0 items-center gap-1'>
        <span className='text-sm font-medium'>本文</span>

        <div className='ml-2 flex items-center gap-0.5'>
          {CONTENT_ACTIONS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              type='button'
              variant='ghost'
              size='icon'
              className={`text-muted-foreground ${TOOLBAR_BUTTON_CLASS}`}
              aria-label={label}
            >
              <Icon className={TOOLBAR_ICON_CLASS} />
            </Button>
          ))}
        </div>
      </div>

      {showViewModes ? (
        <div className='flex shrink-0 items-center gap-1'>
          {VIEW_MODES.map((mode) => {
            const Icon = mode.icon;
            const active = viewMode === mode.id;
            return (
              <Button
                key={mode.id}
                type='button'
                variant={active ? "secondary" : "ghost"}
                size='icon'
                className={TOOLBAR_BUTTON_CLASS}
                onClick={() => onViewModeChange(mode.id)}
                aria-label={mode.label}
                aria-pressed={active}
              >
                <Icon className={TOOLBAR_ICON_CLASS} />
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
