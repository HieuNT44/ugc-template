"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface WYSIWYGEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
  fillHeight?: boolean;
}

export function WYSIWYGEditor({
  value,
  onChange,
  className,
  placeholder = "本文を書く…",
  fillHeight = false,
}: WYSIWYGEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none px-4 py-3 focus:outline-none",
          fillHeight ? "min-h-full" : "min-h-[320px]"
        ),
        "aria-label": "リッチテキストエディター",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        "WYSIWYGEditor relative",
        fillHeight
          ? "flex h-full min-h-0 flex-1 flex-col [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-0"
          : "ring-foreground/10 rounded-lg ring-1",
        className
      )}
    >
      {!editor?.getText().trim() ? (
        <p className='text-muted-foreground pointer-events-none absolute top-3 left-4 z-10 text-sm'>
          {placeholder}
        </p>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  );
}
