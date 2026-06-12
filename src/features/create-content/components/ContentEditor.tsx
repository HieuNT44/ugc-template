"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/core/auth/hooks/useSession";

import { useAutoSave } from "../hooks/use-auto-save";
import { useCreateContentStore } from "../hooks/use-create-content-store";
import { isSaveDraftSuccess } from "../lib/action-results";
import { saveDraftClient } from "../lib/content-client-api";
import { CONTENT_FIELD_OPTIONS } from "../lib/field-options";
import { countWords } from "../lib/word-count";
import {
  blogEditSchema,
  type BlogEditFormData,
} from "../validations/blog.schema";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { CoverUploader } from "./CoverUploader";
import { EditorModeTabs } from "./EditorModeTabs";
import { MarkdownEditor } from "./MarkdownEditor";
import { PreviewModal } from "./PreviewModal";
import { TagInput } from "./TagInput";
import { WYSIWYGEditor } from "./WYSIWYGEditor";

export function ContentEditor() {
  const router = useRouter();
  const store = useCreateContentStore();
  const { session } = useSession();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<BlogEditFormData>({
    resolver: zodResolver(blogEditSchema) as Resolver<BlogEditFormData>,
    mode: "onBlur",
    defaultValues: {
      title: store.title,
      field: store.field,
      tags: store.tags,
      coverImageUrl: store.coverImageUrl,
      editorMode: store.editorMode,
      content: store.content,
      templateId: store.templateId,
    },
  });

  const editorMode = useWatch({
    control: form.control,
    name: "editorMode",
  });
  const content = useWatch({
    control: form.control,
    name: "content",
  });
  const previewTitle = useWatch({
    control: form.control,
    name: "title",
  });
  const previewField = useWatch({
    control: form.control,
    name: "field",
  });
  const previewTags = useWatch({
    control: form.control,
    name: "tags",
  });
  const wordCount = countWords(content);

  const buildPayload = useCallback(() => {
    const values = form.getValues();
    return {
      draftId: store.draftId,
      type: "blog" as const,
      title: values.title,
      field: values.field,
      tags: values.tags,
      coverImageUrl: store.coverPreviewUrl ?? values.coverImageUrl,
      templateId: store.templateId,
      editorMode: values.editorMode,
      content: values.content,
    };
  }, [form, store.coverPreviewUrl, store.draftId, store.templateId]);

  const { status, lastSavedAt, save } = useAutoSave(buildPayload, true);

  async function persistToStore(values: BlogEditFormData) {
    store.patch({
      title: values.title,
      field: values.field,
      tags: values.tags,
      coverImageUrl: store.coverPreviewUrl,
      editorMode: values.editorMode,
      content: values.content,
    });
  }

  async function onContinue(values: BlogEditFormData) {
    setServerError(null);
    await persistToStore(values);

    const result = await saveDraftClient(buildPayload(), session?.accessToken);
    if (!isSaveDraftSuccess(result)) {
      if ("error" in result) {
        setServerError(result.error);
      }
      return;
    }

    store.setDraftId(result.draft.id);
    router.push("/studio/create/blog/publish");
  }

  return (
    <div className='ContentEditor'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <AutoSaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <span className='text-muted-foreground text-xs'>{wordCount} words</span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onContinue)}
          className='flex flex-col gap-5 px-6'
        >
          {serverError ? (
            <Alert variant='destructive'>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}

          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>タイトル</FormLabel>
                <FormControl>
                  <Input placeholder='魅力的なタイトルを入力' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='field'
            render={({ field }) => (
              <FormItem>
                <FormLabel>分野</FormLabel>
                <FormControl>
                  <select
                    className='border-input bg-background h-9 w-full rounded-lg border px-3 text-sm'
                    value={field.value}
                    onChange={field.onChange}
                    aria-label='分野を選択'
                  >
                    <option value=''>Select a field</option>
                    {CONTENT_FIELD_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (optional)</FormLabel>
                <FormControl>
                  <TagInput tags={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className='mb-2 block'>Cover image (optional)</FormLabel>
            <CoverUploader
              previewUrl={store.coverPreviewUrl}
              onChange={(url) => {
                store.patch({ coverPreviewUrl: url, coverImageUrl: url });
              }}
            />
          </div>

          <FormField
            control={form.control}
            name='editorMode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Editor mode</FormLabel>
                <FormControl>
                  <EditorModeTabs
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>本文</FormLabel>
                <FormControl>
                  {editorMode === "wysiwyg" ? (
                    <WYSIWYGEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  ) : (
                    <MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-wrap gap-3'>
            <Button
              type='button'
              variant='outline'
              className='rounded-full'
              onClick={() => void save({ showToast: true })}
            >
              Save now
            </Button>
            <Button
              type='button'
              variant='secondary'
              className='rounded-full'
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className='size-4' />
              プレビュー
            </Button>
            <Button type='submit' className='rounded-full'>
              公開へ進む
            </Button>
          </div>
        </form>
      </Form>

      <PreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={previewTitle}
        field={previewField}
        tags={previewTags}
        content={content}
        editorMode={editorMode}
        coverPreviewUrl={store.coverPreviewUrl}
      />
    </div>
  );
}
