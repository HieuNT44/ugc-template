import { cn } from "@/lib/utils";

interface FallbackPostImageProps {
  className?: string;
  /** Accessible name when used as cover placeholder */
  title?: string;
}

/**
 * Branded post cover placeholder for RealRead when no image URL is available.
 */
export function FallbackPostImage({
  className,
  title = "投稿カバーのプレースホルダー",
}: FallbackPostImageProps) {
  return (
    <div
      className={cn(
        "FallbackPostImage border-border/70 from-muted via-site-main to-muted/80 relative flex items-center justify-center border bg-gradient-to-br",
        className
      )}
      role='img'
      aria-label={title}
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-40'
        aria-hidden
      >
        <div className='bg-foreground/8 absolute top-5 left-4 h-1 w-14 rounded-full' />
        <div className='bg-foreground/6 absolute top-8 left-4 h-1 w-10 rounded-full' />
        <div className='bg-foreground/5 absolute top-11 left-4 h-1 w-16 rounded-full' />
        <div className='bg-foreground/8 absolute right-4 bottom-6 h-1 w-12 rounded-full' />
        <div className='bg-foreground/6 absolute right-4 bottom-9 h-1 w-8 rounded-full' />
      </div>

      <span className='font-logo text-muted-foreground relative text-sm tracking-wide'>
        Image RealRead
      </span>
    </div>
  );
}
