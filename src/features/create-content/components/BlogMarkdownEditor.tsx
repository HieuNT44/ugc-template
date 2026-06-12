"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

type EditorViewMode = "edit" | "split" | "preview";

type UiwMarkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  enablePreview?: boolean;
  showToolbar?: boolean;
  height?: string;
  placeholder?: string;
  className?: string;
};

type UiwMarkdownPreviewProps = {
  source?: string;
  className?: string;
};

type UiwModule = {
  default: ComponentType<UiwMarkdownEditorProps> & {
    Markdown: ComponentType<UiwMarkdownPreviewProps>;
  };
};

const EDITOR_HEIGHT_CLASS =
  "h-full min-h-0 [&_.cm-editor]:h-full [&_.cm-editor.cm-focused]:outline-none [&_.cm-scroller]:h-full [&_.md-editor]:flex [&_.md-editor]:h-full [&_.md-editor]:min-h-0 [&_.md-editor]:flex-1 [&_.md-editor]:flex-col [&_.md-editor]:rounded-none [&_.md-editor]:shadow-none [&_.md-editor-content]:flex [&_.md-editor-content]:h-full [&_.md-editor-content]:min-h-0 [&_.md-editor-content]:flex-1 [&_.md-editor-inner]:h-full";

const UiwMarkdownEditor = dynamic(
  () =>
    import("@uiw/react-markdown-editor").then(
      (mod) => mod.default as UiwModule["default"]
    ),
  {
    ssr: false,
    loading: () => (
      <div className='bg-muted/30 h-full min-h-0 animate-pulse' aria-hidden />
    ),
  }
);

const UiwMarkdownPreview = dynamic(
  () =>
    import("@uiw/react-markdown-editor").then(
      (mod) => mod.default.Markdown as ComponentType<UiwMarkdownPreviewProps>
    ),
  {
    ssr: false,
    loading: () => (
      <div className='bg-muted/20 h-full min-h-0 animate-pulse' aria-hidden />
    ),
  }
);

interface BlogMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  viewMode: EditorViewMode;
  className?: string;
  placeholder?: string;
}

function SidePanel({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className='border-border bg-muted/30 text-muted-foreground border-b px-3 py-1.5 text-xs font-medium tracking-wide uppercase'>
        {label}
      </div>
      <div className='min-h-0 flex-1'>{children}</div>
    </div>
  );
}

function MarkdownPreviewContent({
  value,
  hasContent,
}: {
  value: string;
  hasContent: boolean;
}) {
  if (!hasContent) {
    return (
      <div className='text-muted-foreground flex h-full items-center justify-center px-4 py-4 text-center text-sm leading-relaxed'>
        Markdownを書き始めるとライブプレビューが表示されます。
      </div>
    );
  }

  return (
    <div className='h-full overflow-y-auto'>
      <UiwMarkdownPreview
        source={value}
        className='wmde-markdown-var px-4 py-4'
      />
    </div>
  );
}

function MarkdownEditorPane({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <UiwMarkdownEditor
      value={value}
      onChange={(nextValue) => onChange(nextValue)}
      enablePreview={false}
      showToolbar
      height='100%'
      placeholder={placeholder}
      className={cn("bg-background h-full min-h-0 flex-1", EDITOR_HEIGHT_CLASS)}
    />
  );
}

export function BlogMarkdownEditor({
  value,
  onChange,
  viewMode,
  className,
  placeholder = "Markdownで記事を書く…",
}: BlogMarkdownEditorProps) {
  const showEditor = viewMode === "edit" || viewMode === "split";
  const showPreview = viewMode === "preview" || viewMode === "split";
  const isSplit = viewMode === "split";
  const hasContent = value.trim().length > 0;

  if (isSplit) {
    return (
      <div
        className={cn("BlogMarkdownEditor h-full min-h-0 flex-1", className)}
      >
        <ResizablePanelGroup
          orientation='horizontal'
          className='h-full min-h-0'
        >
          <ResizablePanel defaultSize={50} minSize={30}>
            <SidePanel label='編集'>
              <MarkdownEditorPane
                value={value}
                onChange={onChange}
                placeholder={placeholder}
              />
            </SidePanel>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <SidePanel label='プレビュー'>
              <MarkdownPreviewContent value={value} hasContent={hasContent} />
            </SidePanel>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "BlogMarkdownEditor flex h-full min-h-0 flex-1 flex-col",
        className
      )}
    >
      {showEditor ? (
        <SidePanel label='編集' className='h-full flex-1'>
          <MarkdownEditorPane
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </SidePanel>
      ) : null}

      {showPreview ? (
        <SidePanel label='プレビュー' className='h-full flex-1'>
          <MarkdownPreviewContent value={value} hasContent={hasContent} />
        </SidePanel>
      ) : null}
    </div>
  );
}
