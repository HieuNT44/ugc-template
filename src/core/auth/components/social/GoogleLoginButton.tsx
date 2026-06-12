"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { clientLoginWithGoogle } from "@/core/api/client/auth-client";
import { mapApiRoleToAppRole } from "@/core/api/mappers/auth-user.mapper";
import { establishLaravelSession } from "@/core/auth/lib/auth-session-client";
import { resolvePostAuthRedirect } from "@/core/auth/lib/resolve-post-auth-redirect";
import { resolveAuthTokenResult } from "@/core/auth/lib/resolve-auth-token-result";
import { cn } from "@/lib/utils";

interface GoogleLoginButtonProps {
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
  onSuccess?: (redirectTo: string) => void;
}

export function GoogleLoginButton({
  disabled = false,
  className,
  onError,
  onSuccess,
}: GoogleLoginButtonProps) {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      onError?.("Googleログインに失敗しました");
      return;
    }

    setLoading(true);
    const apiResult = await clientLoginWithGoogle({ id_token: idToken });
    const actionResult = resolveAuthTokenResult(apiResult);
    setLoading(false);

    if (!actionResult.success) {
      onError?.(actionResult.error);
      return;
    }

    const sessionResult = await establishLaravelSession(actionResult);
    if (!sessionResult.ok) {
      onError?.(sessionResult.error ?? "Googleログインに失敗しました");
      return;
    }

    await update();

    if (!apiResult.ok) {
      onError?.("Googleログインに失敗しました");
      return;
    }

    const role = mapApiRoleToAppRole(apiResult.data.user.role);
    const redirectTo = await resolvePostAuthRedirect(
      actionResult.accessToken,
      role
    );
    onSuccess?.(redirectTo);
  };

  if (!clientId) {
    return null;
  }

  return (
    <div
      className={cn(
        "GoogleLoginButton",
        (disabled || loading) && "pointer-events-none opacity-50",
        className
      )}
      aria-busy={loading}
    >
      <GoogleLogin
        type='icon'
        shape='circle'
        theme='outline'
        size='large'
        onSuccess={handleSuccess}
        onError={() => onError?.("Googleログインに失敗しました")}
      />
    </div>
  );
}
