"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useCountdown } from "../hooks/useCountdown";
import { useFormState } from "../hooks/useFormState";
import { AuthFormCard } from "./AuthFormCard";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

const otpSchema = z.object({
  otp: z.string().length(OTP_LENGTH, `Code must be ${OTP_LENGTH} digits`),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OTPVerificationFormProps {
  email: string;
  onSuccess?: () => void;
  onResend?: () => void;
  className?: string;
}

export function OTPVerificationForm({
  email,
  onSuccess,
  onResend,
  className,
}: OTPVerificationFormProps) {
  const formState = useFormState();
  const countdown = useCountdown({ initialSeconds: COUNTDOWN_SECONDS });

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = useWatch({ control: form.control, name: "otp" }) ?? "";

  useEffect(() => {
    countdown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (_values: OtpFormData) => {
    formState.startSubmit();
    formState.setError(
      "OTP認証はまだ有効ではありません。代わりにFirebaseのメール認証を使用してください。"
    );
    void onSuccess;
  };

  const handleResend = () => {
    if (!countdown.isComplete) {
      return;
    }
    countdown.reset();
    form.reset();
    onResend?.();
  };

  return (
    <AuthFormCard className={className ?? "OTPVerificationForm"}>
      <p className='text-muted-foreground mb-4 text-center text-sm'>
        Enter the code sent to {email}
      </p>
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
              name='otp'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormControl>
                    <div className='flex justify-center'>
                      <InputOTP
                        maxLength={OTP_LENGTH}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={formState.isLoading || !!formState.success}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: OTP_LENGTH }).map(
                            (_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            )
                          )}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className='text-center' />
                </FormItem>
              )}
            />

            <div className='text-muted-foreground text-center text-sm'>
              {countdown.isComplete ? (
                <button
                  type='button'
                  onClick={handleResend}
                  className='hover:text-foreground underline'
                >
                  Resend code
                </button>
              ) : (
                <span>Resend in {formatTime(countdown.seconds)}</span>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={
                formState.isLoading ||
                !!formState.success ||
                otpValue.length !== OTP_LENGTH
              }
            >
              {formState.isLoading ? "確認中..." : "確認"}
            </Button>
          </div>

          <div className='mt-4 text-center text-sm'>
            <Link href='/login' className='underline'>
              Back to sign in
            </Link>
          </div>
        </form>
      </Form>
    </AuthFormCard>
  );
}
