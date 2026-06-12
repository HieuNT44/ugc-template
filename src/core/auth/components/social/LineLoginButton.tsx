"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { LineIcon } from "../icons/LineIcon";

interface LineLoginButtonProps {
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
}

export function LineLoginButton({
  disabled = false,
  className,
  onError,
}: LineLoginButtonProps) {
  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      className={cn("rounded-full", className)}
      disabled={disabled}
      aria-label='LINEで続行'
      onClick={() =>
        onError?.("LINEログインには追加のFirebase OAuth設定が必要です")
      }
    >
      <LineIcon />
    </Button>
  );
}
