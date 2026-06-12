"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import {
  completeOnboardingClient,
  getProfileClient,
  updateProfileClient,
} from "@/core/api/client/profile-client";
import { getRedirectUrl } from "@/core/auth/lib/authUtils";
import type { ReaderCreatorProfile } from "@/core/api/types/profile";

import {
  readerOnboardingSchema,
  type ReaderOnboardingFormData,
} from "../validations/onboarding.schema";

function isReaderCreatorProfile(
  profile: unknown
): profile is ReaderCreatorProfile {
  return (
    typeof profile === "object" &&
    profile !== null &&
    "onboarding_step" in profile
  );
}

export function ReaderOnboardingForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const form = useForm<ReaderOnboardingFormData>({
    resolver: zodResolver(readerOnboardingSchema),
    defaultValues: {
      full_name: "",
      username: "",
      bio: "",
      location: "",
    },
  });

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) {
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      if (!token) {
        return;
      }

      setIsLoadingProfile(true);
      setLoadError(null);

      const result = await getProfileClient(token);

      if (cancelled) {
        return;
      }

      if (!result.ok) {
        setLoadError(result.error.message);
        setIsLoadingProfile(false);
        return;
      }

      if (!isReaderCreatorProfile(result.data)) {
        setLoadError("プロフィールを読み込めませんでした。");
        setIsLoadingProfile(false);
        return;
      }

      if (result.data.onboarding_step === "completed") {
        const role = session?.user?.role ?? "reader";
        router.replace(getRedirectUrl(role));
        return;
      }

      form.reset({
        full_name: result.data.full_name ?? "",
        username: result.data.username ?? "",
        bio: result.data.bio ?? "",
        location: result.data.location ?? "",
      });
      setIsLoadingProfile(false);
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session?.accessToken, session?.user?.role, form, router]);

  const onSubmit = async (values: ReaderOnboardingFormData) => {
    const token = session?.accessToken;
    if (!token) {
      setSubmitError("続行するにはログインしてください。");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const updateResult = await updateProfileClient(token, {
      full_name: values.full_name,
      username: values.username,
      bio: values.bio?.trim() ? values.bio.trim() : null,
      location: values.location?.trim() ? values.location.trim() : null,
    });

    if (!updateResult.ok) {
      setSubmitError(updateResult.error.message);
      setIsSubmitting(false);
      return;
    }

    const completeResult = await completeOnboardingClient(token);

    if (!completeResult.ok) {
      setSubmitError(completeResult.error.message);
      setIsSubmitting(false);
      return;
    }

    const role = session.user?.role ?? "reader";
    router.replace(getRedirectUrl(role));
    router.refresh();
    setIsSubmitting(false);
  };

  if (isLoadingProfile) {
    return (
      <div className='ReaderOnboardingForm text-muted-foreground text-sm'>
        Loading your profile...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className='ReaderOnboardingForm text-destructive text-sm'>
        {loadError}
      </div>
    );
  }

  return (
    <div className='ReaderOnboardingForm mx-auto w-full max-w-lg'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          {submitError ? (
            <p className='text-destructive text-sm'>{submitError}</p>
          ) : null}

          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>氏名</FormLabel>
                <FormControl>
                  <Input autoComplete='name' {...field} />
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
                <FormLabel>ユーザー名</FormLabel>
                <FormControl>
                  <Input autoComplete='username' {...field} />
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
                <FormLabel>自己紹介（任意）</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder='あなたについて教えてください'
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
                <FormLabel>所在地（任意）</FormLabel>
                <FormControl>
                  <Input placeholder='市区町村、国' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "設定を完了"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
