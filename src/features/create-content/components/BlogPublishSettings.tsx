"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  FormLabel,
} from "@/components/ui/form";
import { PostLabelBadge } from "@/core/components/post";
import { TypingEffect } from "@/core/components/text";
import { cn } from "@/lib/utils";

import { publishContentAction } from "../actions/publish-content";
import { updatePublishedContentAction } from "../actions/update-published-content";
import type { SaveDraftInput } from "../lib/content-api";
import { useCreateContentStore } from "../hooks/use-create-content-store";
import {
  isPublishSuccess,
  isUpdatePublishedSuccess,
} from "../lib/action-results";
import { getContentMessage } from "../lib/content-messages";
import {
  blogPublishSchema,
  type BlogPublishFormData,
} from "../validations/blog.schema";
import { BlogArticlePreview } from "./BlogArticlePreview";
import { FormErrorSummary } from "./FormErrorSummary";
import { PriceDropdown } from "./PriceDropdown";

type BlogPublishSettingsProps = {
  mode?: "publish" | "update";
  onBack: () => void;
  buildDraftPayload: () => SaveDraftInput;
};

function PublishSavingOverlay({ message }: { message: string }) {
  return (
    <div
      className='PublishSavingOverlay bg-background/80 fixed inset-0 z-[120] flex flex-col items-center justify-center backdrop-blur-md'
      aria-busy='true'
      aria-live='polite'
      role='status'
    >
      <TypingEffect
        text='RealRead'
        immediate
        className='font-logo text-foreground text-4xl font-normal tracking-tight md:text-5xl'
      />
      <p className='text-muted-foreground mt-4 text-sm'>{message}</p>
    </div>
  );
}

export function BlogPublishSettings({
  mode = "publish",
  onBack,
  buildDraftPayload,
}: BlogPublishSettingsProps) {
  const router = useRouter();
  const store = useCreateContentStore();
  const isUpdateMode = mode === "update";
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [requestHumanWrittenBadge, setRequestHumanWrittenBadge] =
    useState(false);
  const [backWarningOpen, setBackWarningOpen] = useState(false);

  const form = useForm<BlogPublishFormData>({
    defaultValues: {
      pricingType: store.pricingType ?? "free",
      priceYen: store.priceYen,
    },
  });

  const pricingType = useWatch({ control: form.control, name: "pricingType" });
  const priceYen = useWatch({ control: form.control, name: "priceYen" });
  const isBusy = form.formState.isSubmitting || isPublishing;

  function onHumanWrittenToggle() {
    if (requestHumanWrittenBadge) {
      return;
    }

    setRequestHumanWrittenBadge(true);
  }

  function onBackClick() {
    if (requestHumanWrittenBadge) {
      setBackWarningOpen(true);
      return;
    }

    onBack();
  }

  function onConfirmBack() {
    setRequestHumanWrittenBadge(false);
    setBackWarningOpen(false);
    onBack();
  }

  async function onPublish(data: BlogPublishFormData) {
    setServerError(null);

    const validated = blogPublishSchema.safeParse(data);
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        const message = (messages ?? []).join(" ");
        if (message) {
          form.setError(field as keyof BlogPublishFormData, { message });
        }
      });
      return;
    }

    setIsPublishing(true);

    store.patch({
      pricingType: validated.data.pricingType,
      priceYen: validated.data.priceYen ?? null,
    });

    const payload = {
      ...buildDraftPayload(),
      pricingType: validated.data.pricingType,
      priceYen: validated.data.priceYen ?? null,
    };

    if (isUpdateMode) {
      const updateResult = await updatePublishedContentAction({
        ...payload,
        draftId: payload.draftId ?? "",
      });

      if (!isUpdatePublishedSuccess(updateResult)) {
        setIsPublishing(false);
        if ("error" in updateResult) {
          setServerError(updateResult.error);
        } else if ("errors" in updateResult) {
          const first = Object.values(updateResult.errors)[0]?.[0];
          setServerError(first ?? "入力内容を確認してください");
        }
        return;
      }

      toast.success(getContentMessage("updated_success"));
      router.push("/studio");
      return;
    }

    const publishResult = await publishContentAction(payload);

    if (!isPublishSuccess(publishResult)) {
      setIsPublishing(false);
      if ("error" in publishResult) {
        setServerError(publishResult.error);
      } else if ("errors" in publishResult) {
        const first = Object.values(publishResult.errors)[0]?.[0];
        setServerError(first ?? "入力内容を確認してください");
      }
      return;
    }

    toast.success(getContentMessage("published_success"));
    router.push("/studio");
  }

  return (
    <div className='BlogPublishSettings flex flex-col gap-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='font-serif text-2xl font-bold'>
            {isUpdateMode ? "設定を更新" : "公開設定"}
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            {isUpdateMode
              ? "保存前に変更内容と価格設定を確認してください。"
              : "公開前に価格を設定し、投稿内容を確認してください。"}
          </p>
        </div>

        <div className='flex shrink-0 gap-3'>
          <Button
            type='button'
            variant='outline'
            size='lg'
            className='h-11 min-w-28 px-6 text-base'
            disabled={isBusy}
            onClick={onBackClick}
          >
            戻る
          </Button>
          <Button
            type='submit'
            form='blog-publish-form'
            size='lg'
            className='h-11 min-w-28 bg-emerald-600 px-6 text-base text-white hover:bg-emerald-700 focus-visible:ring-emerald-500'
            disabled={isBusy}
          >
            {isUpdateMode ? "更新" : "公開"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id='blog-publish-form'
          onSubmit={form.handleSubmit(onPublish)}
          className='grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] md:items-start'
        >
          <div className='BlogPublishSettingsPreview order-2 min-w-0 md:order-1'>
            <BlogArticlePreview
              pricingType={pricingType}
              priceYen={priceYen}
              showHumanWrittenBadge={requestHumanWrittenBadge}
            />
          </div>

          <div className='BlogPublishSettingsForm order-1 flex min-w-0 flex-col gap-5 md:order-2'>
            <div className='border-border border-b pb-4'>
              <h2 className='text-lg font-semibold'>設定</h2>
              <p className='text-muted-foreground mt-1 text-sm'>
                Configure pricing and labels before publishing.
              </p>
            </div>

            <div className='space-y-3'>
              {serverError ? (
                <Alert variant='destructive'>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              ) : null}
              <FormErrorSummary />
            </div>

            <section className='space-y-4'>
              <h2 className='text-base font-semibold'>価格設定</h2>

              <FormField
                control={form.control}
                name='pricingType'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex gap-4'>
                        <label className='flex items-center gap-2 text-sm'>
                          <input
                            type='radio'
                            checked={field.value === "free"}
                            onChange={() => field.onChange("free")}
                          />
                          無料
                        </label>
                        <label className='flex items-center gap-2 text-sm'>
                          <input
                            type='radio'
                            checked={field.value === "paid"}
                            onChange={() => field.onChange("paid")}
                          />
                          有料
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {pricingType === "paid" ? (
                <FormField
                  control={form.control}
                  name='priceYen'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>価格</FormLabel>
                      <FormControl>
                        <PriceDropdown
                          contentType='blog'
                          value={field.value ?? null}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : null}
            </section>

            <section className='space-y-3'>
              <div className='flex items-center justify-between gap-4'>
                <h2 className='text-base font-semibold'>Check Human-written</h2>
                <button
                  type='button'
                  className={cn(
                    "border-input bg-background flex size-6 shrink-0 items-center justify-center rounded-sm border transition-colors disabled:cursor-not-allowed",
                    requestHumanWrittenBadge &&
                      "border-primary bg-primary text-primary-foreground"
                  )}
                  onClick={onHumanWrittenToggle}
                  disabled={requestHumanWrittenBadge || isPublishing}
                  aria-label='人間が執筆バッジを確認'
                  aria-pressed={requestHumanWrittenBadge}
                >
                  {requestHumanWrittenBadge ? (
                    <Check className='size-4' />
                  ) : null}
                </button>
              </div>

              <div className='text-muted-foreground space-y-2 text-sm'>
                <PostLabelBadge label={{ type: "human_written" }} />
                <p>
                  Apply the Human-written badge to your post when backend
                  verification is available. Publishing will continue
                  immediately.
                </p>
              </div>
            </section>
          </div>
        </form>
      </Form>

      <Dialog open={backWarningOpen} onOpenChange={setBackWarningOpen}>
        <DialogContent className='BlogPublishSettingsBackDialog sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Check will be reset</DialogTitle>
            <DialogDescription>
              If you go back and edit this post, the Human-written check and
              badge preview will be removed. You may need to check it again
              before publishing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setBackWarningOpen(false)}
            >
              このページに残る
            </Button>
            <Button type='button' onClick={onConfirmBack}>
              Back to edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isPublishing ? (
        <PublishSavingOverlay
          message={
            isUpdateMode ? "コンテンツを更新中..." : "コンテンツを公開中..."
          }
        />
      ) : null}
    </div>
  );
}
