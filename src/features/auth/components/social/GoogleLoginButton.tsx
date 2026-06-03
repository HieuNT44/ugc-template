"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { loginWithProvider } from "@/core/lib/auth-client";
import { cn } from "@/lib/utils";

import { GoogleIcon } from "../icons/GoogleIcon";

interface GoogleLoginButtonProps {
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
}

export function GoogleLoginButton({
  disabled = false,
  className,
  onError,
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await loginWithProvider("google");
    setLoading(false);
    if (!result.ok) {
      onError?.(result.error ?? "Google sign-in failed");
    }
  };

  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      className={cn("rounded-full", className)}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label='Continue with Google'
    >
      <GoogleIcon />
    </Button>
  );
}
