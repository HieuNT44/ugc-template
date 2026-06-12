"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/core/auth/hooks/useSession";

import { isSaveDraftSuccess } from "../lib/action-results";
import { saveDraftClient } from "../lib/content-client-api";
import { CONTENT_FIELD_OPTIONS } from "../lib/field-options";
import { useAutoSave } from "../hooks/use-auto-save";
import { useCreateContentStore } from "../hooks/use-create-content-store";
import type { BookChapter } from "../types/book-chapter";
import {
  bookEditSchema,
  type BookEditFormData,
} from "../validations/book.schema";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { CoverUploader } from "./CoverUploader";

function createChapter(): BookChapter {
  return {
    id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: "",
    content: "",
  };
}

export function BookEditor() {
  const router = useRouter();
  const store = useCreateContentStore();
  const { session } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultChapters =
    store.chapters.length >= 2
      ? store.chapters
      : [createChapter(), createChapter()];

  const form = useForm<BookEditFormData>({
    resolver: zodResolver(bookEditSchema) as Resolver<BookEditFormData>,
    mode: "onBlur",
    defaultValues: {
      title: store.title,
      description: store.description,
      field: store.field,
      coverImageUrl: store.coverImageUrl,
      chapters: defaultChapters,
      previewChapterIndex: store.previewChapterIndex,
      sellByChapter: store.sellByChapter,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chapters",
  });

  const buildPayload = useCallback(() => {
    const values = form.getValues();
    return {
      draftId: store.draftId,
      type: "book" as const,
      title: values.title,
      description: values.description,
      field: values.field,
      coverImageUrl: store.coverPreviewUrl ?? values.coverImageUrl,
      coverUploadFileId: store.coverUploadFileId,
      chapters: values.chapters,
      previewChapterIndex: values.previewChapterIndex,
      sellByChapter: values.sellByChapter,
    };
  }, [form, store.coverPreviewUrl, store.coverUploadFileId, store.draftId]);

  const { status, lastSavedAt } = useAutoSave(buildPayload, true);

  async function onContinue(values: BookEditFormData) {
    setServerError(null);
    store.patch({
      title: values.title,
      description: values.description,
      field: values.field,
      coverUploadFileId: store.coverUploadFileId,
      chapters: values.chapters,
      previewChapterIndex: values.previewChapterIndex,
      sellByChapter: values.sellByChapter,
    });

    const result = await saveDraftClient(buildPayload(), session?.accessToken);
    if (!isSaveDraftSuccess(result)) {
      setServerError("error" in result ? result.error : "Failed to save");
      return;
    }

    store.setDraftId(result.draft.id);
    router.push("/studio/create/book/publish");
  }

  return (
    <div className='BookEditor'>
      <AutoSaveIndicator
        status={status}
        lastSavedAt={lastSavedAt}
        className='mb-4'
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onContinue)}
          className='flex flex-col gap-5'
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Book title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Book description'
                    rows={4}
                    {...field}
                  />
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
                <FormLabel>Field</FormLabel>
                <FormControl>
                  <select
                    className='border-input bg-background h-9 w-full rounded-lg border px-3 text-sm'
                    value={field.value}
                    onChange={field.onChange}
                    aria-label='Select field'
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

          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <FormLabel>Chapters (min. 2)</FormLabel>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='rounded-full'
                onClick={() => append(createChapter())}
              >
                <Plus className='size-4' />
                Add chapter
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className='ring-foreground/10 rounded-lg p-4 ring-1'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Chapter {index + 1}
                  </span>
                  {fields.length > 2 ? (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => remove(index)}
                      aria-label={`Remove chapter ${index + 1}`}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  ) : null}
                </div>

                <FormField
                  control={form.control}
                  name={`chapters.${index}.title`}
                  render={({ field: chapterField }) => (
                    <FormItem className='mb-3'>
                      <FormLabel>Chapter title</FormLabel>
                      <FormControl>
                        <Input placeholder='Chapter title' {...chapterField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`chapters.${index}.content`}
                  render={({ field: chapterField }) => (
                    <FormItem>
                      <FormLabel>Chapter content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write chapter content'
                          rows={6}
                          {...chapterField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <FormField
            control={form.control}
            name='previewChapterIndex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preview chapter (optional)</FormLabel>
                <FormControl>
                  <select
                    className='border-input bg-background h-9 w-full rounded-lg border px-3 text-sm'
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : Number(val));
                    }}
                    aria-label='Select preview chapter'
                  >
                    <option value=''>None</option>
                    {fields.map((_, index) => (
                      <option key={index} value={index}>
                        Chapter {index + 1}
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
            name='sellByChapter'
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormControl>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    id='sell-by-chapter'
                  />
                </FormControl>
                <FormLabel htmlFor='sell-by-chapter' className='mt-0'>
                  Sell by chapter (optional)
                </FormLabel>
              </FormItem>
            )}
          />

          <div>
            <FormLabel className='mb-2 block'>Cover image (optional)</FormLabel>
            <CoverUploader
              previewUrl={store.coverPreviewUrl}
              onChange={(url, uploadFileId) =>
                store.patch({
                  coverPreviewUrl: url,
                  coverImageUrl: url,
                  coverUploadFileId: uploadFileId ?? null,
                })
              }
            />
          </div>

          <Button type='submit' className='rounded-full'>
            Continue to publish
          </Button>
        </form>
      </Form>
    </div>
  );
}
