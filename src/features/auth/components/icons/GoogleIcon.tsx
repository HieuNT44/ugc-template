import Image from "next/image";

import { cn } from "@/lib/utils";

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <Image
      src='/image/google.svg'
      alt=''
      width={16}
      height={16}
      className={cn("size-4", className)}
      aria-hidden
    />
  );
}
