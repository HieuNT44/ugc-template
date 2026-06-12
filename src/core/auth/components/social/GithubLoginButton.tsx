"use client";

import { Button } from "@/components/ui/button";
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
}: GithubLoginButtonProps) {
  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      className={cn("rounded-full", className)}
      disabled={disabled}
      aria-label='GitHubで続行'
    >
      <GithubIcon />
    </Button>
  );
}
