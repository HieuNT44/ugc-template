"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAccomplishmentsQuery,
  useSyncAccomplishmentsMutation,
} from "@/core/api/hooks/use-profile-cv-queries";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";
import type { AccomplishmentType, AppLanguage } from "@/core/api/types/enums";
import { useSession } from "@/core/auth/hooks/useSession";

import {
  getSettingsCvCommonLabel,
  getSettingsCvSectionLabels,
} from "../../lib/settings-cv-labels";
import {
  createAccomplishmentsFormSchema,
  type AccomplishmentsFormData,
} from "../../validations/profile-cv.schemas";
import {
  CvAddItemButton,
  CvEmptyState,
  CvField,
  CvFieldGrid,
  CvItemPanel,
  CvNativeSelect,
  CvSettingsCard,
  getCvErrorMessage,
  Input,
  setCvServerValidationErrors,
  Textarea,
} from "./CvFormUi";

const ACCOMPLISHMENT_TYPES: AccomplishmentType[] = [
  "project",
  "publication",
  "patent",
  "award",
  "course",
];

function createEmptyAccomplishment(
  sortOrder: number
): AccomplishmentsFormData["accomplishments"][number] {
  return {
    type: "project",
    title: "",
    description: "",
    date: "",
    url: "",
    sort_order: sortOrder,
  };
}

export function AccomplishmentsSettingsForm({
  language = "en",
}: {
  language?: AppLanguage;
}) {
  const { session } = useSession();
  const token = session?.accessToken?.trim();
  const labels = getSettingsCvSectionLabels("accomplishments", language);
  const common = (key: Parameters<typeof getSettingsCvCommonLabel>[0]) =>
    getSettingsCvCommonLabel(key, language);

  const query = useAccomplishmentsQuery({
    token,
    enabled: Boolean(token),
    language,
  });
  const syncMutation = useSyncAccomplishmentsMutation(language);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formSchema = useMemo(
    () => createAccomplishmentsFormSchema(language),
    [language]
  );

  const form = useForm<AccomplishmentsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { accomplishments: [] },
    reValidateMode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "accomplishments",
  });
  const watchedAccomplishments =
    useWatch({
      control: form.control,
      name: "accomplishments",
    }) ?? [];

  useEffect(() => {
    if (query.data) {
      replace(
        query.data.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description ?? "",
          date: item.date ?? "",
          url: item.url ?? "",
          sort_order: item.sort_order,
        }))
      );
    }
  }, [query.data, replace]);

  async function onSave(data: AccomplishmentsFormData) {
    if (!token) {
      setServerError(common("unauthorized"));
      return;
    }

    try {
      await syncMutation.mutateAsync({
        token,
        accomplishments: data.accomplishments.map((item, index) => ({
          ...(item.id !== undefined ? { id: item.id } : {}),
          type: item.type,
          title: item.title.trim(),
          description: item.description?.trim() || null,
          date: item.date?.trim() || null,
          url: item.url?.trim() || null,
          sort_order: index,
        })),
      });
      setSuccessMessage(common("saved"));
    } catch (error) {
      if (error instanceof ClientApiRequestError) {
        if (
          setCvServerValidationErrors<AccomplishmentsFormData>(
            error.apiError.details,
            form.setError
          )
        ) {
          return;
        }

        setServerError(error.apiError.message);
        return;
      }

      setServerError(common("genericError"));
    }
  }

  function handleSaveClick() {
    setServerError(null);
    setSuccessMessage(null);
    void form.handleSubmit(onSave)();
  }

  if (query.isLoading) {
    return <Skeleton className='h-96 w-full rounded-2xl' />;
  }

  return (
    <CvSettingsCard
      title={labels.title}
      description={labels.description}
      isSaving={syncMutation.isPending}
      saveLabel={common("save")}
      savingLabel={common("saving")}
      onSave={handleSaveClick}
    >
      <div className='space-y-4'>
        {serverError ? (
          <Alert variant='destructive'>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}
        {successMessage ? (
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        {fields.length === 0 ? (
          <CvEmptyState
            title={common("emptyTitle")}
            description={common("emptyDescription")}
            addLabel={common("addItem")}
            onAdd={() => append(createEmptyAccomplishment(0))}
          />
        ) : (
          fields.map((field, index) => {
            const watchedItem = watchedAccomplishments[index];
            const title = watchedItem?.title;
            const type = watchedItem?.type ?? "project";
            const errors = form.formState.errors.accomplishments?.[index];

            return (
              <CvItemPanel
                key={field.id}
                index={index}
                title={title?.trim() || labels.title}
                onRemove={() => remove(index)}
                removeLabel={common("removeItem")}
              >
                <CvFieldGrid>
                  <CvField
                    label={labels.type}
                    error={getCvErrorMessage(errors?.type)}
                  >
                    <CvNativeSelect
                      value={type}
                      aria-invalid={Boolean(errors?.type)}
                      onChange={(event) =>
                        form.setValue(
                          `accomplishments.${index}.type`,
                          event.target.value as AccomplishmentType,
                          { shouldDirty: true }
                        )
                      }
                    >
                      {ACCOMPLISHMENT_TYPES.map((value) => (
                        <option key={value} value={value}>
                          {labels.types[value]}
                        </option>
                      ))}
                    </CvNativeSelect>
                  </CvField>
                  <CvField
                    label={labels.titleField}
                    error={errors?.title?.message}
                  >
                    <Input
                      placeholder={labels.titlePh}
                      aria-invalid={Boolean(errors?.title)}
                      {...form.register(`accomplishments.${index}.title`)}
                    />
                  </CvField>
                  <CvField label={labels.date} error={errors?.date?.message}>
                    <Input
                      type='date'
                      aria-invalid={Boolean(errors?.date)}
                      {...form.register(`accomplishments.${index}.date`)}
                    />
                  </CvField>
                  <CvField label={labels.url} error={errors?.url?.message}>
                    <Input
                      type='url'
                      placeholder={labels.urlPh}
                      aria-invalid={Boolean(errors?.url)}
                      {...form.register(`accomplishments.${index}.url`)}
                    />
                  </CvField>
                </CvFieldGrid>
                <CvField
                  label={labels.descriptionField}
                  error={errors?.description?.message}
                >
                  <Textarea
                    rows={3}
                    placeholder={labels.descriptionPh}
                    className='min-h-20 resize-y'
                    aria-invalid={Boolean(errors?.description)}
                    {...form.register(`accomplishments.${index}.description`)}
                  />
                </CvField>
              </CvItemPanel>
            );
          })
        )}

        {fields.length > 0 ? (
          <CvAddItemButton
            label={common("addItem")}
            onClick={() => append(createEmptyAccomplishment(fields.length))}
          />
        ) : null}
      </div>
    </CvSettingsCard>
  );
}
