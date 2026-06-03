"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { InstagramIcon } from "../icons/InstagramIcon";

interface InstagramLoginButtonProps {
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
}

export function InstagramLoginButton({
  disabled = false,
  className,
  onError,
}: InstagramLoginButtonProps) {
  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      className={cn("rounded-full", className)}
      disabled={disabled}
      aria-label='Continue with Instagram'
      onClick={() =>
        onError?.(
          "Instagram login requires additional Firebase OAuth configuration"
        )
      }
    >
      <InstagramIcon />
    </Button>
  );
}
