"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { API_VALIDATION_LIMITS } from "@/core/api/constants/validation-limits";

import { FacebookIcon } from "@/core/auth/components/icons/FacebookIcon";
import { GithubIcon } from "@/core/auth/components/icons/GithubIcon";
import { LineIcon } from "@/core/auth/components/icons/LineIcon";
import { LinkedInIcon } from "@/core/auth/components/icons/LinkedInIcon";
import { XIcon } from "@/core/auth/components/icons/XIcon";
import { YoutubeIcon } from "@/core/auth/components/icons/YoutubeIcon";

import {
  AlignLeft,
  AtSign,
  Code2,
  FileText,
  Globe,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  User,
} from "lucide-react";

import { useUpdateProfileMutation } from "@/core/api/hooks/use-update-profile-mutation";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";
import { useUploadImage } from "@/core/api/hooks/useUploadImage";
import { toUploadUserMessage } from "@/core/api/lib/upload-error";
import { getUploadMessage } from "@/core/api/lib/upload-messages";
import { mapProfileFormToUpdatePayload } from "@/core/api/mappers/profile.mapper";
import { validateImage } from "@/core/api/services/upload.service";
import type { AppLanguage } from "@/core/api/types/enums";
import { useSession } from "@/core/auth/hooks/useSession";

import { getUsernameInitials } from "../lib/profile-avatar";
import {
  getProfileFormLabel,
  getProfileFormPlaceholder,
  getProfileFormSkillsHint,
} from "../lib/profile-form-labels";
import { getProfileUsername } from "../lib/profile-username";
import type { Profile } from "../types";
import {
  settingsProfileSchema,
  type SettingsProfileFormData,
} from "../validations";

interface SettingsProfileFormProps {
  profile: Profile;
  defaultValues: SettingsProfileFormData;
}

function FormFieldLabel({
  icon,
  children,
  hint,
  htmlFor,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <FormLabel
      htmlFor={htmlFor}
      className='text-foreground flex items-center gap-2 text-sm font-medium'
    >
      <span
        className='text-muted-foreground flex size-4 shrink-0 items-center justify-center'
        aria-hidden
      >
        {icon}
      </span>
      {children}
      {hint ? (
        <span className='text-muted-foreground text-xs font-normal'>
          {hint}
        </span>
      ) : null}
    </FormLabel>
  );
}

function ProfileAvatarPicker({
  avatarSrc,
  alt,
  initials,
  isBusy,
  onReplaceClick,
  onRemoveClick,
}: {
  avatarSrc?: string;
  alt: string;
  initials: string;
  isBusy?: boolean;
  onReplaceClick: () => void;
  onRemoveClick: () => void;
}) {
  const hasAvatar = Boolean(avatarSrc?.trim());

  return (
    <div className='group/avatar-picker relative size-28'>
      <Avatar
        key={hasAvatar ? avatarSrc : "avatar-fallback"}
        className={cn(
          "ring-background size-28 ring-4 transition-opacity",
          hasAvatar && "group-hover/avatar-picker:opacity-50"
        )}
      >
        {hasAvatar ? <AvatarImage src={avatarSrc} alt={alt} /> : null}
        <AvatarFallback className='bg-muted text-2xl font-medium'>
          {initials}
        </AvatarFallback>
      </Avatar>

      {isBusy ? (
        <span
          className='bg-background/90 absolute inset-0 z-20 flex items-center justify-center rounded-full'
          aria-hidden
        >
          <Loader2 className='text-muted-foreground size-6 animate-spin' />
        </span>
      ) : null}

      {hasAvatar ? (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-full",
            "opacity-0 transition-opacity group-hover/avatar-picker:opacity-100",
            isBusy && "pointer-events-none"
          )}
        >
          <button
            type='button'
            disabled={isBusy}
            onClick={onReplaceClick}
            aria-label='Replace profile photo'
            className='bg-background/95 text-foreground hover:bg-background flex size-9 items-center justify-center rounded-full border shadow-sm disabled:cursor-not-allowed disabled:opacity-60'
          >
            <Upload className='size-4' aria-hidden />
          </button>
          <button
            type='button'
            disabled={isBusy}
            onClick={onRemoveClick}
            aria-label='Remove profile photo'
            className='bg-background/95 hover:bg-background border-destructive/30 flex size-9 items-center justify-center rounded-full border shadow-sm disabled:cursor-not-allowed disabled:opacity-60'
          >
            <Trash2 className='text-destructive size-4' aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type='button'
          disabled={isBusy}
          onClick={onReplaceClick}
          aria-label='Upload profile photo'
          className='bg-background/95 text-foreground hover:bg-background absolute inset-0 z-10 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover/avatar-picker:opacity-100 disabled:cursor-not-allowed disabled:opacity-60'
        >
          <span className='flex size-9 items-center justify-center rounded-full border shadow-sm'>
            <Upload className='size-4' aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}

function FormSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
      {children}
    </h2>
  );
}

function ProfileSkillsFieldList({
  value,
  onChange,
  addLabel,
  removeLabel,
  placeholder,
  maxCount,
  itemMaxLength,
}: {
  value: string[];
  onChange: (skills: string[]) => void;
  addLabel: string;
  removeLabel: string;
  placeholder: string;
  maxCount: number;
  itemMaxLength: number;
}) {
  const skills = value.length > 0 ? value : [""];

  function updateSkill(index: number, text: string) {
    const next = [...skills];
    next[index] = text;
    onChange(next);
  }

  function addSkillRow() {
    if (skills.length >= maxCount) {
      return;
    }
    onChange([...skills, ""]);
  }

  function removeSkillRow(index: number) {
    if (skills.length === 1) {
      onChange([""]);
      return;
    }
    onChange(skills.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className='ProfileSkillsFieldList space-y-2'>
      {skills.map((skill, index) => {
        const canRemove = skills.length > 1 || skill.trim().length > 0;
        const isLastRow = index === skills.length - 1;

        return (
          <div key={index} className='flex gap-2'>
            <Input
              className='h-11 flex-1 rounded-xl'
              value={skill}
              placeholder={placeholder}
              maxLength={itemMaxLength}
              onChange={(event) => updateSkill(index, event.target.value)}
              aria-label={`${addLabel} ${index + 1}`}
            />
            {canRemove ? (
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='border-destructive/30 size-11 shrink-0 rounded-xl'
                onClick={() => removeSkillRow(index)}
                aria-label={`${removeLabel} ${index + 1}`}
              >
                <Trash2 className='text-destructive size-4' aria-hidden />
              </Button>
            ) : null}
            {isLastRow ? (
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='size-11 shrink-0 rounded-xl border-[#000000] bg-[#000000] text-[#FFFFFF] hover:bg-[#000000]/90 hover:text-[#FFFFFF]'
                disabled={skills.length >= maxCount}
                onClick={addSkillRow}
                aria-label={addLabel}
              >
                <Plus className='size-4' aria-hidden />
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SettingsProfileForm({
  profile,
  defaultValues,
}: SettingsProfileFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState(
    () => profile.image?.trim() || undefined
  );
  const [coverSrc, setCoverSrc] = useState(
    () => profile.coverUrl?.trim() || undefined
  );
  const [avatarPendingFile, setAvatarPendingFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [coverPendingFile, setCoverPendingFile] = useState<File | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarPreviewUrlRef = useRef<string | null>(null);
  const coverPreviewUrlRef = useRef<string | null>(null);
  const language = (profile.settings?.language ?? "en") satisfies AppLanguage;
  const labels = {
    description:
      language === "ja"
        ? "公開プロフィールに表示される基本情報を更新します。"
        : "Update the basic information shown on your public profile.",
    name: getProfileFormLabel("name", language),
    username: getProfileFormLabel("username", language),
    headline: getProfileFormLabel("headline", language),
    bio: getProfileFormLabel("bio", language),
    industry: getProfileFormLabel("industry", language),
    location: getProfileFormLabel("location", language),
    website: getProfileFormLabel("website", language),
    skills: getProfileFormLabel("skills", language),
    socialLinks: getProfileFormLabel("socialLinks", language),
    linkedinUrl: getProfileFormLabel("linkedinUrl", language),
    githubUrl: getProfileFormLabel("githubUrl", language),
    xUrl: getProfileFormLabel("xUrl", language),
    facebookUrl: getProfileFormLabel("facebookUrl", language),
    lineUrl: getProfileFormLabel("lineUrl", language),
    youtubeUrl: getProfileFormLabel("youtubeUrl", language),
    addSkill: getProfileFormLabel("addSkill", language),
    removeSkill: getProfileFormLabel("removeSkill", language),
    skillsHint: getProfileFormSkillsHint(
      API_VALIDATION_LIMITS.skillsMaxCount,
      language
    ),
    placeholders: {
      name: getProfileFormPlaceholder("name", language),
      username: getProfileFormPlaceholder("username", language),
      headline: getProfileFormPlaceholder("headline", language),
      bio: getProfileFormPlaceholder("bio", language),
      industry: getProfileFormPlaceholder("industry", language),
      location: getProfileFormPlaceholder("location", language),
      website: getProfileFormPlaceholder("website", language),
      skill: getProfileFormPlaceholder("skill", language),
      linkedinUrl: getProfileFormPlaceholder("linkedinUrl", language),
      githubUrl: getProfileFormPlaceholder("githubUrl", language),
      xUrl: getProfileFormPlaceholder("xUrl", language),
      facebookUrl: getProfileFormPlaceholder("facebookUrl", language),
      lineUrl: getProfileFormPlaceholder("lineUrl", language),
      youtubeUrl: getProfileFormPlaceholder("youtubeUrl", language),
    },
  };

  const { session } = useSession();
  const updateProfileMutation = useUpdateProfileMutation();
  const { upload: uploadAvatar } = useUploadImage("profile_avatar", language);
  const { upload: uploadCover } = useUploadImage("profile_cover", language);

  const handle = profile.username?.trim() || getProfileUsername(profile);
  const initials = getUsernameInitials(handle);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
      }
      if (coverPreviewUrlRef.current) {
        URL.revokeObjectURL(coverPreviewUrlRef.current);
      }
    };
  }, []);
  const headlineMax = API_VALIDATION_LIMITS.headlineMaxLength;
  const bioMax = API_VALIDATION_LIMITS.settingsProfileBioMaxLength;

  const form = useForm<SettingsProfileFormData>({
    resolver: zodResolver(
      settingsProfileSchema
    ) as Resolver<SettingsProfileFormData>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  });

  const headlineValue =
    useWatch({
      control: form.control,
      name: "headline",
    }) ?? "";
  const bioValue =
    useWatch({
      control: form.control,
      name: "bio",
    }) ?? "";

  async function onSubmit(data: SettingsProfileFormData) {
    setServerError(null);
    setMediaError(null);
    setIsLoading(true);

    try {
      const token = session?.accessToken;
      if (!token) {
        setServerError(getUploadMessage("unauthorized", language));
        return;
      }

      let avatarUploadFileId: string | null | undefined;
      let coverUploadFileId: string | null | undefined;

      if (avatarRemoved) {
        avatarUploadFileId = null;
      } else if (avatarPendingFile) {
        const completed = await uploadAvatar(avatarPendingFile);
        avatarUploadFileId = completed.upload_file_id;
      }

      if (coverRemoved) {
        coverUploadFileId = null;
      } else if (coverPendingFile) {
        const completed = await uploadCover(coverPendingFile);
        coverUploadFileId = completed.upload_file_id;
      }

      const payload = mapProfileFormToUpdatePayload({
        name: data.name,
        username: data.username,
        headline: data.headline,
        bio: data.bio,
        industry: data.industry,
        skills: data.skills.map((item) => item.trim()).filter(Boolean),
        location: data.location,
        website: data.website,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        xUrl: data.xUrl,
        facebookUrl: data.facebookUrl,
        lineUrl: data.lineUrl,
        youtubeUrl: data.youtubeUrl,
      });

      if (avatarUploadFileId !== undefined) {
        payload.avatar_upload_file_id = avatarUploadFileId;
      }
      if (coverUploadFileId !== undefined) {
        payload.cover_upload_file_id = coverUploadFileId;
      }

      const updatedProfile = await updateProfileMutation.mutateAsync({
        token,
        payload,
        language,
      });

      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
        avatarPreviewUrlRef.current = null;
      }
      if (coverPreviewUrlRef.current) {
        URL.revokeObjectURL(coverPreviewUrlRef.current);
        coverPreviewUrlRef.current = null;
      }

      setAvatarSrc(updatedProfile.avatar_url?.trim() || undefined);
      const attachedCoverUrl =
        "cover_url" in updatedProfile
          ? updatedProfile.cover_url?.trim()
          : undefined;
      setCoverSrc(attachedCoverUrl || undefined);
      setAvatarPendingFile(null);
      setAvatarRemoved(false);
      setCoverPendingFile(null);
      setCoverRemoved(false);

      toast.success(getUploadMessage("profile_saved", language));
    } catch (error) {
      if (error instanceof ClientApiRequestError) {
        setServerError(error.apiError.message);
        return;
      }

      setServerError(toUploadUserMessage(error, language));
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    void form.handleSubmit(onSubmit)(event);
  }

  function handleAvatarFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setMediaError(null);

    try {
      validateImage(file);
    } catch (error) {
      setMediaError(toUploadUserMessage(error, language));
      return;
    }

    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
    }
    const localPreview = URL.createObjectURL(file);
    avatarPreviewUrlRef.current = localPreview;
    setAvatarPendingFile(file);
    setAvatarRemoved(false);
    setAvatarSrc(localPreview);
  }

  function handleAvatarRemove() {
    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
      avatarPreviewUrlRef.current = null;
    }
    setAvatarPendingFile(null);
    setAvatarRemoved(true);
    setAvatarSrc(undefined);
    setMediaError(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  }

  function handleCoverFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setMediaError(null);

    try {
      validateImage(file);
    } catch (error) {
      setMediaError(toUploadUserMessage(error, language));
      return;
    }

    if (coverPreviewUrlRef.current) {
      URL.revokeObjectURL(coverPreviewUrlRef.current);
    }
    const localPreview = URL.createObjectURL(file);
    coverPreviewUrlRef.current = localPreview;
    setCoverPendingFile(file);
    setCoverRemoved(false);
    setCoverSrc(localPreview);
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className='SettingsProfileForm gap-0 overflow-hidden rounded-2xl py-0'>
        <div className='border-border flex min-h-14 shrink-0 items-center justify-between gap-4 border-b px-6 py-3'>
          <div className='min-w-0'>
            <h1 className='text-base leading-none font-semibold'>Profile</h1>
            <p className='text-muted-foreground mt-1.5 text-sm leading-normal'>
              {labels.description}
            </p>
          </div>
          <Button
            type='submit'
            form='settings-profile-form'
            disabled={isLoading}
            className='rounded-full px-6'
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className='px-6 pt-6 pb-6'>
          <input
            ref={avatarInputRef}
            type='file'
            accept='image/*'
            className='sr-only'
            aria-hidden
            tabIndex={-1}
            onChange={handleAvatarFileChange}
          />
          <input
            ref={coverInputRef}
            type='file'
            accept='image/*'
            className='sr-only'
            aria-hidden
            tabIndex={-1}
            onChange={handleCoverFileChange}
          />

          {serverError ? (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}
          {mediaError ? (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{mediaError}</AlertDescription>
            </Alert>
          ) : null}

          <div className='relative mt-0'>
            <div
              className={cn(
                "bg-muted relative h-36 w-full overflow-hidden rounded-xl",
                coverSrc ? "bg-cover bg-center" : undefined
              )}
              style={
                coverSrc ? { backgroundImage: `url(${coverSrc})` } : undefined
              }
            >
              {isLoading && (coverPendingFile || coverRemoved) ? (
                <span className='bg-background/50 absolute inset-0 flex items-center justify-center'>
                  <Loader2
                    className='text-muted-foreground size-8 animate-spin'
                    aria-label='Saving cover photo'
                  />
                </span>
              ) : null}
            </div>

            <div className='absolute -bottom-14 left-1/2 z-10 -translate-x-1/2'>
              <ProfileAvatarPicker
                avatarSrc={avatarSrc}
                alt={profile.name ?? handle}
                initials={initials}
                isBusy={
                  isLoading && (avatarPendingFile !== null || avatarRemoved)
                }
                onReplaceClick={() => avatarInputRef.current?.click()}
                onRemoveClick={handleAvatarRemove}
              />
            </div>
          </div>

          <Form {...form}>
            <form
              id='settings-profile-form'
              onSubmit={handleFormSubmit}
              className='mt-16 space-y-3 [&_[data-slot=form-item]]:gap-1'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<User className='size-4' />}>
                      {labels.name}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        placeholder={labels.placeholders.name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<AtSign className='size-4' />}>
                      {labels.username}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        placeholder={labels.placeholders.username}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='headline'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<AlignLeft className='size-4' />}>
                      {labels.headline}
                    </FormFieldLabel>
                    <FormControl>
                      <div className='relative'>
                        <Textarea
                          rows={4}
                          placeholder={labels.placeholders.headline}
                          className='min-h-28 resize-none rounded-xl pb-8'
                          {...field}
                        />
                        <span className='text-muted-foreground absolute right-3 bottom-2 text-xs'>
                          {headlineValue.length}/{headlineMax}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<FileText className='size-4' />}>
                      {labels.bio}
                    </FormFieldLabel>
                    <FormControl>
                      <div className='relative'>
                        <Textarea
                          rows={4}
                          maxLength={bioMax}
                          placeholder={labels.placeholders.bio}
                          className='max-h-32 min-h-24 resize-none overflow-y-auto rounded-xl pb-8'
                          {...field}
                        />
                        <span className='text-muted-foreground absolute right-3 bottom-2 text-xs'>
                          {bioValue.length}/{bioMax}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='industry'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<Code2 className='size-4' />}>
                      {labels.industry}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        placeholder={labels.placeholders.industry}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<MapPin className='size-4' />}>
                      {labels.location}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        placeholder={labels.placeholders.location}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<Globe className='size-4' />}>
                      {labels.website}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        type='url'
                        placeholder={labels.placeholders.website}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='skills'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel
                      icon={<Sparkles className='size-4' />}
                      hint={labels.skillsHint}
                    >
                      {labels.skills}
                    </FormFieldLabel>
                    <FormControl>
                      <ProfileSkillsFieldList
                        value={field.value}
                        onChange={field.onChange}
                        addLabel={labels.addSkill}
                        removeLabel={labels.removeSkill}
                        placeholder={labels.placeholders.skill}
                        maxCount={API_VALIDATION_LIMITS.skillsMaxCount}
                        itemMaxLength={API_VALIDATION_LIMITS.skillItemMaxLength}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormSectionTitle>{labels.socialLinks}</FormSectionTitle>

              <FormField
                control={form.control}
                name='linkedinUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<LinkedInIcon />}>
                      {labels.linkedinUrl}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        type='url'
                        placeholder={labels.placeholders.linkedinUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='githubUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<GithubIcon />}>
                      {labels.githubUrl}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        type='url'
                        placeholder={labels.placeholders.githubUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='xUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<XIcon />}>
                      {labels.xUrl}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        type='url'
                        placeholder={labels.placeholders.xUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='facebookUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<FacebookIcon />}>
                      {labels.facebookUrl}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        type='url'
                        placeholder={labels.placeholders.facebookUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lineUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<LineIcon />}>
                      {labels.lineUrl}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        type='url'
                        placeholder={labels.placeholders.lineUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='youtubeUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormFieldLabel icon={<YoutubeIcon />}>
                      {labels.youtubeUrl}
                    </FormFieldLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-xl'
                        type='url'
                        placeholder={labels.placeholders.youtubeUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </Card>
    </motion.div>
  );
}
