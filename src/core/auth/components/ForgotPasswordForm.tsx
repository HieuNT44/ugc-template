"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/core/auth/validations";

import { useForgotPassword } from "../hooks/useForgotPassword";
import { useFormState } from "../hooks/useFormState";
import { AuthFormCard } from "./AuthFormCard";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
  className?: string;
}

export function ForgotPasswordForm({
  onSuccess,
  onBackToLogin,
  className,
}: ForgotPasswordFormProps) {
  const formState = useFormState();
  const { mutate: forgotPassword } = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    formState.startSubmit();
    const result = await forgotPassword(values);

    if (!result.success) {
      formState.setError(result.error ?? "Unable to send reset email");
      return;
    }

    formState.setSuccess(
      "If an account exists for that email, a reset link has been sent."
    );
    onSuccess?.();
  };

  return (
    <AuthFormCard className={className ?? "ForgotPasswordForm"}>
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
              name='email'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='you@example.com'
                      autoComplete='email'
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
              {formState.isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </div>

          <div className='mt-4 text-center text-sm'>
            <Link
              href='/login'
              className='inline-flex items-center gap-2 underline'
              onClick={onBackToLogin}
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
