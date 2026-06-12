"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { CheckCircle } from "lucide-react";

import { updateProfileAction } from "../actions";
import {
  communityProfileSchema,
  type CommunityProfileFormData,
} from "../validations";

interface EditProfileFormProps {
  defaultValues: CommunityProfileFormData;
}

export function EditProfileForm({ defaultValues }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<CommunityProfileFormData>({
    resolver: zodResolver(
      communityProfileSchema
    ) as Resolver<CommunityProfileFormData>,
    mode: "onBlur",
    defaultValues,
  });

  async function onSubmit(data: CommunityProfileFormData) {
    setServerError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      (
        Object.entries(data) as [keyof CommunityProfileFormData, string][]
      ).forEach(([key, value]) => formData.set(key, value ?? ""));

      const result = await updateProfileAction({}, formData);

      if (result.success && result.message) {
        setSuccessMessage(result.message);
      } else if (result.error) {
        setServerError(result.error);
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          const message = (messages ?? []).join(" ");
          if (message) {
            form.setError(field as keyof CommunityProfileFormData, { message });
          }
        });
      }
    } catch {
      setServerError("問題が発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='EditProfileForm'>
      <CardHeader>
        <CardTitle>プロフィールを編集</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {serverError && (
              <Alert variant='destructive'>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert>
                <CheckCircle className='size-4' />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>氏名</FormLabel>
                  <FormControl>
                    <Input placeholder='氏名' {...field} />
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
                    <Input placeholder='your-handle' {...field} />
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
                  <FormLabel>ヘッドライン</FormLabel>
                  <FormControl>
                    <Input placeholder='短いヘッドライン' {...field} />
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
                  <FormLabel>自己紹介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='あなたについて紹介してください'
                      rows={4}
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
                  <FormLabel>所在地</FormLabel>
                  <FormControl>
                    <Input placeholder='市区町村、国' {...field} />
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
                  <FormLabel>ウェブサイト</FormLabel>
                  <FormControl>
                    <Input
                      type='url'
                      placeholder='https://example.com'
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
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input
                      type='url'
                      placeholder='https://github.com/...'
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
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input
                      type='url'
                      placeholder='https://facebook.com/...'
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
                  <FormLabel>LINE URL</FormLabel>
                  <FormControl>
                    <Input
                      type='url'
                      placeholder='https://line.me/...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isLoading}>
              {isLoading ? "保存中..." : "変更を保存"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
