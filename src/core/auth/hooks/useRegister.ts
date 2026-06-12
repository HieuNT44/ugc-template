"use client";

import { useState } from "react";

import {
  clientRegisterCreator,
  clientRegisterReader,
} from "@/core/api/client/auth-client";
import { establishLaravelSession } from "@/core/auth/lib/auth-session-client";
import { resolvePostAuthRedirect } from "@/core/auth/lib/resolve-post-auth-redirect";
import { mapApiRoleToAppRole } from "@/core/api/mappers/auth-user.mapper";
import { resolveAuthTokenResult } from "@/core/auth/lib/resolve-auth-token-result";
import type { RegisterFormData } from "@/core/auth/validations";
import { registerSchema } from "@/core/auth/validations";

interface UseRegisterOptions {
  asCreator?: boolean;
}

export function useRegister(options?: UseRegisterOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const parsed = registerSchema.safeParse(data);
      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        const message =
          fieldErrors.email?.[0] ??
          fieldErrors.password?.[0] ??
          fieldErrors.confirmPassword?.[0] ??
          fieldErrors.full_name?.[0] ??
          fieldErrors.username?.[0] ??
          "登録内容が正しくありません";
        setError(message);
        return { success: false as const, error: message, fieldErrors };
      }

      const payload = {
        email: parsed.data.email,
        username: parsed.data.username,
        full_name: parsed.data.full_name,
        password: parsed.data.password,
        password_confirmation: parsed.data.confirmPassword,
      };

      const apiResult = options?.asCreator
        ? await clientRegisterCreator(payload)
        : await clientRegisterReader(payload);
      const actionResult = resolveAuthTokenResult(apiResult);

      if (!actionResult.success) {
        setError(actionResult.error);
        return actionResult;
      }

      const sessionResult = await establishLaravelSession(actionResult);
      if (!sessionResult.ok) {
        const message =
          sessionResult.error ?? "セッションを開始できませんでした";
        setError(message);
        return { success: false as const, error: message };
      }

      if (!apiResult.ok) {
        return {
          success: false as const,
          error: "登録レスポンスが正しくありません",
        };
      }

      const role = mapApiRoleToAppRole(apiResult.data.user.role);
      const redirectTo = await resolvePostAuthRedirect(
        actionResult.accessToken,
        role
      );

      return { ...actionResult, redirectTo };
    } catch {
      const message =
        "アカウントを作成できませんでした。時間をおいて再度お試しください。";
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: register, isLoading, error };
}
