"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle } from "lucide-react";
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
import { registerSchema, type RegisterFormData } from "@/core/auth/validations";

import { useFormState } from "../hooks/useFormState";
import { useRegister } from "../hooks/useRegister";
import { AuthFormCard } from "./AuthFormCard";
import { FacebookLoginButton } from "./social/FacebookLoginButton";
import { GoogleLoginButton } from "./social/GoogleLoginButton";
import { InstagramLoginButton } from "./social/InstagramLoginButton";
import { LineLoginButton } from "./social/LineLoginButton";
import { GithubLoginButton } from "./social/GithubLoginButton";
import { SocialLoginDivider } from "./SocialLoginDivider";

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  onSwitchToLogin?: () => void;
  className?: string;
}

export function RegisterForm({
  onSuccess,
  redirectTo = "/",
  onSwitchToLogin,
  className,
}: RegisterFormProps) {
  const router = useRouter();
  const formState = useFormState();
  const { mutate: register } = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    formState.startSubmit();
    const result = await register(values);

    if (!result.success) {
      formState.setError(result.error);
      return;
    }

    formState.setSuccess(
      "Account created. Check your email to verify, then sign in."
    );
    onSuccess?.();
    setTimeout(() => {
      router.push(redirectTo);
      router.refresh();
    }, 2000);
  };

  const handleSocialError = (message: string) => {
    formState.setError(message);
  };

  return (
    <AuthFormCard className={className ?? "RegisterForm"}>
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
              name='name'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Your name'
                      autoComplete='name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='Create a password'
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
                      placeholder='Confirm your password'
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
              {formState.isLoading ? "Creating account..." : "Create account"}
            </Button>

            <SocialLoginDivider />

            <div className='flex justify-center gap-4'>
              <GoogleLoginButton
                disabled={formState.isLoading}
                onError={handleSocialError}
              />
              <FacebookLoginButton
                disabled={formState.isLoading}
                onError={handleSocialError}
              />
              <InstagramLoginButton
                disabled={formState.isLoading}
                onError={handleSocialError}
              />
              <LineLoginButton
                disabled={formState.isLoading}
                onError={handleSocialError}
              />
              <GithubLoginButton
                disabled={formState.isLoading}
                onError={handleSocialError}
              />
            </div>
          </div>

          <div className='mt-4 text-center text-sm'>
            Already have an account?{" "}
            <Link href='/login' className='underline' onClick={onSwitchToLogin}>
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </AuthFormCard>
  );
}
