"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/core/auth/hooks/useSession";
import { useBlogEditorContent } from "../hooks/use-blog-editor-content";
import { useCreateContentStore } from "../hooks/use-create-content-store";
import { useUnsavedChangesWarning } from "../hooks/use-unsaved-changes-warning";
import { isSaveDraftSuccess } from "../lib/action-results";
import { resolveBlogEditorContent } from "../lib/blog-editor-starters";
import { saveDraftClient } from "../lib/content-client-api";
import {
  getContentMessage,
  getSaveDraftErrorMessage,
} from "../lib/content-messages";
import type { ContentDocument } from "../types/content-document";
import {
  blogEditSchema,
  type BlogEditFormData,
} from "../validations/blog.schema";
import { BlogPublishSettings } from "./BlogPublishSettings";
import { BlogContentToolbar } from "./BlogContentToolbar";
import { BlogEditorHeader } from "./BlogEditorHeader";
import { BlogMarkdownEditor } from "./BlogMarkdownEditor";
import { CoverUploader } from "./CoverUploader";
import { EditorModeTabs } from "./EditorModeTabs";
import { PreviewModal } from "./PreviewModal";
import { TagInput } from "./TagInput";
type EditorViewMode = "edit" | "split" | "preview";

const BlogRichTextEditor = dynamic(
  () => import("./BlogRichTextEditor").then((mod) => mod.BlogRichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div
        className='bg-muted/30 h-full min-h-0 flex-1 animate-pulse'
        aria-hidden
      />
    ),
  }
);

type BlogEditorProps = {
  initialDocument?: ContentDocument;
};

function buildFormValuesFromDocument(
  document: ContentDocument
): BlogEditFormData {
  const editorMode = document.editorMode ?? "wysiwyg";

  return {
    title: document.title,
    shortDescription: document.shortDescription ?? "",
    field: document.field,
    tags: document.tags,
    coverImageUrl: document.coverImageUrl ?? "",
    editorMode,
    content: resolveBlogEditorContent(document.content ?? "", editorMode),
    templateId: document.templateId,
  };
}

function hydrateStoreFromDocument(
  document: ContentDocument,
  patch: ReturnType<typeof useCreateContentStore.getState>["patch"]
) {
  patch({
    contentType: document.type,
    draftId: document.id,
    title: document.title,
    shortDescription: document.shortDescription ?? "",
    description: document.description ?? "",
    field: document.field,
    tags: document.tags,
    coverImageUrl: document.coverImageUrl,
    coverUploadFileId: document.coverUploadFileId,
    coverPreviewUrl: document.coverImageUrl,
    templateId: document.templateId,
    editorMode: document.editorMode ?? "wysiwyg",
    content: document.content ?? "",
    pricingType: document.pricingType,
    priceYen: document.priceYen,
  });
}

export function BlogEditor({ initialDocument }: BlogEditorProps = {}) {
  const store = useCreateContentStore();
  const { session } = useSession();
  const isEditingPublished = initialDocument?.status === "published";
  const [viewMode, setViewMode] = useState<EditorViewMode>("split");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPublishSettingsOpen, setIsPublishSettingsOpen] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [markdownUnavailableOpen, setMarkdownUnavailableOpen] = useState(false);
  const form = useForm<BlogEditFormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: initialDocument
      ? buildFormValuesFromDocument(initialDocument)
      : {
          title: store.title,
          shortDescription: store.shortDescription,
          field: store.field,
          tags: store.tags,
          coverImageUrl: store.coverImageUrl,
          editorMode: store.editorMode,
          content: resolveBlogEditorContent(store.content, store.editorMode),
          templateId: store.templateId,
        },
  });

  useEffect(() => {
    if (!initialDocument) {
      return;
    }

    hydrateStoreFromDocument(initialDocument, store.patch);
    form.reset(buildFormValuesFromDocument(initialDocument));
  }, [form, initialDocument, store.patch]);

  const { onEditorModeChange } = useBlogEditorContent(form);
  const { isDirty } = useFormState({ control: form.control });
  const editorMode = useWatch({ control: form.control, name: "editorMode" });

  function onEditorModeTabChange(nextMode: BlogEditFormData["editorMode"]) {
    if (nextMode === "markdown") {
      setMarkdownUnavailableOpen(true);
      return;
    }

    onEditorModeChange(nextMode);
  }

  const buildPayload = useCallback(() => {
    const values = form.getValues();
    return {
      draftId: store.draftId,
      type: "blog" as const,
      title: values.title,
      shortDescription: values.shortDescription,
      field: values.field,
      tags: values.tags,
      coverImageUrl: store.coverPreviewUrl ?? values.coverImageUrl,
      coverUploadFileId: store.coverUploadFileId,
      templateId: store.templateId,
      editorMode: values.editorMode,
      content: values.content,
    };
  }, [
    form,
    store.coverPreviewUrl,
    store.coverUploadFileId,
    store.draftId,
    store.templateId,
  ]);

  const title = useWatch({ control: form.control, name: "title" });
  const shortDescription = useWatch({
    control: form.control,
    name: "shortDescription",
  });
  const field = useWatch({ control: form.control, name: "field" });
  const tags = useWatch({ control: form.control, name: "tags" });
  const content = useWatch({ control: form.control, name: "content" });
  const hasUnsavedChanges =
    isDirty ||
    Boolean(store.coverUploadFileId) ||
    Boolean(store.draftId === null && content.trim().length > 0);

  useUnsavedChangesWarning(hasUnsavedChanges && !isPublishSettingsOpen);

  async function persistToStore(values: BlogEditFormData) {
    store.patch({
      title: values.title,
      shortDescription: values.shortDescription ?? "",
      field: values.field,
      tags: values.tags,
      coverImageUrl: store.coverPreviewUrl,
      coverUploadFileId: store.coverUploadFileId,
      editorMode: values.editorMode,
      content: values.content,
    });
  }

  async function saveDraft(
    values: BlogEditFormData,
    options: { showToast?: boolean } = {}
  ) {
    setIsSavingDraft(true);
    setServerError(null);

    const result = await saveDraftClient(buildPayload(), session?.accessToken);

    setIsSavingDraft(false);

    if (!isSaveDraftSuccess(result)) {
      const message = getSaveDraftErrorMessage(result);

      if ("error" in result) {
        setServerError(result.error);
      } else if ("errors" in result) {
        setServerError(message);
      }

      if (options.showToast) {
        toast.error(message);
      }

      return null;
    }

    store.patch({
      draftId: result.draft.id,
      title: result.draft.title,
      shortDescription: result.draft.shortDescription ?? "",
      field: values.field,
      tags: result.draft.tags,
      coverImageUrl: result.draft.coverImageUrl,
      coverUploadFileId: result.draft.coverUploadFileId,
      coverPreviewUrl: result.draft.coverImageUrl,
      editorMode: result.draft.editorMode ?? values.editorMode,
      content: result.draft.content ?? values.content,
    });
    form.reset(values);

    if (options.showToast) {
      toast.success(getContentMessage("draft_saved"));
    }

    return result.draft;
  }

  async function onSaveDraft() {
    const values = form.getValues();
    await persistToStore(values);
    await saveDraft(values, { showToast: true });
  }

  async function goToPublish() {
    setServerError(null);
    form.clearErrors();

    const values = form.getValues();
    const parsed = blogEditSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        const message = messages?.[0];
        if (message) {
          form.setError(field as keyof BlogEditFormData, { message });
        }
      });
      return;
    }

    await persistToStore(parsed.data);
    setIsPublishSettingsOpen(true);
  }

  if (isPublishSettingsOpen) {
    return (
      <div className='BlogEditor flex min-h-[calc(100svh-3.5rem)] w-full flex-col'>
        <div className='mx-auto w-full max-w-7xl px-4 py-8'>
          <BlogPublishSettings
            mode={isEditingPublished ? "update" : "publish"}
            onBack={() => setIsPublishSettingsOpen(false)}
            buildDraftPayload={buildPayload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='BlogEditor flex min-h-[calc(100svh-3.5rem)] w-full flex-col'>
      <BlogEditorHeader
        onPreview={() => setPreviewOpen(true)}
        onSaveDraft={() => void onSaveDraft()}
        onPublishSettings={() => void goToPublish()}
        isSavingDraft={isSavingDraft}
        showSaveDraft={!isEditingPublished}
        publishSettingsLabel={isEditingPublished ? "設定を更新" : "公開設定"}
      />

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='bg-card flex flex-col px-6 py-4'
        >
          {serverError ? (
            <div className='mb-4'>
              <Alert variant='destructive'>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            </div>
          ) : null}

          <div className='border-border bg-card border-b py-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...field}
                      placeholder='タイトルを入力'
                      className='placeholder:text-muted-foreground/70 w-full border-0 bg-transparent font-serif text-2xl font-bold outline-none lg:text-3xl'
                      aria-label='タイトル'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='shortDescription'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder='短い説明を書く（任意）'
                      className='min-h-20 resize-none text-sm'
                      aria-label='短い説明'
                      maxLength={500}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tags'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormControl>
                    <TagInput tags={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-4'>
              <CoverUploader
                compact
                previewUrl={store.coverPreviewUrl}
                onChange={(url, uploadFileId) => {
                  store.patch({
                    coverPreviewUrl: url,
                    coverImageUrl: url,
                    coverUploadFileId: uploadFileId ?? null,
                  });
                }}
              />
            </div>
          </div>

          <div className='border-border bg-card shrink-0 border px-3 py-2'>
            <FormField
              control={form.control}
              name='editorMode'
              render={({ field }) => (
                <FormItem className='gap-0'>
                  <FormControl>
                    <EditorModeTabs
                      value={field.value}
                      onChange={onEditorModeTabChange}
                      className='w-fit'
                      listClassName='h-9'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className='border-border bg-card flex flex-col border border-t-0'>
            {editorMode === "markdown" ? (
              <BlogContentToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            ) : null}

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-0'>
                  <FormControl className='flex flex-col'>
                    {editorMode === "markdown" ? (
                      <BlogMarkdownEditor
                        value={field.value}
                        onChange={field.onChange}
                        viewMode={viewMode}
                        placeholder='Markdownで記事を書く…'
                        className='min-h-[560px]'
                      />
                    ) : (
                      <BlogRichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='記事を書く…'
                        className='min-h-[560px]'
                      />
                    )}
                  </FormControl>
                  <FormMessage className='px-3 pb-3' />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      <PreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={title}
        shortDescription={shortDescription}
        field={field}
        tags={tags}
        content={content}
        editorMode={editorMode}
        coverPreviewUrl={
          store.coverPreviewUrl ?? form.getValues("coverImageUrl")
        }
      />

      <Dialog
        open={markdownUnavailableOpen}
        onOpenChange={setMarkdownUnavailableOpen}
      >
        <DialogContent className='BlogEditorMarkdownUnavailableDialog sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Markdown is temporarily unavailable</DialogTitle>
            <DialogDescription>
              This feature will be implemented later. Please use the Text Editor
              for now.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              onClick={() => setMarkdownUnavailableOpen(false)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
