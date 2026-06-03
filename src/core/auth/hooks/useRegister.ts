"use client";

import { useState } from "react";

import { registerWithEmail } from "@/core/auth/lib/auth-client";
import { registerAction } from "@/core/auth/actions/registerAction";
import type { RegisterFormData } from "@/core/auth/validations";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    const validation = await registerAction(data);
    if (!validation.success) {
      setError(validation.error);
      setIsLoading(false);
      return validation;
    }

    try {
      const result = await registerWithEmail({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (!result.ok) {
        setError(result.error ?? "Registration failed");
        return {
          success: false as const,
          error: result.error ?? "Registration failed",
        };
      }

      return {
        success: true as const,
        userId: result.userId ?? "",
      };
    } catch {
      const message = "Unable to create account. Try again later.";
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: register, isLoading, error };
}
