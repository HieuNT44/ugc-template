import { cn } from "@/lib/utils";

interface FallbackBookCoverProps {
  className?: string;
  title?: string;
}

/** Portrait book cover placeholder for RealRead when no cover URL is available. */
export function FallbackBookCover({
  className,
  title = "ブックカバーのプレースホルダー",
}: FallbackBookCoverProps) {
  return (
    <div
      className={cn(
        "FallbackBookCover border-border/70 from-muted via-site-main to-muted/80 relative flex h-[120px] w-[80px] shrink-0 flex-col justify-end overflow-hidden rounded-sm border bg-gradient-to-br shadow-sm sm:h-[140px] sm:w-[93px]",
        className
      )}
      role='img'
      aria-label={title}
    >
      <div
        className='bg-foreground/10 absolute inset-y-0 left-0 w-1.5'
        aria-hidden
      />
      <div className='relative px-2 pb-2.5'>
        <span className='font-logo text-muted-foreground block text-[10px] leading-none tracking-wide'>
          RealRead
        </span>
      </div>
    </div>
  );
}
