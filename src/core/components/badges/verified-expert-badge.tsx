"use client";

import { BadgeCheck } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedExpertBadgeProps {
  fields: string[];
}

export function VerifiedExpertBadge({ fields }: VerifiedExpertBadgeProps) {
  const label =
    fields.length > 0
      ? `Verified expert in ${fields.join(", ")}`
      : "認証済みエキスパート";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className='VerifiedExpertBadge inline-flex shrink-0'
          aria-label={label}
        >
          <BadgeCheck className='fill-badge-expert text-primary-foreground size-5' />
        </span>
      </TooltipTrigger>
      <TooltipContent side='top' className='max-w-xs'>
        <p className='text-sm font-medium'>認証済みエキスパート</p>
        {fields.length > 0 ? (
          <p className='text-muted-foreground mt-1 text-xs'>
            {fields.join(" · ")}
          </p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
