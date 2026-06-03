import Image from "next/image";

import { cn } from "@/lib/utils";

export function LineIcon({ className }: { className?: string }) {
  return (
    <Image
      src='/image/line.svg'
      alt=''
      width={16}
      height={16}
      className={cn("size-4", className)}
      aria-hidden
    />
  );
}
