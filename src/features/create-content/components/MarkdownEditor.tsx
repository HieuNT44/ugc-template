"use client";

import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  className?: string;
  placeholder?: string;
  /** Fills parent height for split-pane layouts. */
  fillHeight?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  className,
  placeholder = "Write in Markdown…",
  fillHeight = false,
}: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || viewRef.current) {
      return;
    }

    const state = EditorState.create({
      doc: value,
      extensions: [
        markdown(),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            minHeight: fillHeight ? "100%" : "320px",
            height: fillHeight ? "100%" : "auto",
            fontSize: "14px",
          },
          ".cm-content": {
            padding: fillHeight ? "16px 0" : "16px 20px",
            fontFamily: "ui-monospace, monospace",
            lineHeight: "1.6",
          },
          ".cm-scroller": {
            overflow: "auto",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [fillHeight]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      className={cn(
        "MarkdownEditor",
        fillHeight && "h-full min-h-0",
        className
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "h-full min-h-0",
          fillHeight ? "ring-0" : "ring-foreground/10 rounded-lg ring-1"
        )}
        aria-label={placeholder}
        role='textbox'
      />
    </div>
  );
}
