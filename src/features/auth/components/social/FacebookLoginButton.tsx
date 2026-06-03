"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { loginWithProvider } from "@/core/lib/auth-client";
import { cn } from "@/lib/utils";

import { FacebookIcon } from "../icons/FacebookIcon";

interface FacebookLoginButtonProps {
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
}

export function FacebookLoginButton({
  disabled = false,
  className,
  onError,
}: FacebookLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await loginWithProvider("facebook");
    setLoading(false);
    if (!result.ok) {
      onError?.(result.error ?? "Facebook sign-in failed");
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
      aria-label='Continue with Facebook'
    >
      <FacebookIcon />
    </Button>
  );
}
