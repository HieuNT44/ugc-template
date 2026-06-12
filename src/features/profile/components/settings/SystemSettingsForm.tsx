"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Bell, EyeOff, Globe2, Languages, Mail, Moon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
} from "@/core/api/hooks/use-profile-settings-query";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";
import type { UserSettingsUpdatePayload } from "@/core/api/types";
import type { AppLanguage } from "@/core/api/types/enums";
import { useSession } from "@/core/auth/hooks/useSession";
import { cn } from "@/lib/utils";

import {
  CvField,
  CvNativeSelect,
  CvSettingsCard,
  Input,
  setCvServerValidationErrors,
} from "./CvFormUi";

const TIMEZONE_OPTIONS = [
  "UTC",
  "Asia/Tokyo",
  "Asia/Ho_Chi_Minh",
  "Asia/Singapore",
] as const;

const SETTINGS_DISABLED = true;

const LABELS = {
  en: {
    title: "設定",
    description: "アカウント設定、通知、プライバシーを管理します。",
    save: "設定を保存",
    saving: "保存中...",
    saved: "設定を保存しました",
    unauthorized: "設定を更新するには再度ログインしてください。",
    unavailable: "設定データを利用できません。",
    retry: "ページを更新してもう一度お試しください。",
    language: "言語",
    timezone: "タイムゾーン",
    darkMode: "ダークモード",
    emailNotify: "メール通知",
    inappNotify: "アプリ内通知",
    privacyHideEmail: "公開プロフィールでメールアドレスを非表示にする",
  },
  ja: {
    title: "設定",
    description: "アカウント設定、通知、プライバシーを管理します。",
    save: "設定を保存",
    saving: "保存中...",
    saved: "設定を保存しました",
    unauthorized: "設定を更新するには再度ログインしてください。",
    unavailable: "設定データを利用できません。",
    retry: "ページを更新してもう一度お試しください。",
    language: "言語",
    timezone: "タイムゾーン",
    darkMode: "ダークモード",
    emailNotify: "メール通知",
    inappNotify: "アプリ内通知",
    privacyHideEmail: "公開プロフィールでメールを非表示にする",
  },
} as const;

const systemSettingsSchema = z.object({
  dark_mode: z.boolean(),
  language: z.enum(["en", "ja"]),
  timezone: z.string().trim().min(1).max(64),
  email_notify: z.boolean(),
  inapp_notify: z.boolean(),
  privacy_hide_email: z.boolean(),
});

type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>;

const DEFAULT_VALUES: SystemSettingsFormData = {
  dark_mode: false,
  language: "en",
  timezone: "UTC",
  email_notify: true,
  inapp_notify: true,
  privacy_hide_email: false,
};

function getLabels(language: AppLanguage) {
  return LABELS[language];
}

function toFormData(settings: SystemSettingsFormData): SystemSettingsFormData {
  return {
    dark_mode: settings.dark_mode,
    language: settings.language,
    timezone: settings.timezone,
    email_notify: settings.email_notify,
    inapp_notify: settings.inapp_notify,
    privacy_hide_email: settings.privacy_hide_email,
  };
}

function toPayload(data: SystemSettingsFormData): UserSettingsUpdatePayload {
  return {
    dark_mode: data.dark_mode,
    language: data.language,
    timezone: data.timezone.trim(),
    email_notify: data.email_notify,
    inapp_notify: data.inapp_notify,
    privacy_hide_email: data.privacy_hide_email,
  };
}

function SettingSwitchRow({
  icon,
  label,
  checked,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
}) {
  return (
    <div className='SettingSwitchRow border-input bg-muted/20 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 opacity-70'>
      <div className='flex min-w-0 items-center gap-3'>
        <span
          className='bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full border'
          aria-hidden
        >
          {icon}
        </span>
        <span className='truncate text-sm font-medium'>{label}</span>
      </div>
      <button
        type='button'
        role='switch'
        aria-checked={checked}
        disabled
        className={cn(
          "inline-flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors",
          checked
            ? "border-primary bg-primary justify-end"
            : "border-input bg-muted justify-start"
        )}
      >
        <span
          className='bg-background block size-5 shrink-0 rounded-full shadow-sm'
          aria-hidden
        />
      </button>
    </div>
  );
}

export function SystemSettingsForm({
  language = "en",
}: {
  language?: AppLanguage;
}) {
  const labels = getLabels(language);
  const { session } = useSession();
  const token = session?.accessToken?.trim();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const settingsQuery = useProfileSettingsQuery({
    token,
    enabled: Boolean(token),
    language,
  });
  const updateSettingsMutation = useUpdateProfileSettingsMutation();
  const formSchema = useMemo(() => systemSettingsSchema, []);

  const form = useForm<SystemSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const errors = form.formState.errors;
  const settingsValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset(toFormData(settingsQuery.data));
    }
  }, [form, settingsQuery.data]);

  async function onSave(data: SystemSettingsFormData) {
    setServerError(null);
    setSuccessMessage(null);

    if (!token) {
      setServerError(labels.unauthorized);
      return;
    }

    try {
      const updatedSettings = await updateSettingsMutation.mutateAsync({
        token,
        payload: toPayload(data),
        language,
      });
      form.reset(toFormData(updatedSettings));
      setSuccessMessage(labels.saved);
    } catch (error) {
      if (error instanceof ClientApiRequestError) {
        if (
          setCvServerValidationErrors(error.apiError.details, form.setError)
        ) {
          return;
        }

        setServerError(error.apiError.message);
        return;
      }

      setServerError(labels.retry);
    }
  }

  if (settingsQuery.isLoading) {
    return (
      <div className='SystemSettingsForm space-y-4'>
        <Skeleton className='h-28 w-full rounded-2xl' />
        <Skeleton className='h-56 w-full rounded-2xl' />
      </div>
    );
  }

  if (settingsQuery.error) {
    const message =
      settingsQuery.error instanceof Error
        ? settingsQuery.error.message
        : labels.unavailable;

    return (
      <Alert variant='destructive' className='SystemSettingsForm'>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <CvSettingsCard
      title={labels.title}
      description={labels.description}
      saveLabel={labels.save}
      savingLabel={labels.saving}
      isSaving={updateSettingsMutation.isPending}
      isSaveDisabled={SETTINGS_DISABLED}
      onSave={() => void form.handleSubmit(onSave)()}
      className='SystemSettingsForm'
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

        <div className='space-y-3'>
          <CvField label={labels.language} error={errors.language?.message}>
            <div className='border-input bg-muted/20 flex items-center gap-3 rounded-xl border px-4 py-3 opacity-70'>
              <Languages
                className='text-muted-foreground size-4 shrink-0'
                aria-hidden
              />
              <CvNativeSelect
                value={settingsValues.language}
                disabled={SETTINGS_DISABLED}
                onChange={(event) =>
                  form.setValue("language", event.target.value as AppLanguage, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                aria-invalid={Boolean(errors.language)}
                className='h-9 border-0 bg-transparent px-0 focus-visible:ring-0'
              >
                <option value='en'>英語</option>
                <option value='ja'>日本語</option>
              </CvNativeSelect>
            </div>
          </CvField>

          <CvField label={labels.timezone} error={errors.timezone?.message}>
            <div className='border-input bg-muted/20 flex items-center gap-3 rounded-xl border px-4 py-3 opacity-70'>
              <Globe2
                className='text-muted-foreground size-4 shrink-0'
                aria-hidden
              />
              <Input
                list='system-settings-timezones'
                value={settingsValues.timezone}
                disabled={SETTINGS_DISABLED}
                onChange={(event) =>
                  form.setValue("timezone", event.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                aria-invalid={Boolean(errors.timezone)}
                className='h-9 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0'
              />
            </div>
            <datalist id='system-settings-timezones'>
              {TIMEZONE_OPTIONS.map((timezone) => (
                <option key={timezone} value={timezone} />
              ))}
            </datalist>
          </CvField>
        </div>

        <div className='space-y-3'>
          <SettingSwitchRow
            icon={<Moon className='size-4' />}
            label={labels.darkMode}
            checked={Boolean(settingsValues.dark_mode)}
          />
          <SettingSwitchRow
            icon={<Mail className='size-4' />}
            label={labels.emailNotify}
            checked={Boolean(settingsValues.email_notify)}
          />
          <SettingSwitchRow
            icon={<Bell className='size-4' />}
            label={labels.inappNotify}
            checked={Boolean(settingsValues.inapp_notify)}
          />
          <SettingSwitchRow
            icon={<EyeOff className='size-4' />}
            label={labels.privacyHideEmail}
            checked={Boolean(settingsValues.privacy_hide_email)}
          />
        </div>
      </div>
    </CvSettingsCard>
  );
}
