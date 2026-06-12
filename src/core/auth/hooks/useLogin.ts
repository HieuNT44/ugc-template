"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { clientLogin } from "@/core/api/client/auth-client";
import { mapApiRoleToAppRole } from "@/core/api/mappers/auth-user.mapper";
import { establishLaravelSession } from "@/core/auth/lib/auth-session-client";
import { resolvePostAuthRedirect } from "@/core/auth/lib/resolve-post-auth-redirect";
import { resolveAuthTokenResult } from "@/core/auth/lib/resolve-auth-token-result";
import type { LoginFormData } from "@/core/auth/validations";
import { loginSchema } from "@/core/auth/validations";

export function useLogin() {
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const parsed = loginSchema.safeParse(data);
      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        const message =
          fieldErrors.email?.[0] ??
          fieldErrors.password?.[0] ??
          "ログイン情報が正しくありません";
        setError(message);
        return { success: false as const, error: message, fieldErrors };
      }

      const apiResult = await clientLogin({
        email: parsed.data.email,
        password: parsed.data.password,
      });
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

      await update();

      if (!apiResult.ok) {
        return {
          success: false as const,
          error: "ログインレスポンスが正しくありません",
        };
      }

      const role = mapApiRoleToAppRole(apiResult.data.user.role);
      const redirectTo = await resolvePostAuthRedirect(
        actionResult.accessToken,
        role
      );

      return { ...actionResult, redirectTo };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "問題が発生しました。もう一度お試しください。";
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: login, isLoading, error };
}
