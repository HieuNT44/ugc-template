"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePasswordMutation } from "@/core/api/hooks/use-change-password-mutation";
import { ClientApiRequestError } from "@/core/api/lib/client-api-error";
import type { AppLanguage } from "@/core/api/types/enums";
import { mapApiAuthFailure } from "@/core/auth/lib/map-api-auth-error";
import { useSession } from "@/core/auth/hooks/useSession";

import { getSettingsPasswordLabel } from "../lib/settings-password-labels";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../validations";

interface ChangePasswordFormProps {
  language?: AppLanguage;
}

export function ChangePasswordForm({
  language = "en",
}: ChangePasswordFormProps) {
  const { session } = useSession();
  const changePasswordMutation = useChangePasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormData) {
    setServerError(null);
    setSuccessMessage(null);

    const token = session?.accessToken?.trim();
    if (!token) {
      setServerError(getSettingsPasswordLabel("unauthorized", language));
      return;
    }

    try {
      const message = await changePasswordMutation.mutateAsync({
        token,
        payload: {
          current_password: data.currentPassword,
          password: data.newPassword,
          password_confirmation: data.confirmPassword,
        },
      });

      setSuccessMessage(
        message ?? getSettingsPasswordLabel("success", language)
      );
      form.reset();
    } catch (error) {
      if (error instanceof ClientApiRequestError) {
        setServerError(mapApiAuthFailure(error.apiError).error);
        return;
      }

      setServerError(getSettingsPasswordLabel("genericError", language));
    }
  }

  return (
    <Card className='ChangePasswordForm gap-0 overflow-hidden rounded-2xl py-0'>
      <div className='border-border flex h-14 shrink-0 items-center border-b px-6'>
        <h1 className='text-base leading-none font-semibold'>
          {getSettingsPasswordLabel("title", language)}
        </h1>
      </div>

      <div className='px-6 pt-6 pb-6'>
        <p className='text-muted-foreground mb-6 text-sm leading-normal'>
          {getSettingsPasswordLabel("description", language)}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {serverError ? (
              <Alert variant='destructive'>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}
            {successMessage ? (
              <Alert>
                <CheckCircle className='size-4' />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            ) : null}

            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {getSettingsPasswordLabel("currentPassword", language)}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete='current-password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {getSettingsPasswordLabel("newPassword", language)}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete='new-password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {getSettingsPasswordLabel("confirmPassword", language)}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete='new-password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              disabled={changePasswordMutation.isPending}
              className='rounded-full px-6'
            >
              {changePasswordMutation.isPending
                ? getSettingsPasswordLabel("submitting", language)
                : getSettingsPasswordLabel("submit", language)}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
