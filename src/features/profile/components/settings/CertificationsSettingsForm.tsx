"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCertificationsQuery,
  useSyncCertificationsMutation,
} from "@/core/api/hooks/use-profile-cv-queries";
import { useUploadImage } from "@/core/api/hooks/useUploadImage";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";
import { toUploadUserMessage } from "@/core/api/lib/upload-error";
import type { AppLanguage } from "@/core/api/types/enums";
import { useSession } from "@/core/auth/hooks/useSession";

import {
  getSettingsCvCommonLabel,
  getSettingsCvSectionLabels,
} from "../../lib/settings-cv-labels";
import {
  createCertificationsFormSchema,
  type CertificationsFormData,
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
} from "./CvFormUi";

function createEmptyCertification(
  sortOrder: number
): CertificationsFormData["certifications"][number] {
  return {
    name: "",
    issuing_organization: "",
    issue_date: "",
    expiration_date: "",
    credential_id: "",
    credential_url: "",
    upload_file_id: "",
    image_url: "",
    sort_order: sortOrder,
  };
}

function CertificationImageField({
  index,
  imageUrl,
  language,
  error,
  onUploaded,
  onRemove,
}: {
  index: number;
  imageUrl?: string | null;
  language: AppLanguage;
  error?: string;
  onUploaded: (uploadFileId: string, url: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useUploadImage(
    "profile_certification",
    language
  );
  const labels = getSettingsCvSectionLabels("certifications", language);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const preview = imageUrl?.trim() || undefined;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setUploadError(null);
    try {
      const completed = await upload(file);
      onUploaded(completed.upload_file_id, completed.url?.trim() ?? "");
    } catch (error) {
      setUploadError(toUploadUserMessage(error, language));
    }
  }

  return (
    <CvField label={labels.certificateImage} className='md:col-span-2'>
      <div className='border-border bg-muted/10 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center'>
        {preview ? (
          <div className='relative size-20 shrink-0 overflow-hidden rounded-lg border bg-white'>
            <Image
              src={preview}
              alt=''
              fill
              className='object-cover'
              unoptimized
            />
          </div>
        ) : (
          <div className='bg-muted text-muted-foreground flex size-20 shrink-0 items-center justify-center rounded-lg border text-xs'>
            No image
          </div>
        )}
        <div className='flex flex-wrap gap-2'>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            className='sr-only'
            onChange={(event) => void handleFileChange(event)}
            aria-label={labels.uploadImage}
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className='rounded-full'
          >
            {isUploading ? (
              <Loader2 className='size-4 animate-spin' aria-hidden />
            ) : (
              <Upload className='size-4' aria-hidden />
            )}
            {preview ? labels.replaceImage : labels.uploadImage}
          </Button>
          {preview ? (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={onRemove}
              className='rounded-full'
            >
              {labels.removeImage}
            </Button>
          ) : null}
        </div>
      </div>
      {uploadError ? (
        <p className='text-destructive mt-1.5 text-xs'>{uploadError}</p>
      ) : null}
      {error ? (
        <p className='text-destructive mt-1.5 text-xs' role='alert'>
          {error}
        </p>
      ) : null}
      <span className='sr-only'>Certification {index + 1} image</span>
    </CvField>
  );
}

export function CertificationsSettingsForm({
  language = "en",
}: {
  language?: AppLanguage;
}) {
  const { session } = useSession();
  const token = session?.accessToken?.trim();
  const labels = getSettingsCvSectionLabels("certifications", language);
  const common = (key: Parameters<typeof getSettingsCvCommonLabel>[0]) =>
    getSettingsCvCommonLabel(key, language);

  const query = useCertificationsQuery({
    token,
    enabled: Boolean(token),
    language,
  });
  const syncMutation = useSyncCertificationsMutation(language);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formSchema = useMemo(
    () => createCertificationsFormSchema(language),
    [language]
  );

  const form = useForm<CertificationsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { certifications: [] },
    reValidateMode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "certifications",
  });
  const watchedCertifications =
    useWatch({
      control: form.control,
      name: "certifications",
    }) ?? [];

  useEffect(() => {
    if (query.data) {
      replace(
        query.data.map((item) => ({
          id: item.id,
          name: item.name,
          issuing_organization: item.issuing_organization,
          issue_date: item.issue_date ?? "",
          expiration_date: item.expiration_date ?? "",
          credential_id: item.credential_id ?? "",
          credential_url: item.credential_url ?? "",
          upload_file_id: item.upload_file_id ?? "",
          image_url: item.image_url ?? "",
          sort_order: item.sort_order,
        }))
      );
    }
  }, [query.data, replace]);

  async function onSave(data: CertificationsFormData) {
    if (!token) {
      setServerError(common("unauthorized"));
      return;
    }

    try {
      await syncMutation.mutateAsync({
        token,
        certifications: data.certifications.map((item, index) => ({
          ...(item.id !== undefined ? { id: item.id } : {}),
          name: item.name.trim(),
          issuing_organization: item.issuing_organization.trim(),
          issue_date: item.issue_date?.trim() || null,
          expiration_date: item.expiration_date?.trim() || null,
          credential_id: item.credential_id?.trim() || null,
          credential_url: item.credential_url?.trim() || null,
          upload_file_id: item.upload_file_id?.trim() || null,
          sort_order: index,
        })),
      });
      setSuccessMessage(common("saved"));
    } catch (error) {
      if (error instanceof ClientApiRequestError) {
        if (
          setCvServerValidationErrors<CertificationsFormData>(
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
            onAdd={() => append(createEmptyCertification(0))}
          />
        ) : (
          fields.map((field, index) => {
            const watchedItem = watchedCertifications[index];
            const name = watchedItem?.name;
            const imageUrl = watchedItem?.image_url;
            const errors = form.formState.errors.certifications?.[index];

            return (
              <CvItemPanel
                key={field.id}
                index={index}
                title={name?.trim() || labels.title}
                onRemove={() => remove(index)}
                removeLabel={common("removeItem")}
              >
                <CvFieldGrid>
                  <CvField label={labels.name} error={errors?.name?.message}>
                    <Input
                      placeholder={labels.namePh}
                      aria-invalid={Boolean(errors?.name)}
                      {...form.register(`certifications.${index}.name`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.organization}
                    error={errors?.issuing_organization?.message}
                  >
                    <Input
                      placeholder={labels.organizationPh}
                      aria-invalid={Boolean(errors?.issuing_organization)}
                      {...form.register(
                        `certifications.${index}.issuing_organization`
                      )}
                    />
                  </CvField>
                  <CvField
                    label={labels.issueDate}
                    error={errors?.issue_date?.message}
                  >
                    <Input
                      type='date'
                      aria-invalid={Boolean(errors?.issue_date)}
                      {...form.register(`certifications.${index}.issue_date`)}
                    />
                  </CvField>
                  <CvField
                    label={labels.expirationDate}
                    error={errors?.expiration_date?.message}
                  >
                    <Input
                      type='date'
                      aria-invalid={Boolean(errors?.expiration_date)}
                      {...form.register(
                        `certifications.${index}.expiration_date`
                      )}
                    />
                  </CvField>
                  <CvField
                    label={labels.credentialId}
                    error={errors?.credential_id?.message}
                  >
                    <Input
                      placeholder={labels.credentialIdPh}
                      aria-invalid={Boolean(errors?.credential_id)}
                      {...form.register(
                        `certifications.${index}.credential_id`
                      )}
                    />
                  </CvField>
                  <CvField
                    label={labels.credentialUrl}
                    error={errors?.credential_url?.message}
                  >
                    <Input
                      type='url'
                      placeholder={labels.credentialUrlPh}
                      aria-invalid={Boolean(errors?.credential_url)}
                      {...form.register(
                        `certifications.${index}.credential_url`
                      )}
                    />
                  </CvField>
                </CvFieldGrid>

                <CertificationImageField
                  index={index}
                  imageUrl={imageUrl}
                  language={language}
                  error={errors?.upload_file_id?.message}
                  onUploaded={(uploadFileId, url) => {
                    form.setValue(
                      `certifications.${index}.upload_file_id`,
                      uploadFileId,
                      {
                        shouldDirty: true,
                      }
                    );
                    form.setValue(`certifications.${index}.image_url`, url, {
                      shouldDirty: true,
                    });
                  }}
                  onRemove={() => {
                    form.setValue(
                      `certifications.${index}.upload_file_id`,
                      "",
                      {
                        shouldDirty: true,
                      }
                    );
                    form.setValue(`certifications.${index}.image_url`, "", {
                      shouldDirty: true,
                    });
                  }}
                />
              </CvItemPanel>
            );
          })
        )}

        {fields.length > 0 ? (
          <CvAddItemButton
            label={common("addItem")}
            onClick={() => append(createEmptyCertification(fields.length))}
          />
        ) : null}
      </div>
    </CvSettingsCard>
  );
}
