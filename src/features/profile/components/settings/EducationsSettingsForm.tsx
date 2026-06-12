"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEducationsQuery,
  useSyncEducationsMutation,
} from "@/core/api/hooks/use-profile-cv-queries";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";
import type { AppLanguage } from "@/core/api/types/enums";
import { useSession } from "@/core/auth/hooks/useSession";

import {
  getSettingsCvCommonLabel,
  getSettingsCvSectionLabels,
} from "../../lib/settings-cv-labels";
import {
  createEducationsFormSchema,
  type EducationsFormData,
} from "../../validations/profile-cv.schemas";
import {
  CvAddItemButton,
  CvEmptyState,
  CvField,
  CvFieldGrid,
  CvItemPanel,
  CvSettingsCard,
  Input,
  setCvServerValidationErrors,
  Textarea,
} from "./CvFormUi";

function createEmptyEducation(
  sortOrder: number
): EducationsFormData["educations"][number] {
  return {
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
    sort_order: sortOrder,
  };
}

export function EducationsSettingsForm({
  language = "en",
}: {
  language?: AppLanguage;
}) {
  const { session } = useSession();
  const token = session?.accessToken?.trim();
  const labels = getSettingsCvSectionLabels("educations", language);
  const common = (key: Parameters<typeof getSettingsCvCommonLabel>[0]) =>
    getSettingsCvCommonLabel(key, language);

  const query = useEducationsQuery({
    token,
    enabled: Boolean(token),
    language,
  });
  const syncMutation = useSyncEducationsMutation(language);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formSchema = useMemo(
    () => createEducationsFormSchema(language),
    [language]
  );

  const form = useForm<EducationsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { educations: [] },
    reValidateMode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "educations",
  });
  const watchedEducations =
    useWatch({
      control: form.control,
      name: "educations",
    }) ?? [];

  useEffect(() => {
    if (query.data) {
      replace(
        query.data.map((item) => ({
          id: item.id,
          school_name: item.school_name,
          degree: item.degree ?? "",
          field_of_study: item.field_of_study ?? "",
          start_date: item.start_date ?? "",
          end_date: item.end_date ?? "",
          description: item.description ?? "",
          sort_order: item.sort_order,
        }))
      );
    }
  }, [query.data, replace]);

  async function onSave(data: EducationsFormData) {
    if (!token) {
      setServerError(common("unauthorized"));
      return;
    }

    try {
      await syncMutation.mutateAsync({
        token,
        educations: data.educations.map((item, index) => ({
          ...(item.id !== undefined ? { id: item.id } : {}),
          school_name: item.school_name.trim(),
          degree: item.degree?.trim() || null,
          field_of_study: item.field_of_study?.trim() || null,
          start_date: item.start_date?.trim() || null,
          end_date: item.end_date?.trim() || null,
          description: item.description?.trim() || null,
          sort_order: index,
        })),
      });
      setSuccessMessage(common("saved"));
    } catch (error) {
      if (error instanceof ClientApiRequestError) {
        if (
          setCvServerValidationErrors<EducationsFormData>(
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
            onAdd={() => append(createEmptyEducation(0))}
          />
        ) : (
          fields.map((field, index) => {
            const school = watchedEducations[index]?.school_name;
            const errors = form.formState.errors.educations?.[index];

            return (
              <CvItemPanel
                key={field.id}
                index={index}
                title={school?.trim() || labels.title}
                onRemove={() => remove(index)}
                removeLabel={common("removeItem")}
              >
                <CvFieldGrid>
                  <CvField
                    label={labels.school}
                    className='md:col-span-2'
                    error={errors?.school_name?.message}
                  >
                    <Input
                      placeholder={labels.schoolPh}
                      aria-invalid={Boolean(errors?.school_name)}
                      {...form.register(`educations.${index}.school_name`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.degree}
                    error={errors?.degree?.message}
                  >
                    <Input
                      placeholder={labels.degreePh}
                      aria-invalid={Boolean(errors?.degree)}
                      {...form.register(`educations.${index}.degree`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.field}
                    error={errors?.field_of_study?.message}
                  >
                    <Input
                      placeholder={labels.fieldPh}
                      aria-invalid={Boolean(errors?.field_of_study)}
                      {...form.register(`educations.${index}.field_of_study`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.startDate}
                    error={errors?.start_date?.message}
                  >
                    <Input
                      type='date'
                      aria-invalid={Boolean(errors?.start_date)}
                      {...form.register(`educations.${index}.start_date`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.endDate}
                    error={errors?.end_date?.message}
                  >
                    <Input
                      type='date'
                      aria-invalid={Boolean(errors?.end_date)}
                      {...form.register(`educations.${index}.end_date`)}
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
                    {...form.register(`educations.${index}.description`)}
                  />
                </CvField>
              </CvItemPanel>
            );
          })
        )}

        {fields.length > 0 ? (
          <CvAddItemButton
            label={common("addItem")}
            onClick={() => append(createEmptyEducation(fields.length))}
          />
        ) : null}
      </div>
    </CvSettingsCard>
  );
}
