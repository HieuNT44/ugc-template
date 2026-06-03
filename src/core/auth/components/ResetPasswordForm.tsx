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
import { resetPasswordWithCode } from "@/core/auth/lib/auth-client";
import { resetPasswordAction } from "@/core/auth/actions/resetPasswordAction";
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
  const oobCode =
    tokenProp ?? searchParams.get("oobCode") ?? searchParams.get("token");
  const formState = useFormState();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!oobCode) {
      return;
    }

    formState.startSubmit();

    const validation = await resetPasswordAction(values);
    if (!validation.success) {
      formState.setError(validation.error);
      return;
    }

    try {
      await resetPasswordWithCode(oobCode, values.password);
      formState.setSuccess("Password updated. Redirecting to sign in...");
      onSuccess?.();
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 2000);
    } catch {
      formState.setError("Unable to reset password. Request a new link.");
    }
  };

  if (!oobCode) {
    return (
      <AuthFormCard className={className ?? "ResetPasswordForm"}>
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertDescription>
            This password reset link is invalid or has expired.
          </AlertDescription>
        </Alert>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard className={className ?? "ResetPasswordForm"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {formState.error && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertDescription>{formState.error}</AlertDescription>
              </Alert>
            )}

            {formState.success && (
              <Alert>
                <CheckCircle className='size-4' />
                <AlertDescription>{formState.success}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='Enter new password'
                      autoComplete='new-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='Confirm new password'
                      autoComplete='new-password'
                      {...field}
                    />
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
              {formState.isLoading ? "Updating..." : "Update password"}
            </Button>
          </div>

          <div className='mt-4 text-center text-sm'>
            <Link
              href='/login'
              className='inline-flex items-center gap-2 underline'
            >
              <ArrowLeft className='size-4' />
              Back to sign in
            </Link>
          </div>
        </form>
      </Form>
    </AuthFormCard>
  );
}
