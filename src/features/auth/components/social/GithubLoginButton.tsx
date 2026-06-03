"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { loginWithProvider } from "@/core/lib/auth-client";
import { cn } from "@/lib/utils";

import { GithubIcon } from "../icons/GithubIcon";

interface GithubLoginButtonProps {
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
}

export function GithubLoginButton({
  disabled = false,
  className,
  onError,
}: GithubLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await loginWithProvider("github");
    setLoading(false);
    if (!result.ok) {
      onError?.(result.error ?? "GitHub sign-in failed");
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
      aria-label='Continue with GitHub'
    >
      <GithubIcon />
    </Button>
  );
}
