"use client";

import { AlertCircle, Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import type { AutoSaveStatus } from "../hooks/use-auto-save";

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
  className?: string;
}

export function AutoSaveIndicator({
  status,
  lastSavedAt,
  className,
}: AutoSaveIndicatorProps) {
  const label = (() => {
    if (status === "saving") {
      return "Saving…";
    }
    if (status === "error") {
      return "Connection lost, please try again";
    }
    if (status === "saved" && lastSavedAt) {
      return `Saved at ${lastSavedAt.toLocaleTimeString()}`;
    }
    return "Auto-save every 30 seconds";
  })();

  return (
    <div
      className={cn(
        "AutoSaveIndicator text-muted-foreground flex items-center gap-1.5 text-xs",
        status === "error" && "text-destructive",
        className
      )}
      aria-live='polite'
    >
      {status === "saving" ? (
        <Loader2 className='size-3.5 animate-spin' />
      ) : null}
      {status === "saved" ? (
        <Check className='size-3.5 text-emerald-600' />
      ) : null}
      {status === "error" ? <AlertCircle className='size-3.5' /> : null}
      <span>{label}</span>
    </div>
  );
}
