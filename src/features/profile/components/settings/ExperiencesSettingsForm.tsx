"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useExperiencesQuery,
  useSyncExperiencesMutation,
} from "@/core/api/hooks/use-profile-cv-queries";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";
import type { AppLanguage } from "@/core/api/types/enums";
import { useSession } from "@/core/auth/hooks/useSession";

import {
  getSettingsCvCommonLabel,
  getSettingsCvSectionLabels,
} from "../../lib/settings-cv-labels";
import {
  createExperiencesFormSchema,
  type ExperiencesFormData,
} from "../../validations/profile-cv.schemas";
import {
  CvAddItemButton,
  CvCheckboxField,
  CvEmptyState,
  CvField,
  CvFieldGrid,
  CvItemPanel,
  CvSettingsCard,
  Input,
  setCvServerValidationErrors,
  Textarea,
} from "./CvFormUi";

function createEmptyExperience(
  sortOrder: number
): ExperiencesFormData["experiences"][number] {
  return {
    company_name: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    location: "",
    sort_order: sortOrder,
  };
}

function normalizeExperienceForSubmit(
  item: ExperiencesFormData["experiences"][number],
  sortOrder: number
) {
  return {
    ...(item.id !== undefined ? { id: item.id } : {}),
    company_name: item.company_name.trim(),
    title: item.title.trim(),
    description: item.description?.trim() || null,
    start_date: item.start_date,
    end_date: item.is_current ? null : item.end_date?.trim() || null,
    is_current: item.is_current,
    location: item.location?.trim() || null,
    sort_order: sortOrder,
  };
}

export function ExperiencesSettingsForm({
  language = "en",
}: {
  language?: AppLanguage;
}) {
  const { session } = useSession();
  const token = session?.accessToken?.trim();
  const labels = getSettingsCvSectionLabels("experiences", language);
  const common = (key: Parameters<typeof getSettingsCvCommonLabel>[0]) =>
    getSettingsCvCommonLabel(key, language);

  const query = useExperiencesQuery({
    token,
    enabled: Boolean(token),
    language,
  });
  const syncMutation = useSyncExperiencesMutation(language);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formSchema = useMemo(
    () => createExperiencesFormSchema(language),
    [language]
  );

  const form = useForm<ExperiencesFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { experiences: [] },
    reValidateMode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "experiences",
  });
  const watchedExperiences =
    useWatch({
      control: form.control,
      name: "experiences",
    }) ?? [];

  useEffect(() => {
    if (query.data) {
      replace(
        query.data.map((item) => ({
          id: item.id,
          company_name: item.company_name,
          title: item.title,
          description: item.description ?? "",
          start_date: item.start_date,
          end_date: item.end_date ?? "",
          is_current: item.is_current,
          location: item.location ?? "",
          sort_order: item.sort_order,
        }))
      );
    }
  }, [query.data, replace]);

  async function onSave(data: ExperiencesFormData) {
    if (!token) {
      setServerError(common("unauthorized"));
      return;
    }

    try {
      await syncMutation.mutateAsync({
        token,
        experiences: data.experiences.map(normalizeExperienceForSubmit),
      });
      setSuccessMessage(common("saved"));
    } catch (error) {
      if (error instanceof ClientApiRequestError) {
        if (
          setCvServerValidationErrors<ExperiencesFormData>(
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
            onAdd={() => append(createEmptyExperience(0))}
          />
        ) : (
          fields.map((field, index) => {
            const watchedItem = watchedExperiences[index];
            const company = watchedItem?.company_name;
            const title = watchedItem?.title;
            const isCurrent = watchedItem?.is_current;
            const errors = form.formState.errors.experiences?.[index];

            return (
              <CvItemPanel
                key={field.id}
                index={index}
                title={company?.trim() || title?.trim() || labels.title}
                onRemove={() => remove(index)}
                removeLabel={common("removeItem")}
              >
                <CvFieldGrid>
                  <CvField
                    label={labels.company}
                    error={errors?.company_name?.message}
                  >
                    <Input
                      placeholder={labels.companyPh}
                      aria-invalid={Boolean(errors?.company_name)}
                      {...form.register(`experiences.${index}.company_name`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.titleField}
                    error={errors?.title?.message}
                  >
                    <Input
                      placeholder={labels.titlePh}
                      aria-invalid={Boolean(errors?.title)}
                      {...form.register(`experiences.${index}.title`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.location}
                    error={errors?.location?.message}
                  >
                    <Input
                      placeholder={labels.locationPh}
                      aria-invalid={Boolean(errors?.location)}
                      {...form.register(`experiences.${index}.location`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.startDate}
                    error={errors?.start_date?.message}
                  >
                    <Input
                      type='date'
                      aria-invalid={Boolean(errors?.start_date)}
                      {...form.register(`experiences.${index}.start_date`)}
                    />
                  </CvField>
                  {!isCurrent ? (
                    <CvField
                      label={labels.endDate}
                      error={errors?.end_date?.message}
                    >
                      <Input
                        type='date'
                        aria-invalid={Boolean(errors?.end_date)}
                        {...form.register(`experiences.${index}.end_date`)}
                      />
                    </CvField>
                  ) : (
                    <div className='hidden md:block' aria-hidden />
                  )}
                </CvFieldGrid>

                <CvCheckboxField
                  id={`experience-current-${field.id}`}
                  label={labels.isCurrent}
                  checked={Boolean(isCurrent)}
                  onCheckedChange={(checked) => {
                    form.setValue(`experiences.${index}.is_current`, checked, {
                      shouldDirty: true,
                    });
                    if (checked) {
                      form.setValue(`experiences.${index}.end_date`, "", {
                        shouldDirty: true,
                      });
                    }
                  }}
                />

                <CvField
                  label={labels.descriptionField}
                  error={errors?.description?.message}
                >
                  <Textarea
                    rows={3}
                    placeholder={labels.descriptionPh}
                    className='min-h-20 resize-y'
                    aria-invalid={Boolean(errors?.description)}
                    {...form.register(`experiences.${index}.description`)}
                  />
                </CvField>
              </CvItemPanel>
            );
          })
        )}

        {fields.length > 0 ? (
          <CvAddItemButton
            label={common("addItem")}
            onClick={() => append(createEmptyExperience(fields.length))}
          />
        ) : null}
      </div>
    </CvSettingsCard>
  );
}
