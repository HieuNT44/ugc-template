"use client";

import type { UseFormReturn } from "react-hook-form";

import { getBlogStarterContent } from "../lib/blog-editor-starters";
import type { EditorMode } from "../types/content-type";
import type { BlogEditFormData } from "../validations/blog.schema";
import { useCreateContentStore } from "./use-create-content-store";

export function useBlogEditorContent(form: UseFormReturn<BlogEditFormData>) {
  const patch = useCreateContentStore((state) => state.patch);

  function onEditorModeChange(nextMode: EditorMode) {
    const currentMode = form.getValues("editorMode");

    if (currentMode === nextMode) {
      return;
    }

    const starter = getBlogStarterContent(nextMode);
    form.setValue("content", starter, { shouldDirty: true });
    form.setValue("editorMode", nextMode, { shouldDirty: true });
    patch({ content: starter, editorMode: nextMode });
  }

  return { onEditorModeChange };
}
