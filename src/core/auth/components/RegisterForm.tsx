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
      full_name: "",
      username: "",
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

    onSuccess?.();
    router.push(redirectTo ?? result.redirectTo);
    router.refresh();
    formState.setLoading(false);
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
              name='full_name'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>氏名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='氏名を入力してください'
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
              name='username'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='your_username'
                      autoComplete='username'
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
                  <FormLabel>メールアドレス</FormLabel>
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
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='パスワードを作成してください'
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
                  <FormLabel>パスワード確認</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='パスワードを再入力してください'
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
              {formState.isLoading ? "アカウントを作成中..." : "アカウント作成"}
            </Button>

            <SocialLoginDivider />

            <div className='flex justify-center gap-4'>
              <GoogleLoginButton
                disabled={formState.isLoading}
                onError={handleSocialError}
                onSuccess={(path) => {
                  onSuccess?.();
                  router.push(redirectTo ?? path);
                  router.refresh();
                }}
              />
              <FacebookLoginButton disabled onError={handleSocialError} />
              <InstagramLoginButton disabled onError={handleSocialError} />
              <LineLoginButton disabled onError={handleSocialError} />
              <GithubLoginButton disabled onError={handleSocialError} />
            </div>
          </div>

          <div className='mt-4 text-center text-sm'>
            Already have an account?{" "}
            <Link href='/login' className='underline' onClick={onSwitchToLogin}>
              ログイン
            </Link>
          </div>
        </form>
      </Form>
    </AuthFormCard>
  );
}
