"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

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
import { PasswordInput } from "@/components/ui/password-input";
import { clientResetPassword } from "@/core/api/client/auth-client";
import { mapApiAuthFailure } from "@/core/auth/lib/map-api-auth-error";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/core/auth/validations";

import { useFormState } from "../hooks/useFormState";
import { AuthFormCard } from "./AuthFormCard";

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
  className?: string;
}

export function ResetPasswordForm({
  token: tokenProp,
  onSuccess,
  className,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken =
    tokenProp ?? searchParams.get("token") ?? searchParams.get("oobCode");
  const formState = useFormState();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!resetToken) {
      return;
    }

    formState.startSubmit();

    const parsed = resetPasswordSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const message =
        fieldErrors.password?.[0] ??
        fieldErrors.confirmPassword?.[0] ??
        "パスワード情報が正しくありません";
      formState.setError(message);
      return;
    }

    const apiResult = await clientResetPassword({
      token: resetToken,
      password: parsed.data.password,
      password_confirmation: parsed.data.confirmPassword,
    });

    if (!apiResult.ok) {
      const failure = mapApiAuthFailure(apiResult.error);
      formState.setError(failure.error);
      return;
    }

    formState.setSuccess(
      apiResult.message ??
        "パスワードを更新しました。ログイン画面へ移動します..."
    );
    onSuccess?.();
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 2000);
  };

  if (!resetToken) {
    return (
      <AuthFormCard className={className ?? "ResetPasswordForm"}>
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertDescription>
            Reset link is invalid or expired. Request a new one.
          </AlertDescription>
        </Alert>
        <Button variant='link' className='mt-4 px-0' asChild>
          <Link href='/forgot-password'>
            <ArrowLeft className='mr-2 size-4' />
            Back to forgot password
          </Link>
        </Button>
      </AuthFormCard>
    );
  }

  const displayError = formState.error ?? form.formState.errors.root?.message;

  return (
    <AuthFormCard className={className ?? "ResetPasswordForm"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {formState.success && (
              <Alert>
                <CheckCircle className='size-4' />
                <AlertDescription>{formState.success}</AlertDescription>
              </Alert>
            )}

            {displayError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新しいパスワード</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
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
                  <FormLabel>新しいパスワード確認</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={formState.isLoading || !!formState.success}
            >
              {formState.isLoading ? "更新中..." : "パスワードをリセット"}
            </Button>

            <Button variant='link' className='px-0' asChild>
              <Link href='/login'>
                <ArrowLeft className='mr-2 size-4' />
                Back to sign in
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </AuthFormCard>
  );
}
