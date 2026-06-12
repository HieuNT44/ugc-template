"use client";

import { useState } from "react";

import { clientForgotPassword } from "@/core/api/client/auth-client";
import { mapApiAuthFailure } from "@/core/auth/lib/map-api-auth-error";
import type { ForgotPasswordFormData } from "@/core/auth/validations";
import { forgotPasswordSchema } from "@/core/auth/validations";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) {
      const message =
        parsed.error.flatten().fieldErrors.email?.[0] ?? "Invalid email";
      setError(message);
      setIsLoading(false);
      return { success: false as const, error: message };
    }

    const result = await clientForgotPassword({ email: parsed.data.email });

    if (!result.ok) {
      const failure = mapApiAuthFailure(result.error);
      setError(failure.error);
      setIsLoading(false);
      return { success: false as const, ...failure };
    }

    setIsLoading(false);
    return { success: true as const, message: result.message };
  };

  return { mutate: forgotPassword, isLoading, error };
}
