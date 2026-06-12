"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/core/auth/hooks/useSession";

import { isSaveDraftSuccess } from "../lib/action-results";
import { saveDraftClient } from "../lib/content-client-api";
import { CONTENT_FIELD_OPTIONS } from "../lib/field-options";
import { useAutoSave } from "../hooks/use-auto-save";
import { useCreateContentStore } from "../hooks/use-create-content-store";
import {
  reportEditSchema,
  type ReportEditFormData,
} from "../validations/report.schema";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { CoverUploader } from "./CoverUploader";

export function ReportEditor() {
  const router = useRouter();
  const store = useCreateContentStore();
  const { session } = useSession();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ReportEditFormData>({
    resolver: zodResolver(reportEditSchema) as Resolver<ReportEditFormData>,
    mode: "onBlur",
    defaultValues: {
      title: store.title,
      description: store.description,
      field: store.field,
      coverImageUrl: store.coverImageUrl,
      pdfUrl: store.pdfUrl ?? "",
      pdfFileName: store.pdfFileName ?? undefined,
      previewPages: store.previewPages || 5,
    },
  });

  const buildPayload = useCallback(() => {
    const values = form.getValues();
    return {
      draftId: store.draftId,
      type: "report" as const,
      title: values.title,
      description: values.description,
      field: values.field,
      coverImageUrl: store.coverPreviewUrl ?? values.coverImageUrl,
      coverUploadFileId: store.coverUploadFileId,
      pdfUrl: values.pdfUrl,
      pdfFileName: values.pdfFileName,
      previewPages: values.previewPages,
    };
  }, [form, store.coverPreviewUrl, store.coverUploadFileId, store.draftId]);

  const { status, lastSavedAt } = useAutoSave(buildPayload, true);

  function onPdfSelect(file: File | undefined) {
    if (!file || file.type !== "application/pdf") {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      form.setValue("pdfUrl", dataUrl, { shouldValidate: true });
      form.setValue("pdfFileName", file.name);
      store.patch({ pdfUrl: dataUrl, pdfFileName: file.name });
    };
    reader.readAsDataURL(file);
  }

  async function onContinue(values: ReportEditFormData) {
    setServerError(null);
    store.patch({
      title: values.title,
      description: values.description,
      field: values.field,
      coverUploadFileId: store.coverUploadFileId,
      previewPages: values.previewPages,
    });

    const result = await saveDraftClient(buildPayload(), session?.accessToken);
    if (!isSaveDraftSuccess(result)) {
      setServerError("error" in result ? result.error : "保存に失敗しました");
      return;
    }

    store.setDraftId(result.draft.id);
    router.push("/studio/create/report/publish");
  }

  const pdfFileName = useWatch({ control: form.control, name: "pdfFileName" });

  return (
    <div className='ReportEditor'>
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
                <FormLabel>タイトル</FormLabel>
                <FormControl>
                  <Input placeholder='レポートタイトル' {...field} />
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
                <FormLabel>説明</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='このレポートで読者が学べることを説明してください'
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
            name='pdfUrl'
            render={() => (
              <FormItem>
                <FormLabel>PDFファイル</FormLabel>
                <FormControl>
                  <div className='flex flex-col gap-2'>
                    {pdfFileName ? (
                      <div className='bg-muted flex items-center justify-between rounded-lg px-3 py-2 text-sm'>
                        <span className='truncate'>{pdfFileName}</span>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            form.setValue("pdfUrl", "");
                            form.setValue("pdfFileName", undefined);
                            store.patch({ pdfUrl: null, pdfFileName: null });
                          }}
                          aria-label='PDFを削除'
                        >
                          <Trash2 className='size-4' />
                        </Button>
                      </div>
                    ) : (
                      <button
                        type='button'
                        className='hover:bg-muted/50 text-muted-foreground flex items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-sm'
                        onClick={() => pdfInputRef.current?.click()}
                      >
                        <FileUp className='size-5' />
                        Upload PDF
                      </button>
                    )}
                    <input
                      ref={pdfInputRef}
                      type='file'
                      accept='application/pdf'
                      className='sr-only'
                      onChange={(e) => onPdfSelect(e.target.files?.[0])}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='previewPages'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preview pages (5–10)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={5}
                    max={10}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
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
