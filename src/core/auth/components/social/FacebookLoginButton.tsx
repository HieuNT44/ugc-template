"use client";

import { Button } from "@/components/ui/button";
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
}: FacebookLoginButtonProps) {
  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      className={cn("rounded-full", className)}
      disabled={disabled}
      aria-label='Facebookで続行'
    >
      <FacebookIcon />
    </Button>
  );
}
