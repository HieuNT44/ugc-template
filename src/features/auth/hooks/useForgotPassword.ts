"use client";

import { useState } from "react";

import { sendResetPasswordEmail } from "@/core/lib/auth-client";
import { forgotPasswordAction } from "@/features/auth/actions/forgotPasswordAction";
import type { ForgotPasswordFormData } from "@/features/auth/validations";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    const validation = await forgotPasswordAction(data);
    if (!validation.success) {
      setError(validation.error);
      setIsLoading(false);
      return validation;
    }

    try {
      await sendResetPasswordEmail(data.email);
      return { success: true as const };
    } catch {
      const message = "Unable to send reset email. Try again later.";
      setError(message);
      return { success: false as const, error: message } satisfies {
        success: false;
        error: string;
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: forgotPassword, isLoading, error };
}
