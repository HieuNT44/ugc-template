"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreateContentShellProps {
  children: React.ReactNode;
  title?: string;
  step?: number;
  totalSteps?: number;
  backHref?: string;
  showHeader?: boolean;
  surface?: "default" | "book";
}

export function CreateContentShell({
  children,
  step,
  totalSteps,
  title,
  backHref,
  showHeader = true,
  surface: _surface = "default",
}: CreateContentShellProps) {
  const showSteps =
    showHeader && step != null && totalSteps != null && totalSteps > 0;

  return (
    <div className='CreateContentShell w-full'>
      <div
        className={cn(
          "mx-auto w-full px-4 py-8",
          showHeader ? "max-w-3xl" : "max-w-7xl"
        )}
      >
        {showHeader ? (
          <div className='mb-6'>
            {backHref ? (
              <Button variant='ghost' size='sm' className='mb-4 -ml-2' asChild>
                <Link href={backHref}>Back</Link>
              </Button>
            ) : null}
            {showSteps ? (
              <>
                <p className='text-muted-foreground mb-2 text-sm'>
                  Step {step} of {totalSteps}
                </p>
                <div className='mb-4 flex gap-2'>
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        index < step ? "bg-primary" : "bg-muted"
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              </>
            ) : null}
            {title ? (
              <h1 className='font-serif text-2xl font-bold'>{title}</h1>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
