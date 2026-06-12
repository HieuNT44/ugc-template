"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useMemo } from "react";
import { RichTextProvider } from "reactjs-tiptap-editor";
import {
  RichTextBubbleCodeBlock,
  RichTextBubbleImage,
  RichTextBubbleLink,
  RichTextBubbleMenuDragHandle,
  RichTextBubbleTable,
  RichTextBubbleText,
} from "reactjs-tiptap-editor/bubble";
import { RichTextAttachment } from "reactjs-tiptap-editor/attachment";
import { RichTextBlockquote } from "reactjs-tiptap-editor/blockquote";
import { RichTextBold } from "reactjs-tiptap-editor/bold";
import { RichTextBulletList } from "reactjs-tiptap-editor/bulletlist";
import { RichTextClear } from "reactjs-tiptap-editor/clear";
import { RichTextCode } from "reactjs-tiptap-editor/code";
import { RichTextCodeBlock } from "reactjs-tiptap-editor/codeblock";
import { RichTextColor } from "reactjs-tiptap-editor/color";
import { RichTextEmoji } from "reactjs-tiptap-editor/emoji";
import { RichTextFontFamily } from "reactjs-tiptap-editor/fontfamily";
import { RichTextFontSize } from "reactjs-tiptap-editor/fontsize";
import { RichTextHeading } from "reactjs-tiptap-editor/heading";
import { RichTextHighlight } from "reactjs-tiptap-editor/highlight";
import { RichTextRedo, RichTextUndo } from "reactjs-tiptap-editor/history";
import { RichTextHorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { RichTextImage } from "reactjs-tiptap-editor/image";
import { RichTextIndent } from "reactjs-tiptap-editor/indent";
import { RichTextItalic } from "reactjs-tiptap-editor/italic";
import { RichTextLineHeight } from "reactjs-tiptap-editor/lineheight";
import { RichTextLink } from "reactjs-tiptap-editor/link";
import { RichTextMoreMark } from "reactjs-tiptap-editor/moremark";
import { RichTextOrderedList } from "reactjs-tiptap-editor/orderedlist";
import { RichTextSearchAndReplace } from "reactjs-tiptap-editor/searchandreplace";
import {
  renderCommandListDefault,
  SlashCommandList,
} from "reactjs-tiptap-editor/slashcommand";
import { RichTextStrike } from "reactjs-tiptap-editor/strike";
import { RichTextTable } from "reactjs-tiptap-editor/table";
import { RichTextTaskList } from "reactjs-tiptap-editor/tasklist";
import { RichTextAlign } from "reactjs-tiptap-editor/textalign";
import { RichTextUnderline } from "reactjs-tiptap-editor/textunderline";
import { useLocale } from "reactjs-tiptap-editor/locale-bundle";

import "reactjs-tiptap-editor/style.css";
import "./blog-rich-text-editor.css";

import { useUploadImage } from "@/core/api/hooks/useUploadImage";
import { cn } from "@/lib/utils";

import { createBlogRichTextExtensions } from "../lib/blog-rich-text-extensions";

interface BlogRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

function BlogRichTextToolbar() {
  return (
    <div className='border-border flex flex-wrap items-center gap-1 border-b px-2 py-1.5'>
      <RichTextUndo />
      <RichTextRedo />
      <RichTextSearchAndReplace />
      <RichTextClear />
      <RichTextFontFamily />
      <RichTextHeading />
      <RichTextFontSize />
      <RichTextBold />
      <RichTextItalic />
      <RichTextUnderline />
      <RichTextStrike />
      <RichTextMoreMark />
      <RichTextEmoji />
      <RichTextColor />
      <RichTextHighlight />
      <RichTextBulletList />
      <RichTextOrderedList />
      <RichTextAlign />
      <RichTextIndent />
      <RichTextLineHeight />
      <RichTextTaskList />
      <RichTextLink />
      <RichTextImage />
      <RichTextBlockquote />
      <RichTextHorizontalRule />
      <RichTextCode />
      <RichTextCodeBlock />
      <RichTextTable />
      <RichTextAttachment />
    </div>
  );
}

function BlogRichTextSlashCommandList() {
  const { t } = useLocale();

  const commandList = useMemo(
    () =>
      renderCommandListDefault({ t })
        .map((group) => ({
          ...group,
          commands: group.commands.filter(
            (command) => command.name !== "video"
          ),
        }))
        .filter((group) => group.commands.length > 0),
    [t]
  );

  return <SlashCommandList commandList={commandList} />;
}

export function BlogRichTextEditor({
  value,
  onChange,
  className,
  placeholder = "Write your article…",
}: BlogRichTextEditorProps) {
  const { upload } = useUploadImage("general");
  const uploadInlineImage = useCallback(
    async (file: File) => {
      const completed = await upload(file);

      if (!completed.url) {
        throw new Error("Uploaded image URL is missing");
      }

      return completed.url;
    },
    [upload]
  );

  const extensions = useMemo(
    () => createBlogRichTextExtensions(placeholder, uploadInlineImage),
    [placeholder, uploadInlineImage]
  );

  const editor = useEditor({
    extensions,
    content: value,
    textDirection: "auto",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[560px] px-4 py-3 focus:outline-none",
        "aria-label": placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    if (currentHtml !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className={cn("bg-muted/30 min-h-[560px] animate-pulse", className)}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("BlogRichTextEditor", className)}>
      <RichTextProvider editor={editor}>
        <BlogRichTextToolbar />

        <div>
          <EditorContent editor={editor} className='min-h-[560px]' />
        </div>

        <RichTextBubbleText />
        <RichTextBubbleLink />
        <RichTextBubbleImage />
        <RichTextBubbleTable />
        <RichTextBubbleCodeBlock />
        <RichTextBubbleMenuDragHandle />

        <BlogRichTextSlashCommandList />
      </RichTextProvider>
    </div>
  );
}
