"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/password-input";
import { loginSchema, type LoginFormData } from "@/core/auth/validations";

import { useFormState } from "../hooks/useFormState";
import { useLogin } from "../hooks/useLogin";
import { AuthFormCard } from "./AuthFormCard";
import { SocialLoginSection } from "./SocialLoginSection";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

export function LoginForm({
  onSuccess,
  redirectTo,
  className,
}: LoginFormProps) {
  const router = useRouter();
  const formState = useFormState();
  const { mutate: login } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormData) => {
    formState.startSubmit();
    const result = await login(values);

    if (!result.success) {
      formState.setError(result.error);
      return;
    }

    onSuccess?.();
    router.replace(redirectTo ?? result.redirectTo);
    formState.setLoading(false);
  };

  const displayError = formState.error ?? form.formState.errors.root?.message;

  return (
    <AuthFormCard className={className ?? "LoginForm"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {displayError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertDescription>{displayError}</AlertDescription>
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

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <div className='flex items-center'>
                    <FormLabel>Password</FormLabel>
                    <span
                      aria-disabled='true'
                      className='text-muted-foreground ml-auto inline-block cursor-not-allowed text-sm underline opacity-60'
                    >
                      Forgot password?
                    </span>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder='Enter your password'
                      autoComplete='current-password'
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
              disabled={formState.isLoading}
            >
              {formState.isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <SocialLoginSection
              disabled={formState.isLoading}
              onError={(message) => formState.setError(message)}
              onSuccess={(path) => {
                onSuccess?.();
                router.replace(redirectTo ?? path);
              }}
            />
          </div>

          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{" "}
            <Link href='/register' className='underline'>
              Create account
            </Link>
          </div>
        </form>
      </Form>
    </AuthFormCard>
  );
}
