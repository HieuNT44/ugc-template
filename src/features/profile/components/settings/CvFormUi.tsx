"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ValidationErrorDetail } from "@/core/api/types/envelope";
import { cn } from "@/lib/utils";

export function CvSettingsCard({
  title,
  description,
  isSaving,
  isSaveDisabled,
  saveLabel,
  savingLabel,
  onSave,
  children,
  className,
}: {
  title: string;
  description?: string;
  isSaving?: boolean;
  isSaveDisabled?: boolean;
  saveLabel: string;
  savingLabel: string;
  onSave: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        className={cn(
          "CvSettingsCard gap-0 overflow-hidden rounded-2xl py-0",
          className
        )}
      >
        <div className='border-border flex min-h-14 shrink-0 items-center justify-between gap-4 border-b px-6 py-3'>
          <div className='min-w-0'>
            <h1 className='text-base leading-none font-semibold'>{title}</h1>
            {description ? (
              <p className='text-muted-foreground mt-1.5 text-sm leading-normal'>
                {description}
              </p>
            ) : null}
          </div>
          <Button
            type='button'
            onClick={onSave}
            disabled={isSaving || isSaveDisabled}
            className='shrink-0 rounded-full px-6'
          >
            {isSaving ? savingLabel : saveLabel}
          </Button>
        </div>
        <div className='px-6 pt-6 pb-6'>{children}</div>
      </Card>
    </motion.div>
  );
}

export function CvFieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className='CvFieldGrid grid gap-4 md:grid-cols-2'>{children}</div>
  );
}

export function CvField({
  label,
  children,
  className,
  error,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={cn("CvField space-y-1.5", className)}>
      <Label
        className={cn(
          "text-muted-foreground text-xs font-medium",
          error ? "text-destructive" : undefined
        )}
      >
        {label}
      </Label>
      {children}
      {error ? (
        <p className='text-destructive text-xs leading-snug' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CvNativeSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot='select'
      className={cn(
        "border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export function CvCheckboxField({
  label,
  checked,
  onCheckedChange,
  id,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className='CvCheckboxField border-input bg-muted/20 flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5'
    >
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className='border-input accent-primary size-4 rounded'
      />
      <span className='text-sm leading-none'>{label}</span>
    </label>
  );
}

export function CvItemPanel({
  index,
  title,
  onRemove,
  removeLabel,
  children,
}: {
  index: number;
  title: string;
  onRemove: () => void;
  removeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className='CvItemPanel border-border bg-muted/15 space-y-4 rounded-xl border p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-2.5'>
          <span className='bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
            {index + 1}
          </span>
          <p className='truncate text-sm leading-snug font-medium'>{title}</p>
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={onRemove}
          className='text-muted-foreground hover:text-destructive h-8 shrink-0 px-2'
          aria-label={removeLabel}
        >
          <Trash2 className='size-4' aria-hidden />
        </Button>
      </div>
      {children}
    </div>
  );
}

export function CvAddItemButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type='button'
      variant='outline'
      onClick={onClick}
      className='CvAddItemButton h-11 w-full rounded-xl border-dashed'
    >
      <Plus className='size-4' aria-hidden />
      {label}
    </Button>
  );
}

export function CvEmptyState({
  title,
  description,
  addLabel,
  onAdd,
}: {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
}) {
  return (
    <div className='CvEmptyState border-border bg-muted/10 flex flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center'>
      <p className='text-sm font-medium'>{title}</p>
      <p className='text-muted-foreground mt-1 max-w-sm text-sm leading-relaxed'>
        {description}
      </p>
      <Button type='button' onClick={onAdd} className='mt-4 rounded-full'>
        <Plus className='size-4' aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}

export function setCvServerValidationErrors<T extends FieldValues>(
  details: ValidationErrorDetail[] | undefined,
  setError: UseFormSetError<T>
): boolean {
  if (!details?.length) {
    return false;
  }

  for (const detail of details) {
    setError(detail.field as Path<T>, {
      type: "server",
      message: detail.message,
    });
  }

  return true;
}

export function getCvErrorMessage(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("message" in error)) {
    return undefined;
  }

  const message = error.message;
  return typeof message === "string" ? message : undefined;
}

export { Input, Textarea };
