"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

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
import { useSession } from "@/core/auth/hooks/useSession";
import { publishContentAction } from "../actions/publish-content";
import type { SaveDraftInput } from "../lib/content-api";
import { isPublishSuccess, isSaveDraftSuccess } from "../lib/action-results";
import { saveDraftClient } from "../lib/content-client-api";
import {
  getContentMessage,
  getSaveDraftErrorMessage,
} from "../lib/content-messages";
import { useCreateContentStore } from "../hooks/use-create-content-store";
import type { ContentType } from "../types/content-type";
import { PriceDropdown } from "./PriceDropdown";
import {
  PublishStatusModal,
  type PublishModalPhase,
} from "./PublishStatusModal";

type PublishFormData = {
  pricingType: "free" | "paid";
  priceYen?: number | null;
};

type PublishSettingsProps = {
  contentType: ContentType;
  backHref: string;
  editHref: string;
  buildDraftPayload: () => SaveDraftInput;
  publishSchema: z.ZodType<PublishFormData>;
  allowFree?: boolean;
};

export function PublishSettings({
  contentType,
  backHref,
  editHref,
  buildDraftPayload,
  publishSchema,
  allowFree = true,
}: PublishSettingsProps) {
  const router = useRouter();
  const store = useCreateContentStore();
  const { session } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<PublishModalPhase>("processing");
  const [humanScore, setHumanScore] = useState<number | undefined>();

  const form = useForm<PublishFormData>({
    defaultValues: {
      pricingType: (allowFree ? (store.pricingType ?? "free") : "paid") as
        | "free"
        | "paid",
      priceYen: store.priceYen,
    },
  });

  useEffect(() => {
    if (!allowFree) {
      form.setValue("pricingType", "paid");
    }
  }, [allowFree, form]);

  const pricingType = useWatch({ control: form.control, name: "pricingType" });

  async function ensureDraftId(
    options: { showToast?: boolean } = {}
  ): Promise<string | null> {
    const payload = buildDraftPayload();
    const result = await saveDraftClient(payload, session?.accessToken);

    if (isSaveDraftSuccess(result)) {
      store.setDraftId(result.draft.id);
      if (options.showToast) {
        toast.success(getContentMessage("draft_saved"));
      }
      return result.draft.id;
    }

    const message = getSaveDraftErrorMessage(result);

    setServerError(message);
    if (options.showToast) {
      toast.error(message);
    }

    return null;
  }

  async function onSaveDraft() {
    setServerError(null);
    const draftId = await ensureDraftId({ showToast: true });
    if (draftId) {
      router.push(editHref);
    }
  }

  async function onPublish(data: PublishFormData) {
    setServerError(null);

    const validated = publishSchema.safeParse(data);
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        const message = (messages ?? []).join(" ");
        if (message) {
          form.setError(field as keyof PublishFormData, { message });
        }
      });
      return;
    }

    setModalOpen(true);
    setModalPhase("processing");

    const draftId = await ensureDraftId();
    if (!draftId) {
      setModalOpen(false);
      return;
    }

    store.patch({
      pricingType: validated.data.pricingType,
      priceYen: validated.data.priceYen ?? null,
    });

    const result = await publishContentAction({
      ...buildDraftPayload(),
      pricingType: validated.data.pricingType,
      priceYen: validated.data.priceYen ?? null,
    });

    if (!isPublishSuccess(result)) {
      setModalOpen(false);
      if ("error" in result) {
        setServerError(result.error);
      } else if ("errors" in result) {
        const first = Object.values(result.errors)[0]?.[0];
        setServerError(first ?? "Validation failed");
      }
      return;
    }

    setHumanScore(result.humanScore);
    setModalPhase(result.status);
  }

  return (
    <div className='PublishSettings'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onPublish)}
          className='flex flex-col gap-6'
        >
          {serverError ? (
            <Alert variant='destructive'>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}

          {allowFree ? (
            <FormField
              control={form.control}
              name='pricingType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing</FormLabel>
                  <FormControl>
                    <div className='flex gap-4'>
                      <label className='flex items-center gap-2 text-sm'>
                        <input
                          type='radio'
                          checked={field.value === "free"}
                          onChange={() => field.onChange("free")}
                        />
                        Free
                      </label>
                      <label className='flex items-center gap-2 text-sm'>
                        <input
                          type='radio'
                          checked={field.value === "paid"}
                          onChange={() => field.onChange("paid")}
                        />
                        Paid
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          {pricingType === "paid" || !allowFree ? (
            <FormField
              control={form.control}
              name='priceYen'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <PriceDropdown
                      contentType={contentType}
                      value={field.value ?? null}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <div className='flex flex-wrap gap-3'>
            <Button
              type='button'
              variant='outline'
              className='rounded-full'
              onClick={() => router.push(backHref)}
            >
              Back
            </Button>
            <Button
              type='button'
              variant='secondary'
              className='rounded-full'
              onClick={() => void onSaveDraft()}
            >
              Save draft
            </Button>
            <Button
              type='submit'
              className='rounded-full'
              disabled={form.formState.isSubmitting}
            >
              Publish
            </Button>
          </div>
        </form>
      </Form>

      <PublishStatusModal
        open={modalOpen}
        phase={modalPhase}
        humanScore={humanScore}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
